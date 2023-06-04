import { getSession } from "next-auth/react"
import mysql from "../../../../../lib/db"
import genDate from "../../../../../utils/genDate"

async function handler(req, res) {
   if (req.method === "PUT") {
      const { remark } = req.body
      const order_id = req.query.id
      const date = genDate()
      await mysql.connect()
      await mysql.query(
         "UPDATE `yahoo-auction-order` SET remark_admin = ?, updated_at = ? WHERE id = ?",
         [remark, date, order_id]
      )
      // eslint-disable-next-line prefer-const
      let yahoo_orders = await mysql.query(
         "SELECT `yahoo-auction-order`.*, users.username FROM `yahoo-auction-order` LEFT JOIN users ON `yahoo-auction-order`.user_id = users.id WHERE `yahoo-auction-order`.status IS NULL"
      )
      const admins_all = await mysql.query("SELECT id, username FROM admins")

      for (let i = 0; i < yahoo_orders.length; i++) {
         yahoo_orders[i].admin_maxbid_username = null
         yahoo_orders[i].admin_addbid1_username = null
         yahoo_orders[i].admin_addbid2_username = null
         for (let j = 0; j < admins_all.length; j++) {
            if (yahoo_orders[i].admin_maxbid_id === admins_all[j].id) {
               yahoo_orders[i].admin_maxbid_username = admins_all[j].username
            }
            if (yahoo_orders[i].admin_addbid1_id === admins_all[j].id) {
               yahoo_orders[i].admin_addbid1_username = admins_all[j].username
            }
            if (yahoo_orders[i].admin_addbid2_id === admins_all[j].id) {
               yahoo_orders[i].admin_addbid2_username = admins_all[j].username
            }
         }
      }
      await mysql.end()
      res.status(200).json({
         message: "Put remark admin yahoo auction success!",
         orders: yahoo_orders,
      })
   }
}
export default handler
