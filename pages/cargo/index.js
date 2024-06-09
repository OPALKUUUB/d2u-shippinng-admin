/* eslint-disable no-use-before-define */
/* eslint-disable consistent-return */
import React, { useEffect, useState } from "react"
import {
   Col,
   DatePicker,
   Dropdown,
   Form,
   Input,
   InputNumber,
   Modal,
   Row,
   Select,
   Space,
   Spin,
   Switch,
   Table,
   Tag,
   message,
} from "antd"
import { DownOutlined, PlusCircleOutlined } from "@ant-design/icons"
import axios from "axios"
import dayjs from "dayjs"
import Layout from "../../components/layout/layout"
import EditImageModal from "../../components/EditImageModal/EditImageModal"

function CargoPage() {
   const [trigger, setTrigger] = useState(false)
   const [cargo, setCargo] = useState([])
   const [open, setOpen] = useState(false)
   const [selectedRow, setSelectedRow] = useState(null)
   const [loading, setLoading] = useState(false)

   const editCargo = async (item) => {
      try {
         await axios.put(`/api/cargo?id=${item.id}`, item)
         message.success("แก้ไขข้อมูลสำเร็จ")
         setCargo((prev) => {
            const index = prev.findIndex((c) => c.id === item.id)
            return [...prev.slice(0, index), item, ...prev.slice(index + 1)]
         })
      } catch (err) {
         console.log(err)
      }
   }
   const handleCancelEditModal = () => {
      setOpen(false)
      setSelectedRow(null)
   }
   const handleClickEdit = (item) => {
      setSelectedRow(item)
      setOpen(true)
   }
   const handleClickDelete = (id) => {
      if (!window.confirm("Are you sure you want to delete")) {
         return
      }
      alert(id)
   }
   const handleSelectDeliveryType = async (value, item) => {
      setLoading(true)
      await editCargo({ ...item, delivery_type: value })
      setLoading(false)
   }
   const handleChangeIsNotified = async (value, item) => {
      setLoading(true)
      const check = value ? 1 : 0
      await editCargo({ ...item, is_notified: check })
      setLoading(false)
   }
   const handleChangePaymentType = async (value, item) => {
      setLoading(true)
      await editCargo({ ...item, payment_type: value })
      setLoading(false)
   }
   const handleChangeIsInvoiced = async (value, item) => {
      setLoading(true)
      const check = value ? 1 : 0
      await editCargo({ ...item, is_invoiced: check })
      setLoading(false)
   }
   const columns = [
      {
         title: "วันที่",
         dataIndex: "date",
         width: "120px",
         key: "date",
      },
      {
         title: "รูปภาพ",
         dataIndex: "images",
         width: "120px",
         key: "images",
         render: (images, item) => (
            <EditImageModal
               tracking={item}
               images={images}
               setTrigger={setTrigger}
            />
         ),
      },
      {
         title: "ชื่อลูกค้า",
         dataIndex: "username",
         width: "150px",
         key: "username",
      },
      {
         title: "ช่องทางเดิม",
         dataIndex: "channel",
         width: "150px",
         key: "channel",
         render: (text) => {
            const channelList = ['123', 'mercari', 'fril', 'shimizu', 'yahoo']
            const channelColorList = ['magenta', 'red', 'volcano', 'orange', 'gold']
            const chIdx = channelList.findIndex(ch => ch === text)
            const color = channelColorList[chIdx]
            return <Tag color={color}>{text}</Tag>
         }
      },
      {
         title: "เลขแทรกกิงค์",
         dataIndex: "track_no",
         width: "150px",
         key: "track_no",
      },
      {
         title: "รูปแบบจัดส่ง",
         dataIndex: "delivery_type",
         key: "delivery_type",
         width: "150px",
         render: (value, item) => {
            const type = isValid(value) ? value : ""
            // console.log(value)
            const options = [
               { label: "เลือก", value: "" },
               { label: "EMS", value: "EMS" },
               { label: "AIR CARGO", value: "AIR CARGO" },
            ]
            return (
               <Space>
                  <Select
                     value={type}
                     options={options}
                     onChange={(v) => handleSelectDeliveryType(v, item)}
                  />
               </Space>
            )
         },
      },
      {
         title: "เลขกล่อง",
         dataIndex: "box_no",
         key: "box_no",
         width: "120px",
         render: (text) => (isValid(text) ? text : "-"),
      },
      {
         title: "รอบปิด",
         dataIndex: "round_closed",
         key: "round_closed",
         width: "120px",
         render: (text) => (isValid(text) ? text : "-"),
      },
      {
         title: "น้ำหนักจริง",
         dataIndex: "weight_true",
         key: "weight_true",
         width: "120px",
         render: (text) => (isValid(text) ? text : "-"),
      },
      // {
      //    title: "น้ำหนักขนาด",
      //    dataIndex: "weight_size",
      //    key: "weight_size",
      //    width: "120px",
      //    render: (text) => (isValid(text) ? text : "-"),
      // },
      {
         title: "ราคา",
         dataIndex: "price",
         key: "price",
         width: "100px",
         // eslint-disable-next-line no-nested-ternary
         render: (text, row) => (isValid(text) ? text + (row.delivery_type === 'EMS' ? '¥' : (row.delivery_type === 'AIR CARGO' ? '฿' : '𐄹')) : "-"),
      },
      {
         // title: "แจ้งเก็บเงิน",
         title: "ชำระเงินแล้ว",
         dataIndex: "is_notified",
         key: "is_notified",
         width: "120px",
         render: (value, item) => {
            const checked = isValid(value) ? value === 1 : false
            return (
               <Space>
                  <Switch
                     checked={checked}
                     onChange={(v) => handleChangeIsNotified(v, item)}
                  />
               </Space>
            )
         },
      },
      {
         title: "ที่อยู่จัดส่ง",
         dataIndex: "address",
         key: "address",
         width: "150px",
         render: (text) => (isValid(text) ? text : "-"),
      },
      {
         title: "ประเภทการจ่ายเงิน",
         dataIndex: "payment_type",
         key: "payment_type",
         width: "160px",
         render: (value, item) => {
            const type = isValid(value) ? value : ""
            const options = [
               { label: "เลือก", value: "" },
               { label: "แม่มณี", value: "แม่มณี" },
               { label: "บัญชีบริษัท", value: "บัญชีบริษัท" },
               { label: "เงินสด", value: "เงินสด" },
            ]
            return (
               <Space>
                  <Select
                     value={type}
                     options={options}
                     onChange={(v) => handleChangePaymentType(v, item)}
                  />
               </Space>
            )
         },
      },
      {
         title: "รับของสำเร็จ",
         dataIndex: "is_invoiced",
         key: "is_invoiced",
         width: "180px",
         render: (value, item) => {
            const checked = isValid(value) ? value === 1 : false
            return (
               <Space>
                  <Switch
                     checked={checked}
                     onChange={(v) => handleChangeIsInvoiced(v, item)}
                  />
               </Space>
            )
         },
      },
      {
         title: "จัดการ",
         dataIndex: "id",
         key: "manage",
         width: "90px",
         fixed: "right",
         render: (id, item) => {
            const items = [
               {
                  key: "1",
                  label: "แก้ไข",
                  onClick: () => handleClickEdit(item),
               },
               {
                  key: "2",
                  label: "ลบ",
                  onClick: () => handleClickDelete(item.id),
               },
            ]
            return (
               <Space>
                  <Dropdown menu={{ items }}>
                     <span className="cursor-pointer">
                        จัดการ <DownOutlined />
                     </span>
                  </Dropdown>
               </Space>
            )
         },
      },
   ]

   useEffect(() => {
      const fetchData = async () => {
         setLoading(true)
         try {
            const response = await axios.get("/api/cargo")
            setCargo(response.data.cargo)
            console.log(response.data.cargo)
         } catch (err) {
            console.log(err)
         } finally {
            setLoading(false)
         }
      }

      fetchData()
   }, [trigger])

   return (
      <>
         {loading && (
            <div className="fixed top-0 left-0 right-0 bottom-0 bg-[rgba(0,0,0,0.5)] z-10">
               <div className="fixed top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%]">
                  <Spin size="large" />
               </div>
            </div>
         )}
         <div className="m-3 bg-white p-5 rounded-lg">
            <Table
               columns={columns}
               dataSource={cargo}
               scroll={{
                  x: 1500,
                  y: 450,
               }}
            />
            <EditModal
               open={open}
               onCancel={handleCancelEditModal}
               item={selectedRow}
               editCargo={editCargo}
            />
         </div>
      </>
   )
}

