import { Button, Dropdown, Input, Modal, Space, Table, Upload } from "antd"
import { AppstoreAddOutlined, DownOutlined } from "@ant-design/icons"
import React, { Fragment, useState } from "react"
import { getSession } from "next-auth/react"
import CardHead from "../../../components/CardHead"
import Layout from "../../../components/layout/layout"

const { TextArea } = Input
const mart_model = {
   id: "",
   name: "",
   category: "[]",
   price: "",
   expire_date: "",
   description: "",
   channel: "",
   created_at: "",
   updated_at: "",
}
function MartDonkiPage(props) {
   const [data, setData] = useState(props.products)
   const [showEditModal, setShowEditModal] = useState(false)
   const [selectedRow, setSelectedRow] = useState(mart_model)
   const [productId, setProductId] = useState("")
   const [fileList, setFileList] = useState([])
   const [showImagesModal, setShowImagesModal] = useState(false)
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
   const handleOkEditModal = () => {
      setShowEditModal(false)
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
   const columns = [
      {
         title: "วันที่",
         dataIndex: "created_at",
         width: "120px",
         key: "created_at",
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
      },
      {
         title: "รายละเอียด",
         dataIndex: "description",
         width: "120px",
         key: "description",
         render: (text) => <p>{text}</p>,
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
   return (
      <Fragment>
         <CardHead name="Mart Donki Page" />
         <div className="container-table">
            <Button icon={<AppstoreAddOutlined />}>เพิ่มรายการ</Button>
            <Table columns={columns} dataSource={data} />
         </div>
         <Modal
            title="เพิ่มรายการ Donki"
            open={showEditModal}
            onCancel={handleCancelEditModal}
            onOk={handleOkEditModal}
         >
            <div>
               <label>ชื่อสินค้า: </label>
               <Input
                  value={selectedRow.name}
                  onChange={(value) => console.log(value)}
               />
               <label>รายละเอียด: </label>
               <TextArea rows={4} value={selectedRow.description} />
            </div>
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

MartDonkiPage.getLayout = function getLayout(page) {
   return <Layout>{page}</Layout>
}

export async function getServerSideProps(context) {
   const session = await getSession({ req: context.req })
   const api = `${process.env.BACKEND_URL}/api/mart/donki`
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
export default MartDonkiPage
