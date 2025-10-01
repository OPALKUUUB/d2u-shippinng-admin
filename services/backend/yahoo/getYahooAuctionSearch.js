/* eslint-disable prefer-const */
/* eslint-disable import/no-extraneous-dependencies */
// npm i axios htmlparser2 css-select dom-serializer domutils html-entities
const axios = require("axios")
const htmlparser2 = require("htmlparser2")
const CSSselect = require("css-select")
const render = require("dom-serializer").default
const { textContent } = require("domutils") // ดึงข้อความล้วนจาก node
const { decode } = require("html-entities") // ถอดรหัส &#x...; → อักษรจริง

async function getYahooAuctionSearch(link) {
   try {
      const html = await getHtmlFromLink(link)
      return getDataFromHtml(html, link)
   } catch (error) {
      console.error("Error in getYahooAuctionSearch:", error)
      throw new Error("Failed to fetch data from Yahoo Auction.")
   }
}

async function getHtmlFromLink(link) {
   try {
      const result = await axios.get(link, {
         headers: {
            "User-Agent":
               "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
            "Accept-Language": "ja-JP,ja;q=0.9,en-US;q=0.8,en;q=0.7",
            // 'Referer': 'https://auctions.yahoo.co.jp/', // ถ้าโดนบล็อกให้เปิด
         },
         responseType: "text",
         decompress: true,
         timeout: 15000,
         maxRedirects: 5,
      })
      return result.data
   } catch (error) {
      console.error("Error in getHtmlFromLink:", error?.message || error)
      throw new Error("Failed to fetch HTML from the provided link.")
   }
}

