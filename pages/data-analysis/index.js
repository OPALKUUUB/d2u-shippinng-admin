/* eslint-disable consistent-return */
/* eslint-disable no-bitwise */
/* eslint-disable no-param-reassign */
/* eslint-disable dot-notation */
/* eslint-disable array-callback-return */
/* eslint-disable prefer-const */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-use-before-define */
import React, { useState } from "react"
import axios from "axios"
import * as xlsx from "xlsx-color"
import { Button, Table } from "antd"
import { FileExcelOutlined } from "@ant-design/icons"
import Layout from "../../components/layout/layout"

function DataAnalysisPage() {
   const [startDate, setStartDate] = useState("")
   const [endDate, setEndDate] = useState("")
   const [data, setData] = useState(null)
   function numToSSColumnLetter(num) {
      let columnLetter = ""
      let t

      while (num > 0) {
         t = (num - 1) % 26
         columnLetter = String.fromCharCode(65 + t) + columnLetter
         num = ((num - t) / 26) | 0
      }
      return columnLetter || undefined
   }
   const getData = async () => {
      console.log("------ Start getData ------")
      try {
         console.log(
            `GET::/api/export/tracking?startDate=${startDate}&endDate=${endDate}`
         )
         const responseData = await axios.get(
            `/api/export/tracking?startDate=${startDate}&endDate=${endDate}`
         )
         console.log("response: ", responseData)
         console.log("data: ", responseData.data)
         setData(responseData.data.data)
      } catch (err) {
         console.log(err)
      } finally {
         console.log("------ end getData ------")
      }
   }

   const handleChangeStartDate = (event) => {
      console.log("------ Start handleChangeStartDate ------")
      console.log("oldStartDate: ", startDate)
      setStartDate(event.target.value)
      console.log("nowStartDate: ", event.target.value)
      console.log("------ End handleChangeStartDate ------")
   }

   const handleChangeEndDate = (event) => {
      console.log("------ Start handleChangeEndDate ------")
      console.log("oldEndDate: ", endDate)
      setEndDate(event.target.value)
      console.log("nowEndDate: ", event.target.value)
      console.log("------ End handleChangeEndDate ------")
   }

   const handleSubmitSearchForm = async (event) => {
      event.preventDefault()
      console.log("------ Start handleSubmitSearchForm ------")
      console.log("startDate: ", startDate)
      console.log("endDate: ", endDate)
      try {
         await getData()
      } catch (error) {
         console.log(error)
      } finally {
         console.log("------ End handleSubmitSearchForm ------")
      }
   }

   const ShowData = () => {
      if (data) {
         return (
            <>
               {data.map((item, index) => (
                  <tr key={index}>
                     <td>{item.date}</td>
                     <td>{item.username}</td>
                     <td>{item.channel}</td>
                     <td>{item.delivery_type}</td>
                     <td>{item.track_no}</td>
                     <td>{item.box_no}</td>
                     <td>{item.weight}</td>
                     <td>{item.price}</td>
                     <td>{item.voyage}</td>
                     <td>{item.remark_admin}</td>
                  </tr>
               ))}
            </>
         )
      }
   }

   const handleExportData = async () => {
      let sheets = []
      let merge = [{ s: { r: 3, c: 0 }, e: { r: 3, c: 9 } }]
      sheets.push([`ตั้งแต่วันที่:  ${startDate}`])
      sheets.push([`ถึงวันที่:    ${endDate} `])
      sheets.push([])
      sheets.push([`รายงานข้อมูลขนส่งของทุกช่องทาง`])
      let wscols = []
      for (let i = 0; i < 10; i++) {
         if (i === 0) {
            wscols.push({ width: 20 })
         } else if (i === 1 || i === 3) {
            wscols.push({ width: 15 })
         } else if (i === 4) {
            wscols.push({ width: 25 })
         } else if (i === 9) {
            wscols.push({ width: 30 })
         } else {
            wscols.push({ width: 10 })
         }
      }
      sheets.push([
         `วันที่`,
         `ชื่อลูกค้า`,
         `ช่องทาง`,
         `ช่องทางจ่ายออก`,
         `Tracking No`,
         `Box No`,
         `น้ำหนัก(kg.)`,
         `ราคา(บาท)`,
         `รอบเรือ`,
         `หมายเหตุ`,
      ])
      data.map((item, index) => {
         let row = []
         row.push(item.date)
         row.push(item.username)
         row.push(item.channel)
         row.push(item.delivery_type)
         row.push(item.track_no)
         row.push(item.box_no)
         row.push(item.weight)
         row.push(item.price)
         row.push(item.voyage)
         row.push(item.remark_admin)
         sheets.push(row)
      })

      let wb = xlsx.utils.book_new()
      let ws = xlsx.utils.aoa_to_sheet(sheets)
      ws["!merges"] = merge
      ws["!cols"] = wscols
      xlsx.utils.book_append_sheet(wb, ws, "รายงานข้อมูลขนส่ง")

      wb.Sheets["รายงานข้อมูลขนส่ง"][`A4`].s = {
         font: {
            sz: "20",
         },
         alignment: {
            horizontal: "center",
         },
      }
      for (let col = 1; col <= 10; col++) {
         wb.Sheets["รายงานข้อมูลขนส่ง"][`${numToSSColumnLetter(col)}5`].s = {
            font: {
               sz: "12",
            },
            alignment: {
               horizontal: "center",
            },
         }
      }
      xlsx.writeFile(
         wb,
         `รายงานข้อมูลขนส่งของทุกช่องทาง_${startDate}_${endDate}.xlsx`
      )
   }

   const columns = [
      {
         title: "วันที่",
         dataIndex: "date",
         width: "120px",
         key: "date",
      },
      {
         title: "ชื่อลูกค้า",
         dataIndex: "username",
         width: "120px",
         key: "username",
      },
      {
         title: "ช่องทาง",
         dataIndex: "channel",
         width: "120px",
         key: "channel",
      },
      {
         title: "ช่องทางจ่ายออก",
         dataIndex: "delivery_type",
         width: "120px",
         key: "delivery_type",
         render: (text) => (text === null || text === "") ? "-" : text
      },
      {
         title: "Tracking No",
         dataIndex: "track_no",
         width: "140px",
         key: "track_no",
         render: (text) => (text === null || text === "") ? "-" : text
      },
      {
         title: "Box No",
         dataIndex: "box_no",
         width: "120px",
         key: "box_no",
         render: (text) => (text === null || text === "") ? "-" : text
      },
      {
         title: "น้ำหนัก(Kg.)",
         dataIndex: "weight",
         width: "120px",
         key: "weight",
         render: (text) => (text === null || text === "") ? "-" : text
      },
      {
         title: "ราคา(บาท)",
         dataIndex: "price",
         width: "120px",
         key: "price",
      },
      {
         title: "รอบเรือ",
         dataIndex: "voyage",
         width: "120px",
         key: "voyage",
         render: (text) => (text === null || text === "") ? "-" : text
      },
      {
         title: "หมายเหตุ",
         dataIndex: "remark_admin",
         width: "300px",
         key: "remark_admin",
         render: (text) => (text === null || text === "") ? "-" : text
      },
   ]
   return (
      <div className="px-5 py-5">
         <div className="w-full bg-white rounded-md p-5 mb-3">
            <form onSubmit={handleSubmitSearchForm} className="flex gap-4">
               <div className="flex gap-1 items-center">
                  <label>วันที่ตั้งแต่:</label>
                  <input
                     type="date"
                     value={startDate}
                     onChange={handleChangeStartDate}
                  />
               </div>
               <div className="flex gap-1 items-center">
                  <label>ถึงวันที่:</label>
                  <input
                     type="date"
                     value={endDate}
                     onChange={handleChangeEndDate}
                  />
               </div>
               <div>
                  <button type="submit">ค้นหา</button>
               </div>
            </form>
         </div>
         <div>
            <Table
               dataSource={data}
               columns={columns}
               scroll={{
                  x: 1500,
                  y: 350,
               }}
            />
            {/* <table>
               <thead>
                  <tr>
                     <th>วันที่</th>
                     <th>ชื่อลูกค้า</th>
                     <th>ช่องทาง</th>
                     <th>ช่องทางจ่ายออก</th>
                     <th>Tracking No</th>
                     <th>Box_no</th>
                     <th>น้ำหนัก</th>
                     <th>ราคา</th>
                     <th>รอบเรือ</th>
                     <th>หมายเหตุ</th>
                  </tr>
               </thead>
               <tbody>
                  <ShowData />
               </tbody>
            </table> */}
         </div>
         <Button type="primary" className="font-bold" icon={<FileExcelOutlined />} onClick={handleExportData}>
            Export
         </Button>
      </div>
   )
}

