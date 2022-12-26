/* eslint-disable indent */
/* eslint-disable no-nested-ternary */
import {
   Button,
   Dropdown,
   Select,
   Input,
   InputNumber,
   Checkbox,
   DatePicker,
   Modal,
   Space,
   Table,
   Upload,
} from "antd"
import { AppstoreAddOutlined, DownOutlined } from "@ant-design/icons"
import React, { Fragment, useState } from "react"
import { getSession } from "next-auth/react"
import dayjs from "dayjs"
import CardHead from "../../../components/CardHead"
import Layout from "../../../components/layout/layout"

const { TextArea } = Input
const addForm_model = {
   name: "",
   category: "",
   price: null,
   expire_date: "",
   description: "",
   channel: "omni7",
}
const mart_model = {
   id: "",
   name: "",
   category: "",
   price: null,
   expire_date: "",
   description: "",
   channel: "",
   created_at: "",
   updated_at: "",
}
function MartOmni7Page(props) {
   const [data, setData] = useState(props.products)
   const [addForm, setAddForm] = useState(addForm_model)
   const [InputDate, setInputDate] = useState(null)
   const [expireDate, setExpireDate] = useState("")
   const [checked, setChecked] = useState(false)
   const [multipleCategory, setMultipleCategory] = useState([])
   const [showEditModal, setShowEditModal] = useState(false)
   const [showAddModal, setShowAddModal] = useState(false)
   const [showDeleteModal, setShowDeleteModal] = useState(false)
   const [selectedRow, setSelectedRow] = useState(mart_model)
   const [productId, setProductId] = useState("")
   const [fileList, setFileList] = useState([])
   const [showImagesModal, setShowImagesModal] = useState(false)
   // console.log(
   //    "data",
   //    data.filter((element) => element.name === "test")
   // )
   // console.log("data", data)
   // console.log("addForm", addForm)
   // console.log("selectedRow", selectedRow)
   // console.log("InputDate", InputDate)
   // console.log(
   //    "InputDateString",
   //    InputDate !== null
   //       ? new Date(InputDate).toLocaleDateString("th-TH")
   //       : InputDate
   // )
   const OPTIONS = [
      { label: "7 Premium", value: "7 Premium" },
      { label: "ข้าวและข้าวเหนียว", value: "ข้าวและข้าวเหนียว" },
      { label: "บะหมี่สำเร็จรูป", value: "บะหมี่สำเร็จรูป" },
      { label: "เครื่องปรุงและเครื่องเทศ", value: "เครื่องปรุงและเครื่องเทศ" },
      { label: "อาหารแห้ง", value: "อาหารแห้ง" },
      { label: "อาหารกระป๋อง", value: "อาหารกระป๋อง" },
      { label: "น้ำ", value: "น้ำ" },
      { label: "กาแฟ", value: "กาแฟ" },
      { label: "ชาต่างๆ", value: "ชาต่างๆ" },
      { label: "ชาดำ", value: "ชาดำ" },
      { label: "น้ำอัดลม", value: "น้ำอัดลม" },
      { label: "เครื่องดื่มกีฬา", value: "เครื่องดื่มกีฬา" },
      { label: "อาหาร เครื่องดื่ม", value: "อาหาร เครื่องดื่ม" },
      { label: "บ้าน และครัว", value: "บ้าน และครัว" },
      { label: "เครื่องสำอางค์และความงาม", value: "เครื่องสำอางค์และความงาม" },
      { label: "อุปกรณ์เครื่องเขียน", value: "อุปกรณ์เครื่องเขียน" },
   ]
   const filteredOptions = OPTIONS.filter(
      (ele) => !multipleCategory.includes(ele.value)
   )
   // console.log("multipleCategory", multipleCategory)
   // console.log("filteredOptions", filteredOptions)
   const onChange = ({ fileList: newFileList }) => {
      setFileList(newFileList)
   }
   const onPreview = async (file) => {
      let src = file.url
      if (!src) {
         src = await new Promise((resolve) => {
            const reader = new FileReader()
            reader.readAsDataURL(file.originFileObj)
            reader.onload = () => resolve(reader.result)
         })
      }
      const image = new Image()
      image.src = src
      const imgWindow = window.open(src)
      imgWindow?.document.write(image.outerHTML)
   }
   const handleOkUploadImages = async () => {
      try {
         const doneImage =
            fileList.map((file, index) => ({
               id: index,
               name: file.name,
               status: file.status,
               uid: file.uid,
               url: file.url ? file.url : file.thumbUrl,
            })) || []
         const response = await fetch(
            `/api/mart/images?product_id=${productId}`,
            {
               method: "PATCH",
               headers: { "Content-Type": "application/json" },
               body: JSON.stringify({ doneImage }),
            }
         )
         const responseJson = await response.json()
         setShowImagesModal(false)
      } catch (err) {
         console.log(err)
      }
   }
   const handleCancelImagesModal = () => {
      setShowImagesModal(false)
   }
   const handleOkEditModal = async () => {
      const valueMultipleCategory = [
         { label: "7 Premium", value: "1" },
         { label: "ข้าวและข้าวเหนียว", value: "2" },
         { label: "บะหมี่สำเร็จรูป", value: "3" },
         {
            label: "เครื่องปรุงและเครื่องเทศ",
            value: "4",
         },
         { label: "อาหารแห้ง", value: "5" },
         { label: "อาหารกระป๋อง", value: "6" },
         { label: "น้ำ", value: "7" },
         { label: "กาแฟ", value: "8" },
         { label: "ชาต่างๆ", value: "9" },
         { label: "ชาดำ", value: "10" },
         { label: "น้ำอัดลม", value: "11" },
         { label: "เครื่องดื่มกีฬา", value: "12" },
         { label: "อาหาร เครื่องดื่ม", value: "13" },
         { label: "บ้าน และครัว", value: "14" },
         {
            label: "เครื่องสำอางค์และความงาม",
            value: "15",
         },
         { label: "อุปกรณ์เครื่องเขียน", value: "16" },
      ]
      const arrayMultipleCategory = multipleCategory.reduce(
         (result, current) => [
            ...result,
            ...valueMultipleCategory.filter((ele) => ele.label === current),
         ],
         []
      )
      const body = {
         name: selectedRow.name,
         category: JSON.stringify(arrayMultipleCategory),
         price: selectedRow.price,
         expire_date:
            selectedRow.expire_date === "หมดอายุไม่น้อยกว่า 3 เดือน" && checked
               ? selectedRow.expire_date
               : InputDate !== null
               ? new Date(InputDate).toLocaleDateString("th-TH")
               : "",
         description: selectedRow.description,
      }
      // console.log("selectedRowBody", body)
      try {
         const response = await fetch(`/api/mart/omni7?id=${selectedRow.id}`, {
            method: "PATCH",
            headers: {
               "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
         })
         const responseJson = await response.json()
         const { marts } = responseJson
         setData(marts)
         setSelectedRow(mart_model)
         setInputDate(null)
         setExpireDate("")
         setChecked(false)
         setMultipleCategory([])
         setShowEditModal(false)
      } catch (err) {
         console.log(err)
      }
   }
   const handleCancelEditModal = () => {
      setInputDate(null)
      setExpireDate("")
      setChecked(false)
      setMultipleCategory([])
      setShowEditModal(false)
   }

   const handleShowEditModal = (id) => {
      const keepExpireDate = data
         .filter((ft) => ft.id === id)[0]
         .expire_date.split("/")
      // console.log("expireDate", keepExpireDate)
      // console.log(
      //    "expireDateDayjs",
      //    dayjs(
      //       `${parseInt(keepExpireDate[0], 10)}/${parseInt(
      //          keepExpireDate[1],
      //          10
      //       )}/${parseInt(keepExpireDate[2], 10) - 543}`,
      //       "D/M/YYYY"
      //    )
      // )
      const newMultipleCategory =
         data.filter((ft) => ft.id === id)[0].category === "[]"
            ? []
            : JSON.parse(data.filter((ft) => ft.id === id)[0].category)
      setMultipleCategory(newMultipleCategory.map((ele) => ele.label))
      setSelectedRow(data.filter((ft) => ft.id === id)[0])
      setExpireDate(data.filter((ft) => ft.id === id)[0].expire_date)
      if (keepExpireDate.length === 1) {
         setInputDate(null)
      } else {
         setInputDate(
            dayjs(
               `${parseInt(keepExpireDate[0], 10)}/${parseInt(
                  keepExpireDate[1],
                  10
               )}/${parseInt(keepExpireDate[2], 10) - 543}`,
               "D/M/YYYY"
            )
         )
      }
      if (
         data.filter((ft) => ft.id === id)[0].expire_date ===
         "หมดอายุไม่น้อยกว่า 3 เดือน"
      ) {
         setChecked(true)
      }
      setShowEditModal(true)
   }
   const handleShowDeleteModal = (id) => {
      setSelectedRow(data.filter((ft) => ft.id === id)[0])
      setShowDeleteModal(true)
   }
   const handleCancelDeleteModal = () => {
      setSelectedRow(mart_model)
      setShowDeleteModal(false)
   }

   const handleDeleteEditModal = async (id) => {
      try {
         const response = await fetch(`/api/mart/omni7?id=${id}`, {
            method: "DELETE",
            headers: {
               "Content-Type": "application/json",
            },
            body: JSON.stringify({ id: selectedRow.id }),
         })
         const responseJson = await response.json()
         const { marts } = responseJson
         setData(marts)
         setShowDeleteModal(false)
      } catch (err) {
         console.log(err)
      }
   }
   const handleShowImages = async (id) => {
      // set images by fetch id tracking
      try {
         const response = await fetch(`/api/mart/images?id=${id}`)
         const responseJson = await response.json()
         const { product_image } = responseJson
         const new_product_image = product_image.reduce(
            (accumulator, currentValue, index) => [
               ...accumulator,
               {
                  uid: index,
                  name: `image${index}.png`,
                  status: "done",
                  url: currentValue.image,
                  id: currentValue.id,
               },
            ],
            []
         )
         setProductId(id)
         setFileList(new_product_image)
      } catch (err) {
         console.log(err)
      }
      setShowImagesModal(true)
   }
   const handleCancelAddModal = () => {
      setAddForm(addForm_model)
      setInputDate(null)
      setChecked(false)
      setMultipleCategory([])
      setShowAddModal(false)
   }
   const handleOpenAddModal = () => {
      setShowAddModal(true)
   }
   const handleOkAddModal = async () => {
      const valueMultipleCategory = [
         { label: "7 Premium", value: "1" },
         { label: "ข้าวและข้าวเหนียว", value: "2" },
         { label: "บะหมี่สำเร็จรูป", value: "3" },
         {
            label: "เครื่องปรุงและเครื่องเทศ",
            value: "4",
         },
         { label: "อาหารแห้ง", value: "5" },
         { label: "อาหารกระป๋อง", value: "6" },
         { label: "น้ำ", value: "7" },
         { label: "กาแฟ", value: "8" },
         { label: "ชาต่างๆ", value: "9" },
         { label: "ชาดำ", value: "10" },
         { label: "น้ำอัดลม", value: "11" },
         { label: "เครื่องดื่มกีฬา", value: "12" },
         { label: "อาหาร เครื่องดื่ม", value: "13" },
         { label: "บ้าน และครัว", value: "14" },
         {
            label: "เครื่องสำอางค์และความงาม",
            value: "15",
         },
         { label: "อุปกรณ์เครื่องเขียน", value: "16" },
      ]
      const arrayMultipleCategory = multipleCategory.reduce(
         (result, current) => [
            ...result,
            ...valueMultipleCategory.filter((ele) => ele.label === current),
         ],
         []
      )
      // console.log("arrayMultipleCategory", arrayMultipleCategory)
      const body = {
         name: addForm.name,
         category: JSON.stringify(arrayMultipleCategory),
         price: addForm.price,
         expire_date:
            addForm.expire_date === "หมดอายุไม่น้อยกว่า 3 เดือน"
               ? addForm.expire_date
               : InputDate !== null
               ? new Date(InputDate).toLocaleDateString("th-TH")
               : "",
         description: addForm.description,
         channel: addForm.channel,
      }
      // console.log("body", body)
      try {
         const response = await fetch("/api/mart/omni7", {
            method: "POST",
            headers: {
               "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
         })
         const responseJson = await response.json()
         const { marts } = responseJson
         setData(marts)
         setAddForm(addForm_model)
         setInputDate(null)
         setChecked(false)
         setMultipleCategory([])
         setShowAddModal(false)
      } catch (err) {
         console.log(err)
      }
   }
   const onChangeExpireDate = (e) => {
      setChecked(e.target.checked)
      if (e.target.checked) {
         setAddForm({
            ...addForm,
            expire_date: "หมดอายุไม่น้อยกว่า 3 เดือน",
         })
      } else {
         setAddForm({
            ...addForm,
            expire_date: "",
         })
      }
   }
   const onChangeExpireDateSelectedRow = (e) => {
      setChecked(e.target.checked)
      if (e.target.checked) {
         setSelectedRow({
            ...selectedRow,
            expire_date: "หมดอายุไม่น้อยกว่า 3 เดือน",
         })
      } else {
         setSelectedRow({
            ...selectedRow,
            expire_date: expireDate,
         })
      }
   }
   const columns = [
      {
         title: "วันที่",
         dataIndex: "created_at",
         width: "120px",
         key: "created_at",
         sorter: (a, b) => {
            const datetime_a = a.created_at
            const date_a = datetime_a.split(" ")[0]
            const time_a = datetime_a.split(" ")[1]
            const date_a_f = date_a.split("/")
            const time_a_f = time_a.split(":")
            // [y,m,d,h,m,s]
            const datetime_a_f = [
               parseInt(date_a_f[2], 10),
               parseInt(date_a_f[1], 10),
               parseInt(date_a_f[0], 10),
               parseInt(time_a_f[0], 10),
               parseInt(time_a_f[1], 10),
               parseInt(time_a_f[2], 10),
            ]
            const datetime_b = b.created_at
            const date_b = datetime_b.split(" ")[0]
            const time_b = datetime_b.split(" ")[1]
            const date_b_f = date_b.split("/")
            const time_b_f = time_b.split(":")
            const datetime_b_f = [
               parseInt(date_b_f[2], 10),
               parseInt(date_b_f[1], 10),
               parseInt(date_b_f[0], 10),
               parseInt(time_b_f[0], 10),
               parseInt(time_b_f[1], 10),
               parseInt(time_b_f[2], 10),
            ]
            for (let i = 0; i < 6; i++) {
               if (datetime_a_f[i] - datetime_b_f[i] !== 0) {
                  return datetime_a_f[i] - datetime_b_f[i]
               }
            }
            return 0
         },
         render: (text) => (
            <>
               <p>{text.split(" ")[0]}</p>
               <p>{text.split(" ")[1]}</p>
            </>
         ),
      },
      {
         title: "รูปสินค้า",
         dataIndex: "id",
         width: "120px",
         key: "id",
         render: (id) => (
            <Button onClick={() => handleShowImages(id)}>ดูรูปภาพ</Button>
         ),
      },
      {
         title: "ชื่อสินค้า",
         dataIndex: "name",
         width: "120px",
         key: "name",
         render: (text) => (text === "" ? "-" : text),
      },
      {
         title: "หมวดหมู่สินค้า",
         dataIndex: "category",
         width: "120px",
         key: "category",
         render: (text) =>
            text === "[]" ? (
               "-"
            ) : (
               <ol style={{ marginBottom: 0 }}>
                  {JSON.parse(text).map((element, index) => (
                     <li key={index}>{element.label}</li>
                  ))}
               </ol>
            ),
      },
      {
         title: "ราคาสินค้า",
         dataIndex: "price",
         width: "120px",
         key: "price",
         render: (text) => (text === null ? "-" : text),
      },
      {
         title: "วันหมดอายุของสินค้า",
         dataIndex: "expire_date",
         width: "120px",
         key: "expire_date",
         render: (text) => (text === "" ? "-" : text),
      },
      {
         title: "รายละเอียดสินค้า",
         dataIndex: "description",
         width: "120px",
         key: "description",
         render: (text) => (text === "" ? "-" : text),
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
                  onClick: () => handleShowDeleteModal(id),
               },
            ]
            return (
               <Space>
                  <Dropdown menu={{ items }}>
                     <span style={{ cursor: "pointer" }}>
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
         <CardHead name="Mart 7-Eleven Page" />
         <div className="container-table">
            <div style={{ marginBottom: "10px" }}>
               <Button
                  icon={<AppstoreAddOutlined />}
                  onClick={handleOpenAddModal}
               >
                  เพิ่มรายการ
               </Button>
            </div>
            <Table columns={columns} dataSource={data} />
         </div>
         <Modal
            title="เพิ่มรายการ 7-Eleven"
            open={showAddModal}
            onCancel={handleCancelAddModal}
            onOk={handleOkAddModal}
         >
            <Space direction="vertical" style={{ margin: "10px auto" }}>
               <Space>
                  <label>ชื่อสินค้า: </label>
                  <Input
                     value={addForm.name}
                     onChange={(e) =>
                        setAddForm({
                           ...addForm,
                           name: e.target.value,
                        })
                     }
                  />
               </Space>
               <Space>
                  <label>หมวดหมู่สินค้า: </label>
                  <Select
                     mode="multiple"
                     value={multipleCategory}
                     onChange={setMultipleCategory}
                     style={{ width: 200 }}
                     options={filteredOptions}
                  />
               </Space>
               <Space>
                  <label>ราคาสินค้า: </label>
                  <InputNumber
                     value={addForm.price}
                     onChange={(value) =>
                        setAddForm({
                           ...addForm,
                           price: value,
                        })
                     }
                     step="0.1"
                  />
               </Space>
               <Space>
                  <Checkbox onChange={onChangeExpireDate} checked={checked}>
                     หมดอายุไม่น้อยกว่า 3 เดือน
                  </Checkbox>
               </Space>
               {!addForm.expire_date ? (
                  <Space>
                     <label>วันที่หมดอายุของสินค้า: </label>
                     <DatePicker
                        defaultValue={null}
                        value={InputDate}
                        format="D/M/YYYY"
                        onChange={(value) => {
                           if (value === null) {
                              setInputDate(null)
                           } else {
                              setInputDate(value)
                           }
                        }}
                     />
                  </Space>
               ) : null}
               <Space>
                  <label>รายละเอียดสินค้า: </label>
                  <TextArea
                     rows={4}
                     value={addForm.description}
                     onChange={(e) => {
                        setAddForm({
                           ...addForm,
                           description: e.target.value,
                        })
                     }}
                  />
               </Space>
            </Space>
         </Modal>
         <Modal
            title="แก้ไขรายการ 7-Eleven"
            open={showEditModal}
            onCancel={handleCancelEditModal}
            onOk={handleOkEditModal}
         >
            <Space direction="vertical" style={{ margin: "10px auto" }}>
               <Space>
                  <label>ชื่อสินค้า: </label>
                  <Input
                     value={selectedRow.name}
                     onChange={(e) =>
                        setSelectedRow({
                           ...selectedRow,
                           name: e.target.value,
                        })
                     }
                  />
               </Space>
               <Space>
                  <label>หมวดหมู่สินค้า: </label>
                  <Select
                     mode="multiple"
                     value={multipleCategory}
                     onChange={setMultipleCategory}
                     style={{ width: 200 }}
                     options={filteredOptions}
                  />
               </Space>
               <Space>
                  <label>ราคาสินค้า: </label>
                  <InputNumber
                     value={selectedRow.price}
                     onChange={(value) =>
                        setSelectedRow({
                           ...selectedRow,
                           price: value,
                        })
                     }
                     step="0.1"
                  />
               </Space>
               <Space>
                  <Checkbox
                     onChange={onChangeExpireDateSelectedRow}
                     checked={checked}
                  >
                     หมดอายุไม่น้อยกว่า 3 เดือน
                  </Checkbox>
               </Space>
               {!checked ? (
                  <Space>
                     <label>วันที่หมดอายุของสินค้า: </label>
                     <DatePicker
                        defaultValue={InputDate}
                        value={InputDate}
                        format="D/M/YYYY"
                        onChange={(value) => {
                           if (value === null) {
                              setInputDate(null)
                           } else {
                              setInputDate(value)
                           }
                        }}
                     />
                  </Space>
               ) : null}
               <Space>
                  <label>รายละเอียดสินค้า: </label>
                  <TextArea
                     rows={4}
                     value={selectedRow.description}
                     onChange={(e) => {
                        setSelectedRow({
                           ...selectedRow,
                           description: e.target.value,
                        })
                     }}
                  />
               </Space>
            </Space>
         </Modal>
         <Modal
            title="เพิ่มรูปภาพ"
            open={showImagesModal}
            onCancel={handleCancelImagesModal}
            onOk={handleOkUploadImages}
         >
            <div>
               <Upload
                  listType="picture-card"
                  fileList={fileList}
                  onChange={onChange}
                  onPreview={onPreview}
               >
                  {fileList.length < 7 && "+ Upload"}
               </Upload>
            </div>
         </Modal>
         <Modal
            title="คุณต้องการลบหรือไม่"
            open={showDeleteModal}
            onCancel={handleCancelDeleteModal}
            onOk={() => handleDeleteEditModal(selectedRow.id)}
         ></Modal>
         <style jsx>
            {`
               .container-table {
                  background: white;
                  margin: 10px;
                  padding: 10px;
               }
            `}
         </style>
      </Fragment>
   )
}

MartOmni7Page.getLayout = function getLayout(page) {
   return <Layout>{page}</Layout>
}

export async function getServerSideProps(context) {
   const session = await getSession({ req: context.req })
   const api = `/api/mart/omni7`
   const response = await fetch(api)
   const responseJson = await response.json()
   const { products } = await responseJson
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
         products,
      },
   }
}
export default MartOmni7Page
