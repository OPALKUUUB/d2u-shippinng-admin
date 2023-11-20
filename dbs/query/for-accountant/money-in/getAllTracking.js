import query from "../../../mysql/connection"

const CHANNEL_TYPE = {
   MERCARI: "mercari",
   FRIL: "fril",
   WEB123: "123",
   YAHOO: "yahoo",
   SHIPBILLING: "ship_billing",
   PRIVATE_TRANS: "ขนส่งเอกชน(ที่อยู่ ลค.)",
   CARGO: "cargo"
}
async function getAllTracking(parameters) {
   const { user_id, channel, date } = parameters
   LogFilter(user_id, channel, date)
   try {
      const qs1 = `SELECT * FROM mi_match_tracking`
      const rs_qs1 = await query(qs1, [])
      const rs_qs1_tracking = rs_qs1.filter(
         (fi) =>
            fi.mim_channel === 'mercari' ||
            fi.mim_channel === 'fril' ||
            fi.mim_channel === '123' ||
            fi.mim_channel === 'cargo'
      )
      const rs_qs1_yahoo = rs_qs1.filter(
         (fi) =>
            fi.mim_channel === 'yahoo'
      )
      const rs_qs1_shipbilling = rs_qs1.filter(
         (fi) =>
            fi.mim_channel === "ship_billing"
      )
      const rs_qs1_private_trans = rs_qs1.filter(
         (fi) =>
            fi.mim_channel === "ขนส่งเอกชน(ที่อยู่ ลค.)"
      )
      const rs_qs1_tracking_id = rs_qs1_tracking.map(item => item.mim_match_id)
      const rs_qs1_yahoo_id = rs_qs1_yahoo.map(item => item.mim_match_id)
      const rs_qs1_shipbilling_id = rs_qs1_shipbilling.map(item => item.mim_match_id)
      const rs_qs1_private_trans_id = rs_qs1_private_trans.map(item => item.mim_match_id)

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
         AND t.cont_status != 99
         AND t.channel != 'shimizu' AND t.channel != 'yahoo'
      `
      let data_qs_tracking = []
      if (rs_qs1_tracking_id.length) {
         qs_tracking += "    AND t.id NOT IN (?)"
         data_qs_tracking = [...data_qs_tracking, rs_qs1_tracking_id]
      }
      if (user_id !== "" && user_id !== null && user_id !== undefined) {
         qs_tracking += "    AND t.user_id = ?"
         data_qs_tracking = [...data_qs_tracking, user_id]
      }
      if (channel !== "" && channel !== null && channel !== undefined) {
         qs_tracking += "    AND t.channel = ?"
         data_qs_tracking = [...data_qs_tracking, channel]
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
         AND t.cont_status != 99
      `
      let data_qs_yahoo = []
      if (rs_qs1_yahoo_id.length) {
         qs_yahoo += "    AND t.id NOT IN (?)"
         data_qs_yahoo = [...data_qs_yahoo, rs_qs1_yahoo_id]
      }
      if (user_id !== "" && user_id !== null && user_id !== undefined) {
         qs_yahoo += "    AND t.user_id = ?"
         data_qs_yahoo = [...data_qs_yahoo, user_id]
      }
      if (channel !== "" && channel !== null && channel !== undefined) {
         qs_yahoo += "    AND t.channel = ?"
         data_qs_yahoo = [...data_qs_yahoo, channel]
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
      if (rs_qs1_shipbilling_id.length) {
         qs_shipbilling += "    AND sb.id NOT IN (?)"
         data_qs_shipbilling = [...data_qs_shipbilling, rs_qs1_shipbilling_id]
      }
      if (user_id !== "" && user_id !== null && user_id !== undefined) {
         qs_shipbilling += "    AND sb.user_id = ?"
         data_qs_shipbilling = [...data_qs_shipbilling, user_id]
      }
      if (channel !== "" && channel !== null && channel !== undefined) {
         qs_shipbilling += "    AND sb.delivery_type = ?"
         data_qs_shipbilling = [...data_qs_shipbilling, channel]
      }
      if (date !== "" && date !== null && date !== undefined) {
         qs_shipbilling += "    AND sb.voyage = ?"
         data_qs_shipbilling = [...data_qs_shipbilling, date]
      }
      const rs_qs_shipbilling = await query(qs_shipbilling, data_qs_shipbilling)
      // console.log("rs_qs_shipbilling: ", rs_qs_shipbilling);

      let qs_delivery_in = `
      SELECT 
         sb.id,
         u.username,
         sb.voyage AS date,
         COALESCE(sb.delivery_cost, 0) AS price,
         'ขนส่งเอกชน(ที่อยู่ ลค.)' AS channel,
         sb.created_at,
         u.id AS user_id 
      FROM ship_billing sb 
      JOIN users u ON u.id = sb.user_id
      WHERE STR_TO_DATE(sb.voyage, '%d/%m/%Y') > STR_TO_DATE('30/6/2023', '%d/%m/%Y')
      AND sb.delivery_type = 'ขนส่งเอกชน(ที่อยู่ ลค.)'
      `
      let data_qs_delivery_in = []
      if (rs_qs1_shipbilling_id.length) {
         qs_delivery_in += "    AND sb.id NOT IN (?)"
         data_qs_delivery_in = [...data_qs_delivery_in, rs_qs1_private_trans_id]
      }
      if (user_id !== "" && user_id !== null && user_id !== undefined) {
         qs_delivery_in += "    AND sb.user_id = ?"
         data_qs_delivery_in = [...data_qs_delivery_in, user_id]
      }
      if (channel !== "" && channel !== null && channel !== undefined) {
         qs_delivery_in += "    AND sb.delivery_type = ?"
         data_qs_delivery_in = [...data_qs_delivery_in, channel]
      }
      if (date !== "" && date !== null && date !== undefined) {
         qs_delivery_in += "    AND sb.voyage = ?"
         data_qs_delivery_in = [...data_qs_delivery_in, date]
      }
      const rs_qs_delivery_in = await query(qs_delivery_in, data_qs_delivery_in)

      const result = [
         ...rs_qs_tracking,
         ...rs_qs_yahoo,
         ...rs_qs_shipbilling,
         ...rs_qs_delivery_in
      ]
         .sort(function (a, b) {
            let aa = a.date.split('/').reverse().join(),
               bb = b.date.split('/').reverse().join();
            return aa < bb ? -1 : (aa > bb ? 1 : 0);
         });


      return result

   } catch (error) {
      console.error("Error executing query:", error.message)
      throw new Error(
         "An error occurred while fetching data from getAllTracking(for-accountant/cut-cost)."
      )
   }
}

function LogFilter(user_id, channel, date) {
   console.log("Filter By: ");
   console.log("----------------------------------------");
   console.log("|   user_id   |   channel   |   date   |");
   console.log("----------------------------------------");
   console.log(`|   ${user_id}   |   ${channel}   |   ${date}   |`);
   console.log("----------------------------------------");
}

export default getAllTracking
