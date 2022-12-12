import mysql from "../../../../lib/db"

async function handler(req, res) {
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
      res.status(200).json({ message: "in tracking yahoo", trackings })
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
      } = req.body
      const { id } = req.query
      await mysql.connect()
      const result = await mysql
         .transaction()
         .query(
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
         .query(
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
         .rollback((error) => console.log(error))
         .commit()
      res.status(200).json({
         message: "update yahoo tracking success!",
         trackings: result[1],
      })
   }
}

export default handler
