import mysql from "../../../../lib/db"
import genDate from "../../../../utils/genDate"

async function handler(req, res) {
   if (req.method === "GET") {
      await mysql.connect()
      // eslint-disable-next-line prefer-const
      let yahoo_payments = await mysql.query(
         "SELECT `yahoo-auction-payment`.*, users.username, `yahoo-auction-order`.image, `yahoo-auction-order`.link FROM `yahoo-auction-payment` LEFT JOIN `yahoo-auction-order` ON `yahoo-auction-payment`.order_id = `yahoo-auction-order`.id LEFT JOIN users ON users.id = `yahoo-auction-payment`.user_id"
      )
      const preferences = await mysql.query("SELECT * FROM preference")
      if (preferences.lenght === 0) {
         res.status(400).json({
            message: "Cann't Get preference!",
         })
      }
      await mysql.end()
      res.status(200).json({
         message: "get order from table success!",
         payments: yahoo_payments,
         rate_yen: preferences[0].rate_yen,
      })
   }
   if (req.method === "POST") {
      const {
         user_id,
         order_id,
         bid,
         tranfer_fee,
         delivery_fee,
         payment_status,
      } = req.body
      const date = genDate()
      await mysql.connect()
      await mysql.query(
         "UPDATE `yahoo-auction-order` SET status = ?, updated_at = ? WHERE id = ?",
         ["ชนะ", date, order_id]
      )
      const preferences = await mysql.query("SELECT * FROM preference")
      if (preferences.lenght === 0) {
         res.status(400).json({
            message: "Cann't Get preference!",
         })
      }
      const preference = preferences[0]

      const { rate_yen } = preference
      const result_add = await mysql.query(
         "INSERT INTO `yahoo-auction-payment` (date, user_id, order_id, bid, tranfer_fee, delivery_fee, payment_status,rate_yen, created_at, updated_at) VALUES(?,?, ?, ?, ?, ?, ?, ?, ?, ?)",
         [
            date,
            user_id,
            order_id,
            bid,
            tranfer_fee,
            delivery_fee,
            payment_status,
            rate_yen,
            date,
            date,
         ]
      )
      const payment_id = result_add.insertId
      const payments = await mysql.query(
         "SELECT * FROM `yahoo-auction-payment` WHERE id = ?",
         [payment_id]
      )
      if (payments.lenght === 0) {
         res.status(400).json({
            message: "Fail to add payment!",
         })
         return
      }
      // eslint-disable-next-line prefer-const
      let yahoo_orders = await mysql.query(
         "SELECT `yahoo-auction-order`.*, users.username FROM `yahoo-auction-order` LEFT JOIN users ON `yahoo-auction-order`.user_id = users.id WHERE `yahoo-auction-order`.status IS NULL"
      )
      const admins = await mysql.query("SELECT id, username FROM admins")
      for (let i = 0; i < yahoo_orders.length; i++) {
         yahoo_orders[i].admin_maxbid_username = null
         yahoo_orders[i].admin_addbid1_username = null
         yahoo_orders[i].admin_addbid2_username = null
         for (let j = 0; j < admins.length; j++) {
            if (yahoo_orders[i].admin_maxbid_id === admins[j].id) {
               yahoo_orders[i].admin_maxbid_username = admins[j].username
            }
            if (yahoo_orders[i].admin_addbid1_id === admins[j].id) {
               yahoo_orders[i].admin_addbid1_username = admins[j].username
            }
            if (yahoo_orders[i].admin_addbid2_id === admins[j].id) {
               yahoo_orders[i].admin_addbid2_username = admins[j].username
            }
         }
      }
      await mysql.end()
      res.status(201).json({
         message: "Add payment success!",
         orders: yahoo_orders,
         payment: payments[0],
      })
   }
}
export default handler
