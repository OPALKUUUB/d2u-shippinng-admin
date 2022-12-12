import mysql from "../../../../lib/db"
import genDate from "../../../../utils/genDate"

async function handler(req, res) {
   if (req.method === "GET") {
      await mysql.connect()
      const trackings = await mysql.query(
         "SELECT trackings.*,users.username  FROM trackings JOIN users on users.id = trackings.user_id WHERE channel = ?",
         ["frill"]
      )
      await mysql.end()
      res.status(200).json({
         message: "get frill tracking success!",
         trackings,
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
            channel,
            date_created,
            date_created,
         ]
      )
      const trackings = await mysql.query(
         "SELECT trackings.*,users.username  FROM trackings JOIN users on users.id = trackings.user_id WHERE channel = ?",
         ["frill"]
      )
      await mysql.end()
      res.status(201).json({ message: "insert data success!", trackings })
   }
   if (req.method === "PATCH") {
      const { id } = req.query
      const {
         user_id,
         date,
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
         "UPDATE trackings SET user_id = ?, date = ?, voyage = ?, track_no = ?, box_no = ?, weight = ?, price = ?, remark_user = ?, remark_admin = ?, received = ?, finished = ? WHERE id = ?",
         [
            user_id,
            date,
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
         ["frill"]
      )
      await mysql.end()
      res.status(200).json({ message: "update data success!", trackings })
   }
}

export default handler
