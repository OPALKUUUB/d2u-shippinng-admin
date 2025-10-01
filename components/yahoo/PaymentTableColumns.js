import { Dropdown, Space, Switch, Button } from "antd"
import { DownOutlined, LinkOutlined, MoreOutlined } from "@ant-design/icons"
import sortDate from "../../utils/sortDate"

// เพิ่ม CSS animation สำหรับ NEW badge
if (typeof document !== "undefined") {
   const style = document.createElement("style")
   style.textContent = `
      @keyframes pulse {
         0% { transform: scale(1); opacity: 1; }
         50% { transform: scale(1.1); opacity: 0.8; }
         100% { transform: scale(1); opacity: 1; }
      }
   `
   document.head.appendChild(style)
}

const paymentTableColumns = ({
   data,
   filteredInfo,
   sortedInfo,
   getColumnSearchProps,
   handleShowEditModal,
   handleDeleteRow,
   handleShowSlip,
   handleChangeNotification,
   newPaymentIds = new Set(),
}) => {
   // ตรวจสอบว่ารายการเป็น payment ใหม่หรือไม่
   const isNewPayment = (record) => {
      const paymentKey = `${record.date}_${record.username}_${
         record.id || Math.random()
      }`
      return newPaymentIds.has(paymentKey)
   }

   return [
      {
         title: "วันที่",
         dataIndex: "date",
         width: "120px",
         key: "date",
         sorter: (a, b) => sortDate(a.date, b.date),
         sortOrder: sortedInfo.columnKey === "date" ? sortedInfo.order : null,
         render: (text, record) => {
            const isNew = isNewPayment(record)
            return (
               <div style={{ textAlign: "center", position: "relative" }}>
                  {isNew && (
                     <div
                        style={{
                           position: "absolute",
                           top: "-5px",
                           right: "-5px",
                           background:
                              "linear-gradient(45deg, #ff4d4f, #ff7875)",
                           color: "white",
                           fontSize: "9px",
                           fontWeight: "bold",
                           padding: "1px 4px",
                           borderRadius: "3px",
                           border: "1px solid #fff",
                           boxShadow: "0 1px 3px rgba(0,0,0,0.3)",
                           zIndex: 10,
                           animation: "pulse 2s infinite",
                        }}
                     >
                        NEW
                     </div>
                  )}
                  <div
                     style={{
                        fontSize: "12px",
                        fontWeight: isNew ? "bold" : "500",
                        color: isNew ? "#ff4d4f" : "#595959",
                     }}
                  >
                     {text}
                  </div>
               </div>
            )
         },
         ellipsis: true,
         ...getColumnSearchProps("date"),
      },
      {
         title: "รูปภาพ",
         dataIndex: "image",
         key: "image",
         width: "120px",
         render: (text) => (
            <div style={{ textAlign: "center" }}>
               <img
                  src={text}
                  alt="สินค้า"
                  style={{
                     width: "80px",
                     height: "60px",
                     objectFit: "cover",
                     borderRadius: "4px",
                     border: "1px solid #d9d9d9",
                  }}
               />
            </div>
         ),
      },
      {
         title: "ชื่อลูกค้า",
         dataIndex: "username",
         key: "username",
         width: "150px",
         render: (text, record) => {
            const isNew = isNewPayment(record)
            return (
               <div
                  style={{
                     fontWeight: isNew ? "600" : "normal",
                     color: isNew ? "#ff4d4f" : "#262626",
                  }}
               >
                  {text}
               </div>
            )
         },
         ...getColumnSearchProps("username"),
      },
      {
         title: "ลิ้งค์",
         dataIndex: "link",
         key: "link",
         width: "200px",
         render: (text) => {
            if (
               text &&
               text.includes("https://page.auctions.yahoo.co.jp/jp/auction/")
            ) {
               const auctionId = text.split(
                  "https://page.auctions.yahoo.co.jp/jp/auction/"
               )[1]
               return (
                  <div
                     style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                     }}
                  >
                     <LinkOutlined style={{ color: "#1890ff" }} />
                     <a
                        href={text}
                        target="_blank"
                        rel="noreferrer"
                        style={{
                           color: "#1890ff",
                           textDecoration: "none",
                           fontSize: "12px",
                        }}
                        onMouseEnter={(e) => {
                           e.target.style.textDecoration = "underline"
                        }}
                        onMouseLeave={(e) => {
                           e.target.style.textDecoration = "none"
                        }}
                     >
                        {auctionId.length > 15
                           ? `${auctionId.substring(0, 15)}...`
                           : auctionId}
                     </a>
                  </div>
               )
            }
            return text || "-"
         },
         ellipsis: true,
      },
      {
         title: "ราคาประมูล",
         dataIndex: "bid",
         key: "bid",
         width: "120px",
         align: "right",
         render: (text) => (
            <div
               style={{
                  fontWeight: "600",
                  color: "#1890ff",
                  fontSize: "13px",
               }}
            >
               {new Intl.NumberFormat("ja-JP", {
                  currency: "JPY",
                  style: "currency",
               }).format(text || 0)}
            </div>
         ),
         sorter: (a, b) => (a.bid || 0) - (b.bid || 0),
         sortOrder: sortedInfo.columnKey === "bid" ? sortedInfo.order : null,
      },
      {
         title: "ค่าโอน",
         dataIndex: "tranfer_fee",
         key: "tranfer_fee",
         width: "100px",
         align: "right",
         render: (text) => (
            <div
               style={{
                  fontWeight: "500",
                  color: "#52c41a",
                  fontSize: "12px",
               }}
            >
               {new Intl.NumberFormat("th-TH", {
                  currency: "THB",
                  style: "currency",
                  minimumFractionDigits: 0,
               }).format(text || 0)}
            </div>
         ),
         sorter: (a, b) => (a.tranfer_fee || 0) - (b.tranfer_fee || 0),
         sortOrder:
            sortedInfo.columnKey === "tranfer_fee" ? sortedInfo.order : null,
      },
      {
         title: "ค่าส่ง",
         dataIndex: "delivery_fee",
         key: "delivery_fee",
         width: "100px",
         align: "right",
         render: (text) => (
            <div
               style={{
                  fontWeight: "500",
                  color: "#fa8c16",
                  fontSize: "12px",
               }}
            >
               {new Intl.NumberFormat("ja-JP", {
                  currency: "JPY",
                  style: "currency",
               }).format(text || 0)}
            </div>
         ),
         sorter: (a, b) => (a.delivery_fee || 0) - (b.delivery_fee || 0),
         sortOrder:
            sortedInfo.columnKey === "delivery_fee" ? sortedInfo.order : null,
      },
      {
         title: "รวม",
         dataIndex: "id",
         key: "sum",
         width: "120px",
         align: "right",
         render: (id) => {
            const payment = data.find((item) => item.id === id)
            if (!payment) return "-"

            const { bid, delivery_fee, tranfer_fee, rate_yen } = payment
            const total = Math.ceil(
               (bid + (delivery_fee || 0)) * (rate_yen || 0) +
                  (tranfer_fee || 0)
            )

            return (
               <div
                  style={{
                     fontWeight: "bold",
                     color: "#f5222d",
                     fontSize: "14px",
                     padding: "4px 8px",
                     background: "#fff1f0",
                     borderRadius: "4px",
                     border: "1px solid #ffa39e",
                  }}
               >
                  {new Intl.NumberFormat("th-TH", {
                     currency: "THB",
                     style: "currency",
                     minimumFractionDigits: 0,
                  }).format(total)}
               </div>
            )
         },
      },
      {
         title: "Slip",
         dataIndex: "slip_id",
         key: "slip_id",
         width: "80px",
         align: "center",
         render: (slip_id) => {
            if (slip_id === null) {
               return <span style={{ color: "#bfbfbf" }}>-</span>
            }
            return (
               <Button
                  size="small"
                  type="primary"
                  ghost
                  onClick={() => handleShowSlip(slip_id)}
                  style={{ fontSize: "11px" }}
               >
                  ดูสลิป
               </Button>
            )
         },
      },
      {
         title: "สถานะ",
         dataIndex: "payment_status",
         key: "payment_status",
         width: "140px",
         render: (text) => {
            let color = "#666"
            let bgColor = "#f6f6f6"

            switch (text) {
               case "รอค่าโอนและค่าส่ง":
                  color = "#fa8c16"
                  bgColor = "#fff7e6"
                  break
               case "รอการชำระเงิน":
                  color = "#1890ff"
                  bgColor = "#e6f7ff"
                  break
               case "รอการตรวจสอบ":
                  color = "#722ed1"
                  bgColor = "#f9f0ff"
                  break
               case "ชำระเงินเสร็จสิ้น":
                  color = "#52c41a"
                  bgColor = "#f6ffed"
                  break
               default:
                  break
            }

            return (
               <div
                  style={{
                     fontSize: "11px",
                     fontWeight: "500",
                     color,
                     background: bgColor,
                     padding: "4px 8px",
                     borderRadius: "12px",
                     textAlign: "center",
                     border: `1px solid ${color}30`,
                  }}
               >
                  {text}
               </div>
            )
         },
         filters: [
            { text: "รอค่าโอนและค่าส่ง", value: "รอค่าโอนและค่าส่ง" },
            { text: "รอการชำระเงิน", value: "รอการชำระเงิน" },
            { text: "รอการตรวจสอบ", value: "รอการตรวจสอบ" },
            { text: "ชำระเงินเสร็จสิ้น", value: "ชำระเงินเสร็จสิ้น" },
         ],
         filteredValue: filteredInfo.payment_status || null,
         onFilter: (value, record) => record.payment_status === value,
      },
      {
         title: "แจ้งชำระ",
         dataIndex: "id",
         key: "notificated",
         width: "120px",
         align: "center",
         render: (id) => {
            const payment = data.find((item) => item.id === id)
            if (!payment) return "-"

            const notificated = payment.notificated === 1

            return (
               <div
                  style={{
                     display: "flex",
                     flexDirection: "column",
                     alignItems: "center",
                     gap: "4px",
                  }}
               >
                  <span
                     style={{
                        fontSize: "11px",
                        fontWeight: "500",
                        color: notificated ? "#52c41a" : "#ff4d4f",
                     }}
                  >
                     {notificated ? "แจ้งชำระแล้ว" : "รอแจ้งชำระ"}
                  </span>
                  <Switch
                     size="small"
                     checked={notificated}
                     onClick={() => handleChangeNotification(notificated, id)}
                     style={{
                        backgroundColor: notificated ? "#52c41a" : "#bfbfbf",
                     }}
                  />
               </div>
            )
         },
         filters: [
            { text: "แจ้งชำระแล้ว", value: true },
            { text: "รอแจ้งชำระ", value: false },
         ],
         filteredValue: filteredInfo.notificated || null,
         onFilter: (value, record) => (record.notificated === 1) === value,
      },
      {
         title: "หมายเหตุลูกค้า",
         dataIndex: "remark_user",
         key: "remark_user",
         width: "150px",
         render: (text) => (
            <div
               style={{
                  fontSize: "12px",
                  color: "#666",
                  maxWidth: "140px",
                  wordBreak: "break-word",
               }}
            >
               {text || "-"}
            </div>
         ),
         ellipsis: true,
         ...getColumnSearchProps("remark_user"),
      },
      {
         title: "หมายเหตุแอดมิน",
         dataIndex: "remark_admin",
         key: "remark_admin",
         width: "150px",
         render: (text) => (
            <div
               style={{
                  fontSize: "12px",
                  color: "#666",
                  maxWidth: "140px",
                  wordBreak: "break-word",
               }}
            >
               {text || "-"}
            </div>
         ),
         ellipsis: true,
         ...getColumnSearchProps("remark_admin"),
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
                  label: (
                     <div
                        style={{
                           display: "flex",
                           alignItems: "center",
                           gap: "6px",
                        }}
                     >
                        <span style={{ fontSize: "12px" }}>✏️ แก้ไข</span>
                     </div>
                  ),
                  onClick: () => handleShowEditModal(id),
               },
               {
                  key: "2",
                  label: (
                     <div
                        style={{
                           display: "flex",
                           alignItems: "center",
                           gap: "6px",
                           color: "#ff4d4f",
                        }}
                     >
                        <span style={{ fontSize: "12px" }}>🗑️ ลบ</span>
                     </div>
                  ),
                  onClick: () => handleDeleteRow(id),
               },
            ]

            return (
               <div style={{ textAlign: "center" }}>
                  <Dropdown
                     menu={{ items }}
                     trigger={["click"]}
                     placement="bottomRight"
                  >
                     <button
                        style={{
                           border: "none",
                           background: "#f0f0f0",
                           borderRadius: "4px",
                           padding: "4px 8px",
                           cursor: "pointer",
                           fontSize: "12px",
                           transition: "all 0.3s",
                        }}
                        onMouseEnter={(e) => {
                           e.target.style.background = "#1890ff"
                           e.target.style.color = "white"
                        }}
                        onMouseLeave={(e) => {
                           e.target.style.background = "#f0f0f0"
                           e.target.style.color = "#262626"
                        }}
                     >
                        <MoreOutlined />
                     </button>
                  </Dropdown>
               </div>
            )
         },
      },
   ]
}

export { paymentTableColumns }
export default paymentTableColumns
