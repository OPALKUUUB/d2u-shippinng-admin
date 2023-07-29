/* eslint-disable no-nested-ternary */
import { FileAddOutlined} from "@ant-design/icons"
import {
   Button,
   Col,
   DatePicker,
   Form,
   Input,
   Row,
   message
} from "antd"
import dayjs from "dayjs"
import { useState } from "react"

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
   const [form] = Form.useForm()

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
         await onCreateMoneyInList(body)
      } catch (err) {
         console.log(err)
      } finally {
         form.resetFields()
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
         {/* <Form.Item name="image">
            <Upload>
               <Button icon={<UploadOutlined />}>เลือกรูปภาพ</Button>
            </Upload>
         </Form.Item> */}
         <Form.Item>
            <Button
               disabled={selectedRowKeys.length === 0}
               htmlType="submit"
               icon={<FileAddOutlined />}
               type="primary"
            >
               สร้างรายการเงินเข้า
            </Button>
         </Form.Item>
      </Form>
   )
}

export default CreateMoneyInForm
