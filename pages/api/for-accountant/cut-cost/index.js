/* eslint-disable indent */
/* eslint-disable no-use-before-define */
import ckCbCutCost from "../../../../dbs/query/for-accountant/cut-cost/ckCbCutCost"
import getAllCutCost2 from "../../../../dbs/query/for-accountant/cut-cost/getAllCutCost2"

async function handlers(req, res) {
   const { method,body, query } = req

   switch (method) {
      case "GET":
         console.log("GET::/api/for-accountant/cut-cost")
         handleGetRequest(res)
         break
      case "PUT":
         console.log(
            `PUT::/api/for-accountant/cut-cost?tracking_id=${query.tracking_id}`
         )
         handlePostRequest(res,body, query)
         break
      default:
         res.status(405).json({ code: 405, message: "Method Not Allowed" })
   }
}

async function handleGetRequest(res) {
   try {
      const cutCostData = await getAllCutCost2()
      res.status(200).json({
         code: 200,
         message: "Success",
         data: cutCostData,
      })
   } catch (error) {
      console.error("Error fetching money in data:", error.message)
      res.status(500).json({
         code: 500,
         message: "An error occurred while fetching money in data",
      })
   }
}
async function handlePostRequest(res,body, query) {
   try {
      const result = await ckCbCutCost(query.tracking_id, body.cb_cutcost)
      res.status(200).json({
         code: 200,
         message: "Success",
         result,
      })
   } catch (error) {
      console.error("Error fetching money in data:", error.message)
      res.status(500).json({
         code: 500,
         message: "An error occurred while fetching money in data",
      })
   }
}

export default handlers
