import mysql from "../../../lib/db"
import genDate from "../../../utils/genDate"

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
         `,
         [user_id]
      )
      const trackings = trackings_user.filter((ft) => ft.voyage === voyage)
      const point_current = trackings_user.reduce((a, c) => {
         const price = c.price === null ? 0 : c.price
         const weight = c.weight === null ? 0 : c.weight
         const rate_yen = c.rate_yen === null ? 0.29 : c.rate_yen
         const point = Math.ceil(price / rate_yen / 2000) + weight
         // console.log(price, weight, rate_yen)
         return a + point
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
      res.status(200).json({
         message: "get data from user and voyage success",
         trackings,
         billing: billings[0],
         user: { ...users[0], point_current },
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
