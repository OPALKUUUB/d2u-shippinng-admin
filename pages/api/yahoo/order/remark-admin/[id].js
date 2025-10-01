import { getSession } from "next-auth/react"
import mysql from "../../../../../lib/db"
import genDate from "../../../../../utils/genDate"
import {
   getOptimizedOrders,
   withDB,
   apiResponse,
   methodNotAllowed,
} from "../../../../../lib/yahooOrderService"

async function handler(req, res) {
   if (req.method !== "PUT") {
      return methodNotAllowed(res, req.method, ["PUT"])
   }

   try {
      const { remark } = req.body
      const order_id = req.query.id
      const date = genDate()

      const orders = await withDB(async () => {
         await mysql.query(
            "UPDATE `yahoo-auction-order` SET remark_admin = ?, updated_at = ? WHERE id = ?",
            [remark, date, order_id]
         )
         return getOptimizedOrders()
      })

      return apiResponse(res, 200, "Put remark admin yahoo auction success!", {
         orders,
      })
   } catch (error) {
      console.error("API error:", error)
      return apiResponse(res, 500, "Database error", { error: error.message })
   }
}

export default handler
