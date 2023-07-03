/* eslint-disable no-nested-ternary */
/* eslint-disable indent */
/* eslint-disable no-else-return */
/* eslint-disable prefer-destructuring */
import { Button, message, Modal, Select, Space, Table } from "antd"
import React, { useEffect, useRef, useState } from "react"

function CalRate(rate_w, rate_s, deduct) {
   // console.log(deduct)
   const rate = rate_w > rate_s ? rate_s : rate_w
   if (deduct) {
      // console.log(`deduct${rate}`)
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
   const [pointCurrent, setPointCurrent] = useState("loading...")
   const [data, setData] = useState([])
   const [bill, setBill] = useState({})
   const [discount, setDiscount] = useState(0)
   const [checkDiscount, setCheckDiscount] = useState(false)
   const [costDelivery, setCostdDelivery] = useState(0)
   const [user, setUser] = useState({})
   const [scoreBaseRate, setScoreBaseRate] = useState({ rate: 0, min: false })
   const [selectRow, setSelectRow] = useState()
   const [openModal, setOpenModal] = useState(false)
   const [deduct, setDeduct] = useState(false)
   const [confirmLoading, setConfirmLoading] = useState(false)
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
      }finally {
         setConfirmLoading(false)
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
   const handleUpdateRate = async () => {
      console.log(scoreBaseRate.rate)
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
   const handleConfirmDeduct = async () => {
      const response = await fetch(`/api/shipbilling?id=${bill?.id}`, {
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
         console.log("deduct true")
         return weight * rate_use
      }
      if (weight <= 1) {
         return 0
      }
      return Math.ceil((weight - 1) * 200 * 100) / 100
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
         const response2 = await fetch("/api/point", {
            method: "POST",
            headers: {
               "Content-Type": "application/json",
            },
            body: JSON.stringify({ user_id }),
         })
         const response2Json = await response2.json()
         setPointCurrent(response2Json.point)
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
         // console.log(responseJson.user)
         const point_last = responseJson.user?.point_last
         const point_current =
            (response.user?.point_current || 0) + response2Json.point
         const point_use =
            point_current > point_last ? point_current : point_last
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
   const columns = [
      {
         title: "วันที่",
         dataIndex: "date",
         width: "120px",
         key: "date",
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
         title: "หมายเหตุแอดมิน",
         dataIndex: "remark_admin",
         width: "120px",
         key: "remark_admin",
         render: (text) => (text === "" || null ? "-" : text),
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
   // console.log(sum_channel)
   console.log(deduct)
   console.log(deduct === 0 ? false : deduct === 1 ? true : 150)
   return (
      <div className="w-[90vw] mx-auto">
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
               {pointCurrent}
               <br />
               <span>ฐานค่าส่ง: </span>
               {scoreBaseRate.rate} บาท
               <input
                  type="number"
                  value={scoreBaseRate.rate}
                  onChange={(e) =>
                     setScoreBaseRate((prev) => ({
                        ...prev,
                        rate: e.target.value,
                     }))
                  }
               />
               <button onClick={handleUpdateRate}>ยืนยัน</button>
               <br />
               <span>ค่าส่ง: </span>
               <input
                  type="number"
                  className="border border-gray-400 border-solid"
                  value={costDelivery}
                  onChange={(e) => setCostdDelivery(e.target.value)}
               />
               <button onClick={handleSaveCostDelivery}>ยืนยัน</button> บาท
               <br />
               <span>ส่วนลด: </span>
               <input
                  type="number"
                  className="border border-gray-400 border-solid"
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
               confirmLoading={confirmLoading}
            >
               <input
                  value={selectRow?.cod}
                  onChange={(e) =>
                     setSelectRow((prev) => ({ ...prev, cod: e.target.value }))
                  }
               />
            </Modal>
         </div>
         <div className="Invoice-body pb-6">
            <div>
               <Space className="mb-4">
                  <Select
                     style={{ width: "150px" }}
                     value={deduct}
                     onChange={(value) => setDeduct(value)}
                     options={[
                        { label: "หัก 1 kg.", value: 0 },
                        { label: "ไม่หัก 1 kg.", value: 1 },
                        { label: "เรทพนักงาน", value: 150 },
                     ]}
                  />
                  <Button type="primary" onClick={handleConfirmDeduct}>
                     ยืนยัน
                  </Button>
               </Space>
            </div>
            <table className="text-center">
               <thead className="text-center ">
                  <tr>
                     <th
                        colSpan={7}
                        className="border-solid border-[0.5px] border-gray-400 py-2"
                     >
                        <span className="text-[1.4rem]">{user.username}</span>{" "}
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
                        น้ำหนัก(กก.)
                     </th>
                     <th className="border-solid border-[0.5px] border-gray-400 px-4 py-2">
                        ราคา(฿)
                     </th>
                     <th className="border-solid border-[0.5px] border-gray-400 px-4 py-2">
                        COD(฿)
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
                                 <td className="border-solid border-[0.5px] border-gray-400 px-4 py-2">
                                    {item.weight}
                                 </td>
                                 <td className="border-solid border-[0.5px] border-gray-400 px-4 py-2">
                                    {new Intl.NumberFormat("th-TH", {
                                       currency: "THB",
                                       style: "currency",
                                    }).format(
                                       Math.floor(CalMerFril(item.weight))
                                    )}
                                 </td>
                                 <td className="border-solid border-[0.5px] border-gray-400 px-4 py-2">
                                    {new Intl.NumberFormat("th-TH", {
                                       currency: "THB",
                                       style: "currency",
                                    }).format(item.cod * item.rate_yen)}
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
                                 <td className="border-solid border-[0.5px] border-gray-400 px-4 py-2">
                                    {item.weight}
                                 </td>
                                 <td className="border-solid border-[0.5px] border-gray-400 px-4 py-2">
                                    -
                                 </td>
                                 <td className="border-solid border-[0.5px] border-gray-400 px-4 py-2">
                                    {new Intl.NumberFormat("th-TH", {
                                       currency: "THB",
                                       style: "currency",
                                    }).format(item.cod * item.rate_yen)}
                                 </td>
                              </tr>
                              {showSum && (
                                 <tr>
                                    <th
                                       colSpan={5}
                                       className="border-solid border-[0.5px] border-gray-400 px-4 py-2"
                                    >
                                       รวมราคา(
                                       {channel === "123" ? "web123" : channel})
                                    </th>
                                    <td className="border-solid border-[0.5px] border-gray-400 px-4 py-2">
                                       {/* {sum_channel[channel]?.price} */}
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
                              )}
                           </>
                        )
                     })}
               </tbody>
               <tfoot className="">
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
                        {new Intl.NumberFormat("th-TH", {
                           currency: "THB",
                           style: "currency",
                        }).format(
                           Math.ceil(
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
                        )}
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
