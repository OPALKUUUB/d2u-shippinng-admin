import mysql from "../../../lib/db"

async function handler(req, res) {
   if (req.method === "POST") {
      const { year } = req.body
      console.log("🔷 [Step 1] เริ่มดึงข้อมูลคะแนนของผู้ใช้ทุกคนในปี:", year)
      
      // ดึงข้อมูลคะแนนของผู้ใช้ทุกคนในปีที่ระบุ
      await mysql.connect()
      console.log("🔷 [Step 2] เชื่อมต่อฐานข้อมูลสำเร็จ")

      // ดึงข้อมูล users ทั้งหมด
      const users = await mysql.query(`SELECT id, username FROM users`)
      console.log(`🔷 [Step 3] ดึงข้อมูล users ได้ทั้งหมด ${users.length} คน`)

      console.log("🔷 [Step 4] เริ่มดึงข้อมูล trackings ของแต่ละ user...")
      const userPointsData = await Promise.all(
         users.map(async (user) => {
            const trackings_user = await mysql.query(
               `
               SELECT *
               FROM trackings
               WHERE
               user_id = ?
               AND channel NOT LIKE 'yahoo'
            `,
               [user.id]
            )

            const trackings_user_yahoo = await mysql.query(
               `
            SELECT 
               trackings.*, 
               ${"`yahoo-auction-payment`"}.bid
            FROM
               trackings
            JOIN
               ${"`yahoo-auction-payment`"}
            ON
               ${"`yahoo-auction-payment`"}.tracking_id = trackings.id
            WHERE
               trackings.user_id = ?
               AND trackings.channel = 'yahoo'
            `,
               [user.id]
            )

            const trackings = [
               ...trackings_user,
               ...trackings_user_yahoo,
            ].filter(
               (ft) =>
                  parseInt(ft.created_at.split(" ")[0].split("/")[2], 10) ===
                  year
            )

            const point_current = trackings.reduce((a, c) => {
               const price = c.price === null ? 0 : c.price
               const weight = c.weight === null ? 0 : c.weight
               if (c.channel === "shimizu") {
                  return a + weight
               }
               if (c.channel === "mercari" || c.channel === "fril") {
                  return (
                     a + Math.ceil(price / 1000) + (weight >= 1 ? weight - 1 : 0)
                  )
               }
               if (c.channel === "yahoo") {
                  return a + Math.ceil(c.bid / 2000) + weight
               }
               return a + Math.ceil(price / 2000) + weight
            }, 0)

            const result = {
               user_id: user.id,
               username: user.username,
               point: Math.ceil(point_current),
               trackings_count: trackings.length,
            }
            console.log(`   ✅ คำนวณคะแนนสำหรับ ${user.username} เสร็จ: ${result.point} คะแนน (จาก ${trackings.length} trackings)`)
            return result
         })
      )

      console.log("🔷 [Step 5] คำนวณคะแนนทั้งหมดเสร็จสิ้น")
      console.log("📊 ข้อมูลคะแนนทั้งหมด:", JSON.stringify(userPointsData, null, 2))

      await mysql.end()
      console.log("🔷 [Step 6] ปิดการเชื่อมต่อฐานข้อมูล")
      console.log("✅ [Complete] ส่งข้อมูลกลับสำเร็จ")

      res.status(200).json({
         message: "get all user points",
         year,
         data: userPointsData,
      })
   }
}

export default handler
