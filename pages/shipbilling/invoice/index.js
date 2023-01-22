/* eslint-disable no-nested-ternary */
/* eslint-disable indent */
/* eslint-disable no-else-return */
/* eslint-disable prefer-destructuring */
import { Dropdown, message, Modal, Select, Space, Table } from "antd"
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
   const codRef = useRef()
   let seq = 0
   // const [sumTable, setSumTable] = useState({
   //    mercari: { price: 0, weight: 0 },
   //    fril: { price: 0, weight: 0 },
   //    shimizu: { price: 0 },
   //    web123: { price: 0 },
   //    yahoo: { price: 0 },
   //    mart: { price: 0 },
   // })

   const handleSaveCod = async () => {
      await fetch(`/api/tracking?id=${selectRow?.id}`, {
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
         const { trackings } = await responseJson
         setData([
            ...responseJson.trackings.reduce(
               (a, c, idx) => [...a, { ...c, key: idx }],
               []
            ),
         ])
         setBill(responseJson.billing)
         setDiscount(responseJson.billing?.discount)
         setCostdDelivery(
            responseJson.billing?.cost_delivery === undefined
               ? 0
               : responseJson.billing?.cost_delivery
         )
         setUser(responseJson.user)

         if (responseJson.billing.rate === null) {
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
         } else {
            setScoreBaseRate({ rate: responseJson.billing.rate, min: false })
         }
         setCheckDiscount(responseJson.billing?.check_50 === 1)
      })()
      ;(async () => {
         try {
            const response = await fetch("/api/point", {
               method: "POST",
               headers: {
                  "Content-Type": "application/json",
               },
               body: JSON.stringify({ user_id }),
            })
            const responseJson = await response.json()
            setPointCurrent(responseJson.point)
         } catch (err) {
            console.log(err)
         }
      })()
   }, [])
   let checkShimizu = false
   for (let i = 0; i < data.length; i++) {
      if (data[i].channel !== "shimizu") {
         checkShimizu = false
         break
      } else {
         checkShimizu = true
      }
   }
   const sum_channel = ["yahoo", "shimizu", "mart", "123"].reduce(
      (a, c) => {
         console.log("in")
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
            console.log(baseRateByWeight)
            if (checkShimizu && c2.weight < 0.5) {
               return 100 + c2.cod
            }
            const rate =
               scoreBaseRate.rate < baseRateByWeight
                  ? scoreBaseRate.rate
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
      data
         .filter((ft) => ft.channel === "mercari" || ft.channel === "fril")
         .reduce(
            (a, c) => ({
               ...a,
               [c.channel]: {
                  price:
                     c.weight < 1
                        ? a[c.channel].price + c.cod * c.rate_yen
                        : a[c.channel].price +
                          (c.weight - (deduct ? 0 : 1)) * 200 +
                          c.cod * c.rate_yen,
                  weight:
                     c.weight < 1
                        ? a[c.channel].weight
                        : a[c.channel].weight +
                          (c.weight === undefined ? 0 : c.weight) -
                          (deduct ? 0 : 1),
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
   console.log("deduct: ", deduct)
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
            >
               <input ref={codRef} />
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
                        { label: "หัก 1 kg.", value: false },
                        { label: "ไม่หัก 1 kg.", value: true },
                     ]}
                  />
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
                              <tr key={item.id} className="">
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
                                       item.weight < 1
                                          ? 0
                                          : (item.weight - (deduct ? 0 : 1)) *
                                               200
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
                              <tr key={item.id} className="">
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
                                       {new Intl.NumberFormat("th-TH", {
                                          currency: "THB",
                                          style: "currency",
                                       }).format(
                                          Math.ceil(
                                             parseFloat(
                                                sum_channel[
                                                   channel === "123"
                                                      ? "web123"
                                                      : channel
                                                ]?.price
                                             )
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
                              parseFloat(
                                 sum_channel.mercari.price +
                                    sum_channel.fril.price +
                                    sum_channel.shimizu.price +
                                    sum_channel.yahoo.price +
                                    sum_channel.mart.price +
                                    sum_channel.web123.price,
                                 10
                              )
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

/* {data
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
                                       {new Intl.NumberFormat("th-TH", {
                                          currency: "THB",
                                          style: "currency",
                                       }).format(
                                          Math.ceil(
                                             sumTable.mercari.price * 100
                                          ) / 100
                                       )}
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
                                       {new Intl.NumberFormat("th-TH", {
                                          currency: "THB",
                                          style: "currency",
                                       }).format(
                                          Math.ceil(sumTable.fril.price * 100) /
                                             100
                                       )}
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
                                       {new Intl.NumberFormat("th-TH", {
                                          currency: "THB",
                                          style: "currency",
                                       }).format(
                                          Math.ceil(
                                             sumTable.shimizu.price * 100
                                          ) / 100
                                       )}
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
                                       {new Intl.NumberFormat("th-TH", {
                                          currency: "THB",
                                          style: "currency",
                                       }).format(
                                          Math.ceil(
                                             sumTable.yahoo.price * 100
                                          ) / 100
                                       )}
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
                                       {new Intl.NumberFormat("th-TH", {
                                          currency: "THB",
                                          style: "currency",
                                       }).format(
                                          Math.ceil(sumTable.mart.price * 100) /
                                             100
                                       )}
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
                                       {new Intl.NumberFormat("th-TH", {
                                          currency: "THB",
                                          style: "currency",
                                       }).format(
                                          Math.ceil(
                                             sumTable.web123.price * 100
                                          ) / 100
                                       )}
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
                     })} */
