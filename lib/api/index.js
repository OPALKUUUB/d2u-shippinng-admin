import { message } from "antd"

export default {
   async postMessageLine(lineMessage, line_access_token) {
      try {
         const response = await fetch("/api/postMessageLine", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: lineMessage, line_access_token }),
         })
         message.success("Post message line successfully!")
      } catch (err) {
         console.log("error:",err)
         message.error("Post message line failed!")
      }
   },
}
