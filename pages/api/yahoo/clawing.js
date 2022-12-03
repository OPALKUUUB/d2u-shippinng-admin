import filterBody from "../../../lib/filterBody"

async function handler(req, res) {
   if (req.method === "POST") {
      const result = await fetch(req.body.link).then((response) =>
         response.text()
      )
      const data = filterBody(result)
      res.status(200).json(data)
   }
}
export default handler
