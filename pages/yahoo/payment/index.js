/* eslint-disable prefer-const */
import { DownOutlined } from "@ant-design/icons"
import {
   Button,
   DatePicker,
   Dropdown,
   InputNumber,
   Modal,
   Select,
   Space,
   Table,
} from "antd"
import dayjs from "dayjs"
import weekday from "dayjs/plugin/weekday"
import localeData from "dayjs/plugin/localeData"
import customParseFormat from "dayjs/plugin/customParseFormat"

import { getSession } from "next-auth/react"
import React, { Fragment, useEffect, useState } from "react"
import CardHead from "../../../components/CardHead"
import Layout from "../../../components/layout/layout"
import genDate from "../../../utils/genDate"

dayjs.extend(customParseFormat)
dayjs.extend(weekday)
dayjs.extend(localeData)

const payment_model = {
   key: "7",
   id: 7,
   slip_id: null,
   user_id: 12,
   tracking_id: null,
   admin_id: null,
   date: null,
   bid: 79377,
   tranfer_fee: 1000,
   delivery_fee: 100,
   rate_yen: 0.29,
   notificated: 0,
   payment_status: "รอค่าโอนและค่าส่ง",
   remark_user: null,
   remark_admin: null,
   created_at: "6/12/2565 07:52:00",
   updated_at: "6/12/2565 07:52:00",
   username: "opal",
   image: "https://auctions.c.yimg.jp/images.auctions.yahoo.co.jp/image/dr000/auc0305/users/70b1882bbe1cdc40c55efeae7e6edce2b6414e78/i-img802x1200-1652283739zmsgoi4075.jpg",
   link: "https://page.auctions.yahoo.co.jp/jp/auction/r1051310637",
}

