import React from "react"
import { Modal, Button, Spin } from "antd"
import { EditOutlined, CheckOutlined } from "@ant-design/icons"

const LoadingModal = ({
   visible,
   onOk,
   onCancel,
   loading = false,
   title,
   okText = "ยืนยัน",
   cancelText = "ยกเลิก",
   okButtonProps = {},
   children,
   width = 520,
}) => {
   return (
      <Modal
         title={
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
               <EditOutlined style={{ color: "#1890ff", fontSize: "18px" }} />
               <span>{title}</span>
            </div>
         }
         open={visible}
         onCancel={onCancel}
         footer={[
            <Button key="cancel" onClick={onCancel} disabled={loading}>
               {cancelText}
            </Button>,
            <Button
               key="ok"
               type="primary"
               loading={loading}
               onClick={onOk}
               icon={!loading && <CheckOutlined />}
               {...okButtonProps}
            >
               {loading ? "กำลังบันทึก..." : okText}
            </Button>,
         ]}
         width={width}
         centered
         destroyOnClose
      >
         <Spin spinning={loading} tip="กำลังดำเนินการ...">
            <div style={{ minHeight: loading ? "100px" : "auto" }}>
               {children}
            </div>
         </Spin>
      </Modal>
   )
}

export default LoadingModal
