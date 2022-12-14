import mysql from "../../../lib/db"
import genDate from "../../../utils/genDate"

async function handler(req, res) {
   if (req.method === "GET") {
      await mysql.connect()
      const products = await mysql.query(
         "SELECT *  FROM `mart-product` WHERE channel = ?",
         ["promotion"]
      )
      await mysql.end()
      res.status(200).json({
         message: "get promotion product success!",
         products,
      })
   }
}

export default handler
