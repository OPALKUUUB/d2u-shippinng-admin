import mysql from "../../../lib/db"
import genDate from "../../../utils/genDate"

async function handler(req, res) {
   const { method } = req
   if (method === "GET") {
      console.log(`----------> Call GET::/api/deposit-first`)
      await mysql.connect()
      const trackings_by_voyage = await mysql.query(
         `
         SELECT 
            trackings.user_id, 
            users.username,
            trackings.voyage,
            trackings.box_no
         FROM 
            trackings
         JOIN 
            users 
         ON 
            users.id = trackings.user_id 
         WHERE 
            trackings.airbilling = 0`
      )
      const ship_billing = await mysql.query(
         `SELECT
            ship_billing.id as shipbilling_id,
            ship_billing.user_id,
            ship_billing.voyage,
            ship_billing.payment_type,
            ship_billing.invoice_notificate,
            ship_billing.check,
            ship_billing.check_2,
            ship_billing.remark,
            ship_billing.address,
            ship_billing.rate,
            ship_billing.slip_image,
            ship_billing.delivery_type,
            ship_billing.voyage_price,
            ship_billing.delivery_by,
            ship_billing.date_pay_voyage,
            ship_billing.delivery_cost,
            ship_billing.notify_data_klong4,
            ship_billing.check_pay_delivery_cost,
            ship_billing.track_no,
            ship_billing.deposit_first_delivery_type
        FROM ship_billing
        WHERE ship_billing.delivery_type = ?`,
         ["ฝากไว้ก่อน"]
      )
      const trackings = trackings_by_voyage.reduce((a, c) => {
         const billing = ship_billing.filter(
            (ft) => ft.voyage === c.voyage && ft.user_id === c.user_id
         )
         if (billing.length === 0) {
            return [...a]
         }
         return [...a, { ...c, ...billing[0] }]
      }, [])
      await mysql.end()
      res.status(200).json({
         message: "get product success!",
         trackings,
      })
   }
}

export default handler
