import cloudinary from "cloudinary"

cloudinary.config({
   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
   api_key: process.env.CLOUDINARY_API_KEY,
   api_secret: process.env.CLOUDINARY_API_SECRET,
})

async function handler(req, res) {
   console.log(req.method)
   if(req.method === "POST") {
      console.log(req.body)
      // write query to save to db
      res.status(200).json({
         message: "test api successful!!"
      }) 
      return null
   }
   return null
}

export const config = {
   api: {
      bodyParser: {
         sizeLimit: '4mb' // Set desired value here
      }
   }
}

export default handler
