import query from "../../../mysql/connection"

async function getAllTracking(parameters) {
   const { user_id, channel, date } = parameters

   const queryString = `
    SELECT
    u.username,
    substring_index(t.date,' ',1) as date,
    CASE
        WHEN t.airbilling = 1 THEN t.price_cargo
        else t.price
    END price,
    CASE
        WHEN t.airbilling = 1 THEN 'cargo'
        ELSE t.channel
    END channel,
    t.created_at
    FROM trackings t
    JOIN users u ON u.id = t.user_id
    WHERE 1 = 1
    AND channel != 'shimizu'
    AND t.user_id = ?
    AND channel like ?
    AND t.date like ?
    UNION
    SELECT 
    u.username,
    substring_index(sb.created_at,' ',1) AS date,
    CASE
        WHEN sb.delivery_type IN ('ขนส่งเอกชน(ที่อยู่ ลค.)', 'ฝากไว้ก่อน') THEN sb.cost_delivery
        ELSE sb.voyage_price
    END price,
    'ship_billing' AS channel,
    sb.created_at
    FROM ship_billing sb
    JOIN users u ON u.id = sb.user_id
    WHERE 1 = 1
    AND sb.delivery_type like ?
    AND sb.user_id = ?
    AND sb.created_at like ?
    ORDER BY STR_TO_DATE(date, '%d/%m/%Y') DESC
   `
   

   const data = [
      user_id,
      `%${channel}%`,
      `${date}%`,
      `%${channel}%`,
      user_id,
      `${date}%`,
   ]

   try {
      const results = await query(queryString, data)
      return results
   } catch (error) {
      console.error("Error executing query:", error.message)
      throw new Error("An error occurred while fetching data from getAllTracking(for-accountant/cut-cost).")
   }
}

export default getAllTracking
