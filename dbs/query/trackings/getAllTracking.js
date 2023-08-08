import query from "../../mysql/connection"

async function getAllTrackings() {
   try {
      const trackings = await query(`
      SELECT
        t.id,
        u.username,
        SUBSTRING_INDEX(t.date, ' ', 1) AS date,
        t.channel,
        CASE
            WHEN t.channel = 'yahoo' THEN (
                SELECT yao.link
                FROM \`yahoo-auction-order\` yao
                JOIN \`yahoo-auction-payment\` yap ON yao.id = yao.payment_id
                WHERE t.id = yap.tracking_id
            )
            ELSE t.link
        END AS link,
        CASE
            WHEN t.channel = 'yahoo' THEN (
                SELECT 
                CEIL(((COALESCE(yap.bid, 0) + COALESCE(yap.delivery_fee, 0)) * COALESCE(yap.rate_yen, 0)) + COALESCE(yap.tranfer_fee, 0)) AS price
                FROM \`yahoo-auction-order\` yao
                JOIN \`yahoo-auction-payment\` yap ON yao.id = yao.payment_id
                WHERE t.id = yap.tracking_id
            )
            ELSE t.price
        END AS price,
        t.weight,
        t.airbilling,
        t.box_no,
        t.track_no,
        t.channel,
        t.paid_channel,
        t.voyage,
        t.remark_admin
        FROM trackings t
        JOIN users u on u.id = t.user_id
        ORDER BY STR_TO_DATE(date, '%d/%m/%Y') DESC;ND t.channel = 'yahoo'
        ORDER BY STR_TO_DATE(t.date, '%d/%m/%Y') DESC;
    `)

      return trackings
   } catch (error) {
      // Properly handle errors here
      console.error("Error while fetching trackings:", error)
      throw error
   }
}

export default getAllTrackings
