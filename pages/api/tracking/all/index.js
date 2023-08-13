/* eslint-disable indent */
import getAllTrackings from "../../../../dbs/query/trackings/getAllTracking"

/* eslint-disable no-use-before-define */
async function handlers(req, res) {
   const { method, body } = req

   switch (method) {
      case "GET":
         console.log("GET::/api/tracking/all")
         handleGetRequest(res)
         break
      default:
         res.status(405).json({ code: 405, message: "Method Not Allowed" })
   }
}

async function handleGetRequest(res) {
   try {
      const trackingData = await getAllTrackings()
      res.status(200).json({ code: 200, message: "Success", data: trackingData })
   } catch (error) {
      console.error("Error fetching tracking data:", error.message)
      res.status(500).json({
         code: 500,
         message: "An error occurred while fetching tracking data",
      })
   }
}

export default handlers
