import React from "react"
import { Button, DatePicker, Form, Input } from "antd"
import { AppstoreAddOutlined } from "@ant-design/icons"
import Layout from "../components/layout/layout"

function DashboardPage() {
   return (
      <div className="w-full h-full p-5">
         <div className="w-full h-full bg-white rounded-md p-3">
            <div className="w-full flex gap-3">
               <div className="w-[200px] h-[160px] bg-slate-200 rounded-lg text-gray-600 p-2">
                  <div className="mb-3">อัตราการแลกเปลี่ยน (เยน)</div>
                  <div className="mb-3 font-bold">0.29 บาท</div>
                  <div className="mb-3">
                     <Input prefix="￥" suffix="RMB" />
                  </div>
                  <div className="mb-3">
                     <Button type="primary" className="w-full">
                        ยืนยันการเปลี่ยนค่า
                     </Button>
                  </div>
               </div>
               <div className="w-[730px] h-[160px] bg-slate-100 rounded-md p-2">
                  <Form className="flex flex-wrap w-[700px]">
                     <div className="flex-col w-[350px]">
                        <Form.Item
                           labelCol={{ span: 8 }}
                           label="วันที่ลงข้อมูล"
                        >
                           <DatePicker className="w-full" />
                        </Form.Item>
                        <Form.Item
                           labelCol={{ span: 8 }}
                           label="วันที่จบรายการ"className="mb-4"
                        >
                           <DatePicker className="w-full" />
                        </Form.Item>
                     </div>
                     <div className="flex-col w-[350px]">
                        <Form.Item labelCol={{ span: 5 }} label="เรื่อง">
                           <Input className="w-full" />
                        </Form.Item>
                        <Form.Item labelCol={{ span: 5 }} className="mb-4" label="ราคา">
                           <Input />
                        </Form.Item>
                     </div>

                     <div className="w-full text-center">
                        <Button
                           className="w-full"
                           icon={<AppstoreAddOutlined />}
                           type="primary"
                        >
                           เพิ่มรายการที่ต้องทำ
                        </Button>
                     </div>
                  </Form>
               </div>
            </div>
         </div>
      </div>
   )
}

DashboardPage.getLayout = function getLayout(page) {
   return <Layout>{page}</Layout>
}

export default DashboardPage
