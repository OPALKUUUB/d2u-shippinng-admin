import { InputNumber, Select } from "antd"
import LoadingModal from "../ui/LoadingModal"

const EditStatusModal = ({
   visible,
   loading,
   statusForm,
   formTouched,
   onOk,
   onCancel,
   onStatusChange,
   onBidChange,
   onTransferFeeChange,
   onDeliveryFeeChange,
   onPaymentStatusChange,
   onFieldBlur,
}) => {
   return (
      <>
         <LoadingModal
            visible={visible}
            onOk={onOk}
            onCancel={onCancel}
            loading={loading}
            title="เปลี่ยนสถานะการประมูล"
            okText="ยืนยันการเปลี่ยนสถานะ"
            width={600}
         >
            <div className="UpdateStatusModal">
               <div style={{ marginBottom: "16px" }}>
                  <label
                     style={{
                        display: "block",
                        marginBottom: "8px",
                        fontWeight: "600",
                     }}
                  >
                     สถานะประมูล: <span style={{ color: "#ff4d4f" }}>*</span>
                  </label>
                  <Select
                     value={statusForm.status}
                     options={[
                        { value: "ชนะ", label: "🏆 ชนะประมูล" },
                        { value: "แพ้", label: "❌ แพ้ประมูล" },
                     ]}
                     onChange={onStatusChange}
                     onBlur={() => onFieldBlur("status")}
                     disabled={loading}
                     size="large"
                     placeholder="กรุณาเลือกสถานะการประมูล (จำเป็น)"
                     status={
                        formTouched.status && !statusForm.status
                           ? "error"
                           : undefined
                     }
                  />
                  {formTouched.status && !statusForm.status && (
                     <div
                        style={{
                           color: "#ff4d4f",
                           fontSize: "12px",
                           marginTop: "4px",
                        }}
                     >
                        กรุณาเลือกสถานะการประมูล
                     </div>
                  )}
               </div>

               {statusForm.status === "ชนะ" && (
                  <div
                     style={{
                        background: "#f6ffed",
                        border: "1px solid #b7eb8f",
                        borderRadius: "8px",
                        padding: "16px",
                        marginTop: "16px",
                     }}
                  >
                     <h4 style={{ color: "#52c41a", marginBottom: "16px" }}>
                        🎉 ยินดีด้วย! ประมูลสำเร็จ
                     </h4>

                     <div style={{ marginBottom: "16px" }}>
                        <label
                           style={{
                              display: "block",
                              marginBottom: "8px",
                              fontWeight: "600",
                           }}
                        >
                           ราคาที่ประมูลได้ (¥):{" "}
                           <span style={{ color: "#ff4d4f" }}>*</span>
                        </label>
                        <InputNumber
                           value={statusForm.bid}
                           onChange={onBidChange}
                           onBlur={() => onFieldBlur("bid")}
                           placeholder="กรุณากรอกราคาที่ประมูลได้ (จำเป็น)"
                           style={{ width: "100%" }}
                           size="large"
                           disabled={loading}
                           min={1}
                           precision={0}
                           formatter={(value) =>
                              `¥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                           }
                           parser={(value) => value.replace(/¥\s?|(,*)/g, "")}
                           status={
                              formTouched.bid &&
                              (statusForm.bid <= 0 || !statusForm.bid)
                                 ? "error"
                                 : undefined
                           }
                        />
                        {formTouched.bid &&
                           (!statusForm.bid || statusForm.bid <= 0) && (
                              <div
                                 style={{
                                    color: "#ff4d4f",
                                    fontSize: "12px",
                                    marginTop: "4px",
                                 }}
                              >
                                 กรุณากรอกราคาที่ประมูลได้ (ต้องมากกว่า 0)
                              </div>
                           )}
                     </div>

                     <div style={{ marginBottom: "16px" }}>
                        <label
                           style={{
                              display: "block",
                              marginBottom: "8px",
                              fontWeight: "600",
                           }}
                        >
                           ค่าธรรมเนียมการโอน (฿):
                        </label>
                        <InputNumber
                           value={statusForm.tranfer_fee}
                           onChange={onTransferFeeChange}
                           onBlur={() => onFieldBlur("tranfer_fee")}
                           placeholder="กรอกค่าธรรมเนียมการโอน"
                           style={{ width: "100%" }}
                           size="large"
                           disabled={loading}
                           min={0}
                           precision={2}
                           formatter={(value) =>
                              `฿ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                           }
                           parser={(value) => value.replace(/฿\s?|(,*)/g, "")}
                           status={
                              formTouched.tranfer_fee &&
                              statusForm.tranfer_fee < 0
                                 ? "error"
                                 : undefined
                           }
                        />
                        {formTouched.tranfer_fee &&
                           statusForm.tranfer_fee < 0 && (
                              <div
                                 style={{
                                    color: "#ff4d4f",
                                    fontSize: "12px",
                                    marginTop: "4px",
                                 }}
                              >
                                 ค่าธรรมเนียมไม่สามารถติดลบได้
                              </div>
                           )}
                     </div>

                     <div style={{ marginBottom: "16px" }}>
                        <label
                           style={{
                              display: "block",
                              marginBottom: "8px",
                              fontWeight: "600",
                           }}
                        >
                           ค่าขนส่ง (¥):
                        </label>
                        <InputNumber
                           value={statusForm.delivery_fee}
                           onChange={onDeliveryFeeChange}
                           onBlur={() => onFieldBlur("delivery_fee")}
                           placeholder="กรอกค่าขนส่ง"
                           style={{ width: "100%" }}
                           size="large"
                           disabled={loading}
                           min={0}
                           precision={0}
                           formatter={(value) =>
                              `¥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                           }
                           parser={(value) => value.replace(/¥\s?|(,*)/g, "")}
                           status={
                              formTouched.delivery_fee &&
                              statusForm.delivery_fee < 0
                                 ? "error"
                                 : undefined
                           }
                        />
                        {formTouched.delivery_fee &&
                           statusForm.delivery_fee < 0 && (
                              <div
                                 style={{
                                    color: "#ff4d4f",
                                    fontSize: "12px",
                                    marginTop: "4px",
                                 }}
                              >
                                 ค่าขนส่งไม่สามารถติดลบได้
                              </div>
                           )}
                     </div>

                     <div>
                        <label
                           style={{
                              display: "block",
                              marginBottom: "8px",
                              fontWeight: "600",
                           }}
                        >
                           สถานะการชำระเงิน:{" "}
                           <span style={{ color: "#ff4d4f" }}>*</span>
                        </label>
                        <Select
                           value={statusForm.payment_status}
                           options={[
                              {
                                 value: "รอค่าโอนและค่าส่ง",
                                 label: "⏳ รอค่าโอนและค่าส่ง",
                              },
                              {
                                 value: "รอการชำระเงิน",
                                 label: "💳 รอการชำระเงิน",
                              },
                           ]}
                           onChange={onPaymentStatusChange}
                           onBlur={() => onFieldBlur("payment_status")}
                           style={{ width: "100%" }}
                           size="large"
                           disabled={loading}
                           placeholder="กรุณาเลือกสถานะการชำระเงิน (จำเป็น)"
                           status={
                              formTouched.payment_status &&
                              !statusForm.payment_status
                                 ? "error"
                                 : undefined
                           }
                        />
                        {formTouched.payment_status &&
                           !statusForm.payment_status && (
                              <div
                                 style={{
                                    color: "#ff4d4f",
                                    fontSize: "12px",
                                    marginTop: "4px",
                                 }}
                              >
                                 กรุณาเลือกสถานะการชำระเงิน
                              </div>
                           )}
                     </div>
                  </div>
               )}
            </div>
         </LoadingModal>

         <style jsx global>
            {`
               .UpdateStatusModal .ant-input-number {
                  width: 100%;
                  margin-bottom: 10px;
               }
               .UpdateStatusModal .ant-select {
                  width: 100%;
                  margin-bottom: 10px;
               }
            `}
         </style>
      </>
   )
}

export default EditStatusModal
