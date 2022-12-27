import mysql from "../../../lib/db"

async function handler(req, res) {
   if (req.method === "PATCH") {
      const id = parseInt(req.query.id, 10)
      await mysql.connect()
      await mysql.query("UPDATE trackings SET ? WHERE id = ?", [req.body, id])
      await mysql.end()
      res.status(200).json({ message: "update trackings success!" })
   }else if (req.method === "DELETE") {
      const id = parseInt(req.query.id, 10)
      await mysql.connect()
      await mysql.query("DELETE FROM trackings WHERE id = ?", [id])
      const trackings = await mysql.query(
         "SELECT trackings.*,users.username  FROM trackings JOIN users on users.id = trackings.user_id WHERE channel = ?",
         ["yahoo"]
      )
      await mysql.end()
      res.status(200).json({ message: "delete row successful !", trackings })
   }
}

export default handler
