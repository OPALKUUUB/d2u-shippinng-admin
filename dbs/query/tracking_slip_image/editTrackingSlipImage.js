import query from "../../mysql/connection"

async function editTrackingSlipImage(trackingId, trackingSlipImage) {
   const body = [trackingSlipImage, trackingId]
   const result = await query(
      "UPDATE trackings SET tracking_slip_image = ? WHERE id = ?",
      body
   )
   return result
}

export default editTrackingSlipImage
