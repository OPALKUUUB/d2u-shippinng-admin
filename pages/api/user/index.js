// import { getSession } from "next-auth/react"

import mysql from "../../../lib/db"

async function handler(req, res) {
   //    const session = await getSession({ req })
   //    if (!session) {
   //       res.status(401).json({ message: "Not authenticated!" })
   //       return
   //    }
   await mysql.connect()
   const users = await mysql.query("SELECT * FROM `users`")
   await mysql.end()
   res.status(200).json({
      message: "Get users success!",
      users,
   })
}

export default handler