function getDataFromHtml(body, baseUrl) {
   const dom = htmlparser2.parseDocument(body)
   const base = safeURL(baseUrl)

   // ---------- helpers ----------
   const safeRender = (node, decodeEntities = true) =>
      node ? render(node, { decodeEntities }) : ""

   // ดึงข้อความล้วน + decode entities (สำคัญมากสำหรับภาษาญี่ปุ่นที่มาเป็น &#x....;)
   const textOf = (node) => {
      if (!node) return ""
      return decode(textContent(node) || "")
         .replace(/\s+/g, " ")
         .trim()
   }

   const getAttr = (node, attr) => {
      if (!node) return ""
      const html = safeRender(node, false)
      const m = html.match(new RegExp(`${attr}="([^"]+)"`))
      return m?.[1] ?? ""
   }

   const getMeta = (sel, attr = "content") => {
      const n = CSSselect.selectOne(sel, dom)
      const val = getAttr(n, attr)
      return decode(val || "") // decode เผื่อ meta มี entities
   }

   const abs = (u) => {
      if (!u) return ""
      try {
         return new URL(u, base || undefined).toString()
      } catch {
         return u
      }
   }

   const nextTagSibling = (n) => {
      let cur = n?.next
      while (cur && cur.type !== "tag") cur = cur.next
      return cur || null
   }

   const normalizePrice = (raw) => {
      if (!raw) return ""
      console.log("🔄 normalizePrice input:", JSON.stringify(raw))
      console.log(
         "🔤 Raw bytes:",
         Array.from(raw)
            .map((c) => `${c}(${c.charCodeAt(0)})`)
            .join(" ")
      )

      // ดึงเฉพาะตัวเลขออกมา (ไม่เอา comma)
      const decoded = decode(raw)
      console.log("📝 decoded:", JSON.stringify(decoded))

      // หาชุดตัวเลขแรกที่มี comma (ราคาหลัก) แทนที่จะเอาตัวเลขทั้งหมด
      const priceMatch = decoded.match(/[\d０-９,，、]+(?=\s*円)/) // ตัวเลข + comma ที่อยู่หน้า "円"
      console.log("🎯 Price match:", priceMatch?.[0])

      if (!priceMatch) return ""

      // ลบทุกอย่างยกเว้นตัวเลข - รวมถึง full-width numbers และ zero-width chars
      const cleaned = priceMatch[0]
         .replace(/[\u200B-\u200D\uFEFF]/g, "") // zero-width chars
         .replace(/[０-９]/g, (match) =>
            String.fromCharCode(match.charCodeAt(0) - 0xff10 + 0x30)
         ) // full-width to half-width
         .replace(/[^\d]/g, "") // เอาแค่ตัวเลข (ลบ comma)

      console.log("🧹 cleaned:", JSON.stringify(cleaned))

      if (!cleaned) return ""

      // คืนค่าเป็นตัวเลขเปล่าๆ ไม่มี comma หรือ 円
      const result = cleaned
      console.log("✅ normalized result:", JSON.stringify(result))

      return result
   }

   // ---------- TITLE ----------
   let title =
      textOf(CSSselect.selectOne("h1.ProductTitle__text", dom)) ||
      textOf(
         CSSselect.selectOne('h1[data-testid], h1[itemprop="name"]', dom)
      ) ||
      getMeta('meta[property="og:title"]') ||
      textOf(CSSselect.selectOne("title", dom)) ||
      ""

   // ---------- IMAGES ----------
   const imageSet = new Set()
   // og:image (อาจมีหลายอัน)
   CSSselect.selectAll('meta[property="og:image"]', dom).forEach((n) => {
      const url = getAttr(n, "content")
      if (url) imageSet.add(abs(url))
   })
   // แกลเลอรี: รูปจริงใน src / data-src
   CSSselect.selectAll(
      'div.ProductImage__inner img, img[src*="yimg.jp"], img[src*="aucimg"], img[data-src]',
      dom
   ).forEach((img) => {
      const src = getAttr(img, "src") || getAttr(img, "data-src")
      if (src && !src.startsWith("data:")) imageSet.add(abs(src))
   })

   // เก็บเฉพาะรูปจาก auctions.c.yimg.jp
   const filteredImages = Array.from(imageSet).filter((url) => {
      return url.includes("auctions.c.yimg.jp")
   })
   const image = filteredImages

   // ---------- PRICE ----------
   let price = ""

   // A) โครงสร้าง dt/dd (ทันทีหลัง decode แล้วจะจับคำญี่ปุ่นได้)
   const dtLabels = [
      { key: "即決", weight: 4 }, // ซื้อทันที
      { key: "現在価格", weight: 3 }, // ราคาปัจจุบัน
      { key: "落札価格", weight: 2 }, // ราคาปิดประมูล
      { key: "開始時の価格", weight: 1 }, // ราคาเริ่มต้น
   ]
   let best = { price: "", weight: -1 }

   CSSselect.selectAll("dt", dom).forEach((dt) => {
      const label = textOf(dt) // ← ตอนนี้เป็น "即決" จริง ๆ ไม่ใช่ &#x...
      const hit = dtLabels.find((l) => label.includes(l.key))
      if (!hit) return

      const dd = nextTagSibling(dt)
      if (!dd) return

      // ตัวเลขอยู่ใน dd หรือ span ภายใน
      const candidate =
         textOf(dd) ||
         textOf(
            CSSselect.selectOne(
               "span[class*=Price__value], dd[class*=Price__value]",
               dd
            )
         ) ||
         ""
      const p = normalizePrice(candidate) // "4,800円"
      if (p && hit.weight > best.weight) {
         best = { price: p, weight: hit.weight }
      }
   })

   if (best.price) price = best.price

   // B) dd[class*=Price__value] (กันกรณีไม่มี dt/dd)
   if (!price) {
      console.log("🔍 Trying dd[class*=Price__value] fallback method...")
      const dd = CSSselect.selectOne("dd[class*=Price__value]", dom)
      const ddText = textOf(dd)
      console.log("📝 Found dd text:", ddText)

      const p = normalizePrice(ddText)
      console.log("🔄 Normalized dd price:", p)

      if (p) {
         price = p
         console.log("✅ Price found via dd fallback:", price)
      }
   }

   // B2) ราคาปัจจุบัน/即決 จาก page structure
   if (!price) {
      console.log("🔍 Trying current price structure method...")

      // หาทุก element ที่มีข้อความราคา
      const priceElements = CSSselect.selectAll("*", dom).filter((el) => {
         const text = textOf(el)
         return (
            text &&
            (text.includes("現在") ||
               text.includes("即決") ||
               text.includes("落札価格") ||
               text.match(/^\d[\d,，、]*\s*円/))
         )
      })

      console.log("💰 Found price elements:", priceElements.length)

      // Find first valid price using some() instead of for...of loop
      priceElements.some((el) => {
         const text = textOf(el)
         console.log("📋 Checking element text:", text)

         const p = normalizePrice(text)
         if (p && parseInt(p, 10) > 0) {
            price = p
            console.log("✅ Price found via structure method:", price)
            return true // breaks out of some() loop
         }
         return false
      })
   }

   // C) regex fallback ("即決 9,999円 / 現在価格 9,999円 / 落札価格 9,999円")
   if (!price) {
      const plain = decode(body).replace(/\s+/g, " ")
      const mBuy = plain.match(/即決[^0-9]*([0-9,]+)\s*円/)
      const mCur = plain.match(/現在価格[^0-9]*([0-9,]+)\s*円/)
      const mClosed = plain.match(/落札価格[^0-9]*([0-9,]+)\s*円/)
      const mAny = plain.match(/([0-9,]+)\s*円/)
      const picked = mBuy?.[1] || mCur?.[1] || mClosed?.[1] || mAny?.[1]
      if (picked) price = `${picked}円`
   }

   // D) meta (เฉพาะถ้า > 0)
   if (!price) {
      const metaPrice =
         getMeta('meta[property="product:price:amount"]') ||
         getMeta('meta[property="og:price:amount"]')
      const num = Number(String(metaPrice || "").replace(/[^\d.]/g, ""))
      if (Number.isFinite(num) && num > 0) {
         price = `${num.toLocaleString("ja-JP")}円`
      }
   }

   return {
      image,
      price: (price || "").replace(/\s+/g, "").trim(),
      title: (title || "").trim(),
   }
}

function safeURL(u) {
   try {
      return u ? new URL(u) : undefined
   } catch {
      return undefined
   }
}

module.exports = getYahooAuctionSearch
