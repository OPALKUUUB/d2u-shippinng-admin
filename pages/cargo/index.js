import React, { useEffect, useState } from "react"
import { Dropdown, Space, Table } from "antd"
import { DownOutlined } from "@ant-design/icons"
import axios from "axios"
import Layout from "../../components/layout/layout"
import EditImageModal from "../../components/EditImageModal/EditImageModal"

function CargoPage() {
   const [trigger, setTrigger] = useState(false)
   const [cargo, setCargo] = useState([])
   const columns = [
      {
         title: "วันที่",
         dataIndex: "date",
         width: "120px",
         key: "date",
      },
      {
         title: "รูปภาพ",
         dataIndex: "images",
         width: "120px",
         key: "images",
         render: (images, item) => (
            <EditImageModal
               tracking={item}
               images={images}
               setTrigger={setTrigger}
            />
         ),
      },
      {
         title: "ชื่อลูกค้า",
         dataIndex: "username",
         width: "120px",
         key: "username",
      },
      {
         title: "เลขแทรกกิงค์",
         dataIndex: "track_no",
         key: "track_no",
      },
      {
         title: "รูปแบบจัดส่ง",
         dataIndex: "delivery_type",
         key: "delivery_type",
      },
      {
         title: "เลขกล่อง",
         dataIndex: "box_no",
         key: "box_no",
      },
      {
         title: "น้ำหนักจริง",
         dataIndex: "weight_true",
         key: "weight_true",
      },
      {
         title: "น้ำหนักขนาด",
         dataIndex: "weight_size",
         key: "weight_size",
      },
      {
         title: "ราคา",
         dataIndex: "price",
         key: "price",
      },
      {
         title: "แจ้งเก็บเงิน",
         dataIndex: "is_notified",
         key: "is_notified",
      },
      {
         title: "ที่อยู่จัดส่ง",
         dataIndex: "is_notified",
         key: "is_notified",
      },
      {
         title: "ประเภทการจ่ายเงิน",
         dataIndex: "payment_type",
         key: "payment_type",
      },
      {
         title: "แจ้งวางบิล",
         dataIndex: "is_invoiced",
         key: "is_invoiced",
      },
      {
         title: "จัดการ",
         dataIndex: "id",
         key: "manage",
         width: "90px",
         fixed: "right",
         render: (id) => {
            const items = [
               {
                  key: "1",
                  label: "แก้ไข",
               },
               {
                  key: "2",
                  label: "ลบ",
               },
            ]
            return (
               <Space>
                  <Dropdown menu={{ items }}>
                     <span className="cursor-pointer">
                        จัดการ <DownOutlined />
                     </span>
                  </Dropdown>
               </Space>
            )
         },
      },
   ]

   useEffect(() => {
      const fetchData = async () => {
         try {
            const response = await axios.get("/api/cargo")
            setCargo(response.data.cargo)
         } catch (err) {
            console.log(err)
         }
      }

      fetchData()
   }, [trigger])
   return (
      <div className="m-3">
         <Table columns={columns} dataSource={cargo} />
      </div>
   )
}

CargoPage.getLayout = function getLayout(page) {
   return <Layout>{page}</Layout>
}

export default CargoPage
