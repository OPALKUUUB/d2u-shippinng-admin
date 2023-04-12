import { IncomingForm } from "formidable"
import cloudinary from "cloudinary"
import fs from "fs"

export const config = {
   api: { bodyParser: false },
}

cloudinary.config({
   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
   api_key: process.env.CLOUDINARY_API_KEY,
   api_secret: process.env.CLOUDINARY_API_SECRET,
})

async function handler(req, res) {
   if (req.method === "POST") {
      const form = new IncomingForm({
         uploadDir: "./public/uploads/",
         multiples: true,
         keepExtensions: true,
      })
      form.parse(req)
      res.json({message: "uploaded successfully"})
   }
}

export default handler
