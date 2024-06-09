import React, { useState } from "react"
import axios from "axios"
import { useRouter } from "next/router"
import LoadingPage from "../components/LoadingPage"

export const TABLIST = [
   { label: "all", key: "TabItem_all" },
   { label: "unpaid", key: "TabItem_unpaid" },
   { label: "pickup", key: "TabItem_pickup" },
   { label: "toship", key: "TabItem_toship" },
   { label: "ship", key: "TabItem_ship" },
   { label: "finish", key: "TabItem_finish" },
]

export const InvoiceShipBillingContext = React.createContext(null)

export const useInvoiceShipBillingContext = () =>
   React.useContext(InvoiceShipBillingContext)

export const InvoiceShipBillingProvider = ({ children }) => {
   const router = useRouter()

   const [loading, setLoading] = useState(false)

   const handleUpdateShipBillingStatus = async (
      shipBillingStatus,
      shipBillingId,
      current,
      pageSize
   ) => {
      try {
         setLoading(true)
         const payload = {
            shipBillingId: shipBillingId,
            shipBillingStatus: shipBillingStatus,
         }
         const response = await axios.patch("/api/invoiceShipBilling", payload)
         await handleChangePaginaiton(current, pageSize)
         console.log(response)
      } catch (error) {
         console.log(error)
      } finally {
         console.log("finish")
         setLoading(false)
      }
   }

   const handleChangePaginaiton = async (current, pageSize) => {
      if (isSearchShipBillingValidate(router.query.voyage)) {
         try {
            setLoading(true)
            const response = await axios.get(
               `/api/invoiceShipBilling?voyage=${
                  router.query.voyage
               }&tabSelect=${
                  !router.query.tabSelect ? "all" : router.query.tabSelect
               }&pageSize=${pageSize}&current=${current}`
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

   const isSearchShipBillingValidate = (voyage, tabSelect) => {
      return (
         voyage && /\d{1}|\d{2}\/\d{1}|\d{2}\/\d{4}/.test(voyage)
         // &&
         // tabSelect &&
         // TABLIST.map((item) => item.label).includes(tabSelect)
      )
   }

   const [state, setState] = React.useState({
      _voyages: [],
      _shipBillingData: [],
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
      ;(async () => {
         if (
            isSearchShipBillingValidate(
               router.query.voyage,
               router.query.tabSelect
            )
         ) {
            await handleChangePaginaiton(0, 10)
         }
      })()
   }, [router.query])

   return (
      <InvoiceShipBillingContext.Provider value={state}>
         <LoadingPage loading={loading} />
         {children}
      </InvoiceShipBillingContext.Provider>
   )
}
