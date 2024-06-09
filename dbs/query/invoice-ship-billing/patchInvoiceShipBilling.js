import query from "../../mysql/connection"


async function patchInvoiceShipBilling(body) {
   try {
      const { shipBillingId, shipBillingStatus } = body

      let queryString = `
        UPDATE ship_billing SET ship_billing_status = ? WHERE id = ?
        `
      let data = [shipBillingStatus, shipBillingId]

      await query(queryString, data)

      return {
        message: "update shipBillingStatus successfully"
      }
   } catch (error) {
      console.error("Error executing query:", error.message)
      throw new Error(
         "An error occurred while fetching data from patchInvoiceShipBilling."
      )
   }
}

export default patchInvoiceShipBilling
