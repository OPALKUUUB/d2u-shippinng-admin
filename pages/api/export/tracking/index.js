import { getTrackingExport } from "../../../../dbs/query/export"

async function handler(req, res) {
   const { method } = req
   if (method === "GET") {
      const { startDate, endDate } = req.query
      console.log(
         `----- GET::/api/export/tracking?startDate=${startDate}&endDate=${endDate}`
      )
      try {
         const result = await getTrackingExport(startDate, endDate)
         // console.log(result)
         res.status(200).json({
            message: "get tracking success!",
            data: result,
         })
      } catch (err) {
         console.log(err)
         res.status(400).json({
            message: "get tracking fail!",
         })
      }
   }
}

export default handler
