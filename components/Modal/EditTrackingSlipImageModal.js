import { Button, Modal, Space, Upload } from "antd"

import { UploadOutlined } from "@ant-design/icons"
import React, { useEffect, useState } from "react"
import axios from "axios"
// images, open, onCancel, onOk
function EditTrackingSlipImageModal(props) {
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
         const responseJson = await axios.put(
            `/api/tracking-slip-image/${data.id}`,
            {
               tracking_slip_image: images.length > 0 ? images[0] : null,
               channel: "slip",
            }
         )
         props.setData((prev) => {
            const index = prev.findIndex((fi) => fi.id === data.id)
            return [
               ...prev.slice(0, index),
               {
                  ...data,
                  tracking_slip_image: responseJson.data.tracking_slip_image,
               },
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
         data.tracking_slip_image === "" ||
         data.tracking_slip_image === null ||
         data.tracking_slip_image === undefined
      ) {
         setFileList([])
      } else {
         setFileList([
            {
               uid: `tracking_slip-image-${data.id}`,
               name: `tracking_slip-image-${data.id}`,
               url: data.tracking_slip_image,
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

export default EditTrackingSlipImageModal
