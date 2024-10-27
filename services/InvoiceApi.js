import HttpUtil, { handleError } from "../utils/HttpUtil"

// GET method to fetch invoice ship billing by voyage
const getInvoiceShipBillingByVoyage = async (
   params = {},
   additionalConfig = {}
) => {
   try {
      const { pageSize = 10, current = 1, voyage, shipBillingStatus } = params
      

      if (!voyage) {
         throw new Error("Voyage parameter is required")
      }

      const config = {
         params: {
            pageSize,
            current,
            voyage,
            shipBillingStatus,
         },
         ...additionalConfig,
      }
      
      const { data } = await HttpUtil.get("/api/v2/invoiceShipBilling", config)
      return data
   } catch (error) {
      handleError(error)
   }
}

// GET method to fetch available voyages
const getShipBillingVoyage = async (params = {}) => {
   try {
      const { voyages } = await HttpUtil.get("/api/shipbilling/voyage", {
         params,
      })

      return voyages
   } catch (error) {
      handleError(error)
   }
}

// POST method to create or update invoice ship billing
const postInvoiceShipBilling = async (payload = {}, additionalConfig = {}) => {
   try {
      if (!payload.shipBillingId || !payload.userId) {
         throw new Error("Both shipBillingId and userId are required.")
      }

      const config = {
         ...additionalConfig, // Include any additional configurations like headers, etc.
      }

      const { data } = await HttpUtil.post(
         "/api/v2/invoiceShipBilling",
         payload,
         config
      )
      return data
   } catch (error) {
      handleError(error)
   }
}

// Export the API methods
const InvoiceApi = {
   getInvoiceShipBillingByVoyage,
   getShipBillingVoyage,
   postInvoiceShipBilling, // POST method added here
}

export default InvoiceApi
