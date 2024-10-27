import getInvoiceShipBilling from "../../../../dbs/query/v2/invoice-ship-billing/getInvoiceShipBilling"
import postInvoiceShipBilling from "../../../../dbs/query/v2/invoice-ship-billing/postInvoiceShipBilling"

// Centralized error handler
const handleError = (
   error,
   res,
   message = "An error occurred",
   statusCode = 500
) => {
   console.error(`${message}:`, error.message, error.stack)
   return res.status(statusCode).json({
      code: statusCode,
      message: `${message}. ${error.message}`,
   })
}

// Main handler function
async function handlers(req, res) {
   const { method, query, body } = req

   switch (method) {
      case "GET":
         console.log("GET::/api/v2/invoiceShipBilling")
         return handleGetRequest(query, res)
      case "POST":
         console.log("POST::/api/v2/invoiceShipBilling")
         return handlePostRequest(body, res)
      default:
         return res.status(405).json({
            code: 405,
            message: "Method Not Allowed",
         })
   }
}

// Handle GET request
async function handleGetRequest(query, res) {
   try {
      const invoiceShipBilling = await getInvoiceShipBilling(query)
      return res.status(200).json({
         code: 200,
         message: "Success",
         data: invoiceShipBilling,
      })
   } catch (error) {
      return handleError(error, res, "Error fetching invoice ship billing")
   }
}

// Handle POST request
async function handlePostRequest(body, res) {
   try {
      // Validate request body
      if (!body || !body.shipBillingId || !body.userId) {
         return res.status(400).json({
            code: 400,
            message:
               "Invalid request body. 'shipBillingId' and 'userId' are required.",
         })
      }

      // Call the function to insert or update invoice ship billing in the database
      const result = await postInvoiceShipBilling(body)

      // Respond with success message
      return res.status(201).json({
         code: 201,
         message: "Invoice ship billing created successfully",
         data: result,
      })
   } catch (error) {
      return handleError(error, res, "Error creating invoice ship billing")
   }
}

export default handlers
