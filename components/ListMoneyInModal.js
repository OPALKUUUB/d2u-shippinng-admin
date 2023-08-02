import React, { useEffect, useState } from "react"
import { Card, Modal, Table, Typography, message } from "antd"
import axios from "axios"

const { Text } = Typography

function ListMoneyInModal({ miId, visible, onCancel, setFetchDataTrigger }) {
   const [loading, setLoading] = useState(false)
   const [moneyInData, setMoneyInData] = useState({})
   const [miMatchTracking, setMiMatchTracking] = useState([])

   const fetchMoneyInData = async () => {
      setLoading(true)
      try {
         const response = await axios.get(
            `/api/for-accountant/money-in/${miId}` // Pass the mi_id to fetch specific data
         )
         const responseData = await response.data.data
         setMoneyInData(responseData.moneyInData[0])
         setMiMatchTracking(responseData.miMatchTracking)
      } catch (error) {
         console.error("Error fetching data:", error.message)
      } finally {
         setLoading(false)
      }
   }

   const handleOk = async () => {
      setLoading(true)
      try {
         await axios.put(
            `/api/for-accountant/money-in/${miId}` // Pass the mi_id to fetch specific data
         )

         message.success("Updated successfully!") // Show success message
         onCancel() // Close the modal
      } catch (error) {
         console.error("Error updating status:", error.message)
         message.error("Error updating status. Please try again.")
      } finally {
         setFetchDataTrigger((prev) => !prev)
         setLoading(false)
      }
   }

   useEffect(() => {
      if (visible && miId) {
         fetchMoneyInData()
      }
   }, [visible, miId])

   const columns = [
      {
         title: "ชื่อลูกค้า",
         key: "mim_username",
         render: () => moneyInData.username || "-",
         width: "200px",
      },
      {
         title: "ช่องทาง",
         dataIndex: "mim_channel",
         key: "mim_channel",
         width: "150px",
      },
      {
         title: "ราคา(บาท)",
         dataIndex: "mim_price",
         key: "mim_price",
         width: "100px",
      },
   ]

   return (
      <Modal
         title="รายละเอียดรายการเงินเข้า"
         open={visible}
         onCancel={onCancel}
         okText="ตรวจสอบเสร็จสิ้น"
         cancelText="ยกเลิก"
         onOk={handleOk} // Set the onOk prop to the handleOk function
         confirmLoading={loading} // Show loading state for the button
      >
         <Card className="mb-2">
            {loading ? (
               <p>Loading...</p>
            ) : (
               <>
                  <Text strong>ชื่อลูกค้า:</Text>{" "}
                  <Text>{moneyInData.username || "-"}</Text>
                  <br />
                  {/* Add more information as needed */}
                  <Text strong>ประเภทการชำระเงิน:</Text>{" "}
                  <Text>{moneyInData.mi_payment_type || "-"}</Text>
                  <br />
                  <Text strong>ยอดใบเสร็จ (บาท):</Text>{" "}
                  <Text>{moneyInData.mi_total || "-"}</Text>
                  <br />
                  <Text strong>หมายเหตุ:</Text>{" "}
                  <Text>{moneyInData.mi_remark || "-"}</Text>
               </>
            )}
         </Card>
         <Table
            scroll={{
               //  x: 300,
               y: 300,
            }}
            dataSource={miMatchTracking}
            columns={columns}
         />
      </Modal>
   )
}

export default ListMoneyInModal
