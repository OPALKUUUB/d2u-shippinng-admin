import mysql from "../../../../lib/db"
import genDate from "../../../../utils/genDate"

async function handler(req, res) {
   if (req.method === "GET") {
      await mysql.connect()
      const yahoo_payments = await mysql.query(
         `SELECT 
            ${'`yahoo-auction-payment`'}.*,
            users.username, 
            ${'`yahoo-auction-order`'}.image, 
            ${'`yahoo-auction-order`'}.link
         FROM 
            ${'`yahoo-auction-payment`'} 
         JOIN 
            ${'`yahoo-auction-order`'} 
         ON 
            ${'`yahoo-auction-order`'}.payment_id = ${'`yahoo-auction-payment`'}.id 
         JOIN 
            users 
         ON 
            users.id = ${'`yahoo-auction-payment`'}.user_id
         WHERE
            ${'`yahoo-auction-payment`'}.payment_status != ?`,
         ["ชำระเงินเสร็จสิ้น"]
      )
      await mysql.end()
      res.status(200).json({
         message: "get order from table success!",
         payments: yahoo_payments,
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
         status,
      } = req.body
      const date = genDate()
      await mysql.connect()
      if (status === "แพ้") {
         await mysql.query(
            "UPDATE `yahoo-auction-order` SET status = ?, updated_at = ? WHERE id = ?",
            ["แพ้", date, order_id]
         )
         // eslint-disable-next-line prefer-const
         let yahoo_orders_of_lose = await mysql.query(
            "SELECT `yahoo-auction-order`.*, users.username FROM `yahoo-auction-order` LEFT JOIN users ON `yahoo-auction-order`.user_id = users.id WHERE `yahoo-auction-order`.status IS NULL"
         )
         await mysql.end()
         const admins = await mysql.query("SELECT id, username FROM admins")
         for (let i = 0; i < yahoo_orders_of_lose.length; i++) {
            yahoo_orders_of_lose[i].admin_maxbid_username = null
            yahoo_orders_of_lose[i].admin_addbid1_username = null
            yahoo_orders_of_lose[i].admin_addbid2_username = null
            for (let j = 0; j < admins.length; j++) {
               if (yahoo_orders_of_lose[i].admin_maxbid_id === admins[j].id) {
                  yahoo_orders_of_lose[i].admin_maxbid_username =
                     admins[j].username
               }
               if (yahoo_orders_of_lose[i].admin_addbid1_id === admins[j].id) {
                  yahoo_orders_of_lose[i].admin_addbid1_username =
                     admins[j].username
               }
               if (yahoo_orders_of_lose[i].admin_addbid2_id === admins[j].id) {
                  yahoo_orders_of_lose[i].admin_addbid2_username =
                     admins[j].username
               }
            }
         }

         res.status(200).json({
            message: "update status (แพ้) success!",
            orders: yahoo_orders_of_lose,
         })
         return
      }
      const preferences = await mysql.query("SELECT * FROM preference")
      if (preferences.lenght === 0) {
         res.status(400).json({
            message: "Cann't Get preference!",
         })
      }
      const preference = preferences[0]

      const { rate_yen } = preference
      const result_add = await mysql.query(
         "INSERT INTO `yahoo-auction-payment` (date, user_id, bid, tranfer_fee, delivery_fee, payment_status,rate_yen, created_at, updated_at) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)",
         [
            date.split(" ")[0],
            user_id,
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
      await mysql.query(
         "UPDATE `yahoo-auction-order` SET payment_id = ?, status = ?, updated_at = ? WHERE id = ?",
         [payment_id, "ชนะ", date, order_id]
      )

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
         yahoo_orders[i].key = i
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
   if (req.method === "PUT") {
      // console.log(req.body)
      const {user_id, date, delivery_fee, tranfer_fee, payment_status, rate_yen } =
         req.body
      const { id } = req.query
      const date_created = genDate()
      await mysql.connect()
      if (payment_status === "ชำระเงินเสร็จสิ้น") {
         await mysql
            .transaction()
            .query(
               "INSERT INTO `trackings` (user_id, channel, date, rate_yen, created_at, updated_at) values (?, ?, ?, ?, ?, ?)",
               [user_id, "yahoo", date, rate_yen, date_created, date_created]
            )
            .query((response) => [
               "UPDATE `yahoo-auction-payment` SET tracking_id = ?, date = ?, tranfer_fee = ?, delivery_fee = ?, payment_status = ? , rate_yen = ? where id = ?",
               [
                  response.insertId,
                  date,
                  tranfer_fee,
                  delivery_fee,
                  payment_status,
                  rate_yen,
                  id,
               ],
            ])
            .rollback((error) => console.log(error))
            .commit()
      } else {
         await mysql.query(
            "UPDATE `yahoo-auction-payment` SET date = ?, tranfer_fee = ?, delivery_fee = ?, payment_status = ? , rate_yen = ? where id = ?",
            [date, tranfer_fee, delivery_fee, payment_status, rate_yen, id]
         )
      }
      const yahoo_payments = await mysql.query(
         `SELECT 
            ${'`yahoo-auction-payment`'}.*,
            users.username, 
            ${'`yahoo-auction-order`'}.image, 
            ${'`yahoo-auction-order`'}.link 
         FROM 
            ${'`yahoo-auction-payment`'} 
         JOIN 
            ${'`yahoo-auction-order`'} 
         ON 
            ${'`yahoo-auction-order`'}.payment_id = ${'`yahoo-auction-payment`'}.id 
         JOIN 
            users 
         ON 
            users.id = ${'`yahoo-auction-payment`'}.user_id 
         WHERE
            ${'`yahoo-auction-payment`'}.payment_status != ?`,
         ["ชำระเงินเสร็จสิ้น"]
      )
      await mysql.end()
      res.status(200).json({
         message: "update payment success!",
         payments: yahoo_payments,
      })
   }
}

export default handler
