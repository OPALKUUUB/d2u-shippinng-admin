/* eslint-disable no-nested-ternary */
import { FileAddOutlined, UploadOutlined } from "@ant-design/icons"
import {
   Button,
   Col,
   DatePicker,
   Form,
   Input,
   Row,
   Upload,
   message,
} from "antd"
import axios from "axios"
import dayjs from "dayjs"
import { useState } from "react"
import PasteImage from "./PasteImage"

const { TextArea } = Input

const MoneyInModel = {
   datetime: "",
   payment_type: "",
   total: "",
   remark: "",
   image: "",
}

function CreateMoneyInForm({ onCreateMoneyInList, selectedRowKeys }) {
   const [moneyInForm, setMoneyInForm] = useState(MoneyInModel)
   const [fileList, setFileList] = useState([])
   const [form] = Form.useForm()
   const [loadings, setLoadings] = useState(false)

   const handlePasteImage = async (e) => {
      const items = e.clipboardData?.items
      if (!items) return

      // Look for an image among the pasted items
      const blob = Array.from(items)
         .filter((item) => item.type.indexOf("image") !== -1)
         .map((item) => item.getAsFile())[0]

      // If an image is found, read it as a data URL and add it to the file list
      if (blob) {
         const reader = new FileReader()
         reader.readAsDataURL(blob)
         reader.onload = () => {
            const newFileList = [
               {
                  uid: `paste-${Date.now()}`,
                  name: blob.name,
                  type: blob.type,
                  size: blob.size,
                  originFileObj: blob,
                  url: reader.result,
                  status: "done",
               },
            ]
            setFileList(newFileList)
         }
      }
   }

   const onPreview = async (file) => {
      // let src = file.url
      let src = file.url || file.thumbUrl
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
   const handleChangeFileList = (event) => {
      setFileList(event.fileList)
   }
   const handleInputChange = (fieldName, value) => {
      const formattedValue =
         fieldName === "datetime"
            ? value === null
               ? ""
               : dayjs(value).format("DD/MM/YYYY HH:mm")
            : value
      setMoneyInForm((prevMoneyInForm) => ({
         ...prevMoneyInForm,
         [fieldName]: formattedValue,
      }))
   }
   const onFinish = async () => {
      const body = moneyInForm
      try {
         setLoadings(true)
         if (fileList.length > 0) {
            const images = await Promise.all(
               fileList.map(async (curr) => {
                  const src = await new Promise((resolve) => {
                     const reader = new FileReader()
                     reader.readAsDataURL(curr.originFileObj)
                     reader.onload = () => resolve(reader.result)
                  })
                  const image = new Image()
                  image.src = src
                  return image.src
               })
            )
            const response = await axios.post("/api/upload", { images })
            body.image = response.data.imageURL
         }
         await onCreateMoneyInList(body)
      } catch (err) {
         console.log(err)
      } finally {
         form.resetFields()
         setFileList([])
         setLoadings(false)
      }
   }
   const onFinishFailed = (errorInfo) => {
      errorInfo.errorFields.map((err) =>
         err.errors.map((msg) => message.error(msg))
      )
      console.log("Failed:", errorInfo)
   }

   return (
      <Form form={form} onFinish={onFinish} onFinishFailed={onFinishFailed}>
         <Form.Item name="datetime">
            <DatePicker
               format="DD/MM/YYYY HH:mm"
               showTime
               placeholder="กรอกวันที่และเวลา"
               value={
                  moneyInForm.datetime === null || moneyInForm.datetime === ""
                     ? ""
                     : dayjs(moneyInForm.datetime, "DD/MM/YYYY HH:mm")
               }
               onChange={(date) => handleInputChange("datetime", date)}
            />
         </Form.Item>
         <Row gutter={16}>
            <Col span={12}>
               <Form.Item name="payment_type">
                  <Input
                     placeholder="กรอกประเภทการชำระเงิน"
                     value={moneyInForm.payment_type}
                     onChange={(e) =>
                        handleInputChange("payment_type", e.target.value)
                     }
                  />
               </Form.Item>
            </Col>
            <Col span={12}>
               <Form.Item name="total">
                  <Input
                     type="number"
                     placeholder="กรอกจำนวนเงิน"
                     value={moneyInForm.total}
                     onChange={(e) =>
                        handleInputChange("total", e.target.value)
                     }
                  />
               </Form.Item>
            </Col>
         </Row>
         <Form.Item name="remark">
            <TextArea
               placeholder="กรอกหมายเหตุ..."
               value={moneyInForm.remark}
               onChange={(e) => handleInputChange("remark", e.target.value)}
            />
         </Form.Item>
         <Form.Item name="image">
            <PasteImage
               handlePasteImage={handlePasteImage}
               width="100%"
               height="120px"
            />
         </Form.Item>
         <Form.Item name="image">
            <Upload
               className="cursor-pointer mt-2"
               onPreview={onPreview}
               fileList={fileList}
               onChange={handleChangeFileList}
               maxCount={1}
            >
               <Button className="w-[100%]" icon={<UploadOutlined />}>
                  เลือกรูปภาพ
               </Button>
            </Upload>
         </Form.Item>
         <Form.Item>
            <Button
               disabled={selectedRowKeys.length === 0}
               htmlType="submit"
               icon={<FileAddOutlined />}
               type="primary"
               loading={loadings}
            >
               สร้างรายการเงินเข้า
            </Button>
         </Form.Item>
      </Form>
   )
}

export default CreateMoneyInForm
