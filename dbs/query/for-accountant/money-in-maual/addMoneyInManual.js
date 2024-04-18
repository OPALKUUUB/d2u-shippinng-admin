import query from "../../../mysql/connection"

async function addMoneyInManual(body) {
   try {
      const queryString = `
         INSERT INTO mny_in (content_data)
         VALUES (?)
      `
      
      const data = [JSON.stringify(body)]

      const result = await query(queryString, data)
      const { insertId } = result

      return insertId
   } catch (error) {
      console.error("Error executing query:", error.message)
      throw new Error("An error occurred while adding money in manual.")
   }
}

export default addMoneyInManual
