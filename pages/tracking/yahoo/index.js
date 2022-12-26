/* eslint-disable prefer-const */
import {
   DatePicker,
   Dropdown,
   Input,
   InputNumber,
   Modal,
   Space,
   Table,
} from "antd"
import { getSession } from "next-auth/react"
import React, { Fragment, useState } from "react"
import { DownOutlined, SearchOutlined } from "@ant-design/icons"
import dayjs from "dayjs"
import weekday from "dayjs/plugin/weekday"
import localeData from "dayjs/plugin/localeData"
import customParseFormat from "dayjs/plugin/customParseFormat"
import CardHead from "../../../components/CardHead"
import Layout from "../../../components/layout/layout"

const { TextArea } = Input

dayjs.extend(customParseFormat)
dayjs.extend(weekday)
dayjs.extend(localeData)

function YahooTrackingsPage(props) {
   const { trackings } = props
   const [data, setData] = useState(trackings)
   const [selectedRow, setSelectedRow] = useState({})
   const [sortedInfo, setSortedInfo] = useState({})
   const [filteredInfo, setFilteredInfo] = useState({})
   const [InputDate, setInputDate] = useState(null)
   const [InputVoyageDate, setInputVoyageDate] = useState(null)
   const [showEditModal, setShowEditModal] = useState(false)
   const handleOkEditModal = async () => {
      const {
         id,
         date,
         track_no,
         box_no,
         weight,
         voyage,
         remark_admin,
         remark_user,
      } = selectedRow
      try {
         const response = await fetch(`/api/tracking/yahoo?id=${id}`, {
            method: "PUT",
            headers: {
               "Content-Type": "application/json",
            },
            body: JSON.stringify({
               date,
               track_no,
               box_no,
               weight,
               voyage,
               remark_admin,
               remark_user,
            }),
         })
         const responseJson = await response.json()
         // console.log(responseJson.trackings)
         setData(responseJson.trackings)
         setShowEditModal(false)
      } catch (err) {
         console.log(err)
      }
   }
   const handleCancelEditModal = () => {
      setShowEditModal(false)
   }
   const handleShowEditModal = (id) => {
      const temp = data.filter((ft) => ft.id === id)[0]
      setInputDate(dayjs(temp.date, "D/M/YYYY"))
      setInputVoyageDate(
         temp.voyage === null ? null : dayjs(temp.voyage, "D/M/YYYY")
      )
      setSelectedRow({ ...temp })
      setShowEditModal(true)
   }
   const columns = [
      {
         title: "วันที่",
         dataIndex: "date",
         width: "120px",
         key: "date",
         ellipsis: false,
      },
      {
         title: "รูปภาพ",
         dataIndex: "image",
         key: "image",
         width: "120px",
         filteredValue: null,
         render: (text) => <img src={text} alt="" width="100" />,
      },
      {
         title: "ชื่อลูกค้า",
         dataIndex: "username",
         key: "username",
         filters: props.trackings.reduce(
            (accumulator, currentValue) => [
               ...accumulator,
               { text: currentValue.username, value: currentValue.username },
            ],
            []
         ),
         filteredValue: filteredInfo.username || null,
         onFilter: (value, record) => record.username.includes(value),
         sorter: (a, b) => a.username.length - b.username.length,
         sortOrder:
            sortedInfo.columnKey === "username" ? sortedInfo.order : null,
         ellipsis: true,
         width: "120px",
      },
      {
         title: "ลิ้งค์",
         dataIndex: "link",
         key: "link",
         width: "125px",
         render: (text, record, index) => {
            const link_code = text.split(
               "https://page.auctions.yahoo.co.jp/jp/auction/"
            )
            return (
               <a href={text} target="_blank" rel="noreferrer">
                  {link_code[1]}
               </a>
            )
         },
         filteredValue: null,
         ellipsis: false,
      },
      {
         title: "รวม",
         dataIndex: "id",
         key: "sum",
         render: (id) => {
            const payments = data.filter((ft) => ft.id === id)
            const payment = payments[0]
            const { bid, delivery_fee, tranfer_fee, rate_yen } = payment
            if (!delivery_fee || !tranfer_fee) {
               return "-"
            }
            const s = (bid + delivery_fee) * rate_yen + tranfer_fee
            return new Intl.NumberFormat("th-TH", {
               currency: "THB",
               style: "currency",
            }).format(s)
         },
      },
      {
         title: "เลขแทรกกิงค์",
         dataIndex: "track_no",
         key: "track_no",
         render: (text) => (text === null ? "-" : text),
      },
      {
         title: "เลขกล่อง",
         dataIndex: "box_no",
         key: "box_no",
         render: (text) => (text === null ? "-" : text),
      },
      {
         title: "น้ำหนัก",
         dataIndex: "weight",
         key: "weight",
         render: (text) => (text === null ? "-" : text),
      },
      {
         title: "รอบเรือ",
         dataIndex: "voyage",
         key: "voyage",
         render: (text) => (text === null ? "-" : text),
      },
      {
         title: "หมายเหตุลูกค้า",
         dataIndex: "remark_user",
         key: "remark_user",
         render: (text) => (text === null ? "-" : text),
      },
      {
         title: "หมายเหตุแอดมิน",
         dataIndex: "remark_admin",
         key: "remark_admin",
         render: (text) => (text === null ? "-" : text),
      },
      {
         title: "จัดการ",
         dataIndex: "id",
         key: "manage",
         filteredValue: null,
         ellipsis: true,
         width: "90px",
         fixed: "right",
         render: (id) => {
            const items = [
               {
                  key: "1",
                  label: "แก้ไข",
                  onClick: () => handleShowEditModal(id),
               },
               { key: "2", label: "ลบรายการ" },
            ]
            return (
               <Space>
                  <Dropdown menu={{ items }}>
                     <span>
                        จัดการ <DownOutlined />
                     </span>
                  </Dropdown>
               </Space>
            )
         },
      },
   ]
   return (
      <Fragment>
         <CardHead
            name="Yahoo Tracking"
            description="* แสดงรายการประมูลสินค้าที่ลูกค้าสั่งประมูล"
         />
         <div className="container-table">
            <Table
               dataSource={data}
               columns={columns}
               scroll={{
                  x: 1500,
                  y: 450,
               }}
            />
         </div>
         <Modal
            title="แก้ไขรายการ"
            open={showEditModal}
            onOk={handleOkEditModal}
            onCancel={handleCancelEditModal}
            okText="ยืนยัน"
            cancelText="ยกเลิก"
         >
            <div className="UpdateTrackingModal">
               <label>วันที่: </label>
               <DatePicker
                  defaultValue={null}
                  value={InputDate}
                  format="D/M/YYYY"
                  onChange={(value) => {
                     if (value === null) {
                        setSelectedRow((prev) => ({
                           ...prev,
                           date: null,
                        }))
                        setInputDate(null)
                     } else {
                        setSelectedRow((prev) => ({
                           ...prev,
                           date: new Date(value).toLocaleDateString("th-TH"),
                        }))
                        setInputDate(value)
                     }
                  }}
               />
               <label>เลขแทรกกิงค์: </label>
               <Input
                  value={selectedRow.track_no}
                  onChange={(e) =>
                     setSelectedRow({
                        ...selectedRow,
                        track_no: e.target.value,
                     })
                  }
               />
               <label>เลขกล่อง: </label>
               <Input
                  value={selectedRow.box_no}
                  onChange={(e) =>
                     setSelectedRow({
                        ...selectedRow,
                        box_no: e.target.value,
                     })
                  }
               />
               <label>น้ำหนัก: </label>
               <InputNumber
                  value={selectedRow.weight}
                  onChange={(value) =>
                     setSelectedRow({
                        ...selectedRow,
                        weight: value,
                     })
                  }
               />
               <label>รอบเรือ: </label>
               <DatePicker
                  value={InputVoyageDate}
                  format="D/M/YYYY"
                  onChange={(value) => {
                     if (value === null) {
                        setSelectedRow((prev) => ({
                           ...prev,
                           voyage: null,
                        }))
                        setInputVoyageDate(null)
                     } else {
                        setSelectedRow((prev) => ({
                           ...prev,
                           voyage: new Date(value).toLocaleDateString("th-TH"),
                        }))
                        setInputVoyageDate(value)
                     }
                  }}
               />
               <label>หมายเหตุลูกค้า: </label>
               <TextArea
                  rows={2}
                  value={selectedRow.remark_user}
                  onChange={(e) => {
                     setSelectedRow({
                        ...selectedRow,
                        remark_user: e.target.value,
                     })
                  }}
               />
               <label>หมายเหตุแอดมิน: </label>
               <TextArea
                  rows={2}
                  value={selectedRow.remark_admin}
                  onChange={(e) =>
                     setSelectedRow({
                        ...selectedRow,
                        remark_admin: e.target.value,
                     })
                  }
               />
            </div>
         </Modal>
         <style jsx>
            {`
               .container-table {
                  margin: 10px;
                  background: white;
                  padding: 10px;
               }
            `}
         </style>
      </Fragment>
   )
}

YahooTrackingsPage.getLayout = function getLayout(page) {
   return <Layout>{page}</Layout>
}

export async function getServerSideProps(context) {
   const session = await getSession({ req: context.req })
   // eslint-disable-next-line prefer-template
   const api = process.env.BACKEND_URL + "/api/tracking/yahoo"
   const response = await fetch(api).then((res) => res.json())
   if (!session) {
      return {
         redirect: {
            destination: "/auth/signin",
            permanent: false,
         },
      }
   }
   return {
      props: {
         trackings: response.trackings,
      },
   }
}
export default YahooTrackingsPage
