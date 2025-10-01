import { Modal } from "antd"

const SlipModal = ({ visible, slip, onCancel }) => {
   return (
      <Modal
         title={
            <div
               style={{ fontSize: "16px", fontWeight: "600", color: "#001529" }}
            >
               🧾 สลิปการชำระเงิน
            </div>
         }
         open={visible}
         onCancel={onCancel}
         footer={null}
         width={400}
         centered
         styles={{
            body: {
               padding: "20px",
               textAlign: "center",
            },
         }}
      >
         {slip.image && (
            <div
               style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  background: "#f8f9fa",
                  borderRadius: "8px",
                  padding: "10px",
                  border: "1px solid #e9ecef",
               }}
            >
               <img
                  src={slip.image}
                  alt="สลิปการชำระเงิน"
                  style={{
                     maxWidth: "100%",
                     maxHeight: "500px",
                     borderRadius: "6px",
                     boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  }}
               />
            </div>
         )}
      </Modal>
   )
}

export default SlipModal
