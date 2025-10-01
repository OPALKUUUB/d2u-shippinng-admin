/* eslint-disable prefer-const */
import { DownOutlined } from "@ant-design/icons"
import {
   Button,
   DatePicker,
   Dropdown,
   InputNumber,
   message,
   Modal,
   Select,
   Space,
   Switch,
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
import sortDate from "../../../utils/sortDate"
import { payment_model } from "../../../model/tracking"
import sortDateTime from "../../../utils/sortDateTime"

dayjs.extend(customParseFormat)
dayjs.extend(weekday)
dayjs.extend(localeData)

function YahooPaymentPage() {
   const [data, setData] = useState([])
   const [selectedRow, setSelectedRow] = useState(payment_model)
   const [showEditModal, setshowEditModal] = useState(false)
   const [InputDate, setInputDate] = useState(null)
   const [slip, setSlip] = useState({ id: "", image: "" })
   const [showSlipModal, setShowSlipModal] = useState(false)

   const handleDeleteRow = async (id) => {
      if (!window.confirm("คุณแน่ใจที่จะลบใช่หรือไม่")) {
         return 
      }
      try {
         const response = await fetch("/api/yahoo/payment", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ payment_id: id }),
         })
         const responseJson = await response.json()
         setData(
            responseJson.payments
         )
         message.success("ลบรายการสำเร็จ!")
      } catch (err) {
         console.log(err)
         message.error("ลบไม่สำเร็จ!")
      }
   }
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
         setData(
            responseJson.payments
         )
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

   const handleChangeNotificated = async (status, id) => {
      try {
         const response = await fetch(`/api/yahoo/payment?id=${id}`, {
            method: "PUT",
            headers: {
               "Content-Type": "application/json",
            },
            body: JSON.stringify({ notificated: status ? 0 : 1 }),
         })
         const responseJson = await response.json()
         setData(
            responseJson.payments
         )
         message.success("success!")
      } catch (err) {
         console.log(err)
         message.error("fail!")
      }
   }
   const columns = [
      {
         title: "วันที่",
         dataIndex: "date",
         key: "date",
         sorter: (a, b) => sortDate(a.date, b.date),
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
               minimumFractionDigits: 0,
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

            const s = Math.ceil(
               (bid + (!delivery_fee ? 0 : delivery_fee)) * rate_yen +
                  (!tranfer_fee ? 0 : tranfer_fee)
            )
            return new Intl.NumberFormat("th-TH", {
               currency: "THB",
               style: "currency",
               minimumFractionDigits: 0,
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
         dataIndex: "id",
         key: "notificated",
         render: (id) => {
            const payments = data.filter((ft) => ft.id === id)
            const payment = payments[0]
            const notificated = payment.notificated === 1
            return notificated ? (
               <div>
                  <span style={{ color: "green" }}>แจ้งชำระแล้ว</span>
                  <Switch
                     checked={notificated}
                     onClick={() => handleChangeNotificated(notificated, id)}
                  />
               </div>
            ) : (
               <div>
                  <span style={{ color: "red" }}>รอแจ้งชำระ</span>
                  <Switch
                     checked={notificated}
                     onClick={() => handleChangeNotificated(notificated, id)}
                  />
               </div>
            )
         },
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
                  onClick: () => handleDeleteRow(id)
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
         console.log(responseJson)
         setData(
            responseJson.payments
         )
      })()
   }, [])
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
                           date: genDate(value),
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
            // title="Slip"
            open={showSlipModal}
            onCancel={() => setShowSlipModal(false)}
            okText="ยืนยัน"
            cancelText="ยกเลิก"
            footer={false}
            wrapClassName="Slip-Modal"
         >
            <img src={slip.image} alt="" width={330} />
         </Modal>
         <style jsx global>
            {`
               .Slip-Modal .ant-modal {
                  width: 330px;
                  margin: 0;
                  top: 0;
                  padding: 0;
               }
               .Slip-Modal .ant-modal-content {
                  background-color: rgba(0, 0, 0, 0.01);
                  padding: 0;
                  width: fit-content;
                  box-shadow: none;
               }
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
