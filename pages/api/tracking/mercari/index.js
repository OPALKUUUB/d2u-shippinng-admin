import query from "../../../../dbs/mysql/connection"
import getTrackings from "../../../../dbs/query/trackings/getTrackings"
import mysql from "../../../../lib/db"
import genDate from "../../../../utils/genDate"
import sortDateTime from "../../../../utils/sortDateTime"

async function handler(req, res) {
   if (req.method === "GET") {
      const trackings = await getTrackings("mercari")
      res.status(200).json({
         message: "get mercari tracking success!",
         trackings,
      })
   }
   if (req.method === "POST") {
      const {
         date,
         user_id,
         link,
         box_no,
         track_no,
         weight,
         price,
         voyage,
         received,
         finished,
         remark_user,
         remark_admin,
      } = req.body
      const date_created = genDate()
      await mysql.connect()
      const preference = await mysql.query("SELECT rate_yen FROM preference")
      const { rate_yen } = preference[0]
      await mysql.query(
         "INSERT INTO trackings (rate_yen, date, link, user_id, box_no, track_no, weight, price, voyage, remark_user, remark_admin, received, finished, channel, created_at, updated_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
         [
            rate_yen,
            date,
            link,
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
            "mercari",
            date_created,
            date_created,
         ]
      )
      await mysql.end()
      const trackings = await getTrackings("mercari")
      res.status(201).json({
         message: "insert data success!",
         trackings
      })
   } else if (req.method === "PUT") {
      console.log("put::mercari")
      const id = parseInt(req.query.id, 10)
      const { received, finished, airbilling } = req.body
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
      } else if (airbilling !== undefined) {
         await mysql.query("update trackings set airbilling = ? where id = ?", [
            airbilling,
            id,
         ])
      }
      const trackings = await getTrackings("mercari")
      await mysql.end()
      res.status(200).json({
         message: "update received or finished mercari tracking success!",
         trackings
      })
   } else if (req.method === "PATCH") {
      const { id } = req.query
      const {
         user_id,
         link,
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
      const trackings = await getTrackings("mercari")
      await mysql.end()
      res.status(200).json({
         message: "update data success!",
         trackings
      })
   } else if (req.method === "DELETE") {
      const id = parseInt(req.query.id, 10)
      await mysql.connect()
      await mysql.query("DELETE FROM trackings WHERE id = ?", [id])
      await mysql.end()
      const trackings = await getTrackings("mercari")
      res.status(200).json({
         message: "delete row successful !",
         trackings
      })
   }
}

export default handler
