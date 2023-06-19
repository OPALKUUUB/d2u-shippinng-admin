/* eslint-disable consistent-return */
/* eslint-disable import/prefer-default-export */
import query from "../../mysql/connection"

async function getTrackingExport(startDate, endDate) {
   const sql = `
        SELECT
            t.date, t.channel, t.delivery_type, t.track_no, t.box_no, t.weight, t.voyage, t.remark_admin,
            CASE
                WHEN t.channel = 'yahoo' THEN FORMAT(CEIL(yap.bid), 0)
                WHEN t.price IS NULL THEN 0
                ELSE FORMAT(t.price, 0)
            END AS price,
            u.username, u.name, u.phone
        FROM
            trackings t
        JOIN
            users u ON u.id = t.user_id
        LEFT JOIN
            \`yahoo-auction-payment\` yap ON t.id = yap.tracking_id
        WHERE
            STR_TO_DATE(t.date, '%d/%m/%Y') BETWEEN STR_TO_DATE(?, '%Y-%m-%d') AND STR_TO_DATE(?, '%Y-%m-%d')
        ORDER BY 
            STR_TO_DATE(t.created_at, '%d/%m/%Y %H:%i:%s') DESC
        -- LIMIT 10
    `
   try {
      const result = await query(sql, [startDate, endDate])
      return result
   } catch (err) {
      console.log(err)
   }
}

export { getTrackingExport }
