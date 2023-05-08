import { uploadImage } from "../../../dbs/cloudinary/connection"
import editTrackingSlipImage from "../../../dbs/query/tracking_slip_image/editTrackingSlipImage"

async function handlers(req, res) {
   const trackingId = parseInt(req.query.tracking_id, 10)
   if (req.method === "PUT") {
      console.log(`PUT::/api/tracking-image-slip/${trackingId}`)

      const base64Image = req.body.tracking_slip_image
      const channel = req.body.channel || "undefined"
      try {
         let imageUrl = base64Image
         if (imageUrl) {
            if (base64Image.length > 1000) {
               imageUrl = await uploadImage(base64Image, channel)
            }
         }
         await editTrackingSlipImage(trackingId, imageUrl)
         res.status(200).json({
            code: 200,
            message: "Updated!",
            tracking_slip_image: imageUrl,
         })
      } catch (err) {
         console.log(err)
         res.status(500).json({ code: 500, message: "Server Error!" })
      }
   }
}

export const config = {
   api: {
      bodyParser: {
         sizeLimit: "4mb",
      },
   },
}

export default handlers
