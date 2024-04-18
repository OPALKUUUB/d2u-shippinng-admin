import query from "../../../mysql/connection"

async function getAllMoneyInManual(queryData) {
   try {
      const { pageSize = 10, current = 0 } = queryData
      let queryString = `
         SELECT mi.*, u.username, u.id AS user_id, u.address
         FROM mny_in mi
         JOIN users u ON u.id = JSON_EXTRACT(mi.content_data, '$.userId')
         WHERE JSON_EXTRACT(mi.content_data, '$.userId') <> ''
         ORDER BY mi.created_at DESC
         LIMIT ? OFFSET ?
      `

      const total = await getTotal()
      const results = await query(queryString, [parseInt(pageSize), parseInt(pageSize) * parseInt(current)])

      return {
         results,
         total,
         pageSize: parseInt(pageSize),
         current: parseInt(current),
      }
   } catch (error) {
      console.error("Error executing query:", error.message)
      throw new Error("An error occurred while fetching data from getAllMoneyInManual.")
   }
}

async function getTotal() {
   const sql = `
      SELECT COUNT(JSON_EXTRACT(mi.content_data, '$.userId')) AS count
      FROM mny_in mi
      WHERE JSON_EXTRACT(mi.content_data, '$.userId') <> ''
   `

   const results = await query(sql)
   return results[0].count
}

export default getAllMoneyInManual
