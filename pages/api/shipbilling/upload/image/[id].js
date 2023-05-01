import cloudinary from "cloudinary"
import mysql from "../../../../../lib/db"

cloudinary.config({
   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
   api_key: process.env.CLOUDINARY_API_KEY,
   api_secret: process.env.CLOUDINARY_API_SECRET,
})
function generateRandomString(length) {
   let result = ""
   const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
   for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length))
   }
   return result
}
// eslint-disable-next-line consistent-return
async function uploadBase64Image(base64Image, channel) {
   console.log("Uploading...")
   const timestamp = new Date().getTime()
   const randomString = generateRandomString(8)
   const filename = `${timestamp}-${randomString}-${channel}`
   try {
      const result = await cloudinary.uploader.upload(base64Image, {
         folder: "Assets/trackings",
         public_id: filename,
      })
      console.log(result.secure_url)
      return result.secure_url // Return the secure URL of the uploaded image
   } catch (error) {
      console.error(error)
   } finally {
      console.log("Uploaded!")
   }
}

async function handler(req, res) {
   if (req.method === "POST") {
      console.log(`POST::id ${req.query.id}`)
      const id = parseInt(req.query.id, 10)
      const { images } = req.body
      const image =
         images.length > 0
            ? await uploadBase64Image(images[0], "shipbillling")
            : null
      await mysql.connect()
      await mysql.query(
         `
         UPDATE ship_billing 
         SET slip_image = ?
         WHERE id = ?
         `,
         [image, id]
      )
      await mysql.end()
      res.status(200).json({
         message: "done!",
         image,
      })
   }
}

export const config = {
   api: {
      bodyParser: {
         sizeLimit: "4mb", // Set desired value here
      },
   },
}

export default handler
