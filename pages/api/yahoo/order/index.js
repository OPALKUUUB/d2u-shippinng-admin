import mysql from "../../../../lib/db"
import genDate from "../../../../utils/genDate"

async function handler(req, res) {
   if (req.method === "GET") {
      await mysql.connect()
      // eslint-disable-next-line prefer-const
      let yahoo_orders = await mysql.query(
         "SELECT `yahoo-auction-order`.*, users.username FROM `yahoo-auction-order` LEFT JOIN users ON `yahoo-auction-order`.user_id = users.id WHERE `yahoo-auction-order`.status IS NULL"
      )
      const admins = await mysql.query("SELECT id, username FROM admins")
      for (let i = 0; i < yahoo_orders.length; i++) {
         yahoo_orders[i].key = `${i + 1}`
         yahoo_orders[i].admin_maxbid_username = null
         yahoo_orders[i].admin_addbid1_username = null
         yahoo_orders[i].admin_addbid2_username = null
         // yahoo_orders[i].image = `<img src="${yahoo_orders[i].image}" alt="" />`
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
      res.status(200).json({
         message: "get order from table success!",
         orders: yahoo_orders,
      })
   }
   if (req.method === "POST") {
      const {
         user_id,
         image,
         link,
         name,
         price,
         detail,
         maxbid,
         remark_admin,
      } = req.body
      const date = genDate()
      await mysql.connect()
      await mysql.query(
         "INSERT INTO `yahoo-auction-order` (user_id, image, link, name, price, detail, maxbid, remark_admin, created_at, updated_at) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
         [
            user_id,
            image,
            link,
            name,
            price,
            detail,
            maxbid,
            remark_admin,
            date,
            date,
         ]
      )
      await mysql.end()
      res.status(201).json({ message: "Add yahoo auction success!" })
   }
   if (req.method === "DELETE") {
      await mysql.query("DELETE  FROM `yahoo-auction-order` WHERE id = ?", [
         req.body.order_id,
      ])
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
      res.status(200).json({
         message: "delete data success!",
         orders: yahoo_orders,
      })
   }
}
export default handler
