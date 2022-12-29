/* eslint-disable indent */
/* eslint-disable no-else-return */
/* eslint-disable prefer-destructuring */
import { message, Modal, Table } from "antd"
import { useRouter } from "next/router"
import React, { useEffect, useRef, useState } from "react"

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

function CalBaseRateByWeight(weight) {
   if (weight >= 100) {
      return 140
   } else if (weight >= 50 && weight < 100) {
      return 160
   } else if (weight >= 10 && weight < 50) {
      return 180
   }
   return 200
}
function InvoicePage({ user_id, voyage }) {
   const router = useRouter()
   const [data, setData] = useState([])
   const [bill, setBill] = useState({})
   const [discount, setDiscount] = useState(0)
   const [checkDiscount, setCheckDiscount] = useState(false)
   const [costDelivery, setCostdDelivery] = useState(0)
   const [user, setUser] = useState({})
   const [scoreBaseRate, setScoreBaseRate] = useState({ rate: 0, min: false })
   let seq = 0
   const [sumTable, setSumTable] = useState({
      mercari: { price: 0, weight: 0 },
      fril: { price: 0, weight: 0 },
      shimizu: { price: 0 },
      web123: { price: 0 },
      yahoo: { price: 0 },
      mart: { price: 0 },
   })
   const [selectRow, setSelectRow] = useState()
   const [openModal, setOpenModal] = useState(false)
   const codRef = useRef()
   const handleSaveCod = async () => {
      const response = await fetch(`/api/tracking?id=${selectRow?.id}`, {
         method: "PATCH",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify({ cod: codRef.current.value }),
      })
      message.success("success!")
      setData((prev) => {
         const temp = prev.reduce((a, c) => {
            if (c.id === selectRow.id) {
               return [...a, { ...c, cod: codRef.current.value }]
            }
            return [...a, c]
         }, [])
         return temp
      })
   }
   const handleSaveCostDelivery = async () => {
      const response = await fetch(`/api/shipbilling?id=${bill?.id}`, {
         method: "PATCH",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify({ cost_delivery: costDelivery }),
      })
      const responseJson = await response.json()
      message.success("success!")
   }
   const handleSaveDiscount = async () => {
      const response = await fetch(`/api/shipbilling?id=${bill?.id}`, {
         method: "PATCH",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify({ discount }),
      })
      const responseJson = await response.json()
      message.success("success!")
   }
   const handleCheckDiscount = async (checked) => {
      const response = await fetch(`/api/shipbilling?id=${bill?.id}`, {
         method: "PATCH",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify({ check: checked ? 1 : 0 }),
      })
      const responseJson = await response.json()
      message.success("success!")
      setCheckDiscount(checked)
   }
   useEffect(() => {
      ;(async () => {
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
         const responseJson = await response.json()
         console.log(responseJson)
         const { trackings } = await responseJson
         setData(responseJson.trackings)
         setBill(responseJson.billing)
         setDiscount(responseJson.billing?.discount)
         setCostdDelivery(
            responseJson.billing?.cost_delivery === undefined
               ? 0
               : responseJson.billing?.cost_delivery
         )
         console.log(responseJson.billing?.cost_delivery)
         setUser(responseJson.user)
         const baseRate1 = CalBaseRate(
            responseJson.user?.point_last,
            responseJson.user
         )
         const baseRate2 = CalBaseRate(
            responseJson.user?.point_last,
            responseJson.user
         )
         const baseRate =
            baseRate1.rate < baseRate2.rate ? baseRate1 : baseRate2
         setScoreBaseRate(baseRate)
         setCheckDiscount(responseJson.billing?.check === 1)
         const sum_channel = ["yahoo", "shimizu", "mart", "123"].reduce(
            (a, c) => {
               const sum_weight_cod = trackings
                  .filter((ft) => ft.channel === c)
                  .reduce(
                     (a1, c1) => ({
                        weight: a1.weight + c1.weight,
                        cod: a1.cod + c1.cod * c1.rate_yen,
                     }),
                     { weight: 0, cod: 0 }
                  )
               const price = [sum_weight_cod].reduce((a2, c2) => {
                  // console.log(c2)
                  if (c2.weight === 0) {
                     return a2
                  }
                  if (baseRate.min && c2.weight < 1) {
                     return 200 + c2.cod
                  }
                  const baseRateByWeight = CalBaseRateByWeight(c.weight)
                  const rate =
                     baseRate.rate < baseRateByWeight
                        ? baseRate.rate
                        : baseRateByWeight
                  return c2.weight * rate + c2.cod
               }, 0)
               return {
                  ...a,
                  [c === "123" ? "web123" : c]: {
                     price,
                  },
               }
            },
            trackings
               .filter(
                  (ft) => ft.channel === "mercari" || ft.channel === "fril"
               )
               .reduce(
                  (a, c) => ({
                     ...a,
                     [c.channel]: {
                        price:
                           c.weight < 1
                              ? a[c.channel].price
                              : a[c.channel].price +
                                (c.weight - 1) * 200 +
                                c.cod * c.rate_yen,
                        weight:
                           c.weight < 1
                              ? a[c.channel].weight
                              : a[c.channel].weight +
                                (c.weight === undefined ? 0 : c.weight) -
                                1,
                     },
                  }),
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
         // console.log(sum_channel)
         setSumTable(sum_channel)
      })()
   }, [])
   const columns = [
      {
         title: "วันที่",
         dataIndex: "created_at",
         width: "120px",
         key: "created_at",
      },
      {
         title: "ช่องทาง",
         dataIndex: "channel",
         width: "120px",
         key: "channel",
      },
      {
         title: "Track No.",
         dataIndex: "track_no",
         width: "120px",
         key: "track_no",
      },
      {
         title: "Box No.",
         dataIndex: "box_no",
         width: "120px",
         key: "box_no",
      },
      {
         title: "COD(¥)",
         dataIndex: "cod",
         width: "120px",
         key: "cod",
      },
      {
         title: "แก้ไข COD",
         dataIndex: "id",
         width: "80px",
         key: "id",
         fixed: "right",
         render: (id) => (
            <button
               onClick={() => {
                  setSelectRow(data.filter((ft) => ft.id === id)[0])
                  setOpenModal(true)
               }}
            >
               manage
            </button>
         ),
      },
   ]
   return (
      <div className="w-[90vw] mx-auto">
         <button
            className="bg-black text-white p-2 mt-3 fixed top-2 left-3 z-10"
            onClick={() => router.push("/shipbilling")}
         >
            {"<<"} ย้อนกลับ
         </button>
         <div className="flex px-4 py-2">
            <p className="w-[40%]">
               <span>ชื่อลูกค้า: </span>
               {user?.username}
               <br />
               <span>เบอร์: </span>
               {user?.phone}
               <br />
               <span>ที่อยู่: </span>
               {user?.address}
            </p>
            <p className="w-[40%]">
               <span>คะแนนเก่า: </span>
               {user?.point_last}
               <br />
               <span>คะเเนนล่าสุด: </span>
               {user?.point_current}
               <br />
               <span>ฐานค่าส่ง: </span>
               {scoreBaseRate.rate} บาท
               <br />
               <span>ค่าส่ง: </span>
               <input
                  type="number"
                  className="border border-black border-solid"
                  value={costDelivery}
                  onChange={(e) => setCostdDelivery(e.target.value)}
               />
               <button onClick={handleSaveCostDelivery}>ยืนยัน</button> บาท
               <br />
               <span>ส่วนลด: </span>
               <input
                  type="number"
                  className="border border-black border-solid"
                  value={discount}
                  onChange={(e) => setDiscount(e.target.value)}
               />
               <button onClick={handleSaveDiscount}>ยืนยัน</button> บาท
               <br />
               <label>
                  <input
                     type="checkbox"
                     checked={checkDiscount}
                     onChange={(e) => handleCheckDiscount(e.target.checked)}
                  />
                  ส่วนลด 5%
               </label>
            </p>
         </div>
         <div>
            <Table
               columns={columns}
               dataSource={data}
               scroll={{
                  x: 1500,
                  y: 450,
               }}
            />
            <Modal
               open={openModal}
               onCancel={() => setOpenModal(false)}
               onOk={handleSaveCod}
            >
               <input ref={codRef} />
            </Modal>
         </div>
         <div className="Invoice-body pb-6">
            <table className="w-full  text-[#DBDDD0] border-separate border-spacing-[1px] text-center">
               <thead className="text-center">
                  <tr className="bg-[#4E514E]">
                     <th colSpan={7}>
                        {user.username} {voyage}
                     </th>
                  </tr>
                  <tr className="bg-[#666666]">
                     <th>#</th>
                     <th>ช่องทาง</th>
                     <th>Track No.</th>
                     <th>Box No.</th>
                     <th>น้ำหนัก(กก.)</th>
                     <th className="w-[200px]">ราคา(฿)</th>
                     <th>COD(¥)</th>
                  </tr>
               </thead>
               <tbody>
                  {data
                     .filter((ft) => ft.channel === "mercari")
                     .map((item, index) => {
                        seq += 1
                        if (
                           index ===
                           data.filter((ft) => ft.channel === "mercari")
                              .length -
                              1
                        ) {
                           return (
                              <>
                                 <tr
                                    key={item.id}
                                    className="bg-[#DBDDD0] text-[#4E514E]"
                                 >
                                    <td className="text-center">{seq}</td>
                                    <td>{index === 0 ? item.channel : null}</td>
                                    <td>{item.track_no}</td>
                                    <td>{item.box_no}</td>
                                    <td>
                                       Cal:{" "}
                                       {item.weight < 1
                                          ? 0
                                          : Math.round(
                                               (item.weight - 1) * 100
                                            ) / 100}{" "}
                                       ({item.weight})
                                    </td>
                                    <td>
                                       {item.weight < 1
                                          ? 0
                                          : (Math.round(
                                               (item.weight - 1) * 100
                                            ) /
                                               100) *
                                            200}
                                    </td>
                                    <td className="border-2 border-solid border-t-0 border-l-0 border-r-0">
                                       {item.cod}
                                    </td>
                                 </tr>
                                 <tr className="bg-[#DBDDD0] text-[#4E514E]">
                                    <td
                                       colSpan={5}
                                       className="bg-[#E0DFDB]"
                                    ></td>
                                    <th colSpan={1}>น้ำหนักรวม: </th>
                                    <td colSpan={1} className="text-center">
                                       {Math.ceil(
                                          sumTable.mercari.weight * 100
                                       ) / 100}
                                    </td>
                                 </tr>
                                 <tr className="bg-[#DBDDD0] text-[#4E514E]">
                                    <td
                                       colSpan={5}
                                       className="bg-[#E0DFDB]"
                                    ></td>
                                    <th colSpan={1}>ราคารวม(mercari): </th>
                                    <td
                                       colSpan={1}
                                       className="border-2 border-solid border-t-0 border-l-0 border-r-0"
                                    >
                                       {Math.ceil(
                                          sumTable.mercari.price * 100
                                       ) / 100}
                                    </td>
                                 </tr>
                              </>
                           )
                        }
                        return (
                           <tr
                              key={item.id}
                              className="bg-[#DBDDD0] text-[#4E514E]"
                           >
                              <td className="text-center">{seq}</td>
                              <td>{index === 0 ? item.channel : null}</td>
                              <td>{item.track_no}</td>
                              <td>{item.box_no}</td>
                              <td>
                                 Cal:{" "}
                                 {item.weight < 1
                                    ? 0
                                    : Math.round((item.weight - 1) * 100) /
                                      100}{" "}
                                 ({item.weight})
                              </td>
                              <td>
                                 {item.weight < 1
                                    ? 0
                                    : (Math.round((item.weight - 1) * 100) /
                                         100) *
                                      200}
                              </td>
                              <td>{item.cod}</td>
                           </tr>
                        )
                     })}
                  {data
                     .filter((ft) => ft.channel === "fril")
                     .map((item, index) => {
                        seq += 1
                        if (
                           index ===
                           data.filter((ft) => ft.channel === "fril").length - 1
                        ) {
                           return (
                              <>
                                 <tr
                                    key={item.id}
                                    className="bg-[#DCDCD0] text-[#4E514E]"
                                 >
                                    <td className="text-center">{seq}</td>
                                    <td>{index === 0 ? item.channel : null}</td>
                                    <td>{item.track_no}</td>
                                    <td>{item.box_no}</td>
                                    <td>
                                       Cal:{" "}
                                       {item.weight < 1
                                          ? 0
                                          : Math.round(
                                               (item.weight - 1) * 100
                                            ) / 100}{" "}
                                       ({item.weight})
                                    </td>
                                    <td>
                                       {item.weight < 1
                                          ? 0
                                          : (Math.round(
                                               (item.weight - 1) * 100
                                            ) /
                                               100) *
                                            200}
                                    </td>
                                    <td className="border-2 border-solid border-t-0 border-l-0 border-r-0">
                                       {item.cod}
                                    </td>
                                 </tr>
                                 <tr className="bg-[#DBDDD0] text-[#4E514E]">
                                    <td
                                       colSpan={5}
                                       className="bg-[#E0DFDB]"
                                    ></td>
                                    <th colSpan={1}>น้ำหนักรวม: </th>
                                    <td colSpan={1} className="text-center">
                                       {Math.ceil(sumTable.fril.weight * 100) /
                                          100}
                                    </td>
                                 </tr>
                                 <tr className="bg-[#DBDDD0] text-[#4E514E]">
                                    <td
                                       colSpan={5}
                                       className="bg-[#E0DFDB]"
                                    ></td>
                                    <th colSpan={1}>ราคารวม(fril): </th>
                                    <td
                                       colSpan={1}
                                       className="border-2 border-solid border-t-0 border-l-0 border-r-0"
                                    >
                                       {Math.ceil(sumTable.fril.price * 100) /
                                          100}
                                    </td>
                                 </tr>
                              </>
                           )
                        }
                        return (
                           <tr key={item.id}>
                              <td>{seq}</td>
                              <td>{index === 0 ? item.channel : null}</td>
                              <td>{item.track_no}</td>
                              <td>{item.box_no}</td>
                              <td>
                                 Cal:{" "}
                                 {item.weight < 1
                                    ? 0
                                    : Math.round((item.weight - 1) * 100) /
                                      100}{" "}
                                 ({item.weight})
                              </td>
                              <td>
                                 {item.weight < 1
                                    ? 0
                                    : (Math.round((item.weight - 1) * 100) /
                                         100) *
                                      200}
                              </td>
                              <td>{item.cod}</td>
                           </tr>
                        )
                     })}
                  {data
                     .filter((ft) => ft.channel === "shimizu")
                     .map((item, index) => {
                        seq += 1
                        if (
                           index ===
                           data.filter((ft) => ft.channel === "shimizu")
                              .length -
                              1
                        ) {
                           return (
                              <>
                                 <tr
                                    key={item.id}
                                    className="bg-[#DBDDD0] text-[#4E514E]"
                                 >
                                    <td>{seq}</td>
                                    <td>{index === 0 ? item.channel : null}</td>
                                    <td>{item.track_no}</td>
                                    <td>{item.box_no}</td>
                                    <td>{item.weight}</td>
                                    <td>-</td>
                                    <td className="border-2 border-solid border-t-0 border-l-0 border-r-0">
                                       {item.cod}
                                    </td>
                                 </tr>
                                 <tr className="bg-[#DBDDD0] text-[#4E514E]">
                                    <td
                                       colSpan={5}
                                       className="bg-[#E0DFDB]"
                                    ></td>
                                    <th colSpan={1}>ราคารวม(shimizu): </th>
                                    <td
                                       colSpan={1}
                                       className="border-2 border-solid border-t-0 border-l-0 border-r-0"
                                    >
                                       {Math.ceil(
                                          sumTable.shimizu.price * 100
                                       ) / 100}
                                    </td>
                                 </tr>
                              </>
                           )
                        }
                        return (
                           <tr
                              key={item.id}
                              className="bg-[#DBDDD0] text-[#4E514E]"
                           >
                              <td>{seq}</td>
                              <td>{index === 0 ? item.channel : null}</td>
                              <td>{item.track_no}</td>
                              <td>{item.box_no}</td>
                              <td>{item.weight}</td>
                              <td>-</td>
                              <td>{item.cod}</td>
                           </tr>
                        )
                     })}
                  {data
                     .filter((ft) => ft.channel === "yahoo")
                     .map((item, index) => {
                        seq += 1
                        if (
                           index ===
                           data.filter((ft) => ft.channel === "yahoo").length -
                              1
                        ) {
                           return (
                              <>
                                 <tr
                                    key={item.id}
                                    className="bg-[#DBDDD0] text-[#4E514E]"
                                 >
                                    <td>{seq}</td>
                                    <td>{index === 0 ? item.channel : null}</td>
                                    <td>{item.track_no}</td>
                                    <td>{item.box_no}</td>
                                    <td>{item.weight}</td>
                                    <td>-</td>
                                    <td className="border-2 border-solid border-t-0 border-l-0 border-r-0">
                                       {item.cod}
                                    </td>
                                 </tr>
                                 <tr className="bg-[#DBDDD0] text-[#4E514E]">
                                    <td
                                       colSpan={5}
                                       className="bg-[#E0DFDB]"
                                    ></td>
                                    <th colSpan={1}>ราคารวม(yahoo): </th>
                                    <td
                                       colSpan={1}
                                       className="border-2 border-solid border-t-0 border-l-0 border-r-0"
                                    >
                                       {Math.ceil(sumTable.yahoo.price * 100) /
                                          100}
                                    </td>
                                 </tr>
                              </>
                           )
                        }
                        return (
                           <tr
                              key={item.id}
                              className="bg-[#DBDDD0] text-[#4E514E]"
                           >
                              <td>{seq}</td>
                              <td>{index === 0 ? item.channel : null}</td>
                              <td>{item.track_no}</td>
                              <td>{item.box_no}</td>
                              <td>{item.weight}</td>
                              <td>-</td>
                              <td>{item.cod}</td>
                           </tr>
                        )
                     })}
                  {data
                     .filter((ft) => ft.channel === "mart")
                     .map((item, index) => {
                        seq += 1
                        if (
                           index ===
                           data.filter((ft) => ft.channel === "mart").length - 1
                        ) {
                           return (
                              <>
                                 <tr
                                    key={item.id}
                                    className="bg-[#DBDDD0] text-[#4E514E]"
                                 >
                                    <td>{seq}</td>
                                    <td>{index === 0 ? item.channel : null}</td>
                                    <td>{item.track_no}</td>
                                    <td>{item.box_no}</td>
                                    <td>{item.weight}</td>
                                    <td>-</td>
                                    <td className="border-2 border-solid border-t-0 border-l-0 border-r-0">
                                       {item.cod}
                                    </td>
                                 </tr>
                                 <tr className="bg-[#DBDDD0] text-[#4E514E]">
                                    <td
                                       colSpan={5}
                                       className="bg-[#E0DFDB]"
                                    ></td>
                                    <th colSpan={1}>ราคารวม(mart): </th>
                                    <td
                                       colSpan={1}
                                       className="border-2 border-solid border-t-0 border-l-0 border-r-0"
                                    >
                                       {Math.ceil(sumTable.mart.price * 100) /
                                          100}
                                    </td>
                                 </tr>
                              </>
                           )
                        }
                        return (
                           <tr
                              key={item.id}
                              className="bg-[#DBDDD0] text-[#4E514E]"
                           >
                              <td>{seq}</td>
                              <td>{index === 0 ? item.channel : null}</td>
                              <td>{item.track_no}</td>
                              <td>{item.box_no}</td>
                              <td>{item.weight}</td>
                              <td>-</td>
                              <td>{item.cod}</td>
                           </tr>
                        )
                     })}
                  {data
                     .filter((ft) => ft.channel === "123")
                     .map((item, index) => {
                        seq += 1
                        if (
                           index ===
                           data.filter((ft) => ft.channel === "123").length - 1
                        ) {
                           return (
                              <>
                                 <tr
                                    key={item.id}
                                    className="bg-[#DBDDD0] text-[#4E514E]"
                                 >
                                    <td>{seq}</td>
                                    <td>{index === 0 ? item.channel : null}</td>
                                    <td>{item.track_no}</td>
                                    <td>{item.box_no}</td>
                                    <td>{item.weight}</td>
                                    <td>-</td>
                                    <td className="border-2 border-solid border-t-0 border-l-0 border-r-0">
                                       {item.cod}
                                    </td>
                                 </tr>
                                 <tr className="bg-[#DBDDD0] text-[#4E514E]">
                                    <td
                                       colSpan={5}
                                       className="bg-[#E0DFDB]"
                                    ></td>
                                    <th colSpan={1}>ราคารวม(web123): </th>
                                    <td
                                       colSpan={1}
                                       className="border-2 border-solid border-t-0 border-l-0 border-r-0"
                                    >
                                       {Math.ceil(sumTable.web123.price * 100) /
                                          100}
                                    </td>
                                 </tr>
                              </>
                           )
                        }
                        return (
                           <tr
                              key={item.id}
                              className="bg-[#DBDDD0] text-[#4E514E]"
                           >
                              <td>{seq}</td>
                              <td>{index === 0 ? "web123" : null}</td>
                              <td>{item.track_no}</td>
                              <td>{item.box_no}</td>
                              <td>{item.weight}</td>
                              <td>-</td>
                              <td>{item.cod}</td>
                           </tr>
                        )
                     })}
               </tbody>
               <tfoot className="bg-[#DBDDD0] text-[#4E514E]">
                  <tr>
                     <td colSpan={5} className="bg-[#666666]"></td>
                     <th colSpan={1}>ราคารวม(ทุกช่องทาง): </th>
                     <td colSpan={1}>
                        {sumTable.mercari.price +
                           sumTable.fril.price +
                           sumTable.shimizu.price +
                           sumTable.yahoo.price +
                           sumTable.mart.price +
                           sumTable.web123.price}
                     </td>
                  </tr>
                  <tr>
                     <td colSpan={5} className="bg-[#666666]"></td>
                     <th colSpan={1}>ค่าส่ง:</th>
                     <td colSpan={1}>{costDelivery}</td>
                  </tr>
                  {checkDiscount && (
                     <tr>
                        <td colSpan={5} className="bg-[#666666]"></td>
                        <th colSpan={1}>ส่วนลด 5%:</th>
                        <td colSpan={1}>
                           {Math.floor(
                              (sumTable.mercari.price +
                                 sumTable.fril.price +
                                 sumTable.shimizu.price +
                                 sumTable.yahoo.price +
                                 sumTable.mart.price +
                                 sumTable.web123.price) *
                                 5
                           ) / 100}
                        </td>
                     </tr>
                  )}
                  <tr>
                     <td colSpan={5} className="bg-[#666666]"></td>
                     <th colSpan={1}>ส่วนลด:</th>
                     <td colSpan={1}>{discount}</td>
                  </tr>
                  <tr>
                     <td colSpan={5} className="bg-[#666666]"></td>
                     <th colSpan={1}>ราคาสุทธิ(฿): </th>
                     <td
                        colSpan={1}
                        className="border-4 border-double border-t-0 border-l-0 border-r-0"
                     >
                        {sumTable.mercari.price +
                           sumTable.fril.price +
                           sumTable.shimizu.price +
                           sumTable.yahoo.price +
                           sumTable.mart.price +
                           sumTable.web123.price +
                           costDelivery -
                           discount -
                           (checkDiscount
                              ? Math.floor(
                                   (sumTable.mercari.price +
                                      sumTable.fril.price +
                                      sumTable.shimizu.price +
                                      sumTable.yahoo.price +
                                      sumTable.mart.price +
                                      sumTable.web123.price) *
                                      5
                                ) / 100
                              : 0)}
                     </td>
                  </tr>
               </tfoot>
            </table>
         </div>
      </div>
   )
}

InvoicePage.getInitialProps = async ({ query }) => {
   const { user_id, voyage } = query

   return { user_id, voyage }
}

export default InvoicePage