function EditModal({ item, open, onCancel, editCargo }) {
   if (!item) {
      return null
   }
   const [confirmLoading, setConfirmLoading] = useState(false)
   const [formData, setFormData] = useState(item)

   const handleSubmit = async () => {
      setConfirmLoading(true)
      await editCargo({ ...formData })
      setConfirmLoading(false)
      onCancel()
   }
   useEffect(() => {
      setFormData(item)
   }, [item])
   return (
      <Modal
         title="แก้ไขข้อมูลการขนส่ง"
         open={open}
         onCancel={onCancel}
         width={600}
         onOk={handleSubmit}
         confirmLoading={confirmLoading}
      >
         <div className="pt-5">
            <EditForm formData={formData} setFormData={setFormData} />
         </div>
      </Modal>
   )
}

function EditForm({ formData, setFormData }) {
   const handleFieldChange = (changedFields, allFields) => {
      const changedField = changedFields[0]
      const fieldName = changedField.name[0]
      const fieldValue = changedField.value
      if (fieldName === "date" || fieldName === "round_closed") {
         setFormData((prevData) => ({
            ...prevData,
            [fieldName]: dayjs(fieldValue, "D/M/YYYY").format("D/M/YYYY"),
         }))
      } else {
         setFormData((prevData) => ({
            ...prevData,
            [fieldName]: fieldValue,
         }))
      }
   }

   const date = !isValid(formData.date)
      ? null
      : dayjs(formData.date, "D/M/YYYY")
   const round_closed = !isValid(formData.round_closed)
      ? null
      : dayjs(formData.round_closed, "D/M/YYYY")
   const trackNo = formData.track_no
   const boxNo = formData.box_no
   const weightTrue = formData.weight_true
   const weightSize = formData.weight_size
   const { price } = formData
   const { address } = formData

   return (
      <Form
         fields={[
            { name: ["date"], value: date },
            { name: ["round_closed"], value: round_closed },
            { name: ["track_no"], value: trackNo },
            { name: ["box_no"], value: boxNo },
            { name: ["weight_true"], value: weightTrue },
            { name: ["weight_size"], value: weightSize },
            { name: ["price"], value: price },
            { name: ["address"], value: address },
         ]}
         onFieldsChange={handleFieldChange}
      >
         <Row gutter={16}>
            <Col>
               <Form.Item label="วันที่" name="date">
                  <DatePicker format="DD/MM/YYYY" />
               </Form.Item>
            </Col>
            <Col>
               <Form.Item label="รอบปิด" name="round_closed">
                  <DatePicker format="DD/MM/YYYY" />
               </Form.Item>
            </Col>
         </Row>
         <Row gutter={16}>
            <Col span={12}>
               <Form.Item label="Track No" name="track_no">
                  <Input />
               </Form.Item>
            </Col>
            <Col span={12}>
               <Form.Item label="Box No" name="box_no">
                  <Input />
               </Form.Item>
            </Col>
         </Row>
         <Row gutter={16}>
            <Col span={8}>
               <Form.Item label="น้ำหนักจริง" name="weight_true">
                  <InputNumber className="w-full" />
               </Form.Item>
            </Col>
            <Col span={8}>
               <Form.Item label="น้ำหนักขนาด" name="weight_size">
                  <InputNumber className="w-full" />
               </Form.Item>
            </Col>
            <Col span={8}>
               <Form.Item label="ราคา" name="price">
                  <InputNumber className="w-full" />
               </Form.Item>
            </Col>
         </Row>
         <Col span={24}>
            <Form.Item label="ที่อยู่จัดส่ง" name="address">
               <Input.TextArea className="w-full" />
            </Form.Item>
         </Col>
      </Form>
   )
}

