import mysql from "../../../lib/db"
import genDate from "../../../utils/genDate"

async function handler(req, res) {
   if (req.method === "GET") {
      await mysql.connect()
      const products = await mysql.query(
         "SELECT *  FROM `mart-product` WHERE channel = ?",
         ["disneyland"]
      )
      await mysql.end()
      res.status(200).json({
         message: "get disneyland product success!",
         products,
      })
   }
   
}

export default handler
