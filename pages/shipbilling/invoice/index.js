/* eslint-disable no-nested-ternary */
/* eslint-disable indent */
/* eslint-disable no-else-return */
/* eslint-disable prefer-destructuring */
import {
   Button,
   Checkbox,
   Collapse,
   Divider,
   InputNumber,
   message,
   Modal,
   Spin,
   Switch,
   Table,
} from "antd"
import React, { useEffect, useState } from "react"
import ReportShipBillingInvoice from "../../../components/ReportShipBillingInvoice"

function CalRate(rate_w, rate_s, deduct) {
   const rate = rate_w > rate_s ? rate_s : rate_w
   if (deduct) {
      return deduct === 150 ? 150 : rate
   }
   return 200
}
function CalBaseRate(point, user) {
   if (user?.username === "April") {
      return { rate: 160, min: false }
   } else if (user?.username === "Giotto") {
      return { rate: 180, min: false }
   }
   if (point > 1500) {
      return { rate: 150, min: false }
   } else if (point > 1000 && point <= 1500) {
      return { rate: 160, min: false }
   } else if (point > 500 && point <= 1000) {
      return { rate: 180, min: false }
   } else if (point > 100 && point <= 500) {
      return { rate: 200, min: false }
   }
   return { rate: 200, min: true }
}

