import mysql from "../../../../lib/db"

async function handler(req, res) {
   if (req.method === "GET") {
      const { id } = req.query
      await mysql.connect()
      const tracking_image = await mysql.query(
         "SELECT id, image FROM `tracking-image` WHERE tracking_id = ?",
         [parseInt(id, 10)]
      )
      await mysql.end()
      res.status(200).json({
         message: "get shimizu tracking success!",
         tracking_image,
      })
   }
   // if (req.method === "PATCH") {
   //    const { tracking_id } = req.query
   //    const { deleteImages, addImages } = req.body
   //    await mysql.connect()
   //    if (deleteImages.length > 0) {
   //       let sql = "DELETE FROM `tracking-image` WHERE id = ?"
   //       for (let i = 1; i < deleteImages.length; i++) {
   //          sql += " OR  id = ? "
   //       }
   //       await mysql.query(sql, deleteImages)
   //    }
   //    if (addImages.length > 0) {
   //       let sql =
   //          "INSERT INTO `tracking-image` (image, tracking_id) VALUES (?,?)"
   //       for (let i = 1; i < addImages.length; i++) {
   //          sql += " ,(?,?) "
   //       }
   //       await mysql.query(
   //          sql,
   //          addImages.reduce(
   //             (accumulator, currentValue) => [
   //                ...accumulator,
   //                currentValue,
   //                tracking_id,
   //             ],
   //             []
   //          )
   //       )
   //    }
   //    await mysql.end()
   //    res.status(200).json({ massage: "update image" })
   // }
   if (req.method === "PATCH") {
      const { tracking_id } = req.query
      const { doneImage } = req.body
      console.log("doneApi", doneImage)
      await mysql.connect()
      await mysql.query("DELETE FROM `tracking-image` WHERE tracking_id = ?", [
         parseInt(tracking_id, 10),
      ])
      if (doneImage.length > 0) {
         let sql =
            "INSERT INTO `tracking-image` (image, tracking_id) VALUES (?,?)"
         for (let i = 1; i < doneImage.length; i++) {
            sql += ",(?,?) "
         }
         await mysql.query(
            sql,
            doneImage.reduce(
               (result, current) => [
                  ...result,
                  current.url,
                  parseInt(tracking_id, 10),
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
