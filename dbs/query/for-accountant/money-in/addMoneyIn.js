import query from "../../../mysql/connection"

async function addMoneyIn(body) {
   try {
      const { rowSelectionDataList, moneyInForm, user_id } = body
      console.log(user_id)

      const queryString = `
         INSERT INTO money_in (mi_datetime, mi_payment_type, mi_total, mi_image, mi_remark, mi_user_id, mi_created_at, mi_updated_at)
         VALUES (?, ?, ?, ?, ?, ?, CONVERT_TZ(NOW(), 'SYSTEM', 'Asia/Bangkok'), CONVERT_TZ(NOW(), 'SYSTEM', 'Asia/Bangkok'))
      `
      
      const data = [
         moneyInForm.datetime || null,
         moneyInForm.payment_type || null,
         moneyInForm.total || null,
         moneyInForm.image || null,
         moneyInForm.remark || null,
         user_id
      ]

      const result = await query(queryString, data)
      const { insertId } = result
      const queryStringMatch = `
         INSERT INTO mi_match_tracking
         (mim_mi_id, mim_match_id, mim_status, mim_channel, mim_price) VALUES ?
      `
      const dataMatch = rowSelectionDataList.map((item) => [
         insertId,
         item.id,
         "P",
         item.channel,
         item.price
      ])
      await query(queryStringMatch, [dataMatch])
      return insertId // Return the ID of the newly inserted record
   } catch (error) {
      console.error("Error executing query:", error.message)
      throw new Error("An error occurred while adding money in.")
   }
}

export default addMoneyIn
