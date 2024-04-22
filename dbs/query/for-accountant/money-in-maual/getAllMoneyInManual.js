import query from "../../../mysql/connection"

async function getAllMoneyInManual(queryData) {
   try {
      const {
         pageSize = 10,
         current = 0,
         startDate,
         endDate,
         username,
         moneyInStatus,
      } = queryData
      let queryString = `
         SELECT mi.*, u.username, u.id AS user_id, u.address
         FROM mny_in mi
         JOIN users u ON u.id = JSON_EXTRACT(mi.content_data, '$.userId')
         WHERE JSON_EXTRACT(mi.content_data, '$.userId') <> ''
      `
      let data = []
      if (startDate) {
         queryString += "\nAND mi.created_at >= ?\n"
         data = [...data, startDate]
      }
      if (endDate) {
         queryString += "\nAND mi.created_at <= ?\n"
         data = [...data, endDate]
      }
      if (username) {
         queryString += `\nAND JSON_UNQUOTE(JSON_EXTRACT(mi.content_data, '$.moneyInItems[0].user.username')) = ?\n`
         data = [...data, username]
      }
      if (moneyInStatus !== '') {
         queryString += "\nAND mi.money_in_status LIKE ?\n"
         data = [...data, moneyInStatus]
      }
      queryString += "\nORDER BY mi.created_at DESC\nLIMIT ? OFFSET ?\n"
      data = [
         ...data,
         parseInt(pageSize),
         parseInt(pageSize) * parseInt(current),
      ]
      const total = await getTotal(queryData)
      const results = await query(queryString, data)

      return {
         results,
         total,
         pageSize: parseInt(pageSize),
         current: parseInt(current),
      }
   } catch (error) {
      console.error("Error executing query:", error.message)
      throw new Error(
         "An error occurred while fetching data from getAllMoneyInManual."
      )
   }
}

async function getTotal(queryData) {
   const { startDate, endDate, username, moneyInStatus } = queryData
   let queryString = `
      SELECT COUNT(JSON_EXTRACT(mi.content_data, '$.userId')) AS count
      FROM mny_in mi
      JOIN users u ON u.id = JSON_EXTRACT(mi.content_data, '$.userId')
      WHERE JSON_EXTRACT(mi.content_data, '$.userId') <> ''
   `
   let data = []
   if (startDate) {
      queryString += "\nAND mi.created_at >= ?\n"
      data = [...data, startDate]
   }
   if (endDate) {
      queryString += "\nAND mi.created_at <= ?\n"
      data = [...data, endDate]
   }
   if (username) {
      queryString += `\nAND JSON_UNQUOTE(JSON_EXTRACT(mi.content_data, '$.moneyInItems[0].user.username')) = ?\n`
      data = [...data, username]
   }
   if (moneyInStatus) {
      queryString += "\nAND mi.money_in_status = ?\n"
      data = [...data, moneyInStatus]
   }
   const results = await query(queryString, data)
   return results[0].count
}

export default getAllMoneyInManual
