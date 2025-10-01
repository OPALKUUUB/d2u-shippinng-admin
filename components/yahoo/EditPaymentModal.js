import { Modal, DatePicker, InputNumber, Select } from "antd"
import dayjs from "dayjs"
import genDate from "../../utils/genDate"

const EditPaymentModal = ({
   visible,
   loading,
   paymentForm,
   formTouched,
   onOk,
   onCancel,
   onDateChange,
   onTransferFeeChange,
   onDeliveryFeeChange,
   onRateYenChange,
   onPaymentStatusChange,
   onFieldBlur,
}) => {
   return (
      <Modal
         title={
            <div
               style={{ fontSize: "16px", fontWeight: "600", color: "#001529" }}
            >
               ✏️ แก้ไขข้อมูลการชำระเงิน
            </div>
         }
         open={visible}
         onOk={onOk}
         onCancel={onCancel}
         okText="💾 บันทึก"
         cancelText="❌ ยกเลิก"
         confirmLoading={loading}
         width={500}
         okButtonProps={{
            style: {
               background: "#52c41a",
               borderColor: "#52c41a",
               fontWeight: "500",
            },
         }}
         cancelButtonProps={{
            style: {
               fontWeight: "500",
            },
         }}
      >
         <div style={{ padding: "20px 0" }}>
            {/* วันที่ */}
            <div style={{ marginBottom: "16px" }}>
               <label
                  style={{
                     display: "block",
                     marginBottom: "6px",
                     fontWeight: "500",
                     color: "#262626",
                  }}
               >
                  📅 วันที่:
               </label>
               <DatePicker
                  value={
                     paymentForm.date
                        ? dayjs(paymentForm.date, "D/M/YYYY")
                        : null
                  }
                  format="D/M/YYYY"
                  onChange={(value) => {
                     if (value === null) {
                        onDateChange(null)
                     } else {
                        onDateChange(genDate(value))
                     }
                  }}
                  onBlur={() => onFieldBlur("date")}
                  style={{
                     width: "100%",
                     height: "40px",
                  }}
                  placeholder="เลือกวันที่"
               />
            </div>

            {/* ค่าโอน */}
            <div style={{ marginBottom: "16px" }}>
               <label
                  style={{
                     display: "block",
                     marginBottom: "6px",
                     fontWeight: "500",
                     color: "#262626",
                  }}
               >
                  💰 ค่าโอน (฿):
               </label>
               <InputNumber
                  value={paymentForm.tranfer_fee}
                  onChange={onTransferFeeChange}
                  onBlur={() => onFieldBlur("tranfer_fee")}
                  style={{
                     width: "100%",
                     height: "40px",
                  }}
                  placeholder="0"
                  min={0}
                  precision={0}
                  formatter={(value) =>
                     `฿ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                  parser={(value) => value.replace(/฿\s?|(,*)/g, "")}
               />
            </div>

            {/* ค่าขนส่ง */}
            <div style={{ marginBottom: "16px" }}>
               <label
                  style={{
                     display: "block",
                     marginBottom: "6px",
                     fontWeight: "500",
                     color: "#262626",
                  }}
               >
                  🚚 ค่าขนส่ง (￥):
               </label>
               <InputNumber
                  value={paymentForm.delivery_fee}
                  onChange={onDeliveryFeeChange}
                  onBlur={() => onFieldBlur("delivery_fee")}
                  style={{
                     width: "100%",
                     height: "40px",
                  }}
                  placeholder="0"
                  min={0}
                  precision={0}
                  formatter={(value) =>
                     `￥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                  parser={(value) => value.replace(/￥\s?|(,*)/g, "")}
               />
            </div>

            {/* อัตราแลกเปลี่ยน */}
            <div style={{ marginBottom: "16px" }}>
               <label
                  style={{
                     display: "block",
                     marginBottom: "6px",
                     fontWeight: "500",
                     color: "#262626",
                  }}
               >
                  💱 อัตราแลกเปลี่ยน (เยน → บาท):
               </label>
               <InputNumber
                  value={paymentForm.rate_yen}
                  onChange={onRateYenChange}
                  onBlur={() => onFieldBlur("rate_yen")}
                  style={{
                     width: "100%",
                     height: "40px",
                  }}
                  placeholder="0.25"
                  min={0}
                  step={0.01}
                  precision={4}
               />
            </div>

            {/* สถานะ */}
            <div style={{ marginBottom: "16px" }}>
               <label
                  style={{
                     display: "block",
                     marginBottom: "6px",
                     fontWeight: "500",
                     color: "#262626",
                  }}
               >
                  📊 สถานะการชำระ:
               </label>
               <Select
                  value={paymentForm.payment_status}
                  onChange={onPaymentStatusChange}
                  onBlur={() => onFieldBlur("payment_status")}
                  style={{
                     width: "100%",
                     height: "40px",
                  }}
                  placeholder="เลือกสถานะ"
                  options={[
                     {
                        label: "🟡 รอค่าโอนและค่าส่ง",
                        value: "รอค่าโอนและค่าส่ง",
                     },
                     {
                        label: "🔵 รอการชำระเงิน",
                        value: "รอการชำระเงิน",
                     },
                     {
                        label: "🟣 รอการตรวจสอบ",
                        value: "รอการตรวจสอบ",
                     },
                     {
                        label: "🟢 ชำระเงินเสร็จสิ้น",
                        value: "ชำระเงินเสร็จสิ้น",
                     },
                  ]}
               />
            </div>
         </div>
      </Modal>
   )
}

export default EditPaymentModal
