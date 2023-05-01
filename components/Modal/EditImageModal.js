import { Button, Modal, Space, Upload } from "antd"

import { UploadOutlined } from "@ant-design/icons"
import React, { useEffect, useState } from "react"
import axios from "axios"
// images, open, onCancel, onOk
function EditImageModal(props) {
   const data = props.item
   const [confirmLoading, setConfirmLoading] = useState(false)
   const [fileList, setFileList] = useState([])
   const onChange = ({ fileList: newFileList }) => {
      setFileList(newFileList)
   }
   const handleOk = async () => {
      setConfirmLoading(true)
      const images = await Promise.all(
         fileList.map(async (cur) => {
            const file = cur
            const src = await new Promise((resolve) => {
               const reader = new FileReader()
               reader.readAsDataURL(file.originFileObj)
               reader.onload = () => resolve(reader.result)
            })
            const image = new Image()
            image.src = src
            return image.src
         })
      )
      try {
         const responseJson = await axios.post(
            `/api/shipbilling/upload/image/${data.shipbilling_id}`,
            { images }
         )
         props.setData((prev) => {
            const index = prev.findIndex(
               (fi) => fi.shipbilling_id === data.shipbilling_id
            )
            return [
               ...prev.slice(0, index),
               { ...data, slip_image: responseJson.data.image },
               ...prev.slice(index + 1),
            ]
         })
      } catch (err) {
         console.log(err)
      } finally {
         setConfirmLoading(false)
         props.onCancel()
      }
   }
   useEffect(() => {
      if (
         data.slip_image === "" ||
         data.slip_image === null ||
         data.slip_image === undefined
      ) {
         setFileList([])
      } else {
         setFileList([
            {
               uid: `slip-image-${data.shipbilling_id}`,
               name: `slip-image-${data.shipbilling_id}`,
               url: data.slip_image,
            },
         ])
      }
   }, [props.item])
   return (
      <Modal
         title="เพิ่มรูปภาพสลิป"
         open={props.open}
         onCancel={props.onCancel}
         onOk={handleOk}
         confirmLoading={confirmLoading}
      >
         <Space
            direction="vertical"
            style={{
               width: "100%",
            }}
            size="large"
         >
            <Upload
               fileList={fileList}
               listType="picture"
               onChange={onChange}
               maxCount={1}
            >
               <Button icon={<UploadOutlined />}>Upload Slip</Button>
            </Upload>
         </Space>
      </Modal>
   )
}

export default EditImageModal
