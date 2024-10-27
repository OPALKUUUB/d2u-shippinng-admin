import query from "../../../mysql/connection"
import { CalBaseRate } from "../../../../pages/api/shipbilling"

async function postInvoiceShipBilling(body) {
   try {
      // Destructure and validate inputs
      const { shipBillingId, userId } = body
      if (!shipBillingId || !userId) {
         return { status: 400, message: "Missing shipBillingId or userId" }
      }

      // Fetch user information from the database
      const users = await query("SELECT * FROM users WHERE id = ?", [userId])
      if (users.length === 0) {
         return { status: 404, message: "User not found" }
      }

      // Calculate base rate
      const user = users[0]
      const baseRate = CalBaseRate(user.point_last, user)

      // Prepare content_data with calculated baseRate
      const content_data = {
         slipImage: "",
         address: "",
         addAddress: "",
         addressType: "",
         addAddressType: "",
         isSelectPayOnSite: false,
         baseRate,
         addressList: [],
      }

      // Check if the invoice already exists for the given shipBillingId
      const getInvoiceByShipBilling = await query(
         "SELECT invoice_id FROM invoice WHERE ship_billing_id = ?",
         [shipBillingId]
      )

      // If no invoice exists, insert a new one
      if (getInvoiceByShipBilling.length === 0) {
         const queryParams = [shipBillingId, JSON.stringify(content_data)]
         const queryString =
            "INSERT INTO invoice (ship_billing_id, content_data) VALUES (?, ?);"
         const result = await query(queryString, queryParams)

         return {
            status: 201,
            message: "Invoice created successfully",
            link: `https://web-invoice.d2u-shipping.com?invoiceId=${result.insertId}`,
         }
      }

      // If invoice exists, return the existing invoice link
      return {
         status: 200,
         message: "Invoice already exists",
         link: `https://web-invoice.d2u-shipping.com?invoiceId=${getInvoiceByShipBilling[0].invoice_id}`,
      }
   } catch (error) {
      console.error("Error in postInvoiceShipBilling:", error.message)
      return {
         status: 500,
         message: "An error occurred while processing the invoice",
      }
   }
}

export default postInvoiceShipBilling
