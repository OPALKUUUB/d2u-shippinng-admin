
import mysql from "../../../../../lib/db"
import genDate from "../../../../../utils/genDate"

async function handler(req, res) {
   if (req.method === "PUT") {
      // const session = await getSession({ req })
      // console.log(session)
      const {session} = req.body
      console.log(session)
      if (!session) {
         console.log("Not Found Session!")
         res.status(400).json({ message: "Not found session!" })
         return
      }
      const admin_username = session.user.name
      const { name, check } = req.body
      const order_id = req.query.id
      const date = genDate()
      await mysql.connect()
      const admins = await mysql.query(
         "SELECT id from admins where username = ?",
         [admin_username]
      )
      const admin_id = admins[0].id
      let sql_update_by_name
      if (name === "maxbid") {
         sql_update_by_name =
            "UPDATE `yahoo-auction-order` SET admin_maxbid_id = ?, updated_at = ? WHERE id = ?"
      } else if (name === "addbid1") {
         sql_update_by_name =
            "UPDATE `yahoo-auction-order` SET admin_addbid1_id = ?, updated_at = ? WHERE id = ?"
      } else if (name === "addbid2") {
         sql_update_by_name =
            "UPDATE `yahoo-auction-order` SET admin_addbid2_id = ?, updated_at = ? WHERE id = ?"
      }
      await mysql.query(sql_update_by_name, [
         !check ? admin_id : null,
         date,
         order_id,
      ])
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
         message: "Put addbid admin yahoo auction success!",
         orders: yahoo_orders,
      })
   }
}
export default handler
