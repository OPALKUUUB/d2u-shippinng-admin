import query from "../../../mysql/connection"

async function changeStatusMoneyInList(miId) {
   try {
      const queryString = `
      UPDATE money_in SET mi_status = 'F' WHERE mi_id = ?
    `

      const results = await query(queryString, [miId])
      return results
   } catch (error) {
      console.error("Error executing query:", error.message)
      throw new Error(
         "An error occurred while fetching data from changeStatusMoneyInList."
      )
   }
}

export default changeStatusMoneyInList
