const htmlparser2 = require("htmlparser2");
const render = require("dom-serializer").default;
const CSSselect = require("css-select");

function filterBody(body) {
  const dom = htmlparser2.parseDocument(body);
  const title = render(
    CSSselect.selectOne("div.l-contentsHead h1.ProductTitle__text", dom),
    {
      decodeEntities: false,
    }
  )
    .replace(/<h1 class="ProductTitle__text">/, "")
    .replace(/<\/h1>/, "");
  //   IMAGE
  const image = CSSselect.selectAll("div.ProductImage__inner img", dom).map(
    (img) => {
      return render(img, { decodeEntities: false }).replace(
        /.*src="([^"]*)".*/,
        "$1"
      );
    }
  );
  // console.log(img);
  //   PRICE
  const temp = render(CSSselect.selectOne("dd.Price__value", dom), {
    decodeEntities: false,
  })
    .replace(/<span class="Price__tax u-fontSize14">/, "")
    .replace(/<\/span>/, "")
    .replace(/<dd class="Price__value">/, "")
    .replace(/<\/dd>/, "")
    .replace(/\n/, "");
  let price = "";
  for (let i = 0; i < temp.length; i++) {
    if (temp[i] === "円") {
      break;
    }
    price += temp[i];
  }
  // console.log(price);
  const details = CSSselect.selectAll(
    "li.ProductDetail__item dd.ProductDetail__description",
    dom
  ).map((detail) => {
    return render(detail, { decodeEntities: false })
      .replace(
        /<dd class="ProductDetail__description"><span class="ProductDetail__bullet">：<\/span>/,
        ""
      )
      .replace(/<\/dd>/, "");
  });
  let detail_obj = {
    volumn: details[0],
    startDate: details[1],
    endDate: details[2],
  };
  return {
    image: image,
    price: price,
    detail: detail_obj,
    title: title,
  };
}

export default filterBody;