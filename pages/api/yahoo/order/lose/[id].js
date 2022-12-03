import mysql from "../../../../../lib/db"
import genDate from "../../../../../utils/genDate"

async function handler(req, res) {
   if (req.method === "PUT") {
      const order_id = req.query.id
      const date = genDate()
      await mysql.connect()
      await mysql.query(
         "UPDATE `yahoo-auction-order` SET status = ?, updated_at = ? WHERE id = ?",
         ["แพ้", date, order_id]
      )
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
      res.status(200).json({
         message: "update yahoo auction order to lose success!",
         orders: yahoo_orders,
      })
   }
}

export default handler
