import query from "../../mysql/connection"

async function editQBilling(billingId, q) {
   const body = [q, billingId]
   const result = await query(
      "UPDATE ship_billing SET q = ? WHERE id = ?",
      body
   )
   return result
}

export default editQBilling
