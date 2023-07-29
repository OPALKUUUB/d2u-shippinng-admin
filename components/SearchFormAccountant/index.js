/* eslint-disable no-nested-ternary */
import { SearchOutlined } from "@ant-design/icons"
import { Button, Col, DatePicker, Form, Row, Select, message } from "antd"
import axios from "axios"
import dayjs from "dayjs"
import { useEffect, useState } from "react"

const channelOptions = [
   { label: "กรุณาเลือก", value: "" },
   { label: "Mercari", value: "mercari" },
   { label: "Fril", value: "fril" },
   { label: "Web123", value: "123" },
   { label: "Yahoo", value: "yahoo" },
   { label: "Ship Billing", value: "ship_billing" },
   { label: "ขนส่งในประเทศ", value: "ขนส่งเอกชน(ที่อยู่ ลค.)" },
   { label: "Cargo", value: "cargo" },
]

const SearchFormModel = {
   channel: "",
   user_id: "",
   date: "",
}

function SearchFormAccountant({ onSearch, trigger }) {
   const [searchForm, setSearchForm] = useState(SearchFormModel)
   const [customers, setCustomers] = useState([])

   const handleInputChange = (fieldName, value) => {
      const formattedValue =
         fieldName === "date"
            ? value === null
               ? ""
               : dayjs(value).format("D/M/YYYY")
            : value
      // Update the searchForm state with the new value for the specified field
      setSearchForm((prevSearchForm) => ({
         ...prevSearchForm,
         [fieldName]: formattedValue,
      }))
   }
   const getCustomers = async () => {
      try {
         const response = await axios.get("/api/user")
         const responseData = await response.data
         const users = responseData.users.reduce(
            (acc, curr) => [
               ...acc,
               {
                  label: curr.username,
                  value: curr.id,
               },
            ],
            [{ label: "กรุณาเลือก", value: "" }]
         )
         setCustomers(users)
      } catch (error) {
         console.log(error)
      }
   }
   useEffect(() => {
      ;(async () => {
         try {
            await getCustomers()
         } catch (err) {
            console.log(err)
         }
      })()
   }, [])

   useEffect(() => {
      if (searchForm.user_id !== "") onSearch(searchForm)
   }, [trigger])

   const onFinish = () => {
      onSearch(searchForm)
   }
   const onFinishFailed = (errorInfo) => {
      errorInfo.errorFields.map((err) =>
         err.errors.map((msg) => message.error(msg))
      )
      console.log("Failed:", errorInfo)
   }
   return (
      <Form
         layout="vertical"
         onFinish={onFinish}
         onFinishFailed={onFinishFailed}
      >
         <Row gutter={16}>
            <Col span={4}>
               <Form.Item
                  label="ชื่อลูกค้า"
                  name="user_id"
                  rules={[
                     {
                        required: true,
                        message: "กรุณาเลือกชื่อลูกค้า",
                     },
                  ]}
               >
                  <Select
                     showSearch
                     placeholder="เลือกชื่อลูกค้า"
                     options={customers}
                     optionFilterProp="children"
                     filterOption={(input, option) =>
                        (option?.label ?? "")
                           .toLowerCase()
                           .includes(input.toLowerCase())
                     }
                     value={searchForm.user_id}
                     onChange={(value) => handleInputChange("user_id", value)}
                  />
               </Form.Item>
            </Col>
            <Col span={4}>
               <Form.Item label="ช่องทาง" name="channel">
                  <Select
                     options={channelOptions}
                     placeholder="เลือกช่องทาง"
                     value={searchForm.channel}
                     onChange={(value) => handleInputChange("channel", value)}
                  />
               </Form.Item>
            </Col>
            <Col span={4}>
               <Form.Item label="วันที่" name="date">
                  <DatePicker
                     format="D/M/YYYY"
                     placeholder="เลือกวันที่"
                     className="w-full"
                     value={
                        searchForm.date === ""
                           ? null
                           : dayjs(searchForm.date, "D/M/YYYY")
                     }
                     onChange={(date) => handleInputChange("date", date)}
                  />
               </Form.Item>
            </Col>
            <Col>
               <Form.Item label=" ">
                  <Button
                     htmlType="submit"
                     className="w-full"
                     type="primary"
                     icon={<SearchOutlined />}
                  >
                     ค้นหา
                  </Button>
               </Form.Item>
            </Col>
         </Row>
      </Form>
   )
}

export default SearchFormAccountant
