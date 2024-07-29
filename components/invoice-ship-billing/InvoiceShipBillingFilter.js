import React, { useContext, useEffect, useState } from "react"
import { Card, Col, Form, Row, Select } from "antd"
import { useRouter } from "next/router"
import { InvoiceShipBillingContext } from "../../context/InvoiceShipBillingContext"

export default function InvoiceShipBillingFilter() {
   const router = useRouter()
   const { _voyages, _handleChangePaginaiton } = useContext(InvoiceShipBillingContext)

   const [form] = Form.useForm()

   const [voyageOptionList, setVoyageOptionList] = useState([])
   const [voyageSelect, setVoyageSelect] = useState("")

   const handleChangeVoyageSelect = (value) => {
      setVoyageSelect(value)
      router.push({ query: { voyage: value, tabSelect: 'unpaid' } })
      _handleChangePaginaiton(0, 10, 'unpaid', value)
   }

   useEffect(() => {
      if (_voyages && Array.isArray(_voyages)) {
         setVoyageOptionList(_voyages)
      }
   }, [_voyages])

   useEffect(() => {
      if (router.query?.voyage) {
         setVoyageSelect(router.query.voyage)
         form.setFieldValue("voyageSelect", router.query.voyage)
      }
   }, [router.query])

   return (
      <Card title="รายการวางบิล" size="small">
         <Form layout="vertical" form={form}>
            <Row gutter={8}>
               <Col span={5}>
                  <Form.Item
                     className="w-full"
                     label="รอบเรือ"
                     name="voyageSelect"
                  >
                     <Select
                        options={voyageOptionList}
                        value={voyageSelect}
                        onChange={handleChangeVoyageSelect}
                        placeholder='เลือกรอบเรือ'
                     />
                  </Form.Item>
               </Col>
            </Row>
         </Form>
      </Card>
   )
}
