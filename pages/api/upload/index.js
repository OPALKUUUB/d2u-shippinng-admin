import cloudinary from "cloudinary"

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
         timeout: 240000
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
      const { images } = req.body
      if (images.length > 0) {
         const imageURL = await uploadBase64Image(images[0], "d2u-image")
         res.status(200).json({
            message: "done!",
            imageURL,
         })
      } else {
         res.status(400).json({
            message: "fail!",
         })
      }
   }
}

export const config = {
   api: {
      bodyParser: {
         sizeLimit: "10mb", // Set desired value here
      },
   },
}

export default handler
