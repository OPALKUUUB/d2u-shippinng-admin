import getTrackings from "../../../../dbs/query/trackings/getTrackings"
import mysql from "../../../../lib/db"
import genDate from "../../../../utils/genDate"

async function handler(req, res) {
   if (req.method === "GET") {
      const trackings = await getTrackings("123")
      res.status(200).json({
         message: "get 123 tracking success!",
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
         link,
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
         "INSERT INTO trackings (link, rate_yen, date, user_id, box_no, track_no, weight, price, voyage, remark_user, remark_admin, received, finished, channel, created_at, updated_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
         [
            link,
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
      await mysql.end()
      const trackings = await getTrackings("123")
      res.status(201).json({
         message: "insert data success!",
         trackings,
      })
   } else if (req.method === "PUT") {
      const id = parseInt(req.query.id, 10)
      const { received, finished, airbilling, accountCheck, mnyInCheck, mnyOutCheck, cancelRefundCheck } = req.body
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
      } else if (accountCheck !== undefined) {
         await mysql.query("update trackings set account_check = ? where id = ?", [
            accountCheck,
            id,
         ])
      } else if (mnyInCheck !== undefined) {
         await mysql.query("update trackings set mny_in_check = ? where id = ?", [
            mnyInCheck,
            id,
         ])
      } else if (mnyOutCheck !== undefined) {
         await mysql.query("update trackings set mny_out_check = ? where id = ?", [
            mnyOutCheck,
            id,
         ])
      } else if (cancelRefundCheck !== undefined) {
         await mysql.query("update trackings set cancel_refund_check = ? where id = ?", [
            cancelRefundCheck,
            id,
         ])
      }
      const trackings = await getTrackings("123")
      await mysql.end()
      res.status(200).json({
         message: "update received or finished mercari tracking success!",
         trackings,
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
         "UPDATE trackings SET link = ?, user_id = ?, date = ?, voyage = ?, track_no = ?, box_no = ?, weight = ?, price = ?, remark_user = ?, remark_admin = ?, received = ?, finished = ? WHERE id = ?",
         [
            link,
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
      await mysql.end()
      const trackings = await getTrackings("123")
      res.status(200).json({
         message: "update data success!",
         trackings,
      })
   } else if (req.method === "DELETE") {
      const id = parseInt(req.query.id, 10)
      await mysql.connect()
      // await mysql.query("DELETE FROM trackings WHERE id = ?", [id])
      await mysql.query("UPDATE trackings SET cont_status = 99 where id = ? ", [id])
      await mysql.end()
      const trackings = await getTrackings("123")
      res.status(200).json({
         message: "delete row successful !",
         trackings,
      })
   }
}

export default handler
