import mysql from "../../../lib/db"
import genDate from "../../../utils/genDate"
import sortDateTime from "../../../utils/sortDateTime"

async function handler(req, res) {
   if (req.method === "GET") {
      await mysql.connect()
      const trackings = await mysql.query(
         "SELECT trackings.*,users.username  FROM trackings JOIN users on users.id = trackings.user_id WHERE channel = ? OR channel = ? OR channel = ? OR channel = ? OR channel = ? AND trackings.cont_status != 99",
         ["shimizu", "mercari", "123", "fril", "yahoo"]
      )
      await mysql.end()
      res.status(200).json({
         message: "get all tracking success!",
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
      const trackings = await mysql.query(
         "SELECT trackings.*,users.username  FROM trackings JOIN users on users.id = trackings.user_id WHERE channel = ? OR channel = ? OR channel = ? OR channel = ? OR channel = ?",
         ["shimizu", "mercari", "123", "fril", "yahoo"]
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
      const { received, finished, airbilling, cod, isPicture, isRepack } = req.body
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
      } else if (cod !== undefined) {
         await mysql.query("update trackings set cod = ? where id = ?", [
            cod,
            id,
         ])
         res.status(200).json({ message: "success!" })
         return
      } else if (isPicture !== undefined) {
         await mysql.query("update trackings set isPicture = ? where id = ?", [
            isPicture,
            id,
         ])
         res.status(200).json({ message: "success!" })
         return
      } else if (isRepack !== undefined) {
         await mysql.query("update trackings set isRepack = ? where id = ?", [
            isRepack,
            id,
         ])
         res.status(200).json({ message: "success!" })
         return
      }
      const trackings = await mysql.query(
         "SELECT trackings.*,users.username  FROM trackings JOIN users on users.id = trackings.user_id WHERE channel = ? OR channel = ? OR channel = ? OR channel = ? OR channel = ?",
         ["shimizu", "mercari", "123", "fril", "yahoo"]
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
      const trackings = await mysql.query(
         "SELECT trackings.*,users.username  FROM trackings JOIN users on users.id = trackings.user_id WHERE channel = ? OR channel = ? OR channel = ? OR channel = ? OR channel = ?",
         ["shimizu", "mercari", "123", "fril", "yahoo"]
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
         "SELECT trackings.*,users.username  FROM trackings JOIN users on users.id = trackings.user_id WHERE channel = ? OR channel = ? OR channel = ? OR channel = ? OR channel = ?",
         ["shimizu", "mercari", "123", "fril", "yahoo"]
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