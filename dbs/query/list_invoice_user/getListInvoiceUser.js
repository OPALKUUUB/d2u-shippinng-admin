import genDate from "../../../utils/genDate"
import query from "../../mysql/connection"

async function getListInvoiceUser(user_id, voyage) {
   const users = await query("SELECT * FROM users WHERE id = ?", [user_id])
   // console.log(users)
   if (users.length === 0) {
      // eslint-disable-next-line no-throw-literal
      throw "Invalid user_id"
   }
   const trackings = await query(
      `
    SELECT * FROM trackings
    WHERE
    user_id = ? AND
    voyage LIKE ?
    `,
      [user_id, voyage]
   )
   //    const trackings_yahoo = await query(
   //       `
   //     SELECT
   //     trackings.*,
   //     \`yahoo-auction-payment\`.bid,
   //     FROM trackings
   //     JOIN \`yahoo-auction-payment\`
   //     ON \`yahoo-auction-payment\`.trackings.tracking_id = trackings.id
   //     WHERE
   //     trackings.user_id = ? AND
   //     trackings.channel LIKE 'yahoo' AND
   //     trackings.voyage LIKE ?
   //     `,
   //       [user_id, voyage]
   //    )
   //    const trackings = [...trackings_other, ...trackings_yahoo]
   const count_billing = await query(
      "SELECT COUNT(*) AS count FROM ship_billing WHERE voyage = ? and user_id = ?",
      [voyage, user_id]
   )
   let shipbilling_id = 0
   if (count_billing[0].count === 0) {
      const date = genDate()
      const result_insert_ship_billing = await query(
         "INSERT INTO ship_billing (voyage, user_id, created_at, updated_at) VALUES (?,?,?,?)",
         [voyage, user_id, date, date]
      )
      shipbilling_id = result_insert_ship_billing.insertId
   } else {
      const result = await query(
         "SELECT * FROM ship_billing WHERE voyage = ? and user_id = ?",
         [voyage, user_id]
      )
      shipbilling_id = result[0].id
   }
   const billings = await query("SELECT * FROM ship_billing WHERE id = ? ", [
      shipbilling_id,
   ])
   return {
      trackings,
      billing: billings[0],
      user: users[0],
   }
}

export default getListInvoiceUser
