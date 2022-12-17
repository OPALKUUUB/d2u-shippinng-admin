

import mysql from "../../../lib/db"

async function handler(req, res) {
   await mysql.connect()
   const users = await mysql.query("SELECT id, username FROM `users`")
   await mysql.end()
   // console.log(users)
   res.status(200).json({
      message: "Get users success!",
      users,
   })
}

export default handler
