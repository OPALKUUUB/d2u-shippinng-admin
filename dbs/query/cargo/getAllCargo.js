import query from "../../mysql/connection"

async function getAllCargo() {
   const trackings = await query(`
         SELECT
            t.id,
            t.date,
            t.track_no,
            t.box_no,
            t.voyage,
            t.price,
            t.rate_yen,
            t.remark_admin,
            t.remark_user,
            t.created_at,
            t.updated_at,
            t.channel,
            t.tracking_slip_image,
            t.paid_channel,
            t.airbilling,
            t.weight_true,
            t.weight_size,
            t.delivery_type,
            t.is_notified,
            t.is_invoiced,
            t.payment_type,
            t.address,
            u.id as user_id,
            u.username,
            GROUP_CONCAT(ti.image SEPARATOR '|') AS images
        FROM 
            trackings t
        JOIN 
            users u
        ON 
            u.id = t.user_id
        LEFT JOIN 
            \`tracking-image\` ti
        ON 
            ti.tracking_id = t.id
        GROUP BY
            t.id
        HAVING
            t.airbilling = 1
        ORDER BY 
            STR_TO_DATE(t.created_at, '%d/%m/%Y %H:%i:%s') DESC
   `)
   const trackingObjects = trackings.map((tracking, index) => {
      const images = tracking.images ? tracking.images.split("|") : []
      return {
         username: tracking.username,
         created_at: tracking.created_at,
         key: index,
         id: tracking.id,
         user_id: tracking.user_id,
         date: tracking.date,
         track_no: tracking.track_no,
         box_no: tracking.box_no,
         weight: tracking.weight,
         voyage: tracking.voyage,
         price: tracking.price,
         rate_yen: tracking.price,
         remark_admin: tracking.remark_admin,
         remark_user: tracking.remark_user,
         updated_at: tracking.updated_at,
         channel: tracking.channel,
         tracking_slip_image: tracking.tracking_slip_image,
         paid_channel: tracking.paid_channel,
         delivery_type: tracking.delivery_type,
         weight_true: tracking.weight_true,
         weight_size: tracking.weight_size,
         is_notified: tracking.is_notified,
         is_invoiced: tracking.is_invoiced,
         payment_type: tracking.payment_type,
         address: tracking.address,
         images,
      }
   })
   return trackingObjects
}

export default getAllCargo
