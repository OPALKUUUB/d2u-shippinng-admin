import { Dropdown, Space, Switch, Tooltip } from "antd"
import {
   DownOutlined,
   LinkOutlined,
   CheckCircleOutlined,
   ClockCircleOutlined,
   MoreOutlined,
} from "@ant-design/icons"
import sortDateTime from "../../utils/sortDateTime"
import ImagePopup from "../ImagePopup"

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

const biddingTableColumns = ({
   data,
   filteredInfo,
   sortedInfo,
   getColumnSearchProps,
   handleCheck,
   handleShowEditModal,
   handleShowEditStatusModal,
   handleDeleteRow,
   imagePopupState,
   setImagePopupState,
   newOrderIds = new Set(),
}) => {
   // ตรวจสอบว่ารายการเป็น order ใหม่หรือไม่
   const isNewOrder = (record) => {
      const orderKey = `${record.created_at}_${record.username}_${
         record.id || Math.random()
      }`
      return newOrderIds.has(orderKey)
   }

   return [
      {
         title: "วันที่",
         dataIndex: "created_at",
         width: "120px",
         key: "created_at",
         sorter: (a, b) => sortDateTime(a.created_at, b.created_at),
         sortOrder:
            sortedInfo.columnKey === "created_at" ? sortedInfo.order : null,
         render: (text, record) => {
            const isNew = isNewOrder(record)
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
                     {text.split(" ")[0]}
                  </div>
                  <div style={{ fontSize: "11px", color: "#666" }}>
                     {text.split(" ")[1]}
                  </div>
               </div>
            )
         },
         ellipsis: true,
      },
      {
         title: "รูปภาพ",
         dataIndex: "image",
         key: "image",
         width: "120px",
         filteredValue: null,
         render: (text) => (
            <div style={{ display: "flex", justifyContent: "center" }}>
               <img
                  src={text}
                  alt="Product"
                  width="80"
                  height="80"
                  style={{
                     borderRadius: "8px",
                     objectFit: "cover",
                     border: "1px solid #f0f0f0",
                     transition: "transform 0.2s ease",
                     cursor: "pointer",
                  }}
                  onMouseOver={(e) => {
                     e.target.style.transform = "scale(1.05)"
                  }}
                  onMouseOut={(e) => {
                     e.target.style.transform = "scale(1)"
                  }}
                  onFocus={(e) => {
                     e.target.style.transform = "scale(1.05)"
                  }}
                  onBlur={(e) => {
                     e.target.style.transform = "scale(1)"
                  }}
                  onClick={() =>
                     setImagePopupState({
                        isOpen: true,
                        images: [text],
                        startIndex: 0,
                     })
                  }
               />
            </div>
         ),
      },
      {
         title: "ชื่อลูกค้า",
         dataIndex: "username",
         key: "username",
         filters: data?.reduce(
            (accumulator, currentValue) => [
               ...accumulator,
               { text: currentValue.username, value: currentValue.username },
            ],
            []
         ),
         filteredValue: filteredInfo.username || null,
         onFilter: (value, record) => record.username.includes(value),
         sorter: (a, b) => a.username.length - b.username.length,
         sortOrder:
            sortedInfo.columnKey === "username" ? sortedInfo.order : null,
         ellipsis: true,
         width: "140px",
         render: (text) => (
            <div style={{ textAlign: "center" }}>
               <span
                  style={{
                     background: "transparent",
                     color: "#52c41a",
                     border: "1px solid #52c41a",
                     padding: "4px 8px",
                     borderRadius: "12px",
                     fontSize: "12px",
                     fontWeight: "500",
                     display: "inline-block",
                     maxWidth: "100%",
                     overflow: "hidden",
                     textOverflow: "ellipsis",
                     whiteSpace: "nowrap",
                  }}
               >
                  {text}
               </span>
            </div>
         ),
      },
      {
         title: "ลิงค์ประมูล",
         dataIndex: "link",
         key: "link",
         width: "140px",
         render: (text, record, index) => {
            const link_code = text.split(
               "https://auctions.yahoo.co.jp/jp/auction/"
            )
            const auctionId = link_code[1] || ""
            console.log(link_code)
            return (
               <div style={{ textAlign: "center" }}>
                  <a
                     href={text}
                     target="_blank"
                     rel="noreferrer"
                     style={{
                        background: "transparent",
                        color: "#1677ff",
                        padding: "4px 8px",
                        borderRadius: "4px",
                        textDecoration: "underline",
                        fontSize: "11px",
                        fontWeight: "500",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "4px",
                        transition: "all 0.2s ease",
                        maxWidth: "120px",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                     }}
                     onMouseOver={(e) => {
                        e.target.style.color = "#0958d9"
                        e.target.style.textDecoration = "underline"
                     }}
                     onMouseOut={(e) => {
                        e.target.style.color = "#1677ff"
                        e.target.style.textDecoration = "underline"
                     }}
                     onFocus={(e) => {
                        e.target.style.color = "#0958d9"
                        e.target.style.textDecoration = "underline"
                     }}
                     onBlur={(e) => {
                        e.target.style.color = "#1677ff"
                        e.target.style.textDecoration = "underline"
                     }}
                  >
                     <LinkOutlined style={{ fontSize: "10px" }} />
                     {auctionId}
                  </a>
               </div>
            )
         },
         filteredValue: null,
         ellipsis: false,
      },
      {
         title: "ประมูล #1",
         dataIndex: "id",
         key: "maxbid",
         filteredValue: null,
         width: "150px",
         render: (id) => {
            const orders = data.filter((ft) => ft.id === id)
            const order = orders[0]
            const check = order.admin_maxbid_id !== null
            const isLoading = order.loading_maxbid || false
            return (
               <div style={{ textAlign: "center", padding: "8px" }}>
                  <div
                     style={{
                        fontSize: "12px",
                        fontWeight: "600",
                        color: "#262626",
                        marginBottom: "8px",
                     }}
                  >
                     ¥
                     {new Intl.NumberFormat("ja-JP", {
                        minimumFractionDigits: 0,
                     }).format(order.maxbid)}
                  </div>
                  <div
                     style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "6px",
                     }}
                  >
                     <div
                        onClick={() =>
                           !isLoading && handleCheck("maxbid", check, id)
                        }
                        tabIndex={0}
                        role="button"
                        style={{
                           background: isLoading
                              ? "#f5f5f5"
                              : check
                              ? "#f6ffed"
                              : "#fff7e6",
                           border: `1px solid ${
                              isLoading
                                 ? "#d9d9d9"
                                 : check
                                 ? "#52c41a"
                                 : "#faad14"
                           }`,
                           color: isLoading
                              ? "#999"
                              : check
                              ? "#52c41a"
                              : "#faad14",
                           padding: "4px 8px",
                           borderRadius: "12px",
                           fontSize: "10px",
                           fontWeight: "500",
                           cursor: isLoading ? "not-allowed" : "pointer",
                           transition: "all 0.2s ease",
                           display: "flex",
                           alignItems: "center",
                           gap: "4px",
                           userSelect: "none",
                           opacity: isLoading ? 0.7 : 1,
                           pointerEvents: isLoading ? "none" : "auto",
                        }}
                        onMouseOver={(e) => {
                           if (!isLoading)
                              e.target.style.transform = "scale(1.05)"
                        }}
                        onMouseOut={(e) => {
                           if (!isLoading) e.target.style.transform = "scale(1)"
                        }}
                        onFocus={(e) => {
                           if (!isLoading)
                              e.target.style.transform = "scale(1.05)"
                        }}
                        onBlur={(e) => {
                           if (!isLoading) e.target.style.transform = "scale(1)"
                        }}
                     >
                        {isLoading ? (
                           <>
                              <div
                                 style={{
                                    width: "10px",
                                    height: "10px",
                                    border: "1px solid #d9d9d9",
                                    borderTop: "1px solid #999",
                                    borderRadius: "50%",
                                    animation: "spin 1s linear infinite",
                                 }}
                              />
                              Loading...
                              <style>{`
                              @keyframes spin {
                                 0% { transform: rotate(0deg); }
                                 100% { transform: rotate(360deg); }
                              }
                           `}</style>
                           </>
                        ) : check ? (
                           <>
                              <CheckCircleOutlined
                                 style={{ fontSize: "10px" }}
                              />
                              Assigned
                           </>
                        ) : (
                           <>
                              <ClockCircleOutlined
                                 style={{ fontSize: "10px" }}
                              />
                              Assign
                           </>
                        )}
                     </div>
                     {order.admin_maxbid_username && (
                        <span
                           style={{
                              fontSize: "10px",
                              color: check ? "#1677ff" : "#999",
                              fontWeight: "500",
                           }}
                        >
                           {order.admin_maxbid_username}
                        </span>
                     )}
                  </div>
               </div>
            )
         },
      },
      {
         title: "ประมูล #2",
         dataIndex: "id",
         key: "addbid1",
         filteredValue: null,
         width: "150px",
         render: (id) => {
            const orders = data.filter((ft) => ft.id === id)
            const order = orders[0]
            const check = order.admin_addbid1_id !== null
            const isLoading = order.loading_addbid1 || false

            if (order.addbid1 === null) {
               return (
                  <div style={{ textAlign: "center", padding: "8px" }}>
                     <div
                        style={{
                           background: "#f5f5f5",
                           color: "#999",
                           padding: "6px 10px",
                           borderRadius: "12px",
                           fontSize: "12px",
                           fontStyle: "italic",
                        }}
                     >
                        ไม่มีข้อมูล
                     </div>
                  </div>
               )
            }

            return (
               <div style={{ textAlign: "center", padding: "8px" }}>
                  <div
                     style={{
                        fontSize: "12px",
                        fontWeight: "600",
                        color: "#262626",
                        marginBottom: "8px",
                     }}
                  >
                     ¥
                     {new Intl.NumberFormat("ja-JP", {
                        minimumFractionDigits: 0,
                     }).format(order.addbid1)}
                  </div>
                  <div
                     style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "6px",
                     }}
                  >
                     <div
                        onClick={() =>
                           !isLoading && handleCheck("addbid1", check, id)
                        }
                        tabIndex={0}
                        role="button"
                        style={{
                           background: isLoading
                              ? "#f5f5f5"
                              : check
                              ? "#f6ffed"
                              : "#fff7e6",
                           border: `1px solid ${
                              isLoading
                                 ? "#d9d9d9"
                                 : check
                                 ? "#52c41a"
                                 : "#faad14"
                           }`,
                           color: isLoading
                              ? "#999"
                              : check
                              ? "#52c41a"
                              : "#faad14",
                           padding: "4px 8px",
                           borderRadius: "12px",
                           fontSize: "10px",
                           fontWeight: "500",
                           cursor: isLoading ? "not-allowed" : "pointer",
                           transition: "all 0.2s ease",
                           display: "flex",
                           alignItems: "center",
                           gap: "4px",
                           userSelect: "none",
                           opacity: isLoading ? 0.7 : 1,
                           pointerEvents: isLoading ? "none" : "auto",
                        }}
                        onMouseOver={(e) => {
                           if (!isLoading)
                              e.target.style.transform = "scale(1.05)"
                        }}
                        onMouseOut={(e) => {
                           if (!isLoading) e.target.style.transform = "scale(1)"
                        }}
                        onFocus={(e) => {
                           if (!isLoading)
                              e.target.style.transform = "scale(1.05)"
                        }}
                        onBlur={(e) => {
                           if (!isLoading) e.target.style.transform = "scale(1)"
                        }}
                     >
                        {isLoading ? (
                           <>
                              <div
                                 style={{
                                    width: "10px",
                                    height: "10px",
                                    border: "1px solid #d9d9d9",
                                    borderTop: "1px solid #999",
                                    borderRadius: "50%",
                                    animation: "spin 1s linear infinite",
                                 }}
                              />
                              Loading...
                           </>
                        ) : check ? (
                           <>
                              <CheckCircleOutlined
                                 style={{ fontSize: "10px" }}
                              />
                              Assigned
                           </>
                        ) : (
                           <>
                              <ClockCircleOutlined
                                 style={{ fontSize: "10px" }}
                              />
                              Assign
                           </>
                        )}
                     </div>
                     {order.admin_addbid1_username && (
                        <span
                           style={{
                              fontSize: "10px",
                              color: check ? "#1677ff" : "#999",
                              fontWeight: "500",
                           }}
                        >
                           {order.admin_addbid1_username}
                        </span>
                     )}
                  </div>
               </div>
            )
         },
      },
      {
         title: "ประมูล #3",
         dataIndex: "id",
         key: "addbid2",
         filteredValue: null,
         width: "150px",
         render: (id) => {
            const orders = data.filter((ft) => ft.id === id)
            const order = orders[0]
            const check = order.admin_addbid2_id !== null
            const isLoading = order.loading_addbid2 || false

            if (order.addbid2 === null) {
               return (
                  <div style={{ textAlign: "center", padding: "8px" }}>
                     <div
                        style={{
                           background: "#f5f5f5",
                           color: "#999",
                           padding: "6px 10px",
                           borderRadius: "12px",
                           fontSize: "12px",
                           fontStyle: "italic",
                        }}
                     >
                        ไม่มีข้อมูล
                     </div>
                  </div>
               )
            }

            return (
               <div style={{ textAlign: "center", padding: "8px" }}>
                  <div
                     style={{
                        fontSize: "12px",
                        fontWeight: "600",
                        color: "#262626",
                        marginBottom: "8px",
                     }}
                  >
                     ¥
                     {new Intl.NumberFormat("ja-JP", {
                        minimumFractionDigits: 0,
                     }).format(order.addbid2)}
                  </div>
                  <div
                     style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "6px",
                     }}
                  >
                     <div
                        onClick={() =>
                           !isLoading && handleCheck("addbid2", check, id)
                        }
                        tabIndex={0}
                        role="button"
                        style={{
                           background: isLoading
                              ? "#f5f5f5"
                              : check
                              ? "#f6ffed"
                              : "#fff7e6",
                           border: `1px solid ${
                              isLoading
                                 ? "#d9d9d9"
                                 : check
                                 ? "#52c41a"
                                 : "#faad14"
                           }`,
                           color: isLoading
                              ? "#999"
                              : check
                              ? "#52c41a"
                              : "#faad14",
                           padding: "4px 8px",
                           borderRadius: "12px",
                           fontSize: "10px",
                           fontWeight: "500",
                           cursor: isLoading ? "not-allowed" : "pointer",
                           transition: "all 0.2s ease",
                           display: "flex",
                           alignItems: "center",
                           gap: "4px",
                           userSelect: "none",
                           opacity: isLoading ? 0.7 : 1,
                           pointerEvents: isLoading ? "none" : "auto",
                        }}
                        onMouseOver={(e) => {
                           if (!isLoading)
                              e.target.style.transform = "scale(1.05)"
                        }}
                        onMouseOut={(e) => {
                           if (!isLoading) e.target.style.transform = "scale(1)"
                        }}
                        onFocus={(e) => {
                           if (!isLoading)
                              e.target.style.transform = "scale(1.05)"
                        }}
                        onBlur={(e) => {
                           if (!isLoading) e.target.style.transform = "scale(1)"
                        }}
                     >
                        {isLoading ? (
                           <>
                              <div
                                 style={{
                                    width: "10px",
                                    height: "10px",
                                    border: "1px solid #d9d9d9",
                                    borderTop: "1px solid #999",
                                    borderRadius: "50%",
                                    animation: "spin 1s linear infinite",
                                 }}
                              />
                              Loading...
                           </>
                        ) : check ? (
                           <>
                              <CheckCircleOutlined
                                 style={{ fontSize: "10px" }}
                              />
                              Assigned
                           </>
                        ) : (
                           <>
                              <ClockCircleOutlined
                                 style={{ fontSize: "10px" }}
                              />
                              Assign
                           </>
                        )}
                     </div>
                     {order.admin_addbid2_username && (
                        <span
                           style={{
                              fontSize: "10px",
                              color: check ? "#1677ff" : "#999",
                              fontWeight: "500",
                           }}
                        >
                           {order.admin_addbid2_username}
                        </span>
                     )}
                  </div>
               </div>
            )
         },
      },
      {
         title: "หมายเหตุลูกค้า",
         dataIndex: "remark_user",
         key: "remark_user",
         filteredValue: filteredInfo.remark_user || null,
         ellipsis: true,
         width: "180px",
         render: (text) => (
            <div style={{ padding: "4px" }}>
               {text ? (
                  <div
                     style={{
                        background: "white",
                        border: "1px solid #d9d9d9",
                        borderRadius: "4px",
                        padding: "8px",
                        fontSize: "12px",
                        color: "#262626",
                        maxHeight: "60px",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        lineHeight: "1.4",
                     }}
                  >
                     {text}
                  </div>
               ) : (
                  <span
                     style={{
                        color: "#bfbfbf",
                        fontSize: "12px",
                        fontStyle: "italic",
                     }}
                  >
                     ไม่มีหมายเหตุ
                  </span>
               )}
            </div>
         ),
         ...getColumnSearchProps("remark_user"),
      },
      {
         title: "หมายเหตุแอดมิน",
         dataIndex: "remark_admin",
         key: "remark_admin",
         filteredValue: filteredInfo.remark_admin || null,
         ellipsis: true,
         width: "180px",
         render: (text) => (
            <div style={{ padding: "4px" }}>
               {text ? (
                  <div
                     style={{
                        background: "#1677ff",
                        border: "1px solid #1677ff",
                        borderRadius: "4px",
                        padding: "8px",
                        fontSize: "12px",
                        color: "white",
                        maxHeight: "60px",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        lineHeight: "1.4",
                     }}
                  >
                     {text}
                  </div>
               ) : (
                  <span
                     style={{
                        color: "#bfbfbf",
                        fontSize: "12px",
                        fontStyle: "italic",
                     }}
                  >
                     ไม่มีหมายเหตุ
                  </span>
               )}
            </div>
         ),
         ...getColumnSearchProps("remark_admin"),
      },
      {
         title: "",
         dataIndex: "id",
         key: "manage",
         filteredValue: null,
         ellipsis: true,
         width: "45px",
         fixed: "right",
         render: (id) => {
            const items = [
               {
                  key: "1",
                  label: "หมายเหตุ",
                  onClick: () => handleShowEditModal(id),
               },
               {
                  key: "2",
                  label: "สถานะประมูล",
                  onClick: () => handleShowEditStatusModal(id),
               },
               {
                  key: "3",
                  label: <span style={{ color: "#ff4d4f" }}>ลบรายการ</span>,
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
                           background: "transparent",
                           color: "#595959",
                           border: "1px solid #d9d9d9",
                           borderRadius: "6px",
                           fontSize: "14px",
                           fontWeight: "500",
                           cursor: "pointer",
                           display: "flex",
                           alignItems: "center",
                           justifyContent: "center",
                           transition: "all 0.2s ease",
                           width: "32px",
                           height: "32px",
                        }}
                        onMouseOver={(e) => {
                           e.target.style.background = "#f5f5f5"
                           e.target.style.borderColor = "#1677ff"
                           e.target.style.color = "#1677ff"
                        }}
                        onMouseOut={(e) => {
                           e.target.style.background = "transparent"
                           e.target.style.borderColor = "#d9d9d9"
                           e.target.style.color = "#595959"
                        }}
                        onFocus={(e) => {
                           e.target.style.background = "#f5f5f5"
                           e.target.style.borderColor = "#1677ff"
                           e.target.style.color = "#1677ff"
                        }}
                        onBlur={(e) => {
                           e.target.style.background = "transparent"
                           e.target.style.borderColor = "#d9d9d9"
                           e.target.style.color = "#595959"
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

export { biddingTableColumns }
export default biddingTableColumns
