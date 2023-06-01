import query from "../../mysql/connection"

async function getAllCargo() {
   const trackings = await query(`
         SELECT
            trackings.id,
            trackings.date,
            trackings.track_no,
            trackings.box_no,
            trackings.voyage,
            trackings.price,
            trackings.rate_yen,
            trackings.remark_admin,
            trackings.remark_user,
            trackings.created_at,
            trackings.updated_at,
            trackings.channel,
            trackings.tracking_slip_image,
            trackings.paid_channel,
            trackings.airbilling,
            trackings.weight_true,
            trackings.weight_size,
            trackings.delivery_type,
            trackings.is_notified,
            trackings.is_invoiced,
            users.id as user_id,
            users.username,
            GROUP_CONCAT(\`tracking-image\`.image SEPARATOR '|') AS images
        FROM 
            trackings
        JOIN 
            users 
        ON 
            users.id = trackings.user_id
        LEFT JOIN 
            \`tracking-image\`
        ON 
            \`tracking-image\`.tracking_id = trackings.id
        GROUP BY
            trackings.id
        HAVING
            trackings.airbilling = 1
        ORDER BY 
            STR_TO_DATE(trackings.created_at, '%d/%m/%Y %H:%i:%s') DESC
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
         images,
      }
   })
   return trackingObjects
}

export default getAllCargo
