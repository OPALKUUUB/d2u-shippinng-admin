import mysql from "../../../../lib/db"
import genDate from "../../../../utils/genDate"
import sortDateTime from "../../../../utils/sortDateTime"

async function handler(req, res) {
   if (req.method === "GET") {
      await mysql.connect()
      const trackings = await mysql.query(
         `
         SELECT trackings.*, users.username 
         FROM trackings 
         JOIN users ON users.id = trackings.user_id 
         WHERE channel = 'fril' 
         ORDER BY STR_TO_DATE(trackings.created_at, '%d/%m/%Y %H:%i:%s') DESC;
         `
      )
      const trackingImages = await mysql.query(`
         SELECT  \`tracking-image\`.* 
         FROM  \`tracking-image\`
         JOIN trackings ON
         trackings.id =  \`tracking-image\`.tracking_id
         WHERE trackings.channel = 'fril';
      `)
      await mysql.end()
      const trackingsWithImages = trackings.map((tracking, index) => {
         const images = trackingImages.filter(
            (image) => image.tracking_id === tracking.id
         )
         return {
            key: index,
            ...tracking,
            images,
         }
      })
      res.status(200).json({
         message: "get fril tracking success!",
         trackings: trackingsWithImages,
      })
   }
   if (req.method === "POST") {
      const {
         date,
         user_id,
         box_no,
         track_no,
         weight,
         price,
         voyage,
         received,
         finished,
         remark_user,
         remark_admin,
         channel,
      } = req.body
      const date_created = genDate()
      await mysql.connect()
      const preference = await mysql.query("SELECT rate_yen FROM preference")
      const { rate_yen } = preference[0]
      await mysql.query(
         "INSERT INTO trackings (rate_yen, date, user_id, box_no, track_no, weight, price, voyage, remark_user, remark_admin, received, finished, channel, created_at, updated_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
         [
            rate_yen,
            date,
            user_id,
            box_no,
            track_no,
            weight,
            price,
            voyage,
            remark_user,
            remark_admin,
            received,
            finished,
            "fril",
            date_created,
            date_created,
         ]
      )
      const trackings = await mysql.query(
         "SELECT trackings.*,users.username  FROM trackings JOIN users on users.id = trackings.user_id WHERE channel = ?",
         ["fril"]
      )
      await mysql.end()
      res.status(201).json({
         message: "insert data success!",
         trackings: trackings
            .sort((a, b) => sortDateTime(a.created_at, b.created_at))
            .reduce((a, c, i) => [...a, { ...c, key: i }], []),
      })
   } else if (req.method === "PUT") {
      const id = parseInt(req.query.id, 10)
      const { received, finished } = req.body
      await mysql.connect()
      if (received !== undefined) {
         await mysql.query("update trackings set received = ? where id = ?", [
            received,
            id,
         ])
      } else if (finished !== undefined) {
         await mysql.query("update trackings set finished = ? where id = ?", [
            finished,
            id,
         ])
      }
      const trackings = await mysql.query(
         "SELECT trackings.*,users.username  FROM trackings JOIN users on users.id = trackings.user_id WHERE channel = ?",
         ["fril"]
      )
      await mysql.end()
      res.status(200).json({
         message: "update received or finished mercari tracking success!",
         trackings: trackings
            .sort((a, b) => sortDateTime(a.created_at, b.created_at))
            .reduce((a, c, i) => [...a, { ...c, key: i }], []),
      })
   } else if (req.method === "PATCH") {
      const { id } = req.query
      const {
         user_id,
         date,
         link,
         voyage,
         received,
         finished,
         track_no,
         box_no,
         weight,
         price,
         remark_user,
         remark_admin,
      } = req.body
      await mysql.connect()
      await mysql.query(
         "UPDATE trackings SET user_id = ?, date = ?, link = ?, voyage = ?, track_no = ?, box_no = ?, weight = ?, price = ?, remark_user = ?, remark_admin = ?, received = ?, finished = ? WHERE id = ?",
         [
            user_id,
            date,
            link,
            voyage,
            track_no,
            box_no,
            weight,
            price,
            remark_user,
            remark_admin,
            received,
            finished,
            id,
         ]
      )
      const trackings = await mysql.query(
         "SELECT trackings.*,users.username  FROM trackings JOIN users on users.id = trackings.user_id WHERE channel = ?",
         ["fril"]
      )
      await mysql.end()
      res.status(200).json({
         message: "update data success!",
         trackings: trackings
            .sort((a, b) => sortDateTime(a.created_at, b.created_at))
            .reduce((a, c, i) => [...a, { ...c, key: i }], []),
      })
   } else if (req.method === "DELETE") {
      const id = parseInt(req.query.id, 10)
      await mysql.connect()
      await mysql.query("DELETE FROM trackings WHERE id = ?", [id])
      const trackings = await mysql.query(
         "SELECT trackings.*,users.username  FROM trackings JOIN users on users.id = trackings.user_id WHERE channel = ?",
         ["fril"]
      )
      await mysql.end()
      res.status(200).json({
         message: "delete row successful !",
         trackings: trackings
            .sort((a, b) => sortDateTime(a.created_at, b.created_at))
            .reduce((a, c, i) => [...a, { ...c, key: i }], []),
      })
   }
}

export default handler
