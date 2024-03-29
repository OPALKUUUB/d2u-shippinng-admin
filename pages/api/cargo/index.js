import editCargo from "../../../dbs/query/cargo/editCargo"
import getAllCargo from "../../../dbs/query/cargo/getAllCargo"

async function handlers(req, res) {
   const { method } = req
   if (method === "GET") {
      try {
         const cargo = await getAllCargo()
         res.status(200).json({ code: 200, message: "OK", cargo })
      } catch (error) {
         console.error(error)
         res.status(500).json({ code: 500, message: "Server error" })
      }
   } else if (method === "PUT") {
      const tracking = req.body
      const { id } = req.query
      console.log(tracking, id)
      try {
         const result = await editCargo(id, tracking)
         console.log(result)
         res.status(200).json({ code: 200, message: "OK", result })
      } catch (error) {
         console.error(error)
         res.status(500).json({ code: 500, message: "Server error" })
      }
   }
}

export default handlers
