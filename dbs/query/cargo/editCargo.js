import query from "../../mysql/connection"

async function editCargo(id, tracking) {
   console.log("--------------------> editCargo")
   console.log(tracking)

   const result = await query(
      `
         UPDATE trackings
         SET date = ?
         , track_no = ?
         , box_no = ?
         , weight_true = ?
         , weight_size = ?
         , price_cargo = ?
         , delivery_type = ?
         , is_notified = ?
         , payment_type = ?
         , is_invoiced = ?
         , address = ?
         , round_closed = ?
         WHERE id = ?
   `,
      [
         tracking.date,
         tracking.track_no,
         tracking.box_no,
         tracking.weight_true,
         tracking.weight_size,
         tracking.price,
         tracking.delivery_type,
         tracking.is_notified === null ? 0 : tracking.is_notified,
         tracking.payment_type,
         tracking.is_invoiced === null ? 0 : tracking.is_invoiced,
         tracking.address,
         tracking.round_closed,
         id,
      ]
   )
   return result
   // const trackingById = await query(`select delivery_type from trackings where id = ?`, [id])
   // console.log(trackingById)
   // console.log(result)
}
export default editCargo
