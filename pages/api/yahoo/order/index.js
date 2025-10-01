import mysql from "../../../../lib/db"
import genDate from "../../../../utils/genDate"
import {
   getOptimizedOrders,
   withDB,
   apiResponse,
   methodNotAllowed,
} from "../../../../lib/yahooOrderService"

async function handler(req, res) {
   const { method } = req

   try {
      if (method === "GET") {
         const orders = await withDB(getOptimizedOrders)
         return apiResponse(res, 200, "get order from table success!", {
            orders,
         })
      }

      if (method === "POST") {
         const {
            user_id,
            image,
            link,
            name,
            price,
            detail,
            maxbid,
            remark_user,
            remark_admin,
         } = req.body
         const date = genDate()

         await withDB(async () => {
            await mysql.query(
               "INSERT INTO `yahoo-auction-order` (user_id, image, link, name, price, detail, maxbid, remark_user, remark_admin, created_at, updated_at) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
               [
                  user_id,
                  image,
                  link,
                  name,
                  price,
                  detail,
                  maxbid,
                  remark_user,
                  remark_admin,
                  date,
                  date,
               ]
            )
         })

         return apiResponse(res, 201, "Add yahoo auction success!")
      }

      if (method === "DELETE") {
         const orders = await withDB(async () => {
            await mysql.query(
               "DELETE FROM `yahoo-auction-order` WHERE id = ?",
               [req.body.order_id]
            )
            return getOptimizedOrders()
         })

         return apiResponse(res, 200, "delete data success!", { orders })
      }

      return methodNotAllowed(res, method, ["GET", "POST", "DELETE"])
   } catch (error) {
      console.error("API error:", error)
      return apiResponse(res, 500, "Database error", { error: error.message })
   }
}

export default handler
