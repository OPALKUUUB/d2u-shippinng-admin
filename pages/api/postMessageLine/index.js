import { getSession } from "next-auth/react"

import mysql from "../../../lib/db"

async function handler(req, res) {
   const { message, line_access_token } = req.body
   if (req.method === "POST") {
      const session = await getSession({ req })
      if (!session) {
         res.status(401).json({ message: "Not authenticated!" })
         return
      }
      const username = session.user.name
      try {
         await mysql.connect()
         const users = await mysql.query(
            "SELECT * FROM users WHERE username = ?",
            [username]
         )
         await mysql.end()
         if (users.length === 0) {
            res.status(301).json({ message: "not found user" })
            return
         }
         if (line_access_token) {
            const body = new URLSearchParams()
            body.append("message", message)
            await fetch("https://notify-api.line.me/api/notify", {
               method: "POST",
               headers: {
                  "Content-Type": "application/x-www-form-urlencoded",
                  "Authorization": `Bearer ${line_access_token}`,
               },
               body: body.toString(),
            })
            res.status(200).json({
               status: 200,
               message: "Post message successfully",
            })
         } else {
            res.status(400).json({
               status: 400,
               message: "Please register line notify",
            })
         }
      } catch (e) {
         console.log(e)
         res.status(400).json({ status: 400, message: "Bad request" })
      }
   }
}

export default handler
