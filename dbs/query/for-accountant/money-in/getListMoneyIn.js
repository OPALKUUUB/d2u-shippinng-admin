import query from "../../../mysql/connection"

async function getListMoneyIn(mi_id) {
   try {
      const queryString = `
      SELECT
        u.username,
        mi.mi_datetime,
        mi.mi_payment_type,
        mi.mi_total,
        mi.mi_remark
      FROM money_in mi
      JOIN users u ON u.id = mi.mi_user_id
      WHERE mi.mi_id = ?
      ORDER BY mi.mi_created_at
    `
      const queryString2 = `
        SELECT
            *
        FROM mi_match_tracking mim
        WHERE mim.mim_mi_id = ?
    `

      const moneyInData = await query(queryString, [mi_id])
      const miMatchTracking = await query(queryString2, [mi_id])
      return {
         moneyInData,
         miMatchTracking,
      }
   } catch (error) {
      console.error("Error executing query:", error.message)
      throw new Error(
         "An error occurred while fetching data from getListMoneyIn."
      )
   }
}

export default getListMoneyIn
