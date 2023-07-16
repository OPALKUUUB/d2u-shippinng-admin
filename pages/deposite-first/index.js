/* eslint-disable no-else-return */
/* eslint-disable indent */
/* eslint-disable no-use-before-define */
/* eslint-disable react/jsx-no-useless-fragment */
import React, { Fragment, useEffect, useState } from "react"
import { getSession } from "next-auth/react"
import {
   Button,
   Divider,
   Modal,
   Select,
   Spin,
   Table,
   Input,
   Switch,
   message,
   DatePicker,
} from "antd"
import axios from "axios"
import dayjs from "dayjs"
import Layout from "../../components/layout/layout"

const { TextArea } = Input

function DepositFirstPage() {
   const [loading, setLoading] = useState(false)
   const [data, setData] = useState([])
   const [selectedRow, setSelectedRow] = useState({})
   const [openEditModal, setOpenEditModal] = useState(false)

   const dateComparator = (a, b) => {
      if (a === null && b === null) {
         return 0
      } else if (a === null) {
         return 1
      } else if (b === null) {
         return -1
      }
      const [dayA, monthA, yearA, timeA] = a.split(/[/ ]/)
      const [dayB, monthB, yearB, timeB] = b.split(/[/ ]/)

      const dateA = new Date(`${monthA}/${dayA}/${yearA} ${timeA}`)
      const dateB = new Date(`${monthB}/${dayB}/${yearB} ${timeB}`)
      return dateA - dateB
   }
   
   const handleRemove = async (id) => {
      setLoading(false)
      try {
         axios.patch(`/api/shipbilling?id=${id}`, {
            delivery_type: "รับของแล้ว",
         })
      } catch (error) {
         console.log(error)
      } finally {
         getShipBilling()
         setLoading(true)
         message.success("เปลี่ยนสถานะเป็น รับของแล้ว สำเร็จ")
      }
   }

   const handleChangeDepositFirstDeliveryType = async (opt, id) => {
      setLoading(false)
      try {
         axios.patch(`/api/shipbilling?id=${id}`, {
            deposit_first_delivery_type: opt,
         })
      } catch (error) {
         console.log(error)
      } finally {
         getShipBilling()
         setLoading(true)
      }
   }

   const handleCheck = async (body, id) => {
      setLoading(false)
      try {
         axios.patch(`/api/shipbilling?id=${id}`, body)
      } catch (error) {
         console.log(error)
      } finally {
         getShipBilling()
         setLoading(true)
      }
   }

   const handleChangeDatePayVoyage = (value) => {
      if (value) {
         const date = new Date(value)
         setSelectedRow((prev) => ({
            ...prev,
            date_pay_voyage: date.toLocaleString("th-BK"),
            // date_pay_voyage: date.toLocaleString("th-BK", {timeZone: "UTC"}),
         }))
      } else {
         setSelectedRow((prev) => ({
            ...prev,
            date_pay_voyage: null,
         }))
      }
   }

   const handleOkEditModal = async () => {
      const body = {
         address: selectedRow.address,
         delivery_by: selectedRow.delivery_by,
         date_pay_voyage: selectedRow.date_pay_voyage,
         track_no: selectedRow.track_no,
         delivery_cost: selectedRow.delivery_cost,
         remark: selectedRow.remark,
      }
      try {
         const response = await axios.patch(
            `/api/shipbilling?id=${selectedRow.shipbilling_id}`,
            body
         )
         const responseBody = await response.body
         // console.log(responseBody)
      } catch (error) {
         console.log(error)
      } finally {
         getShipBilling()
         setOpenEditModal(false)
      }
   }

   async function getShipBilling() {
      try {
         const response = await axios.get(`/api/deposit-first`)
         const responseData = await response.data
         setData(
            responseData.trackings
               .sort((a, b) =>
                  dateComparator(a.date_pay_voyage, b.date_pay_voyage)
               )
               .reduce((a, c, idx) => {
                  const group_user = a.find((fi) => fi.username === c.username)
                  if (group_user !== undefined) return a
                  return [...a, { ...c, key: idx }]
               }, [])
         )
      } catch (err) {
         console.log(err)
      } finally {
         setLoading(false)
      }
   }

   const handleOpenEditModal = (item) => {
      setSelectedRow(item)
      setOpenEditModal(true)
   }

   useEffect(() => {
      setLoading(true)
      getShipBilling()
   }, [])

   const columns = [
      {
         title: "username",
         dataIndex: "username",
         key: "username",
      },
      {
         title: "รอบเรือ",
         dataIndex: "voyage",
         key: "voyage",
      },
      {
         title: "ค่าเรือ",
         dataIndex: "check_pay_delivery_cost",
         key: "check_pay_delivery_cost",
         filters: [
            {
               text: "แจ้งแล้ว",
               value: 1,
            },
            {
               text: "ยังไม่แจ้ง",
               value: 0,
            }
         ],
         onFilter: (value, record) =>
            record.check_pay_delivery_cost === null || record.check_pay_delivery_cost === undefined
               ? false
               : record.check_pay_delivery_cost === value,
         render: (ck, item) => {
            const { shipbilling_id } = item
            const check = ck === 1
            return (
               <Switch
                  checked={check}
                  onClick={(value) =>
                     handleCheck(
                        { check_pay_delivery_cost: value ? 1 : 0 },
                        shipbilling_id
                     )
                  }
               />
            )
         },
      },
      {
         title: "วิธีการจัดส่ง",
         dataIndex: "deposit_first_delivery_type",
         key: "deposit_first_delivery_type",
         filters: [
            {
               text: "รับเอง พระราม 3",
               value: "รับเอง พระราม 3",
            },
            {
               text: "รับเอง ร่มเกล้า",
               value: "รับเอง ร่มเกล้า",
            },
            {
               text: "ขนส่งเอกชน",
               value: "ขนส่งเอกชน",
            },
         ],
         onFilter: (value, record) =>
            record.deposit_first_delivery_type === null || record.deposit_first_delivery_type === undefined
               ? false
               : record.deposit_first_delivery_type.indexOf(value) === 0,
         render: (txt, item) => {
            const id = item.shipbilling_id
            return (
               <Select
                  className="w-[150px]"
                  value={txt === null ? "" : txt}
                  options={[
                     { label: "กรุณาเลือกวิธีการจัดส่ง", value: "" },
                     { label: "รับเอง พระราม3", value: "รับเอง พระราม3" },
                     { label: "รับเอง ร่มเกล้า", value: "รับเอง ร่มเกล้า" },
                     { label: "ขนส่งเอกชน", value: "ขนส่งเอกชน" },
                  ]}
                  onChange={(value) =>
                     handleChangeDepositFirstDeliveryType(value, id)
                  }
               />
            )
         },
      },
      {
         title: "วันที่ดึงข้อมูล",
         dataIndex: "date_pay_voyage",
         key: "date_pay_voyage",
      },
      {
         title: "หมายเหตุ",
         dataIndex: "remark",
         key: "remark",
         render: (txt) => (txt === null || txt === "" ? "-" : txt),
      },
      {
         title: "จัดการ",
         key: "manage",
         render: (item) => (
            <>
               <Button onClick={() => handleOpenEditModal(item)}>จัดการ</Button>
               <Button danger onClick={() => handleRemove(item.shipbilling_id)}>นำออก</Button>
            </>
         ),
      },
   ]

   return (
      <Fragment>
         {loading && (
            <div className="fixed top-0 left-0 right-0 bottom-0 bg-[rgba(0,0,0,0.5)] z-10">
               <div className="fixed top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%]">
                  <Spin size="large" />
               </div>
            </div>
         )}
         <div className="p-4">
            <div className="bg-white rounded-lg p-4">
               <div className="font-bold text-[1.2rem] mb-2">ฝากไว้ก่อน</div>
               <Divider />
               <Table
                  dataSource={data}
                  columns={columns}
                  scroll={{
                     x: 1500,
                     y: 450,
                  }}
               />
               <Modal
                  open={openEditModal}
                  onOk={handleOkEditModal}
                  onCancel={() => setOpenEditModal(false)}
                  title="แก้ไขข้อมูลขนส่งเอกชน"
               >
                  <div className="mb-2">
                     <label>วิธีการจัดส่ง: </label>
                     <Select
                        className="w-[180px] mb-1"
                        options={[
                           { label: "กรุณาเลือกวิธีการจัดส่ง", value: "" },
                           { label: "รับเอง พระราม3", value: "รับเอง พระราม3" },
                           {
                              label: "รับเอง ร่มเกล้า",
                              value: "รับเอง ร่มเกล้า",
                           },
                           { label: "ขนส่งเอกชน", value: "ขนส่งเอกชน" },
                        ]}
                        value={
                           selectedRow.delivery_by === null
                              ? ""
                              : selectedRow.delivery_by
                        }
                        onChange={(value) =>
                           setSelectedRow((prev) => ({
                              ...prev,
                              delivery_by: value,
                           }))
                        }
                     />
                  </div>
                  <div className="mb-2">
                     <label>วันที่ดึงข้อมูล: </label>
                     <DatePicker
                        format="DD/MM/YYYY HH:mm:ss"
                        value={
                           selectedRow?.date_pay_voyage === null
                              ? null
                              : dayjs(
                                 selectedRow?.date_pay_voyage,
                                 "D/M/YYYY HH:mm:ss"
                              )
                        }
                        onChange={handleChangeDatePayVoyage}
                     />
                  </div>
                  <div className="mb-2">
                     <label className="mb-2">หมายเหตุ: </label>
                     <TextArea
                        className="mb-1"
                        rows={4}
                        value={selectedRow?.remark}
                        onChange={(e) =>
                           setSelectedRow({
                              ...selectedRow,
                              remark: e.target.value,
                           })
                        }
                     />
                  </div>
               </Modal>
            </div>
         </div>
      </Fragment>
   )
}

DepositFirstPage.getLayout = function getLayout(page) {
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
      props: {
         session,
      },
   }
}

export default DepositFirstPage
