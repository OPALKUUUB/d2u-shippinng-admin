import changeStatusMoneyInList from "../../../../dbs/query/for-accountant/money-in/changeStatusMoneyInList"
import getListMoneyIn from "../../../../dbs/query/for-accountant/money-in/getListMoneyIn"


async function handlers(req, res) {
   const miId = parseInt(req.query.mi_id, 10)
   if (req.method === "GET") {
      console.log(`GET::/api/for-accountant/money-in/${miId}`)
      try {
         const data = await getListMoneyIn(miId)
         res.status(200).json({
            code: 200,
            message: "Success!",
            data
         })
      } catch (err) {
         console.log(err)
         res.status(500).json({ code: 500, message: "Server Error!" })
      }
   }
   if (req.method === "PUT") {
      console.log(`PUT::/api/for-accountant/money-in/${miId}`)
      try {
         await changeStatusMoneyInList(miId)
         res.status(200).json({
            code: 200,
            message: "Updated!",
         })
      } catch (err) {
         console.log(err)
         res.status(500).json({ code: 500, message: "Server Error!" })
      }
   }
}

export default handlers
