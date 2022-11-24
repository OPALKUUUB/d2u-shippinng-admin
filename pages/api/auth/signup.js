import { hashPassword } from "../../../lib/auth"
import mysql from "../../../lib/db"
import genDate from "../../../utils/genDate"

async function handler(req, res) {
   if (req.method !== "POST") {
      return
   }
   const date = genDate()
   const { name, username, password, role} = req.body
   const hashedPassword = await hashPassword(password)
   try {
      await mysql.connect()
      const results = await mysql
         .transaction()
         .query(
            "INSERT INTO admins (name, username, password, role, created_at, updated_at) VALUES (?,?,?,?,?,?)",
            [name, username, hashedPassword, role, date, date]
         )
         .query((response) => [
            "SELECT name, username, role, created_at, updated_at FROM admins where id = ?",
            response.insertId,
         ])
         .rollback((error) => {
            console.log(error)
         })
         .commit()
      await mysql.end()
      res.status(201).json({message: "Created user!", user: results[1][0] })
   } catch (error) {
      console.log(error)
      if (error?.code === "ER_DUP_ENTRY") {
         res.status(422).json({
            message: "User exists already!",
         })
      } else {
         res.status(400).json({ message: "Something Wrong!" })
      }
   }
}
export default handler
