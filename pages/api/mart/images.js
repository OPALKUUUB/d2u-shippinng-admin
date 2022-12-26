import mysql from "../../../lib/db"

async function handler(req, res) {
   if (req.method === "GET") {
      const { id } = req.query
      await mysql.connect()
      const product_image = await mysql.query(
         "SELECT id, image FROM `mart-product-image` WHERE mart_product_id = ?",
         [parseInt(id, 10)]
      )
      await mysql.end()
      res.status(200).json({
         message: "get mart product disneyland success!",
         product_image,
      })
   }
   if (req.method === "PATCH") {
      const { product_id } = req.query
      const { doneImage } = req.body
      //   console.log("doneApi", doneImage)
      await mysql.connect()
      await mysql.query(
         "DELETE FROM `mart-product-image` WHERE mart_product_id = ?",
         [parseInt(product_id, 10)]
      )
      if (doneImage.length > 0) {
         let sql =
            "INSERT INTO `mart-product-image` (image, mart_product_id) VALUES (?,?)"
         for (let i = 1; i < doneImage.length; i++) {
            sql += ",(?,?) "
         }
         await mysql.query(
            sql,
            doneImage.reduce(
               (result, current) => [
                  ...result,
                  current.url,
                  parseInt(product_id, 10),
               ],
               []
            )
         )
      }
      await mysql.end()
      res.status(200).json({ massage: "post image success!" })
   }
}

export default handler
