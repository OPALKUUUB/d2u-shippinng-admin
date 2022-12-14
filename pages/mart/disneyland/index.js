import {
   Button,
   Dropdown,
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
import CardHead from "../../../components/CardHead"
import Layout from "../../../components/layout/layout"

const { TextArea } = Input
const addForm_model = {
   name: "",
   category: "",
   price: null,
   expire_date: "",
   description: "",
   channel: "disneyland",
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
function MartDisneylandPage(props) {
   const [data, setData] = useState(props.products)
   const [addForm, setAddForm] = useState(addForm_model)
   const [expireDate, setExpireDate] = useState("")
   const [InputDate, setInputDate] = useState(null)
   const [showEditModal, setShowEditModal] = useState(false)
   const [showAddModal, setShowAddModal] = useState(false)
   const [selectedRow, setSelectedRow] = useState(mart_model)
   const [productId, setProductId] = useState("")
   const [fileList, setFileList] = useState([])
   const [showImagesModal, setShowImagesModal] = useState(false)
   console.log(
      "data",
      data.filter((element) => element.name === "test")
   )
   console.log("addForm", addForm)
   console.log("selectedRow", selectedRow)
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
      const body = {
         name: selectedRow.name,
         category: `[${selectedRow.category}]`,
         price: selectedRow.price,
         expire_date: selectedRow.expire_date,
         description: selectedRow.description,
      }
      try {
         const response = await fetch(
            `/api/mart/disneyland?id=${selectedRow.id}`,
            {
               method: "PATCH",
               headers: {
                  "Content-Type": "application/json",
               },
               body: JSON.stringify(body),
            }
         )
         const responseJson = await response.json()
         const { marts } = responseJson
         setData(marts)
         setAddForm(addForm_model)
         setInputDate(null)
         setExpireDate("")
         setShowEditModal(false)
      } catch (err) {
         console.log(err)
      }
   }
   const handleCancelEditModal = () => {
      setShowEditModal(false)
   }

   const handleShowEditModal = (id) => {
      setSelectedRow(data.filter((ft) => ft.id === id)[0])
      setShowEditModal(true)
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
      setShowAddModal(false)
   }
   const handleOpenAddModal = () => {
      setShowAddModal(true)
   }
   const handleOkAddModal = async () => {
      const body = {
         name: addForm.name,
         category: `[${addForm.category}]`,
         price: addForm.price,
         expire_date: addForm.expire_date,
         description: addForm.description,
         channel: addForm.channel,
      }
      try {
         const response = await fetch("/api/mart/disneyland", {
            method: "POST",
            headers: {
               "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
            setExpireDate,
         })
         const responseJson = await response.json()
         const { marts } = responseJson
         setData(marts)
         setAddForm(addForm_model)
         setInputDate(null)
         setExpireDate("")
         setShowAddModal(false)
      } catch (err) {
         console.log(err)
      }
   }
   const onChangeExpireDate = (e) => {
      if (e.target.checked) {
         setExpireDate("หมดอายุไม่น้อยกว่า 3 เดือน")
         setAddForm({
            ...addForm,
            expire_date: "หมดอายุไม่น้อยกว่า 3 เดือน",
         })
      } else {
         setExpireDate("")
         setAddForm({
            ...addForm,
            expire_date: "",
         })
      }
   }
   const onChangeExpireDateSelectedRow = (e) => {
      if (e.target.checked) {
         setExpireDate("หมดอายุไม่น้อยกว่า 3 เดือน")
         setSelectedRow({
            ...selectedRow,
            expire_date: "หมดอายุไม่น้อยกว่า 3 เดือน",
         })
      } else {
         setExpireDate("")
         setSelectedRow({
            ...selectedRow,
            expire_date: "",
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
            const date_a_f = datetime_a.split("/")
            // [y,m,d,h,m,s]
            const datetime_a_f = [
               parseInt(date_a_f[2], 10),
               parseInt(date_a_f[1], 10),
               parseInt(date_a_f[0], 10),
            ]
            const datetime_b = b.created_at
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
               // <ol>
               //    {JSON.parse(text).map((element, index) => (
               //       <li key={index}>{element}</li>
               //    ))}
               // </ol>
               <p>{text}</p>
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
         render: (text) => (text === "" ? "-" : <p>{text}</p>),
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
         <CardHead name="Mart Disneyland Page" />
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
            title="เพิ่มรายการ Disneyland"
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
                  <Input
                     value={addForm.category}
                     onChange={(e) =>
                        setAddForm({
                           ...addForm,
                           category: e.target.value,
                        })
                     }
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
                  <Checkbox onChange={onChangeExpireDate}>
                     หมดอายุไม่น้อยกว่า 3 เดือน
                  </Checkbox>
               </Space>
               {!expireDate ? (
                  <Space>
                     <label>วันที่หมดอายุของสินค้า: </label>
                     <DatePicker
                        defaultValue={null}
                        value={InputDate}
                        format="D/M/YYYY"
                        onChange={(value) => {
                           if (value === null) {
                              setAddForm((prev) => ({
                                 ...prev,
                                 expire_date: "",
                              }))
                              setInputDate(null)
                           } else {
                              setAddForm((prev) => ({
                                 ...prev,
                                 expire_date: new Date(
                                    value
                                 ).toLocaleDateString("th-TH"),
                              }))
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
            title="แก้ไขรายการ Disneyland"
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
                  <Input
                     value={selectedRow.category}
                     onChange={(e) =>
                        setSelectedRow({
                           ...selectedRow,
                           category: e.target.value,
                        })
                     }
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
                  <Checkbox onChange={onChangeExpireDateSelectedRow}>
                     หมดอายุไม่น้อยกว่า 3 เดือน
                  </Checkbox>
               </Space>
               {!expireDate ? (
                  <Space>
                     <label>วันที่หมดอายุของสินค้า: </label>
                     <DatePicker
                        defaultValue={null}
                        value={InputDate}
                        format="D/M/YYYY"
                        onChange={(value) => {
                           if (value === null) {
                              setSelectedRow((prev) => ({
                                 ...prev,
                                 expire_date: "",
                              }))
                              setInputDate(null)
                           } else {
                              setSelectedRow((prev) => ({
                                 ...prev,
                                 expire_date: new Date(
                                    value
                                 ).toLocaleDateString("th-TH"),
                              }))
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

MartDisneylandPage.getLayout = function getLayout(page) {
   return <Layout>{page}</Layout>
}

export async function getServerSideProps(context) {
   const session = await getSession({ req: context.req })
   const api = `${process.env.BACKEND_URL}/api/mart/disneyland`
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
export default MartDisneylandPage
