/* eslint-disable consistent-return */
/* eslint-disable import/prefer-default-export */
import query from "../../mysql/connection"

async function getTrackingExport(startDate, endDate) {
   const sql = `
        SELECT
            t.date, t.channel, t.delivery_type, t.track_no, t.box_no, t.weight, t.price, t.voyage, t.remark_admin,
            u.username, u.name, u.phone
        FROM
            trackings t
        JOIN
            users u
        ON
            u.id = t.user_id
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