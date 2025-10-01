import mysql from "./db"

// Helper function to get optimized orders with admin usernames
export const getOptimizedOrders = async () => {
   const yahoo_orders = await mysql.query(`
      SELECT 
         yo.*,
         u.username,
         a1.username as admin_maxbid_username,
         a2.username as admin_addbid1_username,
         a3.username as admin_addbid2_username
      FROM \`yahoo-auction-order\` yo
      LEFT JOIN users u ON yo.user_id = u.id
      LEFT JOIN admins a1 ON yo.admin_maxbid_id = a1.id
      LEFT JOIN admins a2 ON yo.admin_addbid1_id = a2.id
      LEFT JOIN admins a3 ON yo.admin_addbid2_id = a3.id
      WHERE yo.status IS NULL
      ORDER BY 
         STR_TO_DATE(yo.created_at, '%d/%m/%Y %H:%i:%s') DESC,
         yo.id DESC
   `)

   return yahoo_orders.map((order, index) => ({
      ...order,
      key: `${index + 1}`,
   }))
}

// Database operation wrapper with automatic connection management
export const withDB = async (operation) => {
   try {
      await mysql.connect()
      const result = await operation()
      await mysql.end()
      return result
   } catch (error) {
      console.error("Database error:", error)
      await mysql.end()
      throw error
   }
}

// Standard API response helper
export const apiResponse = (res, status, message, data = null) => {
   const response = { message }
   if (data) Object.assign(response, data)
   return res.status(status).json(response)
}

// Method not allowed helper
export const methodNotAllowed = (res, method, allowed = []) => {
   res.setHeader("Allow", allowed)
   return res.status(405).end(`Method ${method} Not Allowed`)
}
