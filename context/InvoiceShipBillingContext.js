/* eslint-disable default-param-last */
import React, { useState } from "react"
import axios from "axios"
import { useRouter } from "next/router"
import { useSearchParams } from "next/navigation"
import LoadingPage from "../components/LoadingPage"

export const TABLIST = [
   { label: "unpaid", key: "unpaid" },
   { label: "keep", key: "keep" },
   { label: "pickup", key: "pickup" },
   { label: "toship", key: "toship" },
   { label: "ship", key: "ship" },
   { label: "finish", key: "finish" },
   { label: "all", key: "all" },
]

export const InvoiceShipBillingContext = React.createContext(null)

export const useInvoiceShipBillingContext = () =>
   React.useContext(InvoiceShipBillingContext)

export const InvoiceShipBillingProvider = ({ children }) => {
   const router = useRouter()
   const searchParams = useSearchParams()

   const [loading, setLoading] = useState(false)

   const handleUpdateShipBillingStatus = async (
      shipBillingStatus,
      shipBillingId
   ) => {
      try {
         setLoading(true)
         const payload = {
            shipBillingId,
            shipBillingStatus,
         }
         await axios.patch("/api/invoiceShipBilling", payload)
      } catch (error) {
         console.log(error)
      } finally {
         setLoading(false)
      }
   }

   const handleUpdateInvoice = async (shipbillingId, contentData) => {
      try {
         setLoading(true)
         const payload = {
            shipbillingId,
            contentData: JSON.stringify(contentData),
         }
         await axios.put("/api/invoiceShipBilling", payload)
      } catch (error) {
         console.log(error)
      } finally {
         setLoading(false)
      }
   }

   const handleChangePaginaiton = async (
      current = 0,
      pageSize = 10,
      tabSelect = "unpaid",
      voyage
   ) => {
      if (isSearchShipBillingValidate(voyage)) {
         try {
            setLoading(true)
            const response = await axios.get(
               `/api/invoiceShipBilling?voyage=${voyage}&tabSelect=${tabSelect}&pageSize=${pageSize}&current=${current}`
            )
            const responseData = await response.data?.data
            setState((prev) => ({
               ...prev,
               _shipBillingData: responseData,
            }))
         } catch (error) {
            console.error(error)
         } finally {
            setLoading(false)
         }
      }
   }

   const isSearchShipBillingValidate = (voyage) => {
      return voyage && /\d{1}|\d{2}\/\d{1}|\d{2}\/\d{4}/.test(voyage)
   }

   const [state, setState] = React.useState({
      _voyages: [],
      _shipBillingData: [],
      _handleUpdateInvoice: handleUpdateInvoice,
      _handleChangePaginaiton: handleChangePaginaiton,
      _handleUpdateShipBillingStatus: handleUpdateShipBillingStatus,
      _loading: loading,
      _setLoading: setLoading,
   })

   React.useEffect(() => {
      ;(async () => {
         try {
            setLoading(true)
            const response = await axios.get("/api/shipbilling/voyage")
            const responseData = response.data
            const { voyages } = responseData
            setState((prev) => ({
               ...prev,
               _voyages: voyages.map((item, index) => ({
                  key: `VoyageItem_${index + 1}`,
                  label: item.voyage,
                  value: item.voyage,
               })),
            }))
         } catch (error) {
            console.error(error)
         } finally {
            setLoading(false)
         }
      })()
   }, [])

   React.useEffect(() => {
      const fetchData = async () => {
         if (isSearchShipBillingValidate(router.query.voyage)) {
            await handleChangePaginaiton(
               0,
               10,
               searchParams.has("tabSelect")
                  ? searchParams.get("tabSelect")
                  : "all",
               searchParams.has("voyage") ? searchParams.get("voyage") : ""
            )
         }
      }
      fetchData()
   }, [])

   return (
      <InvoiceShipBillingContext.Provider value={state}>
         <LoadingPage loading={loading} />
         {children}
      </InvoiceShipBillingContext.Provider>
   )
}
