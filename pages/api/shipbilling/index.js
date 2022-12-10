import mysql from "../../../lib/db"
import genDate from "../../../utils/genDate"

async function handler(req, res) {
   if (req.method === "GET") {
      const { voyage } = req.query
      await mysql.connect()
      const trackings = await mysql.query(
         "SELECT `trackings`.*, users.username, ship_billing.payment_type, ship_billing.invoice_notificate, ship_billing.check, ship_billing.remark FROM `trackings` JOIN users ON `trackings`.user_id = users.id LEFT JOIN ship_billing ON ship_billing.voyage = trackings.voyage WHERE trackings.voyage = ?",
         [voyage]
      )
      console.log(trackings)
      await mysql.end()
      res.status(200).json({
         message: "get disneyland product success!",
         trackings,
      })
   }
}

export default handler
