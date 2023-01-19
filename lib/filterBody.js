const htmlparser2 = require("htmlparser2")
const render = require("dom-serializer").default
const CSSselect = require("css-select")

function filterBody(body) {
   const dom = htmlparser2.parseDocument(body)
   const title = render(
      CSSselect.selectOne("h1.ProductTitle__text", dom),
      {
         decodeEntities: false,
      }
   )
      .replace(/<h1 class="ProductTitle__text">/, "")
      .replace(/<\/h1>/, "")
   //   IMAGE
   const image = CSSselect.selectAll("div.ProductImage__inner img", dom).map(
      (img) =>
         render(img, { decodeEntities: false }).replace(
            /.*src="([^"]*)".*/,
            "$1"
         )
   )
   // console.log(img);
   //   PRICE
   const temp = render(CSSselect.selectOne("dd[class~=Price__value]", dom), {
      decodeEntities: false,
   })
   const temp1 = render(CSSselect.selectOne("span[class~=Price__tax]", dom), {
      decodeEntities: false,
   })
   const price = temp
      .replace(temp1, "")
      .replace(`<dd class="Price__value">`, "")
      .replace(`<dd class="Price__value Price__value--buyNow">`, "")
      .replace("</dd>", "")
      .replace("円", "")
      .trim()
   // console.log(price)
   const details = CSSselect.selectAll(
      "li.ProductDetail__item dd.ProductDetail__description",
      dom
   ).map((detail) =>
      render(detail, { decodeEntities: false })
         .replace(
            /<dd class="ProductDetail__description"><span class="ProductDetail__bullet">：<\/span>/,
            ""
         )
         .replace(/<\/dd>/, "")
   )
   const detail_obj = {
      volumn: details[0],
      startDate: details[1],
      endDate: details[2],
   }
   return {
      image,
      price,
      detail: detail_obj,
      title,
   }
}

export default filterBody
