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
   Switch,
   Table,
} from "antd"
import { DownOutlined } from "@ant-design/icons"
import axios from "axios"
import dayjs from "dayjs"
import moment from "moment"
import Layout from "../../components/layout/layout"
import EditImageModal from "../../components/EditImageModal/EditImageModal"

function CargoPage() {
   const [trigger, setTrigger] = useState(false)
   const [cargo, setCargo] = useState([])
   const [open, setOpen] = useState(false)
   const [selectedRow, setSelectedRow] = useState(null)

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
            const options = [
               { label: "เลือก", value: "" },
               { label: "EMS", value: "EMS" },
               { label: "AIR CARGO", value: "AIR CARGO" },
            ]
            return (
               <Space>
                  <Select value={type} options={options} />
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
         title: "น้ำหนักจริง",
         dataIndex: "weight_true",
         key: "weight_true",
         width: "120px",
         render: (text) => (isValid(text) ? text : "-"),
      },
      {
         title: "น้ำหนักขนาด",
         dataIndex: "weight_size",
         key: "weight_size",
         width: "120px",
         render: (text) => (isValid(text) ? text : "-"),
      },
      {
         title: "ราคา",
         dataIndex: "price",
         key: "price",
         width: "100px",
         render: (text) => (isValid(text) ? text : "-"),
      },
      {
         title: "แจ้งเก็บเงิน",
         dataIndex: "is_notified",
         key: "is_notified",
         width: "120px",
         render: (value, item) => {
            const checked = isValid(value) ? value === 1 : false
            return (
               <Space>
                  <Switch checked={checked} />
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
         width: "120px",
         render: (value, item) => {
            const type = isValid(value) ? value : ""
            const options = [
               { label: "เลือก", value: "" },
               { label: "type 1", value: "type 1" },
               { label: "type 2", value: "type 2" },
            ]
            return (
               <Space>
                  <Select value={type} options={options} />
               </Space>
            )
         },
      },
      {
         title: "แจ้งวางบิล",
         dataIndex: "is_invoiced",
         key: "is_invoiced",
         width: "180px",
         render: (value, item) => {
            const checked = isValid(value) ? value === 1 : false
            return (
               <Space>
                  <Switch checked={checked} />
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
         try {
            const response = await axios.get("/api/cargo")
            setCargo(response.data.cargo)
         } catch (err) {
            console.log(err)
         }
      }

      fetchData()
   }, [trigger])

   return (
      <div className="m-3">
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
         />
      </div>
   )
}

function EditModal({ item, open, onCancel }) {
   if (!item) {
      return null
   }
   const [formData, setFormData] = useState(item)

   const handleSubmit = () => {
      console.log(formData)
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

      setFormData((prevData) => ({
         ...prevData,
         [fieldName]: fieldValue,
      }))
   }

   const date = !isValid(formData.date)
      ? null
      : dayjs(formData.date, "D/M/YYYY")
   const trackNo = formData.track_no
   const boxNo = formData.box_no
   const weightTrue = formData.weight_true
   const weightSize = formData.weight_size
   const { price } = formData

   return (
      <Form
         fields={[
            { name: ["date"], value: date },
            { name: ["track_no"], value: trackNo },
            { name: ["box_no"], value: boxNo },
            { name: ["weight_true"], value: weightTrue },
            { name: ["weight_size"], value: weightSize },
            { name: ["price"], value: price },
         ]}
         onFieldsChange={handleFieldChange}
      >
         <Col>
            <Form.Item label="วันที่" name="date">
               <DatePicker format="DD/MM/YYYY" />
            </Form.Item>
         </Col>
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
