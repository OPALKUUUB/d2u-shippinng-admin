import getInvoiceShipBilling from "../../../dbs/query/invoice-ship-billing/getInvoiceShipBilling"
import patchInvoiceShipBilling from "../../../dbs/query/invoice-ship-billing/patchInvoiceShipBilling"
import updateInvoice from "../../../dbs/query/invoice-ship-billing/updateInvoice"

async function handlers(req, res) {
   const { method, query, body } = req
   switch (method) {
      case "GET":
         console.log("GET::/api/invoiceShipBilling")
         await handleGetRequest(query, res)
         break
      case "PATCH":
         console.log("PATCH::/api/invoiceShipBilling")
         await handlePatchRequest(body, res)
         break
      case "PUT":
         console.log("PUT::/api/invoiceShipBilling")
         await handlePutRequest(body, res)
         break
      default:
         res.status(405).json({ code: 405, message: "Method Not Allowed" })
   }
}

async function handleGetRequest(query, res) {
   try {
      const invoiceShipBilling = await getInvoiceShipBilling(query)
      res.status(200).json({
         code: 200,
         message: "Success",
         data: invoiceShipBilling,
      })
   } catch (error) {
      console.error("Error patching invoice ship billing: ", error.message)
      res.status(500).json({
         code: 500,
         message: "An error occured while patching  invoiceShipBilling",
      })
   }
}

async function handlePatchRequest(body, res) {
   try {
      const invoiceShipBilling = await patchInvoiceShipBilling(body)
      res.status(200).json({
         code: 200,
         message: "Success",
         data: invoiceShipBilling,
      })
   } catch (error) {
      console.error("Error fetching invoice ship billing: ", error.message)
      res.status(500).json({
         code: 500,
         message: "An error occured while fetcing  invoiceShipBilling",
      })
   }
}

async function handlePutRequest(body, res) {
   try {
      const invoiceResult = await updateInvoice(body)
      res.status(200).json({
         code: 200,
         message: "Success",
         data: invoiceResult,
      })
   } catch (error) {
      console.error("Error fetching invoice ship billing: ", error.message)
      res.status(500).json({
         code: 500,
         message: "An error occured while fetcing  invoiceResult",
      })
   }
}

export default handlers
