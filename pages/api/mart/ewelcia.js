import mysql from "../../../lib/db"
import genDate from "../../../utils/genDate"

async function handler(req, res) {
   if (req.method === "GET") {
      await mysql.connect()
      const products = await mysql.query(
         "SELECT *  FROM `mart-product` WHERE channel = ?",
         ["ewelcia"]
      )
      await mysql.end()
      res.status(200).json({
         message: "get ewelcia product success!",
         products,
      })
   }
}

export default handler