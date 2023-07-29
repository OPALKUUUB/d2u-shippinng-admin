/* eslint-disable indent */
/* eslint-disable no-use-before-define */
import getAllTracking from "../../../dbs/query/for-accountant/money-in/getAllTracking"

async function handlers(req, res) {
   const { method, query } = req

   switch (method) {
      case "GET":
         handleGetRequest(query, res)
         break
      default:
         res.status(405).json({ code: 405, message: "Method Not Allowed" })
   }
}

async function handleGetRequest(query, res) {
   const { date, user_id, channel } = query
   if (!user_id) {
      return res
         .status(400)
         .json({ code: 400, message: "Missing required query parameters" })
   }

   console.log(
      `GET::/api/for-accountant?date=${date}&user_id=${user_id}&channel=${channel}`
   )

   try {
      const moneyIns = await getAllTracking({ date, user_id, channel })
      return res.status(200).json({
         code: 200,
         moneyIns,
         message: "OK",
      })
   } catch (error) {
      console.error("Error fetching cut costs:", error.message)
      return res.status(500).json({ code: 500, message: "SERVER ERROR" })
   }
}

export default handlers
