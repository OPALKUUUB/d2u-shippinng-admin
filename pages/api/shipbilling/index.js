import mysql from "../../../lib/db"
import genDate from "../../../utils/genDate"

function CalBaseRate(point, user) {
   if (user?.username === "April") {
      return { rate: 160, min: false }
   }
   if (user?.username === "Giotto") {
      return { rate: 180, min: false }
   }
   if (point > 1500) {
      return { rate: 150, min: false }
   }
   if (point > 1000 && point <= 1500) {
      return { rate: 160, min: false }
   }
   if (point > 500 && point <= 1000) {
      return { rate: 180, min: false }
   }
   if (point > 100 && point <= 500) {
      return { rate: 200, min: false }
   }
   return { rate: 200, min: true }
}

function CalBaseRateByWeight(weight) {
   if (weight >= 100) {
      return 140
   }
   if (weight >= 50 && weight < 100) {
      return 160
   }
   if (weight >= 10 && weight < 50) {
      return 180
   }
   return 200
}
async function handler(req, res) {
   if (req.method === "GET") {
      const { voyage } = req.query
      await mysql.connect()
      const trackings_by_voyage = await mysql.query(
         "SELECT trackings.user_id, users.username, trackings.voyage FROM trackings JOIN users ON users.id = trackings.user_id WHERE trackings.voyage = ? GROUP BY trackings.user_id",
         [voyage]
      )
      const ship_billing = await mysql.query(
         `SELECT
         ship_billing.id as shipbilling_id,
         ship_billing.user_id,
         ship_billing.voyage,
         ship_billing.payment_type,
         ship_billing.invoice_notificate,
         ship_billing.check,
         ship_billing.remark,
         ship_billing.address
         FROM ship_billing 
         WHERE voyage = ?`,
         [voyage]
      )
      const date = genDate()
      const trackings = trackings_by_voyage.reduce((a, c) => {
         const billing = ship_billing.filter(
            (ft) => ft.voyage === c.voyage && ft.user_id === c.user_id
         )
         if (billing.length === 0) {
            return [
               ...a,
               {
                  shipbilling_id: null,
                  user_id: c.user_id,
                  username: c.username,
                  address: c.address,
                  created_at: date,
                  voyage,
                  payment_type: null,
                  invoice_notificate: null,
                  check: null,
                  remark: null,
               },
            ]
         }
         return [...a, { ...c, ...billing[0] }]
      }, [])
      await mysql.end()
      res.status(200).json({
         message: "get disneyland product success!",
         trackings,
      })
   } else if (req.method === "POST") {
      const { voyage } = req.body
      const user_id = parseInt(req.body.user_id, 10)
      await mysql.connect()
      const users = await mysql.query("SELECT * FROM users WHERE id = ?", [
         user_id,
      ])
      const trackings_user = await mysql.query(
         `
            SELECT *
            FROM trackings
            WHERE
            user_id = ?
            AND channel NOT LIKE 'yahoo'
         `,
         [user_id]
      )
      const trancking_user_yahoo = await mysql.query(
         `
            SELECT trackings.*, ${"`yahoo-auction-payment`"}.bid
            FROM trackings
            JOIN
            ${"`yahoo-auction-payment`"} 
            ON ${"`yahoo-auction-payment`"}.tracking_id = trackings.id
            where
            trackings.user_id  = ? 
            AND trackings.channel LIKE ?;
         `,
         [user_id,'yahoo']
      )
      const trackings = [...trackings_user, ...trancking_user_yahoo].filter(
         (ft) =>
            parseInt(ft.created_at.split(" ")[0].split("/")[2], 10) === 2023
      )
      const point_current = trackings.reduce((a, c) => {
         const price = c.price === null ? 0 : c.price
         const weight = c.weight === null ? 0 : c.weight
         if (c.channel === "shimizu") {
            return a + weight
         }
         if (c.channel === "mercari" || c.channel === "fril") {
            return a + Math.ceil(price / 1000) + weight >= 1 ? weight - 1 : 0
         }
         if (c.channel === "yahoo") {
            console.log("in")
            return a + Math.ceil(c.bid / 2000) + weight
         }
         return a + Math.ceil(price / 2000) + weight
      }, 0)
      // console.log(point_current)
      // eslint-disable-next-line prefer-destructuring
      const count_billing = await mysql.query(
         "SELECT COUNT(*) AS count FROM ship_billing WHERE voyage = ? and user_id = ?",
         [voyage, user_id]
      )
      let shipbilling_id = 0
      if (count_billing[0].count === 0) {
         const date = genDate()
         const result_insert_ship_billing = await mysql.query(
            "INSERT INTO ship_billing (voyage, user_id, created_at, updated_at) VALUES (?,?,?,?)",
            [voyage, user_id, date, date]
         )
         shipbilling_id = result_insert_ship_billing.insertId
      } else {
         const result = await mysql.query(
            "SELECT * FROM ship_billing WHERE voyage = ? and user_id = ?",
            [voyage, user_id]
         )
         // console.log(result)
         shipbilling_id = result[0].id
      }
      const billings = await mysql.query(
         "SELECT * FROM ship_billing WHERE id = ? ",
         [shipbilling_id]
      )
      // console.log(billings)
      await mysql.end()
      const user = { ...users[0], point_current }
      const baseRate1 = CalBaseRate(
         user?.point_last,
         user
      )
      const baseRate2 = CalBaseRate(
         user?.point_last,
         user
      )
      const baseRate =
         baseRate1.rate < baseRate2.rate ? baseRate1 : baseRate2
      res.status(200).json({
         message: "get data from user and voyage success",
         trackings,
         billing: billings[0],
         user,
         baseRate
      })
   } else if (req.method === "PATCH") {
      const id = parseInt(req.query.id, 10)
      await mysql.connect()
      await mysql.query("UPDATE ship_billing SET ? WHERE id = ?", [
         req.body,
         id,
      ])
      const billing = await mysql.query(
         "select id as shipbilling_id, ship_billing.* from ship_billing where id = ?",
         [id]
      )
      await mysql.end()
      res.status(200).json({
         message: "update shipbilling success!",
         billing: billing[0],
      })
   }
}

export default handler
