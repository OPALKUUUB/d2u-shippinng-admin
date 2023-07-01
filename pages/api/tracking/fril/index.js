import query from "../../../../dbs/mysql/connection"
import getTrackings from "../../../../dbs/query/trackings/getTrackings"
import mysql from "../../../../lib/db"
import genDate from "../../../../utils/genDate"

async function handler(req, res) {
   if (req.method === "GET") {
      const trackings = await getTrackings("fril")
      res.status(200).json({
         message: "get fril tracking success!",
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
            "fril",
            date_created,
            date_created,
         ]
      )
      await mysql.end()
      const trackings = await getTrackings("fril")
      res.status(201).json({
         message: "insert data success!",
         trackings,
      })
   } else if (req.method === "PUT") {
      const {id} = req.query
      const keys = Object.keys(req.body)
      const values = Object.values(req.body)
      console.log(keys[0], values[0])
      await query(`
         UPDATE trackings
         SET ${keys[0]} = ?
         WHERE id = ?
      `, [values[0], id])
      const trackings = await getTrackings("fril")
      res.status(200).json({
         message: "update received or finished mercari tracking success!",
         trackings,
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
      await mysql.end()
      const trackings = await getTrackings("fril")
      res.status(200).json({
         message: "update data success!",
         trackings,
      })
   } else if (req.method === "DELETE") {
      const id = parseInt(req.query.id, 10)
      await mysql.connect()
      await mysql.query("DELETE FROM trackings WHERE id = ?", [id])
      await mysql.end()
      const trackings = await getTrackings("fril")
      res.status(200).json({
         message: "delete row successful !",
         trackings,
      })
   }
}
export const config = {
   api: {
      bodyParser: {
         responseLimit: false,
      },
   },
}
export default handler
