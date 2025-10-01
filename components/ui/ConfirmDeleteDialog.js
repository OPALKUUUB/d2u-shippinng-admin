import React from "react"
import { Modal, Button } from "antd"
import { ExclamationCircleOutlined, DeleteOutlined } from "@ant-design/icons"

const ConfirmDeleteDialog = ({
   visible,
   onConfirm,
   onCancel,
   loading = false,
   title = "ยืนยันการลบ",
   description = "คุณแน่ใจหรือไม่ที่จะลบรายการนี้? การดำเนินการนี้ไม่สามารถยกเลิกได้",
   itemName = "",
}) => {
   return (
      <Modal
         title={
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
               <ExclamationCircleOutlined
                  style={{ color: "#ff4d4f", fontSize: "20px" }}
               />
               <span>{title}</span>
            </div>
         }
         open={visible}
         onCancel={onCancel}
         footer={[
            <Button key="cancel" onClick={onCancel} disabled={loading}>
               ยกเลิก
            </Button>,
            <Button
               key="confirm"
               type="primary"
               danger
               loading={loading}
               onClick={onConfirm}
               icon={<DeleteOutlined />}
            >
               {loading ? "กำลังลบ..." : "ยืนยันลบ"}
            </Button>,
         ]}
         width={480}
         centered
      >
         <div style={{ padding: "16px 0" }}>
            <p style={{ marginBottom: "8px", fontSize: "16px" }}>
               {description}
            </p>
            {itemName && (
               <div
                  style={{
                     background: "#fff2f0",
                     border: "1px solid #ffccc7",
                     borderRadius: "6px",
                     padding: "12px",
                     marginTop: "12px",
                  }}
               >
                  <strong>รายการที่จะลบ:</strong> {itemName}
               </div>
            )}
         </div>
      </Modal>
   )
}

export default ConfirmDeleteDialog
