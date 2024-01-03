import mysql from "../../../lib/db"

async function handler(req, res) {
   if (req.method === "POST") {
      const { user_id } = req.body
      await mysql.connect()
      const trackings_user = await mysql.query(
         `
            SELECT *
            FROM trackings
            WHERE
            user_id = ?
            AND channel NOT LIKE 'yahoo'
         `,
         [user_id]
      )
      const trackings_user_yahoo = await mysql.query(
         `
         SELECT 
            trackings.*, 
            ${"`yahoo-auction-payment`"}.bid
         FROM
            trackings
         JOIN
            ${"`yahoo-auction-payment`"}
         ON
            ${"`yahoo-auction-payment`"}.tracking_id = trackings.id
         WHERE
            trackings.user_id = ?
            AND trackings.channel = 'yahoo'
         `,
         [user_id]
      )
      const trackings = [...trackings_user, ...trackings_user_yahoo].filter(
         (ft) =>
            // parseInt(ft.created_at.split(" ")[0].split("/")[2], 10) === 2023
            parseInt(ft.created_at.split(" ")[0].split("/")[2], 10) === 2024
      )
      const point_current = trackings.reduce((a, c) => {
         const price = c.price === null ? 0 : c.price
         const weight = c.weight === null ? 0 : c.weight
         if (c.channel === "shimizu") {
            return a + weight
         }
         if (c.channel === "mercari" || c.channel === "fril") {
            return a + Math.ceil(price / 1000) + (weight >= 1 ? weight - 1 : 0)
         }
         if (c.channel === "yahoo") {
            return a + Math.ceil(c.bid / 2000) + weight
         }
         return a + Math.ceil(price / 2000) + weight
      }, 0)
      await mysql.end()
      res.status(200).json({
         message: "get point",
         point: Math.ceil(point_current),
      })
   }

}

export default handler
