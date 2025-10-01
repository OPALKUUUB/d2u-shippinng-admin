const getYahooAuctionSearch = require("../../../services/backend/yahoo/getYahooAuctionSearch")

export default async function handler(req, res) {
   if (req.method !== "POST") {
      return res.status(405).json({ message: "Method not allowed" })
   }

   try {
      const { link } = req.body

      if (!link) {
         return res.status(400).json({
            message: "กรุณาใส่ลิงค์ประมูล",
            error: "Link is required",
         })
      }

      // ตรวจสอบว่าเป็น link Yahoo Auction จริงหรือไม่
      if (
         !link.includes("auctions.yahoo.co.jp/jp/auction/") &&
         !link.includes("page.auctions.yahoo.co.jp/jp/auction/")
      ) {
         return res.status(400).json({
            message: "ลิงค์ไม่ถูกต้อง กรุณาใส่ลิงค์ประมูล Yahoo",
            error: "Invalid Yahoo Auction link",
         })
      }

      console.log("🔍 Searching Yahoo Auction:", link)

      const auctionData = await getYahooAuctionSearch(link)

      console.log("✅ Yahoo Auction data found:", {
         title: auctionData.title,
         price: auctionData.price,
         imageCount: auctionData.image?.length || 0,
      })

      return res.status(200).json({
         status: 200,
         message: "ค้นหาข้อมูลประมูลสำเร็จ!",
         data: auctionData,
      })
   } catch (error) {
      console.error("❌ Error in Yahoo Auction search:", error)

      return res.status(500).json({
         status: 500,
         message: "เกิดข้อผิดพลาดในการค้นหาข้อมูลประมูล",
         error: error.message,
      })
   }
}
