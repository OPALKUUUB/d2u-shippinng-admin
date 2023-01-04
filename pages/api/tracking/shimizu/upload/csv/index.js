import mysql from "../../../../../../lib/db"

async function handler(req, res) {
   if (req.method === "POST") {
      await mysql.connect()
      const preference = await mysql.query("SELECT rate_yen FROM preference")
      const { rate_yen } = preference[0]
      const trackings = req.body.trackings.map((item) => ({
         ...item,
         rate_yen,
      }))
      const insert_columns = Object.keys(trackings[0])
      const insert_data = trackings.reduce(
         (a, i) => [...a, Object.values(i)],
         []
      )
      await mysql.query("INSERT INTO trackings (??) VALUES ?", [
         insert_columns,
         insert_data,
      ])
      await mysql.end()
      res.status(201).json({
         message: "Insert data success!",
      })
   }
}

export default handler
