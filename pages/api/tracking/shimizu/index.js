import mysql from "../../../../lib/db"
import genDate from "../../../../utils/genDate"

async function getShimizu() {
   await mysql.connect()
   const trackings = await mysql.query(`
      SELECT
         trackings.id,
         trackings.date,
         trackings.track_no,
         trackings.box_no,
         trackings.weight,
         trackings.voyage,
         trackings.price,
         trackings.rate_yen,
         trackings.remark_admin,
         trackings.remark_user,
         trackings.created_at,
         trackings.updated_at,
         trackings.channel,
         users.username,
         GROUP_CONCAT(\`tracking-image\`.image) AS images
      FROM 
         trackings
      JOIN 
         users 
      ON 
         users.id = trackings.user_id
      LEFT JOIN 
         \`tracking-image\`
      ON 
         \`tracking-image\`.tracking_id = trackings.id
      GROUP BY
         trackings.id
      HAVING
         trackings.channel = 'shimizu'
      ORDER BY 
         DATE_FORMAT(trackings.created_at, '%d/%m/%y %h:%i:%s') DESC;
   `)
   const trackingObjects = trackings.map((tracking, index) => ({
      username: tracking.username,
      created_at: tracking.created_at,
      key: index,
      id: tracking.id,
      date: tracking.date,
      track_no: tracking.track_no,
      box_no: tracking.box_no,
      weight: tracking.weight,
      voyage: tracking.voyage,
      price: tracking.price,
      rate_yen: tracking.price,
      remark_admin: tracking.remark_admin,
      remark_user: tracking.remark_user,
      updated_at: tracking.updated_at,
      channel: tracking.channel,
      images: tracking.images ? tracking.images.split(",") : [],
   }))
   await mysql.end()
   return trackingObjects
}

async function handler(req, res) {
   if (req.method === "GET") {
      const trackings = await getShimizu()
      res.status(200).json({
         message: "get shimizu tracking success!",
         trackings
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
            date_created
         ]
      )
      const trackings = await getShimizu()
      await mysql.end()
      res.status(201).json({
         message: "insert data success!",
         trackings
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
      const trackings = await getShimizu()
      await mysql.end()
      res.status(200).json({
         message: "update data success!",
         trackings
      })
   } else if (req.method === "DELETE") {
      const id = parseInt(req.query.id, 10)
      await mysql.connect()
      await mysql.query("DELETE FROM trackings WHERE id = ?", [id])
      const trackings = await getShimizu()
      await mysql.end()
      res.status(200).json({
         message: "delete row successful !",
         trackings
      })
   }
}

export default handler