function YahooPaymentPage(props) {
   const [data, setData] = useState([])
   const [selectedRow, setSelectedRow] = useState(payment_model)
   const [showEditModal, setshowEditModal] = useState(false)
   const [InputDate, setInputDate] = useState(null)
   const [slip, setSlip] = useState({ id: "", image: "" })
   const [showSlipModal, setShowSlipModal] = useState(false)
   const handleShowEditModal = (id) => {
      const temp = data.filter((ft) => ft.id === id)[0]
      setInputDate(dayjs(temp.date, "D/M/YYYY"))
      setSelectedRow({ ...temp })
      setshowEditModal(true)
   }
   const handleOkEditModal = async () => {
      // eslint-disable-next-line prefer-const
      let {
         user_id,
         id,
         date,
         tranfer_fee,
         delivery_fee,
         rate_yen,
         payment_status,
      } = selectedRow
      tranfer_fee = !tranfer_fee ? 0 : tranfer_fee
      delivery_fee = !delivery_fee ? 0 : delivery_fee
      rate_yen = !rate_yen ? 0 : rate_yen
      const body = {
         date,
         tranfer_fee,
         delivery_fee,
         rate_yen,
         payment_status,
         user_id,
      }
      try {
         const response = await fetch(`/api/yahoo/payment?id=${id}`, {
            method: "PUT",
            headers: {
               "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
         })
         const responseJson = await response.json()
         const { payments } = responseJson
         setData(payments)
         setshowEditModal(false)
         setSelectedRow(payment_model)
         setInputDate(null)
      } catch (err) {
         console.log(err)
      }
   }
   const handleCancelEditModal = () => {
      // console.log("handleCancleEdittModal")
      setSelectedRow(payment_model)
      setshowEditModal(false)
   }
   const handleShowSlip = async (id) => {
      try {
         const response = await fetch(`/api/yahoo/slip/${id}`)
         const responseJson = await response.json()
         console.log(responseJson)
         setSlip(responseJson.slip)
         setShowSlipModal(true)
      } catch (err) {
         console.log(err)
      }
   }
   const columns = [
      {
         title: "วันที่",
         dataIndex: "date",
         key: "date",
         sorter: (a, b) => {
            const datetime_a = a.date
            const date_a_f = datetime_a.split("/")
            // [y,m,d,h,m,s]
            const datetime_a_f = [
               parseInt(date_a_f[2], 10),
               parseInt(date_a_f[1], 10),
               parseInt(date_a_f[0], 10),
            ]
            const datetime_b = b.date
            const date_b_f = datetime_b.split("/")
            const datetime_b_f = [
               parseInt(date_b_f[2], 10),
               parseInt(date_b_f[1], 10),
               parseInt(date_b_f[0], 10),
            ]
            for (let i = 0; i < 3; i++) {
               if (datetime_a_f[i] - datetime_b_f[i] !== 0) {
                  return datetime_a_f[i] - datetime_b_f[i]
               }
            }
            return 0
         },
      },
      {
         title: "รูปภาพ",
         dataIndex: "image",
         key: "image",
         render: (text) => <img src={text} alt="" width={100} />,
      },
      {
         title: "ชื่อลูกค้า",
         dataIndex: "username",
         key: "username",
      },
      {
         title: "ลิ้งค์",
         dataIndex: "link",
         key: "link",
         render: (text) => {
            if (
               text.includes("https://page.auctions.yahoo.co.jp/jp/auction/")
            ) {
               return (
                  <a href={text} target="_blank" rel="noreferrer">
                     {
                        text.split(
                           "https://page.auctions.yahoo.co.jp/jp/auction/"
                        )[1]
                     }
                  </a>
               )
            }
            return text
         },
      },
      {
         title: "ราคาประมูล",
         dataIndex: "bid",
         key: "bid",
         render: (text) =>
            new Intl.NumberFormat("ja-JP", {
               currency: "JPY",
               style: "currency",
            }).format(text),
      },
      {
         title: "ค่าโอน",
         dataIndex: "tranfer_fee",
         key: "tranfer_fee",
         render: (text) =>
            new Intl.NumberFormat("th-TH", {
               currency: "THB",
               style: "currency",
            }).format(text),
      },
      {
         title: "ค่าส่ง",
         dataIndex: "delivery_fee",
         key: "delivery_fee",
         render: (text) =>
            new Intl.NumberFormat("ja-JP", {
               currency: "JPY",
               style: "currency",
               minimumFractionDigits: 2,
            }).format(text),
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
         title: "Slip",
         dataIndex: "slip_id",
         key: "slip_id",
         render: (slip_id) => {
            if (slip_id === null) {
               return "-"
            }
            return <Button onClick={() => handleShowSlip(slip_id)}>slip</Button>
         },
      },
      {
         title: "สถานะ",
         dataIndex: "payment_status",
         key: "payment_status",
      },
      {
         title: "แจ้งชำระ",
         dataIndex: "notificated",
         key: "notificated",
         render: (text) =>
            text === 1 ? (
               <span style={{ color: "green" }}>แจ้งชำระแล้ว</span>
            ) : (
               <span style={{ color: "red" }}>รอแจ้งชำระ</span>
            ),
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
         width: "90px",
         fixed: "right",
         render: (id) => {
            const items = [
               {
                  key: "1",
                  label: "แก้ไข",
                  onClick: () => handleShowEditModal(id),
               },
               {
                  key: "2",
                  label: "ลบ",
               },
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
   useEffect(() => {
      ;(async () => {
         const response = await fetch("/api/yahoo/payment")
         const responseJson = await response.json()
         setData(responseJson.payments)
      })()
   })
   return (
      <Fragment>
         <CardHead
            name="Yahoo Payment Auction"
            description="* แสดงรายการประมูลสินค้าที่ลูกค้าต้องชำระ"
         />

         <div className="container-table">
            <Table
               dataSource={data}
               columns={columns}
               scroll={{
                  x: 1500,
                  y: 500,
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
            <div className="UpdatePaymentModal">
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
                           date: genDate(),
                        }))
                        setInputDate(value)
                     }
                  }}
               />
               <label>ค่าโอน(฿): </label>
               <InputNumber
                  value={selectedRow.tranfer_fee}
                  onChange={(value) =>
                     setSelectedRow((prev) => ({ ...prev, tranfer_fee: value }))
                  }
               />
               <label>ค่าขนส่ง(￥): </label>
               <InputNumber
                  value={selectedRow.delivery_fee}
                  onChange={(value) =>
                     setSelectedRow((prev) => ({
                        ...prev,
                        delivery_fee: value,
                     }))
                  }
               />
               <label>อัตราแลกเปลี่ยนจากเยนเป็นเงินบาท: </label>
               <InputNumber
                  value={selectedRow.rate_yen}
                  onChange={(value) =>
                     setSelectedRow((prev) => ({ ...prev, rate_yen: value }))
                  }
               />
               <label>สถานะ: </label>
               <Select
                  onChange={(value) =>
                     setSelectedRow((prev) => ({
                        ...prev,
                        payment_status: value,
                     }))
                  }
                  value={selectedRow.payment_status}
                  options={[
                     { label: "รอค่าโอนและค่าส่ง", value: "รอค่าโอนและค่าส่ง" },
                     { label: "รอการชำระเงิน", value: "รอการชำระเงิน" },
                     { label: "รอการตรวจสอบ", value: "รอการตรวจสอบ" },
                     { label: "ชำระเงินเสร็จสิ้น", value: "ชำระเงินเสร็จสิ้น" },
                  ]}
               />
            </div>
         </Modal>
         <Modal
            title="Slip"
            open={showSlipModal}
            onCancel={() => setShowSlipModal(false)}
            okText="ยืนยัน"
            cancelText="ยกเลิก"
         >
            <img src={slip.image} alt="" width={100} />
         </Modal>
         <style jsx global>
            {`
               .UpdatePaymentModal .ant-picker {
                  width: 100%;
                  margin-bottom: 10px;
               }
               .UpdatePaymentModal .ant-input-number {
                  width: 100%;
                  margin-bottom: 10px;
               }
               .UpdatePaymentModal .ant-select {
                  width: 100%;
                  margin-bottom: 10px;
               }
            `}
         </style>
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

YahooPaymentPage.getLayout = function getLayout(page) {
   return <Layout>{page}</Layout>
}

export async function getServerSideProps(context) {
   const session = await getSession({ req: context.req })

   if (!session) {
      return {
         redirect: {
            destination: "/auth/signin",
            permanent: false,
         },
      }
   }
   return {
      props: { session },
   }
}
export default YahooPaymentPage
