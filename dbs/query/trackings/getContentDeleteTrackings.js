import query from "../../mysql/connection"

async function getContentDeleteTrackings() {
   const trackings = await query(`
    SELECT
       t.*,
       SUBSTRING_INDEX(t.date, ' ', 1) AS date,
       users.id as user_id,
       users.username,
       GROUP_CONCAT(\`tracking-image\`.image) AS images
    FROM 
       trackings t
    JOIN 
       users 
    ON 
       users.id = t.user_id
    LEFT JOIN 
       \`tracking-image\`
    ON 
       \`tracking-image\`.tracking_id = t.id
    WHERE
       t.cont_status = 99
    GROUP BY
       t.id
    ORDER BY 
       STR_TO_DATE(t.created_at, '%d/%m/%Y %H:%i:%s') DESC;
 `)
   return trackings.map((tracking, index) => ({
      key: index,
      ...tracking,
      images: tracking.images ? tracking.images.split(",") : [],
   }))
}

export default getContentDeleteTrackings
