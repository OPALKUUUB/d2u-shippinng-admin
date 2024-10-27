import React, { useState, useEffect, useMemo } from "react"
import { useRouter } from "next/router"
import { useSearchParams } from "next/navigation"
import LoadingPage from "../components/LoadingPage"
import InvoiceApi from "../services/InvoiceApi"

export const InvoiceShipBillingContext = React.createContext(null)

export const useInvoiceShipBillingContext = () =>
   React.useContext(InvoiceShipBillingContext)

export const InvoiceShipBillingProvider = ({ children }) => {
   const router = useRouter()
   const searchParams = useSearchParams()

   const [loading, setLoading] = useState(false)
   const [voyage, setVoyage] = useState(null)
   const [invoiceShipBillingData, setInvoiceShipBillingData] = useState({
      results: [],
      current: 1,
      pageSize: 10,
      total: 0,
   })
   const [voyages, setVoyages] = useState([]) // Default to empty array
   const [error, setError] = useState(null)

   // Centralized error handling
   const handleError = (err) => {
      console.error("API Error:", err)
      setError(err.message || "An error occurred")
   }

   // Fetch ship billing voyage data on initial load
   useEffect(() => {
      const fetchVoyages = async () => {
         setLoading(true)
         try {
            const data = await InvoiceApi.getShipBillingVoyage()
            setVoyages(data || [])
         } catch (err) {
            handleError(err)
         } finally {
            setLoading(false)
         }
      }

      fetchVoyages() // Always fetch on component mount
   }, []) // Empty dependency array to run only on mount

   // Capture voyage from URL params and fetch related data
   useEffect(() => {
      const voyageParam = searchParams.get("voyage")
      if (voyageParam) {
         setVoyage(voyageParam)
      } else {
         console.error("Voyage parameter is missing")
      }
   }, [searchParams])

   useEffect(() => {
      if (voyage) {
         fetchInvoiceShipBilling({
            current: invoiceShipBillingData.current,
            pageSize: invoiceShipBillingData.pageSize,
         })
      }
   }, [voyage]) // Re-fetch when `voyage` changes

   // Fetch invoice ship billing based on voyage parameter and pagination
   const fetchInvoiceShipBilling = async (pagination) => {
      if (!voyage) return

      setLoading(true)
      try {
         const { current, pageSize, shipBillingStatus } = pagination
         const data = await InvoiceApi.getInvoiceShipBillingByVoyage({
            voyage,
            pageSize,
            current,
            shipBillingStatus:
               shipBillingStatus !== "all" ? shipBillingStatus : undefined,
         })
         setInvoiceShipBillingData({
            results: data.results || [],
            current,
            pageSize,
            total: data.total || 0,
         })
      } catch (err) {
         handleError(err)
      } finally {
         setLoading(false)
      }
   }

   // Function to handle pagination changes
   const setPagination = (current, pageSize, shipBillingStatus = "all") => {
      fetchInvoiceShipBilling({ current, pageSize, shipBillingStatus })
   }

   // Memoize the context value to avoid unnecessary re-renders
   const contextValue = useMemo(
      () => ({
         voyage,
         voyages,
         invoiceShipBillingData,
         loading,
         error,
         setPagination,
         setLoading,
      }),
      [voyage, voyages, invoiceShipBillingData, loading, error]
   )

   return (
      <InvoiceShipBillingContext.Provider value={contextValue}>
         <LoadingPage loading={loading} />
         {children}
      </InvoiceShipBillingContext.Provider>
   )
}
