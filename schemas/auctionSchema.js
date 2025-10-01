import { z } from "zod"

// Yahoo auction URL validation regex
const yahooAuctionUrlRegex =
   /^https:\/\/(auctions|page\.auctions)\.yahoo\.co\.jp\/jp\/auction\/[a-zA-Z0-9]+$/

export const auctionFormSchema = z.object({
   customerId: z.string().min(1, "กรุณาเลือกผู้ประมูล"),

   auctionLink: z
      .string()
      .min(1, "กรุณาใส่ลิงค์ประมูล")
      .refine(
         (link) => yahooAuctionUrlRegex.test(link),
         "ลิงค์ต้องเป็น URL ประมูล Yahoo ที่ถูกต้อง"
      ),

   maxBid: z
      .number({
         required_error: "กรุณาใส่ราคาประมูลสูงสุด",
         invalid_type_error: "ราคาต้องเป็นตัวเลข",
      })
      .min(1, "ราคาต้องมากกว่า 0 เยน")
      .int("ราคาต้องเป็นจำนวนเต็ม"),

   customerNote: z.string().optional(),

   adminNote: z.string().optional(),
})

// Validation schema for search link only
export const searchLinkSchema = z.object({
   link: z
      .string()
      .min(1, "กรุณาใส่ลิงค์ประมูล")
      .refine(
         (link) => yahooAuctionUrlRegex.test(link),
         "ลิงค์ต้องเป็น URL ประมูล Yahoo ที่ถูกต้อง"
      ),
})
