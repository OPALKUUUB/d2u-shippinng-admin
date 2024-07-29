import axios from "axios"
import query from "../../mysql/connection"

async function updateInvoice(body) {
   try {
      const { shipbillingId, contentData } = body

      let queryString =
         "UPDATE invoice SET content_data = ? WHERE ship_billing_id = ?"

      const contentDataJson = JSON.parse(contentData)
      const apiFlag = contentDataJson?.apiFlag

      let data = [
         JSON.stringify({ ...contentDataJson, apiFlag: "" }),
         shipbillingId,
      ]

      const isAddressDeliveryed = contentDataJson?.isAddressDeliveryed
      const isAddAddressDeliveryed = contentDataJson?.isAddAddressDeliveryed
      const sendedTrackNoAndPriceAddress =
         contentDataJson?.sendedTrackNoAndPriceAddress
      const sendedTrackNoAndPriceAddAddress =
         contentDataJson?.sendedTrackNoAndPriceAddAddress
      const address = contentDataJson?.address
      const addressType = contentDataJson?.addressType
      const addAddress = contentDataJson?.addAddress
      const addAddressType = contentDataJson?.addAddressType
      const trackingPriceList1 = contentDataJson?.trackingPriceList1 || []
      const trackingPriceList2 = contentDataJson?.trackingPriceList2 || []

      if (isAddressDeliveryed && apiFlag === "isAddressDeliveryed") {
         console.log("====> message line api")
         await axios({
            method: "post",
            url: "https://api.line.me/v2/bot/message/push",
            headers: {
               Authorization: `Bearer ${process.env.API_LINE_TOKEN}`,
            },
            data: {
               to: "Ue53cb4435ad1424e69a5eadec21a96b3",
               messages: [
                  {
                     type: "text",
                     text: "ทาง d2u ได้ทำการส่งพัสดุให้ทาง ลคเรียบร้อยแล้ว กรุณารอแทร็กกิ้งและราคาภายใน 24 ชั่วโมง",
                  },
               ],
            },
         })
      } else if (
         isAddAddressDeliveryed &&
         apiFlag === "isAddAddressDeliveryed"
      ) {
         console.log("====> message line api")
         await axios({
            method: "post",
            url: "https://api.line.me/v2/bot/message/push",
            headers: {
               Authorization: `Bearer ${process.env.API_LINE_TOKEN}`,
            },
            data: {
               to: "Ue53cb4435ad1424e69a5eadec21a96b3",
               messages: [
                  {
                     type: "text",
                     text: "ทาง d2u ได้ทำการส่งพัสดุให้ทาง ลคเรียบร้อยแล้ว กรุณารอแทร็กกิ้งและราคาภายใน 24 ชั่วโมง",
                  },
               ],
            },
         })
      } else if (
         sendedTrackNoAndPriceAddress &&
         apiFlag === "sendedTrackNoAndPriceAddress"
      ) {
         console.log("====> message line api")
         await axios({
            method: "post",
            url: "https://api.line.me/v2/bot/message/push",
            headers: {
               Authorization: `Bearer ${process.env.API_LINE_TOKEN}`,
            },
            data: {
               to: "Ue53cb4435ad1424e69a5eadec21a96b3",
               messages: [
                  {
                     type: "text",
                     text: `ประเภทที่อยู่: ${addressType}\nที่อยู่: ${address}\n${trackingPriceList1
                        .map(
                           (item) =>
                              `[${item.trackingNo}] ${
                                 item?.price
                                    ? (item?.price).toLocaleString()
                                    : "-"
                              }`
                        )
                        .join(
                           "\n"
                        )}\nhttps://track.thailandpost.co.th/?trackNumber=${trackingPriceList1
                        .map((item) => item.trackingNo)
                        .join(",")}`,
                  },
               ],
            },
         })
      } else if (
         sendedTrackNoAndPriceAddAddress &&
         apiFlag === "sendedTrackNoAndPriceAddAddress"
      ) {
         console.log("====> message line api")
         await axios({
            method: "post",
            url: "https://api.line.me/v2/bot/message/push",
            headers: {
               Authorization: `Bearer ${process.env.API_LINE_TOKEN}`,
            },
            data: {
               to: "Ue53cb4435ad1424e69a5eadec21a96b3",
               messages: [
                  {
                     type: "text",
                     text: `ประเภทที่อยู่: ${addAddressType}\nที่อยู่: ${addAddress}\n${trackingPriceList2
                        .map(
                           (item) =>
                              `[${item.trackingNo}] ${
                                 item?.price
                                    ? (item?.price).toLocaleString()
                                    : "-"
                              }`
                        )
                        .join(
                           "\n"
                        )}\nhttps://track.thailandpost.co.th/?trackNumber=${trackingPriceList2
                        .map((item) => item.trackingNo)
                        .join(",")}`,
                  },
               ],
            },
         })
      }

      await query(queryString, data)

      return {
         message: "update contentData invoice successfully",
      }
   } catch (error) {
      console.error("Error executing query:", error.message)
      throw new Error(
         "An error occurred while fetching data from updateInvoice."
      )
   }
}

export default updateInvoice
