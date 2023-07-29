/* eslint-disable indent */
/* eslint-disable no-use-before-define */
import addMoneyIn from "../../../../dbs/query/for-accountant/money-in/addMoneyIn"
import getAllMoneyIn from "../../../../dbs/query/for-accountant/money-in/getAllMoneyIn"

async function handlers(req, res) {
   const { method, body } = req

   switch (method) {
      case "GET":
         console.log("GET::/api/for-accountant/money-in")
         handleGetRequest(res)
         break
      case "POST":
         console.log("POST::/api/for-accountant/money-in")
         handlePostRequest(body, res)
         break
      default:
         res.status(405).json({ code: 405, message: "Method Not Allowed" })
   }
}

async function handleGetRequest(res) {
   try {
      const moneyInData = await getAllMoneyIn()
      res.status(200).json({ code: 200, message: "Success", data: moneyInData })
   } catch (error) {
      console.error("Error fetching money in data:", error.message)
      res.status(500).json({
         code: 500,
         message: "An error occurred while fetching money in data",
      })
   }
}

async function handlePostRequest(body, res) {
   try {
      const moneyInId = await addMoneyIn(body)
      res.status(200).json({
         code: 200,
         message: "Money in added successfully",
         data: moneyInId,
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
