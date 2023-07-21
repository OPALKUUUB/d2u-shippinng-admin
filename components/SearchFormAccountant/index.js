/* eslint-disable no-nested-ternary */
import { SearchOutlined } from "@ant-design/icons"
import { Button, Col, DatePicker, Form, Row, Select } from "antd"
import dayjs from "dayjs"
import moment from "moment"
import { useState } from "react"

const channelOptions = [
   { label: "Mercari", value: "mercari" },
   { label: "Fril", value: "fril" },
   { label: "Web123", value: "123" },
   { label: "Yahoo", value: "yahoo" },
   { label: "Ship Billing", value: "Ship Billing" },
   { label: "ขนส่งในประเทศ", value: "inland-transit" },
   { label: "Cargo", value: "cargo" },
]

const CustomersOption = [
   { label: "test", value: 1 },
   { label: "CEOmaijung", value: 2 },
   { label: "ExxSombat", value: 507 },
]

const SearchFormModel = {
   channel: "",
   user_id: "",
   date: "",
}

function SearchFormAccountant({ onSearch }) {
   const [searchForm, setSearchForm] = useState(SearchFormModel)
   const [customers, setCustomers] = useState(CustomersOption)

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

   const handleSearch = () => {
      // Call the onSearch callback function with the searchParams state
      onSearch(searchForm)
   }
   return (
      <Form layout="vertical">
         <Row gutter={16}>
            <Col span={4}>
               <Form.Item label="ชื่อลูกค้า">
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
               <Form.Item label="ช่องทาง">
                  <Select
                     options={channelOptions}
                     placeholder="เลือกช่องทาง"
                     value={searchForm.channel}
                     onChange={(value) => handleInputChange("channel", value)}
                  />
               </Form.Item>
            </Col>
            <Col span={4}>
               <Form.Item label="วันที่">
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
            <Col span={2}>
               <Form.Item label=" ">
                  <Button
                     className="w-full"
                     type="primary"
                     icon={<SearchOutlined />}
                     onClick={handleSearch}
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
