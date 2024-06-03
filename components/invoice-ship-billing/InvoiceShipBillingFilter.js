import { Card, Col, Form, Row, Select } from "antd"
import React from "react"

export default function InvoiceShipBillingFilter() {
   const [form] = Form.useForm()
   return (
    <Card title="รายการวางบิล" size="small">
        <Form layout="vertical">
            <Row gutter={8}>
                <Col span={4}>
                    <Form.Item label="รอบเรือ">
                        <Select options={[]}/>
                    </Form.Item>
                </Col>
            </Row>
        </Form>
    </Card>
   );
}
