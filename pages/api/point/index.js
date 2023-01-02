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
         `,
         [user_id]
      )
      const trackings = trackings_user.filter(
         (ft) =>
            parseInt(ft.created_at.split(" ")[0].split("/")[2], 10) === 2023
      )
      const point_current = trackings.reduce((a, c) => {
         console.log(c)
         const price = c.price === null ? 0 : c.price
         const weight = c.weight === null ? 0 : c.weight
         const rate_yen = c.rate_yen === null ? 0.29 : c.rate_yen
         const point = Math.ceil(price / rate_yen / 2000) + weight
         return a + point
      }, 0)
      await mysql.end()
      res.status(200).json({
         message: "get point",
         point: point_current,
      })
   }
}

export default handler
