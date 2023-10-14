import query from "../../../mysql/connection"

async function getAllTracking(parameters) {
   const { user_id, channel, date } = parameters

   try {
      const qs1 = `SELECT * FROM mi_match_tracking`
      const rs_qs1 = await query(qs1, [])
      const rs_qs1_tracking = rs_qs1.filter(
         (fi) =>
            fi.mim_channel === 'mercari' ||
            fi.mim_channel === 'fril' ||
            fi.mim_channel === '123'
      )
      const rs_qs1_yahoo = rs_qs1.filter(
         (fi) => 
            fi.mim_channel === 'yahoo'
      )
      const rs_qs1_shipbilling = rs_qs1.filter(
         (fi) =>
            fi.mim_channel === "ship_billing" ||
            fi.mim_channel === "ขนส่งเอกชน(ที่อยู่ ลค.)"
      )
      const rs_qs1_tracking_id = rs_qs1_tracking.map(item => item.mim_match_id)
      const rs_qs1_yahoo_id = rs_qs1_yahoo.map(item => item.mim_match_id)
      const rs_qs1_shipbilling_id = rs_qs1_shipbilling.map(item => item.mim_match_id)

      let qs_tracking = `
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
         WHERE STR_TO_DATE(SUBSTRING_INDEX(t.date, ' ', 1), '%d/%m/%Y') > STR_TO_DATE('30/6/2023', '%d/%m/%Y') 
         AND t.channel != 'shimizu' AND t.channel != 'yahoo'
      `
      let data_qs_tracking = []
      if(rs_qs1_tracking_id.length) {
         qs_tracking += "    AND t.id NOT IN (?)"
         data_qs_tracking = [...data_qs_tracking, rs_qs1_tracking_id]
      }
      if (user_id !== "" && user_id !== null && user_id !== undefined) {
         qs_tracking += "    AND t.user_id = ?"
         data_qs_tracking = [...data_qs_tracking, user_id]
      }
      if (date !== "" && date !== null && date !== undefined) {
         qs_tracking += "    AND t.date = ?"
         data_qs_tracking = [...data_qs_tracking, date]
      }
      qs_tracking += "     ORDER BY t.channel DESC"
      const rs_qs_tracking = await query(qs_tracking, data_qs_tracking)
      // console.log("rs_qs_tracking: ", rs_qs_tracking);
      
      let qs_yahoo = `
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
         JOIN \`yahoo-auction-payment\` yap ON yap.tracking_id = t.id
         WHERE STR_TO_DATE(SUBSTRING_INDEX(t.date, ' ', 1), '%d/%m/%Y') > STR_TO_DATE('30/6/2023', '%d/%m/%Y')
      `
      let data_qs_yahoo = []
      if(rs_qs1_yahoo_id.length) {
         qs_yahoo += "    AND t.id NOT IN (?)"
         data_qs_yahoo = [...data_qs_yahoo, rs_qs1_yahoo_id]
      }
      if (user_id !== "" && user_id !== null && user_id !== undefined) {
         qs_yahoo += "    AND t.user_id = ?"
         data_qs_yahoo = [...data_qs_yahoo, user_id]
      }
      if (date !== "" && date !== null && date !== undefined) {
         qs_yahoo += "    AND t.date = ?"
         data_qs_yahoo = [...data_qs_yahoo, date]
      }
      const rs_qs_yahoo = await query(qs_yahoo, data_qs_yahoo)
      // console.log('rs_qs_yahoo: ', rs_qs_yahoo);

      let qs_shipbilling = `
      SELECT 
         sb.id,
         u.username,
         sb.voyage AS date,
         COALESCE(sb.voyage_price, 0) AS price,
         'ship_billing' AS channel,
         sb.created_at,
         u.id AS user_id 
      FROM ship_billing sb 
      JOIN users u ON u.id = sb.user_id
      WHERE STR_TO_DATE(sb.voyage, '%d/%m/%Y') > STR_TO_DATE('30/6/2023', '%d/%m/%Y')
      AND sb.delivery_type IS NOT NULL
      `
      let data_qs_shipbilling = []
      if(rs_qs1_shipbilling_id.length) {
         qs_shipbilling += "    AND sb.id NOT IN (?)"
         data_qs_shipbilling = [...data_qs_shipbilling, rs_qs1_shipbilling_id]
      }
      if (user_id !== "" && user_id !== null && user_id !== undefined) {
         qs_shipbilling += "    AND sb.user_id = ?"
         data_qs_shipbilling = [...data_qs_shipbilling, user_id]
      }
      if (date !== "" && date !== null && date !== undefined) {
         qs_shipbilling += "    AND sb.date = ?"
         data_qs_shipbilling = [...data_qs_shipbilling, date]
      }
      const rs_qs_shipbilling = await query(qs_shipbilling, data_qs_shipbilling)
      // console.log("rs_qs_shipbilling: ", rs_qs_shipbilling);

      let qs_delivery_in = `
      SELECT 
         sb.id,
         u.username,
         sb.voyage AS date,
         COALESCE(sb.voyage_price, 0) AS price,
         'ขนส่งเอกชน(ที่อยู่ ลค.)' AS channel,
         sb.created_at,
         u.id AS user_id 
      FROM ship_billing sb 
      JOIN users u ON u.id = sb.user_id
      WHERE STR_TO_DATE(sb.voyage, '%d/%m/%Y') > STR_TO_DATE('30/6/2023', '%d/%m/%Y')
      AND sb.delivery_type = 'ขนส่งเอกชน(ที่อยู่ ลค.)'
      `
      let data_qs_delivery_in = []
      if(rs_qs1_shipbilling_id.length) {
         qs_delivery_in += "    AND sb.id NOT IN (?)"
         data_qs_delivery_in = [...data_qs_delivery_in, rs_qs1_shipbilling_id]
      }
      if (user_id !== "" && user_id !== null && user_id !== undefined) {
         qs_delivery_in += "    AND sb.user_id = ?"
         data_qs_delivery_in = [...data_qs_delivery_in, user_id]
      }
      if (date !== "" && date !== null && date !== undefined) {
         qs_delivery_in += "    AND sb.date = ?"
         data_qs_delivery_in = [...data_qs_delivery_in, date]
      }
      const rs_qs_delivery_in = await query(qs_delivery_in, data_qs_delivery_in)

      return [
               ...rs_qs_tracking, 
               ...rs_qs_yahoo, 
               ...rs_qs_shipbilling, 
               ...rs_qs_delivery_in
            ]

   } catch (error) {
      console.error("Error executing query:", error.message)
      throw new Error(
         "An error occurred while fetching data from getAllTracking(for-accountant/cut-cost)."
      )
   }

   // const queryString = `
   //  SELECT
   //    t.id,
   //    u.username,
   //    SUBSTRING_INDEX(t.date, ' ', 1) AS date,
   //    CEIL(((COALESCE(yap.bid, 0) + COALESCE(yap.delivery_fee, 0)) * COALESCE(yap.rate_yen, 0)) + COALESCE(yap.tranfer_fee, 0)) AS price,
   //    t.channel,
   //    t.created_at,
   //    u.id AS user_id
   //  FROM trackings t
   //  JOIN users u ON u.id = t.user_id
   //  LEFT JOIN \`yahoo-auction-payment\` yap ON yap.tracking_id = t.id
   //  LEFT JOIN mi_match_tracking mimt ON t.id = mimt.mim_match_id AND mimt.mim_channel = 'yahoo'
   //  WHERE  t.user_id = ?
   //    AND t.date LIKE ?
   //    AND t.channel = 'yahoo'
   //    AND mimt.mim_match_id IS NULL AND mimt.mim_channel IS NULL AND mimt.mim_status IS NULL
   //    AND STR_TO_DATE(SUBSTRING_INDEX(t.date, ' ', 1), '%d/%m/%Y') > STR_TO_DATE('30/6/2023', '%d/%m/%Y')
   //  UNION
   //  SELECT
   //    t.id,
   //    u.username,
   //    SUBSTRING_INDEX(t.date, ' ', 1) AS date,
   //    CASE
   //      WHEN t.airbilling = 1 THEN t.price_cargo
   //      ELSE t.price
   //    END AS price,
   //    CASE
   //      WHEN t.airbilling = 1 THEN 'cargo'
   //      ELSE t.channel
   //    END AS channel,
   //    t.created_at,
   //    u.id AS user_id
   //  FROM trackings t
   //  JOIN users u ON u.id = t.user_id
   //  LEFT JOIN mi_match_tracking mimt ON t.id = mimt.mim_match_id 
   //    AND mimt.mim_channel IN ('mercari', 'fril', '123')
   //  WHERE t.channel != 'shimizu'
   //    AND t.channel != 'yahoo'
   //    AND t.user_id = ?
   //    AND (t.channel LIKE ? OR t.airbilling = 1)
   //    AND t.date LIKE ?
   //    AND mimt.mim_match_id IS NULL AND mimt.mim_channel IS NULL AND mimt.mim_status IS NULL
   //    AND STR_TO_DATE(SUBSTRING_INDEX(t.date, ' ', 1), '%d/%m/%Y') > STR_TO_DATE('30/6/2023', '%d/%m/%Y')
   //  UNION
   //  SELECT
   //    sb.id,
   //    u.username,
   //    sb.voyage AS date,
   //    COALESCE(sb.voyage_price, 0) AS price,
   //    'ship_billing' AS channel,
   //    sb.created_at,
   //    u.id AS user_id
   //  FROM ship_billing sb
   //  JOIN users u ON u.id = sb.user_id
   //  LEFT JOIN mi_match_tracking mimt ON sb.id = mimt.mim_match_id 
   //    AND (mimt.mim_channel IN ('ship_billing'))
   //  WHERE sb.user_id = ?
   //    AND sb.voyage LIKE ?
   //    AND mimt.mim_match_id IS NULL AND mimt.mim_channel IS NULL AND mimt.mim_status IS NULL
   //    AND STR_TO_DATE(sb.voyage, '%d/%m/%Y') > STR_TO_DATE('30/6/2023', '%d/%m/%Y')
   //  UNION
   //  SELECT
   //    sb.id,
   //    u.username,
   //    sb.voyage AS date,
   //    COALESCE(sb.delivery_cost, 0) AS price,
   //    'ขนส่งเอกชน(ที่อยู่ ลค.)' AS channel,
   //    sb.created_at,
   //    u.id AS user_id
   //  FROM ship_billing sb
   //  JOIN users u ON u.id = sb.user_id
   //  LEFT JOIN mi_match_tracking mimt ON sb.id = mimt.mim_match_id 
   //    AND (mimt.mim_channel IN ('ขนส่งเอกชน(ที่อยู่ ลค.)'))
   //  WHERE sb.user_id = ?
   //    AND sb.voyage LIKE ?
   //    AND mimt.mim_match_id IS NULL AND mimt.mim_channel IS NULL AND mimt.mim_status IS NULL
   //    AND STR_TO_DATE(sb.voyage, '%d/%m/%Y') > STR_TO_DATE('30/6/2023', '%d/%m/%Y')
   //  ORDER BY STR_TO_DATE(date, '%d/%m/%Y') DESC
   // `

   // const data = [
   //    user_id,
   //    `${date}%`,
   //    user_id,
   //    `%${channel}%`,
   //    `${date}%`,
   //    user_id,
   //    `${date}%`,
   //    user_id,
   //    `${date}%`,
   // ]

   // try {
   //    const results = await query(queryString, data)
   //    if (
   //       channel === "ship_billing" ||
   //       channel === "ขนส่งเอกชน(ที่อยู่ ลค.)" ||
   //       channel === "cargo" ||
   //       channel === "yahoo" ||
   //       channel === "123" ||
   //       channel === "mercari" ||
   //       channel === "fril"
   //    ) {
   //       return results.filter((fi) => fi.channel === channel)
   //    }
   //    return results
   // } catch (error) {
   //    console.error("Error executing query:", error.message)
   //    throw new Error(
   //       "An error occurred while fetching data from getAllTracking(for-accountant/cut-cost)."
   //    )
   // }
}

export default getAllTracking