export default DataAnalysisPage

DataAnalysisPage.getLayout = function getLayout(page) {
   return <Layout>{page}</Layout>
}

const mockup_data = [
   {
      date: "17/06/2023",
      username: "opal",
      channel: "yahoo",
      delivery_type: "9980",
      track_no: "111111",
      box_no: "100",
      weight: 10,
      price: 1000,
      round_boat: "20/06/2023",
      remark: "this is a fake data",
   },
   {
      date: "17/06/2023",
      username: "opal",
      channel: "yahoo",
      delivery_type: "9980",
      track_no: "111111",
      box_no: "100",
      weight: 10,
      price: 1000,
      round_boat: "20/06/2023",
      remark: "this is a fake data",
   },
   {
      date: "17/06/2023",
      username: "opal",
      channel: "yahoo",
      delivery_type: "9980",
      track_no: "111111",
      box_no: "100",
      weight: 10,
      price: 1000,
      round_boat: "20/06/2023",
      remark: "this is a fake data",
   },
   {
      date: "17/06/2023",
      username: "opal",
      channel: "yahoo",
      delivery_type: "9980",
      track_no: "111111",
      box_no: "100",
      weight: 10,
      price: 1000,
      round_boat: "20/06/2023",
      remark: "this is a fake data",
   },
   {
      date: "17/06/2023",
      username: "opal",
      channel: "yahoo",
      delivery_type: "9980",
      track_no: "111111",
      box_no: "100",
      weight: 10,
      price: 1000,
      round_boat: "20/06/2023",
      remark: "this is a fake data",
   },
   {
      date: "17/06/2023",
      username: "opal",
      channel: "yahoo",
      delivery_type: "9980",
      track_no: "111111",
      box_no: "100",
      weight: 10,
      price: 1000,
      round_boat: "20/06/2023",
      remark: "this is a fake data",
   },
   {
      date: "17/06/2023",
      username: "opal",
      channel: "yahoo",
      delivery_type: "9980",
      track_no: "111111",
      box_no: "100",
      weight: 10,
      price: 1000,
      round_boat: "20/06/2023",
      remark: "this is a fake data",
   },
   {
      date: "17/06/2023",
      username: "opal",
      channel: "yahoo",
      delivery_type: "9980",
      track_no: "111111",
      box_no: "100",
      weight: 10,
      price: 1000,
      round_boat: "20/06/2023",
      remark: "this is a fake data",
   },
   {
      date: "17/06/2023",
      username: "opal",
      channel: "yahoo",
      delivery_type: "9980",
      track_no: "111111",
      box_no: "100",
      weight: 10,
      price: 1000,
      round_boat: "20/06/2023",
      remark: "this is a fake data",
   },
   {
      date: "17/06/2023",
      username: "opal",
      channel: "yahoo",
      delivery_type: "9980",
      track_no: "111111",
      box_no: "100",
      weight: 10,
      price: 1000,
      round_boat: "20/06/2023",
      remark: "this is a fake data",
   },
   {
      date: "17/06/2023",
      username: "opal",
      channel: "yahoo",
      delivery_type: "9980",
      track_no: "111111",
      box_no: "100",
      weight: 10,
      price: 1000,
      round_boat: "20/06/2023",
      remark: "this is a fake data",
   },
   {
      date: "17/06/2023",
      username: "opal",
      channel: "yahoo",
      delivery_type: "9980",
      track_no: "111111",
      box_no: "100",
      weight: 10,
      price: 1000,
      round_boat: "20/06/2023",
      remark: "this is a fake data",
   },
   {
      date: "17/06/2023",
      username: "opal",
      channel: "yahoo",
      delivery_type: "9980",
      track_no: "111111",
      box_no: "100",
      weight: 10,
      price: 1000,
      round_boat: "20/06/2023",
      remark: "this is a fake data",
   },
   {
      date: "17/06/2023",
      username: "opal",
      channel: "yahoo",
      delivery_type: "9980",
      track_no: "111111",
      box_no: "100",
      weight: 10,
      price: 1000,
      round_boat: "20/06/2023",
      remark: "this is a fake data",
   },
   {
      date: "17/06/2023",
      username: "opal",
      channel: "yahoo",
      delivery_type: "9980",
      track_no: "111111",
      box_no: "100",
      weight: 10,
      price: 1000,
      round_boat: "20/06/2023",
      remark: "this is a fake data",
   },
   {
      date: "17/06/2023",
      username: "opal",
      channel: "yahoo",
      delivery_type: "9980",
      track_no: "111111",
      box_no: "100",
      weight: 10,
      price: 1000,
      round_boat: "20/06/2023",
      remark: "this is a fake data",
   },
   {
      date: "17/06/2023",
      username: "opal",
      channel: "yahoo",
      delivery_type: "9980",
      track_no: "111111",
      box_no: "100",
      weight: 10,
      price: 1000,
      round_boat: "20/06/2023",
      remark: "this is a fake data",
   },
   {
      date: "17/06/2023",
      username: "opal",
      channel: "yahoo",
      delivery_type: "9980",
      track_no: "111111",
      box_no: "100",
      weight: 10,
      price: 1000,
      round_boat: "20/06/2023",
      remark: "this is a fake data",
   },
   {
      date: "17/06/2023",
      username: "opal",
      channel: "yahoo",
      delivery_type: "9980",
      track_no: "111111",
      box_no: "100",
      weight: 10,
      price: 1000,
      round_boat: "20/06/2023",
      remark: "this is a fake data",
   },
   {
      date: "17/06/2023",
      username: "opal",
      channel: "yahoo",
      delivery_type: "9980",
      track_no: "111111",
      box_no: "100",
      weight: 10,
      price: 1000,
      round_boat: "20/06/2023",
      remark: "this is a fake data",
   },
   {
      date: "17/06/2023",
      username: "opal",
      channel: "yahoo",
      delivery_type: "9980",
      track_no: "111111",
      box_no: "100",
      weight: 10,
      price: 1000,
      round_boat: "20/06/2023",
      remark: "this is a fake data",
   },
]
