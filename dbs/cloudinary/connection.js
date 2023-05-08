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

async function uploadImage(base64Image, channel) {
   console.log(`Channel ${channel} Uploading...`)
   const timestamp = new Date().getTime()
   const randomString = generateRandomString(8)
   const filename = `${timestamp}-${randomString}-${channel}`
   try {
      const result = await cloudinary.uploader.upload(base64Image, {
         folder: "Assets/trackings",
         public_id: filename,
      })
      return result.secure_url
   } catch (error) {
      throw Error(error.message)
   }
}

async function removeImage(publicId) {
   try {
      const result = await cloudinary.uploader.destroy(publicId)
      return result.result === "ok"
   } catch (error) {
      throw Error(error.message)
   }
}

export { removeImage, uploadImage }
