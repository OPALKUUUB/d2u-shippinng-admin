import mysql from "../../../../lib/db"
import sortDateTime from "../../../../utils/sortDateTime"

async function handler(req, res) {
   console.log("----------------------------------------------------------------")
   if (req.method === "GET") {
      await mysql.connect()
      const trackings = await mysql.query(
         `SELECT 
            trackings.*,
            ${"`yahoo-auction-payment`"}.bid,
            ${"`yahoo-auction-payment`"}.tranfer_fee,
            ${"`yahoo-auction-payment`"}.delivery_fee,
            ${"`yahoo-auction-payment`"}.rate_yen,
            ${"`yahoo-auction-order`"}.image,
            ${"`yahoo-auction-order`"}.link,
            ${"`yahoo-auction-payment`"}.rate_yen,
            users.username 
         FROM 
            trackings
         JOIN 
            ${"`yahoo-auction-payment`"}
         ON 
            ${"`yahoo-auction-payment`"}.tracking_id = trackings.id
         JOIN 
            ${"`yahoo-auction-order`"}
         ON 
            ${"`yahoo-auction-order`"}.payment_id = ${"`yahoo-auction-payment`"}.id
         JOIN 
            users 
         ON 
            users.id = ${"`yahoo-auction-order`"}.user_id 
         WHERE 
            channel = ?`,
         ["yahoo"]
      )
      await mysql.end()
      res.status(200).json({
         message: "in tracking yahoo",
         trackings: trackings
            .sort((a, b) => sortDateTime(a.created_at, b.created_at))
            .reduce((a, c, i) => [...a, { ...c, key: i }], []),
      })
   }
   if (req.method === "PUT") {
      const {
         date,
         track_no,
         box_no,
         weight,
         voyage,
         remark_admin,
         remark_user,
         received,
         finished,
         airbilling
      } = req.body
      const { id } = req.query
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
      } else {
         await mysql.query(
            "UPDATE trackings SET date = ?, track_no = ?, box_no = ?, weight = ?, voyage = ?, remark_admin = ?, remark_user = ? WHERE id = ?",
            [
               date,
               track_no,
               box_no,
               weight,
               voyage,
               remark_admin,
               remark_user,
               id,
            ]
         )
      }
      const trackings = await mysql.query(
         `SELECT 
         trackings.*,
         ${"`yahoo-auction-payment`"}.bid,
         ${"`yahoo-auction-payment`"}.tranfer_fee,
         ${"`yahoo-auction-payment`"}.delivery_fee,
         ${"`yahoo-auction-payment`"}.rate_yen,
         ${"`yahoo-auction-order`"}.image,
         ${"`yahoo-auction-order`"}.link,
         ${"`yahoo-auction-payment`"}.rate_yen,
         users.username 
      FROM 
         trackings 
      JOIN 
         ${"`yahoo-auction-payment`"}
      ON 
         ${"`yahoo-auction-payment`"}.tracking_id = trackings.id
      JOIN 
         ${"`yahoo-auction-order`"}
      ON 
         ${"`yahoo-auction-order`"}.payment_id = ${"`yahoo-auction-payment`"}.id
      JOIN 
         users 
      ON 
         users.id = ${"`yahoo-auction-order`"}.user_id 
      WHERE 
         channel = ?`,
         ["yahoo"]
      )
      res.status(200).json({
         message: "update yahoo tracking success!",
         trackings: trackings
            .sort((a, b) => sortDateTime(a.created_at, b.created_at))
            .reduce((a, c, i) => [...a, { ...c, key: i }], []),
      })
   } else if (req.method === "DELETE") {
      const id = parseInt(req.query.id, 10)
      await mysql.connect()
      await mysql.query("DELETE FROM trackings WHERE id = ?", [id])
      const trackings = await mysql.query(
         `SELECT 
            trackings.*,
            ${"`yahoo-auction-payment`"}.bid,
            ${"`yahoo-auction-payment`"}.tranfer_fee,
            ${"`yahoo-auction-payment`"}.delivery_fee,
            ${"`yahoo-auction-payment`"}.rate_yen,
            ${"`yahoo-auction-order`"}.image,
            ${"`yahoo-auction-order`"}.link,
            ${"`yahoo-auction-payment`"}.rate_yen,
            users.username 
         FROM 
            trackings
         JOIN 
            ${"`yahoo-auction-payment`"}
         ON 
            ${"`yahoo-auction-payment`"}.tracking_id = trackings.id
         JOIN 
            ${"`yahoo-auction-order`"}
         ON 
            ${"`yahoo-auction-order`"}.payment_id = ${"`yahoo-auction-payment`"}.id
         JOIN 
            users 
         ON 
            users.id = ${"`yahoo-auction-order`"}.user_id 
         WHERE 
            channel = ?`,
         ["yahoo"]
      )
      await mysql.end()
      console.log(trackings)
      res.status(200).json({
         message: "delete row successful !",
         trackings: trackings
            .sort((a, b) => sortDateTime(a.created_at, b.created_at))
            .reduce((a, c, i) => [...a, { ...c, key: i }], []),
      })
   }
}

export default handler