function AddModal({ item, open, onCancel, editCargo }) {
   const [formData, setFormData] = useState(item)

   // const handleSubmit = async () => {
   //    await editCargo({ ...formData })
   // }
   // useEffect(() => {
   //    setFormData(item)
   // }, [item])
   return (
      <Modal
         title="เพิ่มข้อมูลการขนส่ง"
         open={open}
         onCancel={onCancel}
         width={600}
         // onOk={handleSubmit}
      >
         <div className="pt-5">
            <AddForm formData={formData} setFormData={setFormData} />
         </div>
      </Modal>
   )
}

function AddForm({ formData, setFormData }) {
   return (
      <Form
      // fields={}
      // onFieldsChange={handleFieldChange}
      >
         <Form.Item label="วันที่" name="date">
            <DatePicker format="DD/MM/YYYY" />
         </Form.Item>
         <Form.Item label="Track No" name="track_no">
            <Input />
         </Form.Item>
         <Form.Item label="Box No" name="box_no">
            <Input />
         </Form.Item>
         <Form.Item label="น้ำหนักจริง" name="weight_true">
            <InputNumber className="w-full" />
         </Form.Item>
         <Form.Item label="น้ำหนักขนาด" name="weight_size">
            <InputNumber className="w-full" />
         </Form.Item>
         <Form.Item label="ราคา" name="price">
            <InputNumber className="w-full" />
         </Form.Item>
      </Form>
   )
}

function isValid(text) {
   return text !== null && text !== "" && text !== undefined
}

CargoPage.getLayout = function getLayout(page) {
   return <Layout>{page}</Layout>
}

export default CargoPage
