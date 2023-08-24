import query from "../../../mysql/connection"

async function getAllTracking(parameters) {
   const { user_id, channel, date } = parameters

   const queryString = `
    SELECT
      t.id,
      u.username,
      SUBSTRING_INDEX(t.date, ' ', 1) AS date,
      CEIL(((COALESCE(yap.bid, 0) + COALESCE(yap.delivery_fee, 0)) * COALESCE(yap.rate_yen, 0)) + COALESCE(yap.tranfer_fee, 0)) AS price,
      t.channel,
      t.created_at,
      u.id AS user_id
    FROM trackings t
    JOIN users u ON u.id = t.user_id
    LEFT JOIN \`yahoo-auction-payment\` yap ON yap.tracking_id = t.id
    LEFT JOIN mi_match_tracking mimt ON t.id = mimt.mim_match_id AND mimt.mim_channel = 'yahoo'
    WHERE  t.user_id = ?
      AND t.date LIKE ?
      AND t.channel = 'yahoo'
      AND mimt.mim_match_id IS NULL AND mimt.mim_channel IS NULL AND mimt.mim_status IS NULL
      AND STR_TO_DATE(SUBSTRING_INDEX(t.date, ' ', 1), '%d/%m/%Y') > STR_TO_DATE('30/6/2023', '%d/%m/%Y')
    UNION
    SELECT
      t.id,
      u.username,
      SUBSTRING_INDEX(t.date, ' ', 1) AS date,
      CASE
        WHEN t.airbilling = 1 THEN t.price_cargo
        ELSE t.price
      END AS price,
      CASE
        WHEN t.airbilling = 1 THEN 'cargo'
        ELSE t.channel
      END AS channel,
      t.created_at,
      u.id AS user_id
    FROM trackings t
    JOIN users u ON u.id = t.user_id
    LEFT JOIN mi_match_tracking mimt ON t.id = mimt.mim_match_id 
      AND mimt.mim_channel IN ('mercari', 'fril', '123')
    WHERE t.channel != 'shimizu'
      AND t.channel != 'yahoo'
      AND t.user_id = ?
      AND (t.channel LIKE ? OR t.airbilling = 1)
      AND t.date LIKE ?
      AND mimt.mim_match_id IS NULL AND mimt.mim_channel IS NULL AND mimt.mim_status IS NULL
      AND STR_TO_DATE(SUBSTRING_INDEX(t.date, ' ', 1), '%d/%m/%Y') > STR_TO_DATE('30/6/2023', '%d/%m/%Y')
    UNION
    SELECT
      sb.id,
      u.username,
      sb.voyage AS date,
      CASE
        WHEN sb.delivery_type IN ('ขนส่งเอกชน(ที่อยู่ ลค.)', 'ฝากไว้ก่อน') THEN COALESCE(sb.delivery_cost, 0)
        ELSE COALESCE(sb.voyage_price, 0)
      END AS price,
      CASE
        WHEN sb.delivery_type IN ('ขนส่งเอกชน(ที่อยู่ ลค.)') THEN 'ขนส่งเอกชน(ที่อยู่ ลค.)'
        ELSE 'ship_billing'
      END AS channel,
      sb.created_at,
      u.id AS user_id
    FROM ship_billing sb
    JOIN users u ON u.id = sb.user_id
    LEFT JOIN mi_match_tracking mimt ON sb.id = mimt.mim_match_id 
      AND (mimt.mim_channel IN ('ship_billing', 'ขนส่งเอกชน(ที่อยู่ ลค.)'))
    WHERE sb.user_id = ?
      AND sb.voyage LIKE ?
      AND mimt.mim_match_id IS NULL AND mimt.mim_channel IS NULL AND mimt.mim_status IS NULL
      AND STR_TO_DATE(sb.voyage, '%d/%m/%Y') > STR_TO_DATE('30/6/2023', '%d/%m/%Y')
    ORDER BY STR_TO_DATE(date, '%d/%m/%Y') DESC
   `

   const data = [
      user_id,
      `${date}%`,
      user_id,
      `%${channel}%`,
      `${date}%`,
      user_id,
      `${date}%`,
   ]

   try {
      const results = await query(queryString, data)
      if (
         channel === "ship_billing" ||
         channel === "ขนส่งเอกชน(ที่อยู่ ลค.)" ||
         channel === "cargo" ||
         channel === "yahoo" ||
         channel === "123" ||
         channel === "mercari" ||
         channel === "fril" 
      ) {
         return results.filter((fi) => fi.channel === channel)
      }
      return results
   } catch (error) {
      console.error("Error executing query:", error.message)
      throw new Error(
         "An error occurred while fetching data from getAllTracking(for-accountant/cut-cost)."
      )
   }
}

export default getAllTracking
