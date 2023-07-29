import query from "../../../mysql/connection"

async function getAllMoneyIn() {
   try {
      const queryString = `
      SELECT
        u.username,
        mi.mi_user_id,
        mi.mi_id AS id,
        mi.mi_datetime AS datetime,
        mi.mi_payment_type AS payment_type,
        mi.mi_total AS total,
        mi.mi_remark AS remark,
        mi.mi_image AS image,
        mi.mi_created_at AS created_at,
        mi.mi_updated_at AS updated_at
      FROM money_in mi
      JOIN users u ON u.id = mi.mi_user_id
      ORDER BY mi_created_at
    `

      const results = await query(queryString)
      return results
   } catch (error) {
      console.error("Error executing query:", error.message)
      throw new Error(
         "An error occurred while fetching data from getAllMoneyIn."
      )
   }
}

export default getAllMoneyIn
