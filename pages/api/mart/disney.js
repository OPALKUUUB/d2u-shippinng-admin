import mysql from "../../../lib/db"
import genDate from "../../../utils/genDate"

async function handler(req, res) {
   if (req.method === "GET") {
      await mysql.connect()
      const products = await mysql.query(
         "SELECT *  FROM `mart-product` WHERE channel = ?",
         ["disney"]
      )
      await mysql.end()
      res.status(200).json({
         message: "get disney product success!",
         products,
      })
   }
   if (req.method === "POST") {
      const { name, category, price, expire_date, description, channel } =
         req.body
      const date_created = genDate()
      await mysql.connect()
      await mysql.query(
         "INSERT INTO `mart-product` (name, category, price, expire_date, description, channel, created_at, updated_at) VALUES (?,?,?,?,?,?,?,?)",
         [
            name,
            category,
            price,
            expire_date,
            description,
            channel,
            date_created,
            date_created,
         ]
      )
      const marts = await mysql.query(
         "SELECT * FROM `mart-product` WHERE channel = ?",
         ["disney"]
      )
      await mysql.end()
      res.status(201).json({ message: "insert data success!", marts })
   }
   if (req.method === "PATCH") {
      const { id } = req.query
      const { name, category, price, expire_date, description } = req.body
      await mysql.connect()
      await mysql.query(
         "UPDATE `mart-product` SET name = ?, category = ?, price = ?, expire_date = ?, description = ? WHERE id = ?",
         [name, category, price, expire_date, description, id]
      )
      const marts = await mysql.query(
         "SELECT * FROM `mart-product` WHERE channel = ?",
         ["disney"]
      )
      await mysql.end()
      res.status(200).json({ message: "update data success!", marts })
   }
   if (req.method === "DELETE") {
      const { id } = req.query
      await mysql.connect()
      await mysql.query("DELETE FROM `mart-product` WHERE id = ?", [id])
      const marts = await mysql.query(
         "SELECT * FROM `mart-product` WHERE channel = ?",
         ["disney"]
      )
      await mysql.end()
      res.status(200).json({ message: "delete data success!", marts })
   }
}

export default handler
