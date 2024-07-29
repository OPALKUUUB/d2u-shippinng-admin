import { CalBaseRate } from ".."
import mysql from "../../../../lib/db"

async function handler(req, res) {
   if (req.method === "POST") {
      try {
         const { shipBillingId, userId, shipBillingStatus } = req.body
         const users = await mysql.query("SELECT * FROM users WHERE id = ?", [
            userId,
         ])
         const baseRate1 = CalBaseRate(users[0]?.point_last, users[0])
         const baseRate2 = CalBaseRate(users[0]?.point_last, users[0])
         const baseRate =
            baseRate1.rate < baseRate2.rate ? baseRate1 : baseRate2
         const content_data = {
            mode: shipBillingStatus,
            address: "",
            slipImage: "",
            addAddress: "",
            addressType: "",
            addAddressType: "",
            isSelectPayOnSite: false,
            nextInvoice: false,
            baseRate,
         }
         const getInvoiceByShipBilling = await mysql.query(
            "SELECT invoice_id FROM invoice WHERE ship_billing_id = ?",
            [shipBillingId]
         )
         if (getInvoiceByShipBilling.length === 0) {
            const queryParams = [shipBillingId, JSON.stringify(content_data)]
            const queryString =
               "INSERT INTO invoice (ship_billing_id, content_data) VALUES(?,?);"
            const row = await mysql.query(queryString, queryParams)
            res.status(200).json({
               link: `http://localhost:5173?invoiceId=${row.insertId}`,
            })
         } else {
            res.status(200).json({
               link: `http://localhost:5173?invoiceId=${getInvoiceByShipBilling[0].invoice_id}`,
               message: "this invoice create link already",
            })
         }
      } catch (error) {
         console.log(error)
      }
   }
}

export default handler
