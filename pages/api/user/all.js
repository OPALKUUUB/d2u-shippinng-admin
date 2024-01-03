import mysql from "../../../lib/db"

async function handler(req, res) {
   if (req.method === "GET") {
      await mysql.connect()
      // console.log(req.query.user_id)
      if (req.query.user_id !== undefined) {
         const user_id = parseInt(req.query.user_id, 10)
         const users = await mysql.query("select * from users where id = ?", [
            user_id,
         ])
         await mysql.end()
         res.status(200).json({ user: users[0] })
      } else {
         const users = await mysql.query("SELECT * FROM users")
         await mysql.end()
         res.status(200).json({
            message: "Get users success!",
            users,
         })
      }
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
   } else if (req.method === "PUT") {
      const { id, point_last } = req.body
      await mysql.connect()
      await mysql.query(
         "update users set point_last = ? where id = ?",
         [point_last, id]
      )
      // const users = await mysql.query("select * from users")
      await mysql.end()
      res.status(200).json({ message: "update point_last user success!" })
   }
}

export default handler
