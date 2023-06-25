import query from "../../mysql/connection"

async function getTrackings(channel) {
   const trackings = await query(`
    SELECT
       trackings.*,
       users.id as user_id,
       users.username,
       GROUP_CONCAT(\`tracking-image\`.image) AS images
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
       trackings.channel = ?
    ORDER BY 
       STR_TO_DATE(trackings.created_at, '%d/%m/%Y %H:%i:%s') DESC;
 `, [channel])
   const trackingObjects = trackings.map((tracking, index) => ({
      key: index,
      ...tracking,
      images: tracking.images ? tracking.images.split(",") : [],
   }))
   return trackingObjects
}

export default getTrackings
