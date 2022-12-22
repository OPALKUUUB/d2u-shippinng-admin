import mysql from "../../../../../lib/db"

async function handler(req, res) {
   if (req.method === "GET") {
      await mysql.connect()
      const yahoo_history = await mysql.query(
         `
        SELECT
            ${"`yahoo-auction-order`"}.id,
            ${"`yahoo-auction-order`"}.image,
            ${"`yahoo-auction-order`"}.link,
            ${"`yahoo-auction-order`"}.status,
            ${"`yahoo-auction-payment`"}.payment_status,
            ${"`yahoo-auction-order`"}.created_at
        FROM
            ${"`yahoo-auction-order`"}
        LEFT JOIN
            ${"`yahoo-auction-payment`"}
        ON
            ${"`yahoo-auction-order`"}.payment_id = ${"`yahoo-auction-payment`"}.id
        WHERE
            ${"`yahoo-auction-order`"}.status IS NOT NULL AND
            ${"`yahoo-auction-payment`"}.payment_status != ? AND
            ${"`yahoo-auction-payment`"}.payment_status != ? AND
            ${"`yahoo-auction-payment`"}.payment_status != ?`,
         ["รอค่าโอนและค่าส่ง", "รอการชำระเงิน", "รอการตรวจสอบ"]
      )
      await mysql.end()
      res.status(200).json({
         message: "get history success",
         history: yahoo_history,
      })
   }
}

export default handler
