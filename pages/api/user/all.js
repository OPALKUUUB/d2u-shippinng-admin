import mysql from "../../../lib/db"

async function handler(req, res) {
   if (req.method === "GET") {
      await mysql.connect()
      const users = await mysql.query("SELECT * FROM users")
      await mysql.end()
      res.status(200).json({
         message: "Get users success!",
         users,
      })
   } else if (req.method === "PATCH") {
      const { id, username, name, contact, address, phone, point_last } =
         req.body
      await mysql.connect()
      await mysql.query(
         "update users set username = ?, name = ?, contact = ?, address = ?, phone = ?, point_last = ? where id = ?",
         [username, name, contact, address, phone, point_last, id]
      )
      const users = await mysql.query("select * from users")
      await mysql.end()
      res.status(200).json({ message: "patch user success!", users })
   }
}

export default handler
