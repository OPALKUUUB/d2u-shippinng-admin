import query from "../../mysql/connection"

async function editPaidChannel(trackingId, paidChannel) {
   const body = [paidChannel, trackingId]
   const result = await query(
      "UPDATE trackings SET paid_channel = ? WHERE id = ?",
      body
   )
   return result
}

export default editPaidChannel
