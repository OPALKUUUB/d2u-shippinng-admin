import query from "../../../mysql/connection"

async function getAllCutCost2() {
   try {
      const queryString = `
      SELECT
         t.id,
         SUBSTRING_INDEX(t.date, ' ', 1) AS date,
         u.username,
         CASE
            WHEN t.channel = 'yahoo' THEN (
               SELECT CEIL(((COALESCE(yap.bid, 0) + COALESCE(yap.delivery_fee, 0)) * COALESCE(yap.rate_yen, 0)) + COALESCE(yap.tranfer_fee, 0)) AS price
               FROM \`yahoo-auction-payment\` yap
               WHERE yap.tracking_id = t.id
               LIMIT 1
            )
            ELSE t.price
         END AS price,
         t.channel,
         t.paid_channel,
         t.cb_cutcost,
         CASE
            WHEN t.channel = 'yahoo' THEN (
               SELECT yao.link FROM \`yahoo-auction-order\` yao
               LEFT JOIN \`yahoo-auction-payment\` yap
               ON yap.id = yao.payment_id AND yap.tracking_id = t.id
               LIMIT 1
            )
            ELSE t.link
         END AS link,
         t.created_at
      FROM trackings t
      JOIN users u ON u.id = t.user_id
      WHERE t.channel != 'shimizu'
      AND t.paid_channel != 'PAYPAY'
      AND t.cont_status != 99
      ORDER BY 
         STR_TO_DATE(t.created_at, '%d/%m/%Y %H:%i:%s') DESC;
    `

      const results = await query(queryString)
      return results
   } catch (error) {
      console.error("Error executing query:", error.message)
      throw new Error(
         "An error occurred while fetching data from getAllCutCost2."
      )
   }
}

export default getAllCutCost2
