import mysql from "../../../../lib/db"

async function handler(req, res) {
   if (req.method === "GET") {
      const id = parseInt(req.query.id, 10)
      await mysql.connect()
      const slips = await mysql.query(
         "SELECT * FROM `yahoo-auction-slip` WHERE id = ?",
         [id]
      )
      await mysql.end()
      res.status(200).json({ slip: slips[0] })
   }
}

export default handler