// function CalBaseRateByWeight(weight) {
//    if (weight >= 100) {
//       return 140
//    } else if (weight >= 50 && weight < 100) {
//       return 160
//    } else if (weight >= 10 && weight < 50) {
//       return 180
//    }
//    return 200
// }
function CalBaseRateByWeight(weight) {
   if (weight >= 0.5 && weight < 10) {
      return 200
   } else if (weight >= 10 && weight < 50) {
      return 180
   } else if (weight >= 50) {
      return 160
   }
   return 200
}
function InvoicePage({ user_id, voyage }) {
   const [pointCurrent, setPointCurrent] = useState(0)
   const [pointLast, setPointLast] = useState(0)
   const [data, setData] = useState([])
   const [bill, setBill] = useState({})
   const [discount, setDiscount] = useState(0)
   const [checkDiscount, setCheckDiscount] = useState(false)
   const [isEmployeeRate, setIsEmployeeRate] = useState(false)
   const [costDelivery, setCostdDelivery] = useState(0)
   const [user, setUser] = useState({})
   const [scoreBaseRate, setScoreBaseRate] = useState({ rate: 0, min: false })
   const [selectRow, setSelectRow] = useState()
   const [openModal, setOpenModal] = useState(false)
   const [deduct, setDeduct] = useState(false)
   const [confirmLoading, setConfirmLoading] = useState(false)
   const [loading, setLoading] = useState(false)
   const [rateYen, setRateYen] = useState(0)
   let seq = 0

   const handleSaveCod = async () => {
      setConfirmLoading(true)
      try {
         await fetch(`/api/tracking?id=${selectRow?.id}`, {
            method: "put",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ cod: selectRow?.cod || 0 }),
         })
         // console.log(response)
         message.success("success!")
         setData((prev) => {
            const temp = prev.reduce((a, c) => {
               if (c.id === selectRow.id) {
                  return [...a, { ...c, cod: selectRow?.cod || 0 }]
               }
               return [...a, c]
            }, [])
            return temp
         })
      } catch (err) {
         console.log(err)
      } finally {
         setConfirmLoading(false)
         setOpenModal(false)
      }
   }
   const handleSaveCostDelivery = async () => {
      const response = await fetch(`/api/shipbilling?id=${bill?.id}`, {
         method: "PATCH",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify({ cost_delivery: costDelivery }),
      })
      await response.json()
      message.success("success!")
   }
   const handleSaveDiscount = async () => {
      const response = await fetch(`/api/shipbilling?id=${bill?.id}`, {
         method: "PATCH",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify({ discount }),
      })
      await response.json()
      message.success("success!")
   }
   const handleCheckDiscount = async (checked) => {
      const response = await fetch(`/api/shipbilling?id=${bill?.id}`, {
         method: "PATCH",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify({ check_50: checked ? 1 : 0 }),
      })
      await response.json()
      message.success("success!")
      setCheckDiscount(checked)
   }
   const handleCheckEmployeeRate = async (checked) => {
      const response = await fetch(`/api/shipbilling?id=${bill?.id}`, {
         method: "PATCH",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify({ isEmployeeRate: checked }),
      })
      await response.json()
      message.success("success!")
      setIsEmployeeRate(checked)
      setScoreBaseRate((prev) => ({
         ...prev,
         rate: 150,
      }))
      await handleUpdateRateByRate(150)
   }
   const handleUpdateRate = async () => {
      const response = await fetch(`/api/shipbilling?id=${bill?.id}`, {
         method: "PATCH",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify({
            rate: scoreBaseRate.rate === "" ? null : scoreBaseRate.rate,
         }),
      })
      await response.json()
      message.success("success!")
      if (scoreBaseRate.rate === "") {
         window.location.reload(false)
      }
   }
   const handleUpdateRateByRate = async (rate) => {
      const response = await fetch(`/api/shipbilling?id=${bill?.id}`, {
         method: "PATCH",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify({
            rate,
         }),
      })
      await response.json()
      message.success("success!")
      if (scoreBaseRate.rate === "") {
         window.location.reload(false)
      }
   }
   const handleSaveVoyagePrice = async (price) => {
      setLoading(true)
      const response = await fetch(`/api/shipbilling?id=${bill?.id}`, {
         method: "PATCH",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify({
            voyage_price: price,
            check: true,
         }),
      })
      await response.json()
      message.success("success!")
      setBill((prev) => ({ ...prev, voyage_price: price }))
      setLoading(false)
   }
   const handleResetVoyagePrice = async () => {
      setLoading(true)
      const response = await fetch(`/api/shipbilling?id=${bill?.id}`, {
         method: "PATCH",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify({
            voyage_price: null,
            check: false,
         }),
      })
      await response.json()
      message.success("success!")
      setBill((prev) => ({ ...prev, voyage_price: null }))
      setLoading(false)
   }
   const handleConfirmDeduct = async () => {
      await fetch(`/api/shipbilling?id=${bill?.id}`, {
         method: "PUT",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify({
            deduct,
         }),
      })
   }
   function CalMerFril(weight) {
      const baseRateByWeight = CalBaseRateByWeight(weight)
      const rate_use = CalRate(baseRateByWeight, scoreBaseRate.rate, deduct)
      if (deduct) {
         return weight * rate_use
      }
      if (weight <= 1) {
         return 0
      }
      return Math.ceil((weight - 1) * 200 * 100) / 100
   }
   const refreshData = async () => {
      const response = await fetch(`/api/shipbilling`, {
         method: "POST",
         headers: {
            "Content-Type": "application/json",
         },
         body: JSON.stringify({
            user_id,
            voyage,
         }),
      })
      const response2 = await fetch("/api/point", {
         method: "POST",
         headers: {
            "Content-Type": "application/json",
         },
         body: JSON.stringify({ user_id }),
      })
      const response2Json = await response2.json()
      setPointCurrent(response2Json.point || 0)
      const responseJson = await response.json()
      setData([
         ...responseJson.trackings.reduce(
            (a, c, idx) => [...a, { ...c, key: idx }],
            []
         ),
      ])
      setDeduct(responseJson.billing.deduct)
      setBill(responseJson.billing)
      setDiscount(responseJson.billing?.discount)
      setCostdDelivery(
         responseJson.billing?.cost_delivery === undefined
            ? 0
            : responseJson.billing?.cost_delivery
      )
      setUser(responseJson.user)
      const point_last = responseJson.user?.point_last || 0
      setPointLast(point_last)
      const point_current =
         (response.user?.point_current || 0) + response2Json.point
      const point_use = point_current > point_last ? point_current : point_last
      if (responseJson.billing.rate === null) {
         const baseRate1 = CalBaseRate(point_use, responseJson.user)
         const baseRate2 = CalBaseRate(point_use, responseJson.user)
         const baseRate =
            baseRate1.rate < baseRate2.rate ? baseRate1 : baseRate2
         setScoreBaseRate(baseRate)
      } else {
         setScoreBaseRate({ rate: responseJson.billing.rate, min: false })
      }
      setCheckDiscount(responseJson.billing?.check_50 === 1)
      setIsEmployeeRate(responseJson.billing?.isEmployeeRate === 1)
      setRateYen(responseJson?.rateYen || 0)
   }
   useEffect(() => {
      setLoading(true)
      ;(async () => {
         await refreshData()
         setLoading(false)
      })()
   }, [])

   const sum_channel = ["yahoo", "shimizu", "mart", "123"].reduce(
      (a, c) => {
         const sum_weight_cod = data
            .filter((ft) => ft.channel === c)
            .reduce(
               (a1, c1) => ({
                  weight: a1.weight + c1.weight,
                  cod: a1.cod + c1.cod * c1.rate_yen,
               }),
               { weight: 0, cod: 0 }
            )
         if (data.filter((ft) => ft.channel === c).length === 0) {
            return a
         }
         const price = [sum_weight_cod].reduce((a2, c2) => {
            const baseRateByWeight = CalBaseRateByWeight(c2.weight)

            let rate_use =
               baseRateByWeight < scoreBaseRate.rate
                  ? baseRateByWeight
                  : scoreBaseRate.rate
            if (deduct === 150) {
               rate_use = 150
            }
            if (c === "shimizu" && scoreBaseRate.min && c2.weight < 0.5) {
               return 100 + c2.cod
            }
            const weight = Math.floor(c2.weight * 100) / 100
            return Math.ceil(weight * rate_use + c2.cod)
         }, 0)
         return {
            ...a,
            [c === "123" ? "web123" : c]: {
               price,
            },
         }
      },
      data
         .filter((ft) => ft.channel === "mercari" || ft.channel === "fril")
         .reduce(
            (a, c) => {
               const cal_mer_fril = Math.ceil(CalMerFril(c.weight))
               // console.log(CalMerFril(c.weight))
               const before_price = a[c.channel].price + c.cod * c.rate_yen
               const sprice = Math.ceil(before_price + cal_mer_fril)
               // console.log(cal_mer_fril)
               return {
                  ...a,
                  [c.channel]: {
                     price: sprice,
                     weight:
                        c.weight < 1
                           ? a[c.channel].weight
                           : a[c.channel].weight +
                             (c.weight === undefined ? 0 : c.weight) -
                             (deduct ? 0 : 1),
                  },
               }
            },
            {
               mercari: { price: 0, weight: 0 },
               fril: { price: 0, weight: 0 },
               shimizu: { price: 0 },
               web123: { price: 0 },
               yahoo: { price: 0 },
               mart: { price: 0 },
            }
         )
   )
   const handleCheckTracking = async (status, id, key) => {
      setLoading(true)
      try {
         const response = await fetch(`/api/tracking?id=${id}`, {
            method: "PUT",
            headers: {
               "Content-Type": "application/json",
            },
            body: JSON.stringify({ [key]: status ? 0 : 1 }),
         })
         await response.json()
         await refreshData()
         message.success("success!")
      } catch (err) {
         console.log(err)
         message.error("fail!")
      } finally {
         setLoading(false)
      }
   }
   const columns = [
      {
         title: "วันที่",
         dataIndex: "date",
         key: "date",
      },
      {
         title: "ช่องทาง",
         dataIndex: "channel",
         key: "channel",
      },
      {
         title: "Track No.",
         dataIndex: "track_no",
         key: "track_no",
      },
      {
         title: "Box No.",
         dataIndex: "box_no",
         key: "box_no",
      },
      {
         title: "COD(¥)",
         dataIndex: "cod",
         key: "cod",
      },
      {
         title: "ถ่ายรูป",
         dataIndex: "isPicture",
         key: "isPicture",
         render: (ck, item) =>
            ck ? (
               <Switch
                  checked={ck}
                  onChange={() => handleCheckTracking(ck, item.id, "isPicture")}
               />
            ) : (
               <Switch
                  checked={ck}
                  onChange={() => handleCheckTracking(ck, item.id, "isPicture")}
               />
            ),
      },
      {
         title: "repack",
         dataIndex: "isRepack",
         key: "isRepack",
         render: (ck, item) =>
            ck ? (
               <Switch
                  checked={ck}
                  onChange={() => handleCheckTracking(ck, item.id, "isRepack")}
               />
            ) : (
               <Switch
                  checked={ck}
                  onChange={() => handleCheckTracking(ck, item.id, "isRepack")}
               />
            ),
      },
      {
         title: "หมายเหตุแอดมิน",
         dataIndex: "remark_admin",
         key: "remark_admin",
         render: (text) => (text === "" || null ? "-" : text),
      },
      {
         title: "แก้ไข COD",
         dataIndex: "id",
         key: "id",
         fixed: "right",
         render: (id) => (
            <Button
               onClick={() => {
                  setSelectRow(data.filter((ft) => ft.id === id)[0])
                  setOpenModal(true)
               }}
            >
               manage
            </Button>
         ),
      },
   ]
   const voyagePrice = Math.ceil(
      parseFloat(
         Math.ceil(
            parseFloat(
               sum_channel.mercari.price +
                  sum_channel.fril.price +
                  sum_channel.shimizu.price +
                  sum_channel.yahoo.price +
                  sum_channel.mart.price +
                  sum_channel.web123.price
            )
         ) +
            parseFloat(costDelivery, 10) -
            parseFloat(discount, 10) -
            (checkDiscount
               ? Math.ceil(
                    Math.ceil(
                       parseFloat(
                          sum_channel.mercari.price +
                             sum_channel.fril.price +
                             sum_channel.shimizu.price +
                             sum_channel.yahoo.price +
                             sum_channel.mart.price +
                             sum_channel.web123.price
                       )
                    ) * 5
                 ) / 100
               : 0),
         10
      )
   )

   const renderSummary = (label, value) => {
      return (
         <tr key={label}>
            <th
               colSpan={4}
               className="border-solid border-[0.5px] border-gray-400 px-4 py-2 text-right"
            >
               {label}:
            </th>
            <td
               colSpan={1}
               className="border-solid border-[0.5px] border-gray-400 px-4 py-2 text-right"
            >
               {value.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
               })}
            </td>
         </tr>
      )
   }
   const summaryWeight = data
      .reduce((acc, curr) => {
         return acc + (curr?.weight || 0)
      }, 0)
      .toFixed(2)
   const baseRateByWeight = CalBaseRateByWeight(summaryWeight || 0)
   const baseRateUse = Math.min(baseRateByWeight, scoreBaseRate.rate || 200)
   const summaryPrice =
      Math.round(summaryWeight * (baseRateUse) * 100) / 100
   const summaryIsPicture =
      Math.round(
         data.reduce((acc, curr) => {
            return acc + (curr?.isPicture ? 30 : 0)
         }, 0) * 100
      ) / 100
   const summaryIsRepack =
      Math.round(
         data.reduce((acc, curr) => {
            return acc + (curr?.isRepack ? 50 : 0)
         }, 0) * 100
      ) / 100
   const summaryDiscountFivePercent = checkDiscount
      ? Math.round((summaryPrice - (discount || 0)) * 5) / 100
      : 0
   const summaryCod =
      Math.round(
         data.reduce((acc, curr) => {
            return acc + (curr?.cod || 0)
         }, 0) *
            rateYen *
            100
      ) / 100

   const isOnlyShimizu =
      data.filter((fi) => fi.channel !== "shimizu").length === 0
   const pointUse = pointCurrent > pointLast ? pointCurrent : pointLast
   const isCaseLTE0_5KgShimizu =
      isOnlyShimizu && pointUse < 100 && summaryWeight < 0.5
   const totalBalance = isCaseLTE0_5KgShimizu
      ? 100
      : summaryPrice +
        summaryIsPicture +
        summaryIsRepack -
        (discount || 0) -
        summaryDiscountFivePercent +
        (costDelivery || 0) +
        summaryCod
   let summary = [
      {
         label: "น้ำหนักรวม(Kg.)",
         value: summaryWeight,
      },
      {
         label: "ราคารวม(฿)",
         value: summaryPrice,
      },
      {
         label: "ค่าถ่ายรูป(฿)",
         value: summaryIsPicture,
      },
      {
         label: "ค่า repack(฿)",
         value: summaryIsRepack,
      },
      {
         label: "ส่วนลด(฿)",
         value: discount || 0,
      },
      {
         label: "ส่วนลด 5 %(฿)",
         value: summaryDiscountFivePercent,
      },
      {
         label: "ค่าส่ง(฿)",
         value: costDelivery || 0,
      },
      {
         label: "รวม COD(฿)",
         value: summaryCod,
      },
      {
         label: "ราคารวมสุทธิ(฿)",
         value: Math.round(totalBalance),
      },
   ].filter((item) => item.value !== 0)

   summary = summary.length === 3 ? [summary[0], summary[2]] : summary

   const title = `${user.username} รอบเรือ ${voyage}`
   return (
      <div className="w-screen h-screen bg-gray-100 overflow-x-hidden overflow-y-auto">
         {loading && (
            <div className="fixed top-0 left-0 right-0 bottom-0 bg-[rgba(0,0,0,0.5)] z-10">
               <div className="fixed top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%]">
                  <Spin size="large" />
               </div>
            </div>
         )}
         <div className="w-[90vw] mx-auto bg-white pt-2 px-6 pb-6">
            <div className="w-full pt-3 bg-gray-200 rounded-md px-2">
               <div className="w-full font-bold text-[1.2rem] p-2 underline">
                  วางบิลรอบเรือ {voyage}
               </div>
               <div className="w-full grid grid-cols-2">
                  <div className="w-[500px] p-2">
                     <div className="flex mb-1">
                        <div className="font-bold w-[100px]">ชื่อลูกค้า:</div>
                        {user?.username}
                     </div>
                     <div className="flex mb-1">
                        <div className="font-bold w-[100px]">เบอร์:</div>
                        {user?.phone}
                     </div>
                     <div className="flex mb-1">
                        <div className="font-bold w-[100px]">ที่อยู่:</div>
                        {user?.address}
                     </div>
                     <div className="flex mb-1">
                        <div className="font-bold w-[100px]">คะแนนเก่า:</div>
                        {user?.point_last} คะแนน
                     </div>
                     <div className="flex mb-1">
                        <div className="font-bold w-[100px]">คะเเนนล่าสุด:</div>
                        {pointCurrent} คะแนน
                     </div>
                     <br />
                  </div>
                  <div className="w-[350px]">
                     <div className="flex items-center mb-1">
                        <div className="font-bold w-[80px]">ฐานค่าส่ง: </div>
                        <InputNumber
                           className="w-[120px] me-2"
                           addonAfter="฿"
                           value={scoreBaseRate.rate}
                           onChange={(value) =>
                              setScoreBaseRate((prev) => ({
                                 ...prev,
                                 rate: value,
                              }))
                           }
                        />
                        <Button type="primary" onClick={handleUpdateRate}>
                           ยืนยัน
                        </Button>
                     </div>
                     <div className="flex items-center mb-1">
                        <div className="font-bold w-[80px]">ค่าส่ง: </div>
                        <InputNumber
                           className="w-[120px] me-2"
                           addonAfter="฿"
                           value={costDelivery}
                           onChange={(value) => setCostdDelivery(value)}
                        />
                        <Button type="primary" onClick={handleSaveCostDelivery}>
                           ยืนยัน
                        </Button>
                     </div>
                     <div className="flex items-center mb-2">
                        <div className="font-bold w-[80px]">ส่วนลด: </div>
                        <InputNumber
                           className="w-[120px] me-2"
                           addonAfter="฿"
                           value={discount}
                           onChange={(value) => setDiscount(value)}
                        />
                        <Button type="primary" onClick={handleSaveDiscount}>
                           ยืนยัน
                        </Button>
                     </div>
                     <div className="flex items-center">
                        <Checkbox
                           className="me-2"
                           checked={checkDiscount}
                           onChange={(e) =>
                              handleCheckDiscount(e.target.checked)
                           }
                        />
                        ส่วนลด 5%
                     </div>
                     <div className="flex items-center">
                        <Checkbox
                           className="me-2"
                           checked={isEmployeeRate}
                           onChange={(e) =>
                              handleCheckEmployeeRate(e.target.checked)
                           }
                        />
                        ราคาพนักงาน
                     </div>
                  </div>
               </div>
            </div>
            <Collapse accordion className="mt-3">
               <Collapse.Panel header="ดูสรุปข้อมูล(PDF)">
                  <ReportShipBillingInvoice
                     data={data}
                     summary={summary}
                     title={title}
                     voyage={voyage}
                     user={user}
                  />
               </Collapse.Panel>
            </Collapse>
            <Divider
               orientation="left"
               style={{ fontSize: "1rem", fontWeight: "bold" }}
            >
               รายการสินค้า
            </Divider>
            <div>
               <Table columns={columns} dataSource={data} />
               <Modal
                  open={openModal}
                  onCancel={() => setOpenModal(false)}
                  onOk={handleSaveCod}
                  confirmLoading={confirmLoading}
               >
                  <input
                     value={selectRow?.cod}
                     onChange={(e) =>
                        setSelectRow((prev) => ({
                           ...prev,
                           cod: e.target.value,
                        }))
                     }
                  />
               </Modal>
            </div>
            <div>
               <div className="w-[575px] flex items-center gap-2 justify-end mb-2">
                  {bill.voyage_price === null || bill.voyage_price === "" ? (
                     <div className="text-gray-500 flex-1 text-left">
                        ยังไม่ได้ทำการบันทึกค่าเรือ
                     </div>
                  ) : (
                     <div className="text-green-500 flex-1 text-left">
                        ค่าเรือที่ถูกบันทึก{" "}
                        {(Math.round(totalBalance) || 0).toLocaleString("th-TH", {
                           minimumFractionDigits: 2,
                           style: "currency",
                           currency: "THB",
                        })}
                     </div>
                  )}
                  <Button onClick={() => handleSaveVoyagePrice(Math.round(totalBalance))}>
                     บันทึกค่าเรือ
                  </Button>
                  <Button type="dashed" danger onClick={handleResetVoyagePrice}>
                     reset
                  </Button>
               </div>
               <table className="text-center">
                  <thead className="text-center ">
                     <tr>
                        <th
                           colSpan={7}
                           className="border-solid border-[0.5px] border-gray-400 py-2"
                        >
                           <span className="text-[1.4rem]">
                              {user.username}
                           </span>{" "}
                           รอบเรือ( {voyage} )
                        </th>
                     </tr>
                     <tr>
                        <th className="border-solid border-[0.5px] border-gray-400 px-4 py-2">
                           #
                        </th>
                        <th className="border-solid border-[0.5px] border-gray-400 px-4 py-2">
                           ช่องทาง
                        </th>
                        <th className="border-solid border-[0.5px] border-gray-400 px-4 py-2">
                           Track No.
                        </th>
                        <th className="border-solid border-[0.5px] border-gray-400 px-4 py-2">
                           Box No.
                        </th>
                        <th className="border-solid border-[0.5px] border-gray-400 px-4 py-2">
                           น้ำหนัก(Kg.)
                        </th>
                        {/* <th className="border-solid border-[0.5px] border-gray-400 px-4 py-2">
                           ราคา(฿)
                        </th> */}
                        <th className="border-solid border-[0.5px] border-gray-400 px-4 py-2">
                           COD(¥)
                        </th>
                     </tr>
                  </thead>
                  <tbody>
                     {data
                        .sort((a, b) => {
                           const priority_a =
                              a.channel === "mercari"
                                 ? 1
                                 : a.channel === "fril"
                                 ? 2
                                 : a.channel === "shimizu"
                                 ? 3
                                 : a.channel === "yahoo"
                                 ? 4
                                 : a.channel === "123"
                                 ? 5
                                 : 6
                           const priority_b =
                              b.channel === "mercari"
                                 ? 1
                                 : b.channel === "fril"
                                 ? 2
                                 : b.channel === "shimizu"
                                 ? 3
                                 : b.channel === "yahoo"
                                 ? 4
                                 : b.channel === "123"
                                 ? 5
                                 : 6
                           return priority_a - priority_b
                        })
                        .map((item, index, arr) => {
                           seq += 1
                           if (
                              item.channel === "mercari" ||
                              item.channel === "fril"
                           ) {
                              return (
                                 <tr key={`TrInvoice-${item.id}-${index}`}>
                                    <td className="border-solid border-[0.5px] border-gray-400 px-4 py-2">
                                       {seq}
                                    </td>
                                    <td className="border-solid border-[0.5px] border-gray-400 px-4 py-2">
                                       {item.channel}
                                    </td>
                                    <td className="border-solid border-[0.5px] border-gray-400 px-4 py-2">
                                       {item.track_no}
                                    </td>
                                    <td className="border-solid border-[0.5px] border-gray-400 px-4 py-2">
                                       {item.box_no}
                                    </td>
                                    <td className="border-solid border-[0.5px] border-gray-400 px-4 py-2 text-right">
                                       {item.weight}
                                    </td>
                                    {/* <td className="border-solid border-[0.5px] border-gray-400 px-4 py-2 bg-slate-100">
                                       {new Intl.NumberFormat("th-TH", {
                                          currency: "THB",
                                          style: "currency",
                                       }).format(
                                          Math.floor(CalMerFril(item.weight))
                                       )}
                                    </td> */}
                                    <td className="border-solid border-[0.5px] border-gray-400 px-4 py-2 text-right">
                                       {/* {new Intl.NumberFormat("th-TH", {
                                          currency: "THB",
                                          style: "currency",
                                       }).format(item.cod * item.rate_yen)} */}
                                       {(item?.cod || 0).toLocaleString()}
                                    </td>
                                 </tr>
                              )
                           }
                           let showSum = false
                           const channel = item.channel
                           if (
                              ["shimizu", "123", "yahoo"].find(
                                 (fi) => fi === item.channel
                              ) !== undefined
                           ) {
                              if (index + 1 < arr.length) {
                                 if (item.channel !== arr[index + 1].channel) {
                                    showSum = true
                                 }
                              }
                              if (index + 1 === arr.length) {
                                 showSum = true
                              }
                           }
                           return (
                              <>
                                 <tr
                                    key={`TrInvoice-${item.id}-${index}`}
                                    className=""
                                 >
                                    <td className="border-solid border-[0.5px] border-gray-400 px-4 py-2">
                                       {seq}
                                    </td>
                                    <td className="border-solid border-[0.5px] border-gray-400 px-4 py-2">
                                       {item.channel}
                                    </td>
                                    <td className="border-solid border-[0.5px] border-gray-400 px-4 py-2">
                                       {item.track_no}
                                    </td>
                                    <td className="border-solid border-[0.5px] border-gray-400 px-4 py-2">
                                       {item.box_no}
                                    </td>
                                    <td className="border-solid border-[0.5px] border-gray-400 px-4 py-2 text-right">
                                       {item.weight}
                                    </td>
                                    {/* <td className="border-solid border-[0.5px] border-gray-400 px-4 py-2 bg-slate-100">
                                       -
                                    </td> */}
                                    <td className="border-solid border-[0.5px] border-gray-400 px-4 py-2 text-right">
                                       {/* {new Intl.NumberFormat("th-TH", {
                                          currency: "THB",
                                          style: "currency",
                                       }).format(item.cod * item.rate_yen)} */}
                                       {(item?.cod || 0).toLocaleString()}
                                    </td>
                                 </tr>
                                 {/* {showSum && (
                                    <tr>
                                       <th
                                          colSpan={5}
                                          className="border-solid border-[0.5px] border-gray-400 px-4 py-2"
                                       >
                                          รวมราคา(
                                          {channel === "123"
                                             ? "web123"
                                             : channel}
                                          )
                                       </th>
                                       <td className="border-solid border-[0.5px] border-gray-400 px-4 py-2">
                                          {new Intl.NumberFormat("th-TH", {
                                             currency: "THB",
                                             style: "currency",
                                          }).format(
                                             Math.ceil(
                                                sum_channel[
                                                   channel === "123"
                                                      ? "web123"
                                                      : channel
                                                ]?.price
                                             )
                                          )}
                                       </td>
                                    </tr>
                                 )} */}
                              </>
                           )
                        })}
                  </tbody>
                  <tfoot>
                     {summary.map((item, index) => {
                        return renderSummary(item.label, item.value)
                     })}
                  </tfoot>
                  {/* <tfoot>
                     <tr>
                        {checkDiscount ? (
                           <>
                              <td colSpan={2}></td>
                              <th
                                 colSpan={1}
                                 className="border-solid border-[0.5px] border-gray-400 px-4 py-2"
                              >
                                 ส่วนลด 5%:
                              </th>
                              <td
                                 colSpan={1}
                                 className="border-solid border-[0.5px] border-gray-400 px-4 py-2"
                              >
                                 {new Intl.NumberFormat("th-TH", {
                                    currency: "THB",
                                    style: "currency",
                                 }).format(
                                    Math.ceil(
                                       (sum_channel.mercari.price +
                                          sum_channel.fril.price +
                                          sum_channel.shimizu.price +
                                          sum_channel.yahoo.price +
                                          sum_channel.mart.price +
                                          sum_channel.web123.price) *
                                          5
                                    ) / 100
                                 )}
                              </td>
                           </>
                        ) : (
                           <td colSpan={4}></td>
                        )}
                        <th
                           colSpan={1}
                           className="border-solid border-[0.5px] border-gray-400 px-4 py-2"
                        >
                           ราคารวม(ทุกช่องทาง):{" "}
                        </th>
                        <td
                           colSpan={1}
                           className="border-solid border-[0.5px] border-gray-400 px-4 py-2"
                        >
                           {new Intl.NumberFormat("th-TH", {
                              currency: "THB",
                              style: "currency",
                           }).format(
                              Math.ceil(
                                 sum_channel.mercari.price +
                                    sum_channel.fril.price +
                                    sum_channel.shimizu.price +
                                    sum_channel.yahoo.price +
                                    sum_channel.mart.price +
                                    sum_channel.web123.price
                              )
                           )}
                        </td>
                     </tr>
                     <tr>
                        <td colSpan={4} className=""></td>
                        <th
                           colSpan={1}
                           className="border-solid border-[0.5px] border-gray-400 px-4 py-2"
                        >
                           ค่าส่ง:
                        </th>
                        <td
                           colSpan={1}
                           className="border-solid border-[0.5px] border-gray-400 px-4 py-2"
                        >
                           {new Intl.NumberFormat("th-TH", {
                              currency: "THB",
                              style: "currency",
                           }).format(parseFloat(costDelivery, 10))}
                        </td>
                     </tr>

                     {discount === 0 ? undefined : (
                        <tr>
                           <td colSpan={4} className=""></td>
                           <th
                              colSpan={1}
                              className="border-solid border-[0.5px] border-gray-400 px-4 py-2"
                           >
                              ส่วนลด:
                           </th>
                           <td
                              colSpan={1}
                              className="border-solid border-[0.5px] border-gray-400 px-4 py-2"
                           >
                              {new Intl.NumberFormat("th-TH", {
                                 currency: "THB",
                                 style: "currency",
                              }).format(parseFloat(discount, 10))}
                           </td>
                        </tr>
                     )}
                     <tr>
                        <td colSpan={4} className=""></td>
                        <th
                           colSpan={1}
                           className="border-solid border-[0.5px] border-gray-400 px-4 py-2"
                        >
                           ราคาสุทธิ(฿):{" "}
                        </th>
                        <td
                           colSpan={1}
                           style={{
                              borderBottom: "5px double black",
                              borderRight: "0.5px solid black",
                           }}
                        >
                           {voyagePriceShow}
                        </td>
                     </tr>
                  </tfoot> */}
               </table>
            </div>
            {/* {renderPdf()} */}
         </div>
      </div>
   )
}

InvoicePage.getInitialProps = async ({ query }) => {
   const { user_id, voyage } = query

   return { user_id, voyage }
}

export default InvoicePage
