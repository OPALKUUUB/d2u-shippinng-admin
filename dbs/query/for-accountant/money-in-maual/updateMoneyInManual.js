import query from "../../../mysql/connection"

async function updateMoneyInManual(body, mnyId) {
   try {
      const queryString = `
         UPDATE mny_in SET ? WHERE mny_id = ?
      `
      
      const data = [body, mnyId]

      return await query(queryString, data)
   } catch (error) {
      console.error("Error executing query:", error.message)
      throw new Error("An error occurred while adding money in manual.")
   }
}

export default updateMoneyInManual
