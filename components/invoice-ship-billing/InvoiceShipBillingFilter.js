import React, { useContext, useEffect, useState, useMemo } from "react"
import { Card, Col, Form, Row, Select } from "antd"
import { useRouter } from "next/router"
import { debounce } from "lodash"
import { InvoiceShipBillingContext } from "../../context/InvoiceShipBillingContextV2"


export default function InvoiceShipBillingFilter() {
   const router = useRouter()
   const { voyages } = useContext(InvoiceShipBillingContext) // Get voyages from context
   const [form] = Form.useForm()

   // Extract the 'voyage' from the URL query params
   const { voyage: queryVoyage } = router.query
   const [voyageSelect, setVoyageSelect] = useState(queryVoyage || "")

   // Memoize voyage options to avoid recalculating on each render
   const voyageOptionList = useMemo(() => {
      if (voyages && voyages.length > 0) {
         return voyages.map((v) => ({
            key: v.voyage,
            label: v.voyage,
            value: v.voyage,
         }))
      }
      return []
   }, [voyages])

   // Initialize the form with the selected voyage from the URL query
   useEffect(() => {
      if (queryVoyage) {
         setVoyageSelect(queryVoyage)
         form.setFieldsValue({ voyageSelect: queryVoyage })
      }
   }, [queryVoyage, form])

   // Handle voyage selection with debounced routing to prevent quick consecutive updates
   const handleVoyageChange = useMemo(
      () =>
         debounce((value) => {
            if (value !== voyageSelect) {
               setVoyageSelect(value)
               form.setFieldsValue({ voyageSelect: value }) // Update the form value

               // Use shallow routing to update the URL without reloading the page
               router.push(
                  {
                     pathname: "/invoice-ship-billing",
                     query: { voyage: value },
                  },
                  undefined,
                  { shallow: true }
               ) // Shallow routing enabled
            }
         }, 300),
      [voyageSelect, router, form]
   )

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
                        onChange={handleVoyageChange}
                        placeholder="เลือกรอบเรือ"
                        allowClear
                        showSearch
                        filterOption={(input, option) =>
                           option?.label
                              .toLowerCase()
                              .includes(input.toLowerCase())
                        }
                     />
                  </Form.Item>
               </Col>
            </Row>
         </Form>
      </Card>
   )
}
