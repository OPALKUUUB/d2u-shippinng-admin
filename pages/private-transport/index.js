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
   message,
   Input,
   DatePicker,
   InputNumber,
   Switch,
} from "antd"
import { useRouter } from "next/router"
import axios from "axios"
import dayjs from "dayjs"
import Layout from "../../components/layout/layout"

const { TextArea } = Input

function PrivateTransport() {
   const router = useRouter()
   const [loading, setLoading] = useState(false)
   const [voyageSelect, setVoyageSelect] = useState("เลือกรอบเรือ")
   const [voyageSelectItems, setVoyageSelectItems] = useState([])
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

   const handleCheck = async (body, id) => {
      setLoading(false)
      try {
         axios.patch(`/api/shipbilling?id=${id}`, body)
      } catch (error) {
         console.log(error)
      } finally {
         if (router.query.voyage) handleChangeSelect(router.query.voyage)
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
         console.log(responseBody)
      } catch (error) {
         console.log(error)
      } finally {
         if (router.query.voyage) handleChangeSelect(router.query.voyage)
         setOpenEditModal(false)
      }
   }

   const handleChangeSelect = async (value) => {
      message.info(`voyage ${value}`)
      setVoyageSelect(value)
      if (router.query.voyage !== value) {
         router.push({ query: { voyage: value } })
      }
      try {
         const response = await axios.get(`/api/shipbilling?voyage=${value}`)
         const responseData = await response.data
         setData(
            responseData.trackings
               .filter((fi) => fi.delivery_type === "ขนส่งเอกชน(ที่อยู่ ลค.)")
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

   async function getShippingVoyage() {
      try {
         const response = await axios.get("/api/shipbilling/voyage")
         const responseData = await response.data
         const voyageReduce = responseData.voyages.reduce(
            (accumulator, currentValue) => [
               ...accumulator,
               { label: currentValue.voyage, value: currentValue.voyage },
            ],
            []
         )
         setVoyageSelectItems(voyageReduce)
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
      if (router.query.voyage) handleChangeSelect(router.query.voyage)
      getShippingVoyage()
   }, [])

   const columns = [
      {
         title: "username",
         dataIndex: "username",
         key: "username",
      },
      {
         title: "ที่อยู่จัดส่ง",
         dataIndex: "address",
         key: "address",
      },
      {
         title: "บริษัทขนส่ง",
         dataIndex: "delivery_by",
         key: "delivery_by",
         filters: [
            {
               text: "ยังไม่เลือก",
               value: "",
            },
            {
               text: "FLASH",
               value: "FLASH",
            },
            {
               text: "KERRY",
               value: "KERRY",
            },
            {
               text: "J&T",
               value: "J&T",
            },
            {
               text: "ปณ",
               value: "ปณ",
            },
            {
               text: "DHL",
               value: "DHL",
            },
         ],
         onFilter: (value, record) =>
            record.delivery_by === null || record.delivery_by === undefined
               ? false
               : record.delivery_by === value,
         render: (txt) => (txt === null || txt === "" ? "-" : txt),
      },
      {
         title: "วันที่จ่ายค่าเรือ",
         dataIndex: "date_pay_voyage",
         key: "date_pay_voyage",
      },
      {
         title: "แจ้งข้อมูลคลอง 4",
         dataIndex: "notify_data_klong4",
         key: "notify_data_klong4",
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
            record.notify_data_klong4 === null || record.notify_data_klong4 === undefined
               ? false
               : record.notify_data_klong4 === value,
         render: (ck, item) => {
            const { shipbilling_id } = item
            const check = ck === 1
            return (
               <Switch
                  checked={check}
                  onClick={(value) =>
                     handleCheck(
                        { notify_data_klong4: value ? 1 : 0 },
                        shipbilling_id
                     )
                  }
               />
            )
         },
      },
      {
         title: "Track No.",
         dataIndex: "track_no",
         key: "track_no",
         render: (txt) => (txt === null || txt === "" ? "-" : txt),
      },
      {
         title: "ค่าขนส่ง",
         dataIndex: "delivery_cost",
         key: "delivery_cost",
         render: (txt) => (txt === null || txt === "" ? "-" : txt),
      },
      {
         title: "จ่ายค่าส่ง",
         dataIndex: "check_pay_delivery_cost",
         key: "check_pay_delivery_cost",
         filters: [
            {
               text: "จ่ายแล้ว",
               value: 1,
            },
            {
               text: "ยังไม่จ่าย",
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
         title: "หมายเหตุ",
         dataIndex: "remark",
         key: "remark",
         render: (txt) => (txt === null || txt === "" ? "-" : txt),
      },
      {
         title: "จัดการ",
         key: "manage",
         render: (item) => (
            <Button onClick={() => handleOpenEditModal(item)}>จัดการ</Button>
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
               <div className="font-bold text-[1.2rem] mb-2">ขนส่งเอกชน</div>
               <Divider />
               <Select
                  className="mb-3"
                  size="middle"
                  defaultValue="เลือกรอบเรือ"
                  value={voyageSelect}
                  onChange={handleChangeSelect}
                  style={{ width: 200 }}
                  options={voyageSelectItems}
               />
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
                  {/* {JSON.stringify(selectedRow)} */}
                  <div className="mb-2">
                     <label>บริษัทขนส่ง: </label>
                     <Select
                        className="w-[180px] mb-1"
                        options={[
                           { label: "กรุณาเลือกบริษัทขนส่ง", value: "" },
                           { label: "FLASH", value: "FLASH" },
                           { label: "KERRY", value: "KERRY" },
                           { label: "J&T", value: "J&T" },
                           { label: "ปณ.", value: "ปณ." },
                           { label: "DHL", value: "DHL" },
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
                     <label>วันที่จ่ายค่าเรือ: </label>
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
                     <label>Track No.:</label>
                     <Input
                        value={selectedRow?.track_no}
                        onChange={(e) =>
                           setSelectedRow((prev) => ({
                              ...prev,
                              track_no: e.target.value,
                           }))
                        }
                     />
                  </div>
                  <div className="mb-2">
                     <label>ค่าขนส่ง:</label>
                     <InputNumber
                        className="w-full"
                        value={selectedRow?.delivery_cost}
                        onChange={(value) => {
                           setSelectedRow((prev) => ({
                              ...prev,
                              delivery_cost: value,
                           }))
                        }}
                     />
                  </div>
                  <div className="mb-2">
                     <label className="mb-2">ที่อยู่จัดส่ง: </label>
                     <TextArea
                        className="mb-1"
                        rows={4}
                        value={selectedRow?.address}
                        onChange={(e) =>
                           setSelectedRow({
                              ...selectedRow,
                              address: e.target.value,
                           })
                        }
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

PrivateTransport.getLayout = function getLayout(page) {
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

export default PrivateTransport
