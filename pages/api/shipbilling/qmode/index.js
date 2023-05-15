import editQBilling from "../../../../dbs/query/billing/editQBilling"
import getListInvoiceUser from "../../../../dbs/query/list_invoice_user/getListInvoiceUser"
import editCod from "../../../../dbs/query/trackings/editCod"

async function handlers(req, res) {
   const { method } = req
   if (method === "GET") {
      const { voyage, user_id } = req.query
      console.log(
         `GET::/api/shipbilling/qmode?voyage=${voyage}&user_id=${user_id}`
      )
      const result = await getListInvoiceUser(parseInt(user_id, 10), voyage)
      res.status(200).json(result)
   } else if (method === "PUT") {
      console.log(`PUT::/api/shipbilling/qmode`)
      const { q, id } = req.body
      const result = await editQBilling(id, q)
      res.status(200).json(result)
   } else if (method === "PATCH") {
      const { trackingId, cod } = req.body
      const result = await editCod(trackingId, cod)
      res.status(200).json(result)
   }
   return null
}

export default handlers
