import query from "../../mysql/connection"

async function editCod(trackingId, cod) {
   const body = [cod, trackingId]
   const result = await query(
      "UPDATE trackings SET cod = ? WHERE id = ?",
      body
   )
   return result
}

export default editCod
