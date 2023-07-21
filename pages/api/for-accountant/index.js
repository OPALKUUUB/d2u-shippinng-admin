/* eslint-disable consistent-return */
/* eslint-disable no-use-before-define */
/* eslint-disable indent */
import getAllTracking from "../../../dbs/query/for-accountant/money-in"

async function handlers(req, res) {
   const { method, query, body } = req

   switch (method) {
      case "GET":
         handleGetRequest(query, res)
         break
      case "POST":
         handlePostRequest(body, res)
         break
      case "PUT":
         handlePutRequest(body, res)
         break
      case "DELETE":
         handleDeleteRequest(body, res)
         break
      case "PATCH":
         handlePatchRequest(body, res)
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
      res.status(200).json({
         code: 200,
         moneyIns,
         message: "OK",
      })
   } catch (error) {
      console.error("Error fetching cut costs:", error.message)
      res.status(500).json({ code: 500, message: "SERVER ERROR" })
   }
}

// Implement similar functions for other HTTP methods as needed
async function handlePostRequest(body, res) {
   // Implementation for POST requests
}

async function handlePutRequest(body, res) {
   // Implementation for PUT requests
}

async function handleDeleteRequest(body, res) {
   // Implementation for DELETE requests
}

async function handlePatchRequest(body, res) {
   // Implementation for PATCH requests
}

export default handlers
