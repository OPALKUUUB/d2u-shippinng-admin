import updateMoneyInManual from "../../../../dbs/query/for-accountant/money-in-maual/updateMoneyInManual"



async function handlers(req, res) {
   const mnyId = parseInt(req.query.mnyId, 10)
   const { method, body } = req
   if (method === "PUT") {
    handleUpdateRequest(body, mnyId, res)
   }
}

async function handleUpdateRequest(body, mnyId, res) {
    try {
       const result = await updateMoneyInManual(body, mnyId)
       res.status(200).json({
          code: 200,
          message: "Money in added successfully",
          data: result,
       })
    } catch (error) {
       console.error("Error adding money in:", error.message)
       res.status(500).json({
          code: 500,
          message: "An error occurred while adding money in",
       })
    }
 }

export default handlers
