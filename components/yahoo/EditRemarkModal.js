import { Input } from "antd"
import LoadingModal from "../ui/LoadingModal"

const { TextArea } = Input

const EditRemarkModal = ({
   visible,
   loading,
   selectedRow,
   onOk,
   onCancel,
   onRemarkChange,
}) => {
   return (
      <LoadingModal
         visible={visible}
         onOk={onOk}
         onCancel={onCancel}
         loading={loading}
         title="แก้ไขหมายเหตุแอดมิน"
         okText="บันทึกหมายเหตุ"
      >
         <div style={{ marginBottom: "16px" }}>
            <label
               style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: "600",
               }}
            >
               หมายเหตุแอดมิน: <span style={{ color: "#ff4d4f" }}>*</span>
            </label>
            <TextArea
               rows={4}
               value={selectedRow?.remark_admin || ""}
               placeholder="กรุณากรอกหมายเหตุภายในสำหรับแอดมิน... (จำเป็น)"
               onChange={onRemarkChange}
               disabled={loading}
               maxLength={500}
               showCount
               status={
                  selectedRow?.remark_admin &&
                  selectedRow.remark_admin.trim() === ""
                     ? "error"
                     : undefined
               }
            />
            {selectedRow?.remark_admin &&
               selectedRow.remark_admin.trim() === "" && (
                  <div
                     style={{
                        color: "#ff4d4f",
                        fontSize: "12px",
                        marginTop: "4px",
                     }}
                  >
                     กรุณากรอกหมายเหตุแอดมิน
                  </div>
               )}
         </div>
      </LoadingModal>
   )
}

export default EditRemarkModal
