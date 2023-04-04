import mysql from "../../../../lib/db"

async function handler(req, res) {
   if (req.method === "GET") {
      await mysql.connect()
      const voyages = await mysql.query(
         `SELECT voyage
         FROM trackings
         WHERE voyage IS NOT NULL AND voyage != ''
         GROUP BY voyage
         ORDER BY STR_TO_DATE(voyage, '%d/%m/%Y') DESC
         `
      )
      await mysql.end()
      res.status(200).json({
         message: "get disneyland product success!",
         voyages,
      })
   }
}

export default handler
