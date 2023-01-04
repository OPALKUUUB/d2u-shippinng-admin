import mysql from "../../../../lib/db"
import genDate from "../../../../utils/genDate"
import sortDateTime from "../../../../utils/sortDateTime"

async function handler(req, res) {
   if (req.method === "GET") {
      await mysql.connect()
      const trackings = await mysql.query(
         "SELECT trackings.*,users.username  FROM trackings JOIN users on users.id = trackings.user_id WHERE channel = ?",
         ["shimizu"]
      )
      await mysql.end()
      res.status(200).json({
         message: "get shimizu tracking success!",
         trackings: trackings
            .sort((a, b) => sortDateTime(a.created_at, b.created_at))
            .reduce((a, c, i) => [...a, { ...c, key: i }], []),
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
         remark_user,
         remark_admin,
         channel,
      } = req.body
      const date_created = genDate()
      await mysql.connect()
      const preference = await mysql.query("SELECT rate_yen FROM preference")
      const { rate_yen } = preference[0]
      await mysql.query(
         "INSERT INTO trackings (rate_yen, date, user_id, box_no, track_no, weight, price, voyage, remark_user, remark_admin, channel, created_at, updated_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)",
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
            "shimizu",
            date_created,
            date_created,
         ]
      )
      const trackings = await mysql.query(
         "SELECT trackings.*,users.username  FROM trackings JOIN users on users.id = trackings.user_id WHERE channel = ?",
         ["shimizu"]
      )
      await mysql.end()
      res.status(201).json({
         message: "insert data success!",
         trackings: trackings
            .sort((a, b) => sortDateTime(a.created_at, b.created_at))
            .reduce((a, c, i) => [...a, { ...c, key: i }], []),
      })
   }
   if (req.method === "PATCH") {
      const { id } = req.query
      const {
         user_id,
         date,
         voyage,
         track_no,
         box_no,
         weight,
         price,
         remark_user,
         remark_admin,
      } = req.body
      await mysql.connect()
      await mysql.query(
         "UPDATE trackings SET user_id = ?, date = ?, voyage = ?, track_no = ?, box_no = ?, weight = ?, price = ?, remark_user = ?, remark_admin = ? WHERE id = ?",
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
            id,
         ]
      )
      const trackings = await mysql.query(
         "SELECT trackings.*,users.username  FROM trackings JOIN users on users.id = trackings.user_id WHERE channel = ?",
         ["shimizu"]
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
         ["shimizu"]
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
