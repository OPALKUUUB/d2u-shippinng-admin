import { Button, Card, Col, DatePicker, Form, Row, Select } from "antd"
import { useContext, useState } from "react"
import { SearchOutlined } from "@ant-design/icons"
import dayjs from "dayjs"
import ListMoneyInManualContext from "../../../context/ListMoneyInManualContext"
import SelectCustomerFormItem from "../../SelectCustomerFormItem"

export const MONEY_IN_STATUS_OPTIONS = [
   { label: "เลือกทั้งหมด", value: "" },
   { label: "รอตรวจสอบ", value: "WAITING" },
   { label: "ตรวสอบเสร็จสิ้น", value: "SUCCESS" },
]

function ListMoneyInManualFilter({ title }) {
   const { setSearchListMoneyInDataPayload } =
      useContext(ListMoneyInManualContext)
   const [form] = Form.useForm()
   const [startDate, setStartDate] = useState(null)
   const [startDateString, setStartDateString] = useState("")
   const [endDate, setEndDate] = useState(null)
   const [endDateString, setEndDateString] = useState("")
   const [user, setUser] = useState({
      userId: "",
      username: "",
   })
   const [moneyInStatus, setMoneyInStatus] = useState("")
   const [_isLoadCustomer, setIsLoadCustomer] = useState(false)

   const getPayload = () => ({
         startDate: !startDateString
            ? ""
            : dayjs(startDateString, "DD/MM/YYYY").format("YYYY-MM-DD"),
         endDate: !endDateString
            ? ""
            : dayjs(endDateString, "DD/MM/YYYY").format("YYYY-MM-DD"),
         username: user?.userId ? user?.username : "",
         moneyInStatus,
      })

   const handleSubmitListMoneyInManualSearchForm = () => {
      setSearchListMoneyInDataPayload(getPayload())
   }

   return (
      <Card title={`ค้นหา${title}`}>
         <Form
            layout="vertical"
            onFinish={handleSubmitListMoneyInManualSearchForm}
         >
            <Row gutter={8}>
               <Col span={4}>
                  <Form.Item label="วันที่เริ่มต้น">
                     <DatePicker
                        className="w-full"
                        value={startDate}
                        format="DD/MM/YYYY"
                        onChange={(date, dateString) => {
                           setStartDate(date)
                           setStartDateString(dateString)
                        }}
                     />
                  </Form.Item>
               </Col>
               <Col span={4}>
                  <Form.Item label="วันที่สิ้นสุด">
                     <DatePicker
                        className="w-full"
                        value={endDate}
                        format="DD/MM/YYYY"
                        onChange={(date, dateString) => {
                           setEndDate(date)
                           setEndDateString(dateString)
                        }}
                     />
                  </Form.Item>
               </Col>
               <Col span={4}>
                  <SelectCustomerFormItem
                     form={form}
                     setuser={setUser}
                     setisloadcustomer={setIsLoadCustomer}
                  />
               </Col>
               <Col span={4}>
                  <Form.Item label="สถานะรายการ">
                     <Select
                        value={moneyInStatus}
                        options={MONEY_IN_STATUS_OPTIONS}
                        onChange={setMoneyInStatus}
                     />
                  </Form.Item>
               </Col>
               <Col span={4}>
                  <Form.Item label=" ">
                     <Button
                        htmlType="submit"
                        type="primary"
                        icon={<SearchOutlined />}
                     >
                        ค้นหารายการเงินเข้า
                     </Button>
                  </Form.Item>
               </Col>
            </Row>
         </Form>
      </Card>
   )
}

export default ListMoneyInManualFilter
