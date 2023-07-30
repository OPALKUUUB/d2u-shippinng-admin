import query from "../../../mysql/connection"

async function ckCbCutCost(tracking_id, checked) {
   console.log(checked)
   try {
      const queryString = `
      UPDATE trackings
      SET cb_cutcost = ?
      WHERE id = ?
    `

      const result = await query(queryString, [checked, tracking_id])
      console.log(result)
      return result
   } catch (error) {
      console.error("Error executing query:", error.message)
      throw new Error("An error occurred while fetching data from ckCbCutCost.")
   }
}

export default ckCbCutCost
