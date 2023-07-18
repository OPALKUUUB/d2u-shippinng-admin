import { SearchOutlined } from "@ant-design/icons"
import { Button, Col, DatePicker, Form, Row, Select } from "antd"
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
   { label: "opal", value: "opal" },
   { label: "maii", value: "maii" },
   { label: "ping", value: "maii" },
   { label: "ji", value: "ji" },
]

const SearchFormModel = {
   channel: "",
   username: "",
   date: "",
}

function SearchFormAccountant() {
   const [searchForm, setSearchForm] = useState(SearchFormModel)
   const [customers, setCustomers] = useState(CustomersOption)
   return (
      <Form layout="vertical">
         <Row gutter={16}>
            <Col span={4}>
               <Form.Item label="ช่องทาง">
                  <Select options={channelOptions} placeholder="เลือกช่องทาง"/>
               </Form.Item>
            </Col>
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
                  />
               </Form.Item>
            </Col>
            <Col span={4}>
               <Form.Item label="วันที่">
                  <DatePicker placeholder="เลือกวันที่" className="w-full" />
               </Form.Item>
            </Col>
            <Col span={2}>
               <Form.Item label=" ">
                  <Button className="w-full" type="primary" icon={<SearchOutlined />}>
                     ค้นหา
                  </Button>
               </Form.Item>
            </Col>
         </Row>
      </Form>
   )
}

export default SearchFormAccountant
