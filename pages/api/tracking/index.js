import mysql from "../../../lib/db"

async function handler(req, res) {
   if (req.method === "PATCH") {
      const id = parseInt(req.query.id, 10)
      await mysql.connect()
      await mysql.query("UPDATE trackings SET ? WHERE id = ?", [req.body, id])
      await mysql.end()
      res.status(200).json({ message: "update trackings success!" })
   }
}

export default handler
