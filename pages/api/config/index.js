import query from "../../../dbs/mysql/connection"

async function updateRateYen(rateYen) {
   const updateQuery = `
    UPDATE preference
    SET rate_yen = ${rateYen}
    WHERE id = 1
  `
   const result = await query(updateQuery)
   return result
}

export async function getRateYen() {
   const selectQuery = `
      SELECT rate_yen
      FROM preference
      WHERE id = 1
    `
   const result = await query(selectQuery)
   if (result.length > 0) {
      return result[0].rate_yen
   }
   return null
}

async function handlers(req, res) {
   const { method } = req
   if (method === "GET") {
      try {
         const rateYen = await getRateYen()
         if (rateYen !== null) {
            res.status(200).json({ code: 200, message: "OK", rateYen })
         } else {
            res.status(404).json({
               code: 404,
               message: "Preference with ID 1 not found",
            })
         }
      } catch (error) {
         console.error(error)
         res.status(500).json({ code: 500, message: "Server error" })
      }
   } else if (method === "PUT") {
      const { rateYen } = req.body
      try {
         const updateResult = await updateRateYen(rateYen)
         if (updateResult.affectedRows > 0) {
            res.status(200).json({
               code: 200,
               message: "Rate yen updated successfully",
            })
         } else {
            res.status(404).json({
               code: 404,
               message: "Preference with ID 1 not found",
            })
         }
      } catch (error) {
         console.error(error)
         res.status(500).json({ code: 500, message: "Server error" })
      }
   }
}

export default handlers
