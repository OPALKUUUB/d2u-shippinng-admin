/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable no-nested-ternary */
/* eslint-disable prefer-const */
import {
   Table,
   message,
   Select,
   Dropdown,
   Space,
   Modal,
   Input,
   Button,
   Switch,
   Collapse,
   Spin,
   Tag,
} from "antd"
import {
   Page,
   Text,
   View,
   Document,
   StyleSheet,
   PDFViewer,
   Font,
} from "@react-pdf/renderer"
import { getSession } from "next-auth/react"
import React, { Fragment, useEffect, useState, useRef } from "react"
import { useRouter } from "next/router"
import {
   DownOutlined,
   PlusCircleFilled,
   SearchOutlined,
   CheckOutlined,
} from "@ant-design/icons"
import Highlighter from "react-highlight-words"
import axios from "axios"
import CardHead from "../../components/CardHead"
import Layout from "../../components/layout/layout"
import EditImageModal from "../../components/Modal/EditImageModal"

const { TextArea } = Input

const ShipBillingModel = {
   shipbilling_id: "",
   user_id: "",
   payment_type: "",
   slip_image: "",
   delivery_type: "",
   delivery_by: "",
   remark: "",
}

function ShipBilling() {
   const router = useRouter()
   const [data, setData] = useState([])
   const [dataTemp, setDataTemp] = useState([])
   const [voyageSelect, setVoyageSelect] = useState("เลือกรอบเรือ")
   const [items, setItems] = useState([])
   const [showEditModal, setShowEditModal] = useState(false)
   const [selectedRow, setSelectedRow] = useState(ShipBillingModel)
   const [selectedRowKeys, setSelectedRowKeys] = useState([])
   const [searchText, setSearchText] = useState("")
   const [searchedColumn, setSearchedColumn] = useState("")
   const [openEditSlipModal, setOpenEditSlipModal] = useState(false)
   const searchInput = useRef(null)
   const [loading, setLoading] = useState(false)

   const handleChangeSelect = async (value) => {
      message.info(`voyage ${value}`)
      setVoyageSelect(value)
      if (router.query.voyage !== value) {
         router.push({ query: { voyage: value } })
      }
      try {
         const response = await axios.get(`/api/shipbilling?voyage=${value}`)
         const responseJson = await response.data
         console.log(responseJson)
         setDataTemp(responseJson.trackings)
         setData(
            responseJson.trackings
               .sort((a, b) => {
                  const ua = a.username.toLowerCase()
                  const ub = b.username.toLowerCase()
                  return ua < ub ? -1 : ua > ub ? 1 : 0
               })
               .reduce((a, c, idx) => {
                  const group_user = a.find((fi) => fi.username === c.username)
                  if (group_user !== undefined) return a
                  return [...a, { ...c, key: idx }]
               }, [])
         )
      } catch (err) {
         console.log(err)
      }
   }
   const handleOkEditModal = async () => {
      let { shipbilling_id } = selectedRow
      try {
         if (selectedRow.shipbilling_id === null) {
            const response1 = await fetch(`/api/shipbilling`, {
               method: "POST",
               headers: {
                  "Content-Type": "application/json",
               },
               body: JSON.stringify({
                  user_id: selectedRow.user_id,
                  voyage: voyageSelect,
               }),
            })
            const responseJson1 = await response1.json()
            shipbilling_id = responseJson1.billing.id
         }
         const response = await fetch(`/api/shipbilling?id=${shipbilling_id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
               address: selectedRow.address,
               remark: selectedRow.remark,
               delivery_type: selectedRow.delivery_type,
               payment_type: selectedRow.payment_type,
               date_pay_voyage: new Date().toLocaleString("th-BK"),
               delivery_by: selectedRow.delivery_by,
            }),
         })
         const responseJson = await response.json()
         const { billing } = responseJson
         setData((prev) => {
            const index = prev.findIndex(
               (f) =>
                  f.user_id === billing.user_id && f.voyage === billing.voyage
            )
            // console.log(index)
            return [
               ...prev.slice(0, index),
               { ...billing, username: selectedRow.username },
               ...prev.slice(index + 1),
            ]
         })
         message.success("success!")
      } catch (err) {
         console.log(err)
      } finally {
         setSelectedRow(ShipBillingModel)
         setShowEditModal(false)
      }
   }

   const handleClickAddressCustomer = async () => {
      const { user_id } = selectedRow
      const response = await fetch(`/api/user/all?user_id=${user_id}`)
      const responseJson = await response.json()
      const txt = responseJson.user?.address
      setSelectedRow((prev) => ({
         ...prev,
         delivery_type: "ขนส่งเอกชน(ที่อยู่ ลค.)",
         address: txt,
      }))
   }

   const handleChangeDeliveryType = async (value) => {
      if (value === "ขนส่งเอกชน(ที่อยู่ ลค.)") {
         handleClickAddressCustomer()
      } else {
         setSelectedRow((prev) => ({
            ...prev,
            delivery_type: value,
            address: value,
         }))
      }
   }

   const handleChangeNoti = async (status, bill) => {
      // eslint-disable-next-line prefer-destructuring
      let shipbilling_id = bill.shipbilling_id
      if (bill.shipbilling_id === null) {
         const response1 = await fetch(`/api/shipbilling`, {
            method: "POST",
            headers: {
               "Content-Type": "application/json",
            },
            body: JSON.stringify({
               user_id: bill.user_id,
               voyage: voyageSelect,
            }),
         })
         const responseJson1 = await response1.json()
         shipbilling_id = responseJson1.billing.id
      }
      const response = await fetch(`/api/shipbilling?id=${shipbilling_id}`, {
         method: "PATCH",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify({
            invoice_notificate: status ? 0 : 1,
         }),
      })
      const responseJson = await response.json()
      const { billing } = responseJson
      setData((prev) => {
         const index = prev.findIndex(
            (f) => f.user_id === billing.user_id && f.voyage === billing.voyage
         )
         return [
            ...prev.slice(0, index),
            { ...billing },
            ...prev.slice(index + 1),
         ]
      })
      message.success("success!")
   }
   const handleChangeCheck = async (status, bill) => {
      // eslint-disable-next-line prefer-destructuring
      let shipbilling_id = bill.shipbilling_id
      if (bill.shipbilling_id === null) {
         const response1 = await fetch(`/api/shipbilling`, {
            method: "POST",
            headers: {
               "Content-Type": "application/json",
            },
            body: JSON.stringify({
               user_id: bill.user_id,
               voyage: voyageSelect,
            }),
         })
         const responseJson1 = await response1.json()
         shipbilling_id = responseJson1.billing.id
      }
      const response = await fetch(`/api/shipbilling?id=${shipbilling_id}`, {
         method: "PATCH",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify({
            check: status ? 0 : 1,
         }),
      })
      const responseJson = await response.json()
      const { billing } = responseJson
      setData((prev) => {
         const index = prev.findIndex(
            (f) => f.user_id === billing.user_id && f.voyage === billing.voyage
         )
         console.log(index)
         return [
            ...prev.slice(0, index),
            { ...billing },
            ...prev.slice(index + 1),
         ]
      })
      message.success("success!")
   }
   const handleChangeCheck2 = async (status, bill) => {
      // eslint-disable-next-line prefer-destructuring
      let shipbilling_id = bill.shipbilling_id
      if (bill.shipbilling_id === null) {
         const response1 = await fetch(`/api/shipbilling`, {
            method: "POST",
            headers: {
               "Content-Type": "application/json",
            },
            body: JSON.stringify({
               user_id: bill.user_id,
               voyage: voyageSelect,
            }),
         })
         const responseJson1 = await response1.json()
         shipbilling_id = responseJson1.billing.id
      }
      const response = await fetch(`/api/shipbilling?id=${shipbilling_id}`, {
         method: "PATCH",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify({
            check_2: status ? 0 : 1,
         }),
      })
      const responseJson = await response.json()
      const { billing } = responseJson
      setData((prev) => {
         const index = prev.findIndex(
            (f) => f.user_id === billing.user_id && f.voyage === billing.voyage
         )
         console.log(index)
         return [
            ...prev.slice(0, index),
            { ...billing },
            ...prev.slice(index + 1),
         ]
      })
      message.success("success!")
   }
   const handleSearch = (selectedKeys, confirm, dataIndex) => {
      confirm()
      setSearchText(selectedKeys[0])
      setSearchedColumn(dataIndex)
   }
   const handleReset = (clearFilters) => {
      clearFilters()
      setSearchText("")
   }
   const getColumnSearchProps = (dataIndex) => ({
      filterDropdown: ({
         setSelectedKeys,
         selectedKeys,
         confirm,
         clearFilters,
         close,
      }) => (
         <div
            style={{
               padding: 8,
            }}
            onKeyDown={(e) => e.stopPropagation()}
         >
            <Input
               ref={searchInput}
               placeholder={`Search ${dataIndex}`}
               value={selectedKeys[0]}
               onChange={(e) =>
                  setSelectedKeys(e.target.value ? [e.target.value] : [])
               }
               onPressEnter={() =>
                  handleSearch(selectedKeys, confirm, dataIndex)
               }
               style={{
                  marginBottom: 8,
                  display: "block",
               }}
            />
            <Space>
               <Button
                  type="primary"
                  onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                  icon={<SearchOutlined />}
                  size="small"
                  style={{
                     width: 90,
                  }}
               >
                  Search
               </Button>
               <Button
                  onClick={() => clearFilters && handleReset(clearFilters)}
                  size="small"
                  style={{
                     width: 90,
                  }}
               >
                  Reset
               </Button>
               <Button
                  type="link"
                  size="small"
                  onClick={() => {
                     confirm({
                        closeDropdown: false,
                     })
                     setSearchText(selectedKeys[0])
                     setSearchedColumn(dataIndex)
                  }}
               >
                  Filter
               </Button>
               <Button
                  type="link"
                  size="small"
                  onClick={() => {
                     close()
                  }}
               >
                  close
               </Button>
            </Space>
         </div>
      ),
      filterIcon: (filtered) => (
         <SearchOutlined
            style={{
               color: filtered ? "#1890ff" : undefined,
            }}
         />
      ),
      onFilter: (value, record) => {
         if (record[dataIndex] === null) {
            return false
         }
         return record[dataIndex]
            .toString()
            .toLowerCase()
            .includes(value.toLowerCase())
      },
      onFilterDropdownOpenChange: (visible) => {
         if (visible) {
            setTimeout(() => searchInput.current?.select(), 100)
         }
      },
      render: (text) =>
         // eslint-disable-next-line no-nested-ternary
         searchedColumn === dataIndex ? (
            <Highlighter
               highlightStyle={{
                  backgroundColor: "#ffc069",
                  padding: 0,
               }}
               searchWords={[searchText]}
               autoEscape
               textToHighlight={text ? text.toString() : ""}
            />
         ) : text === "" || text === null ? (
            "-"
         ) : (
            text
         ),
   })
   const columns = [
      {
         title: "username",
         dataIndex: "username",
         width: "80px",
         key: "username",
         ...getColumnSearchProps("username"),
         render: (text, item) => (
            <div>
               {text}{" "}
               {item.checked && <CheckOutlined className="text-green-500" />}
            </div>
         ),
      },
      {
         title: "วิธีการจัดส่ง",
         dataIndex: "delivery_type",
         width: "120px",
         key: "delivery_type",
         filters: [
            {
               text: "รับเอง พระราม 3",
               value: "รับเอง พระราม 3",
            },
            {
               text: "รับเอง ร่มเกล้า",
               value: "รับเอง ร่มเกล้า",
            },
            {
               text: "D2U ส่งให้",
               value: "D2U ส่งให้",
            },
            {
               text: "ฝากไว้ก่อน",
               value: "ฝากไว้ก่อน",
            },
            {
               text: "ขนส่งเอกชน(ที่อยู่ ลค.)",
               value: "ขนส่งเอกชน(ที่อยู่ ลค.)",
            },
         ],
         onFilter: (value, record) =>
            record.delivery_type === null || record.delivery_type === undefined
               ? false
               : record.delivery_type.indexOf(value) === 0,
         render: (text, item) => {
            if (text === "ขนส่งเอกชน(ที่อยู่ ลค.)") {
               return (
                  <div>
                     <Tag color="orange">{text}</Tag>
                     <Tag color="gold">
                        {item.delivery_by === null || item.delivery_by === ""
                           ? "ยังไม่ได้เลือก"
                           : item.delivery_by}
                     </Tag>
                  </div>
               )
            }
            return text === "" || text === null ? (
               "-"
            ) : (
               <Tag color="magenta">{text}</Tag>
            )
         },
      },
      {
         title: "ที่อยู่จัดส่ง",
         dataIndex: "address",
         width: "120px",
         key: "address",
         render: (text) => (text === "" || text === null ? "-" : text),
         ...getColumnSearchProps("address"),
      },
      {
         title: "ค่าเรือ",
         dataIndex: "voyage_price",
         width: "60px",
         key: "voyage_price",
         render: (num) => {
            if (num === "" || num === null) {
               return "-"
            }
            return new Intl.NumberFormat("th-TH", {
               currency: "THB",
               style: "currency",
            }).format(num)
         },
      },
      {
         title: "ประเภทการจ่าย",
         dataIndex: "payment_type",
         width: "60px",
         align: "center",
         key: "payment_type",
         filters: [
            {
               text: "เงินสด",
               value: "เงินสด",
            },
            {
               text: "โอนเงิน",
               value: "โอนเงิน",
            },
            {
               text: "ไม่มีค่าเรือ",
               value: "ไม่มีค่าเรือ",
            },
         ],
         onFilter: (value, record) => record.payment_type?.indexOf(value) === 0,
         render: (text) => (text === null || text === "" ? "-" : text),
      },
      {
         title: "แจ้งยอด",
         dataIndex: "user_id",
         width: "70px",
         align: "center",
         key: "invoice_notificate",
         filters: [
            {
               text: "แจ้งยอดแล้ว",
               value: 1,
            },
            {
               text: "ยังไม่แจ้งยอด",
               value: 0 || null,
            },
         ],
         onFilter: (value, record) => record.invoice_notificate === value,
         render: (user_id) => {
            const billings = data.filter((ft) => ft.user_id === user_id)
            const billing = billings[0]
            const invoice_notificate = billing.invoice_notificate === 1
            return invoice_notificate ? (
               <div className="flex flex-col items-center">
                  <Switch
                     checked={invoice_notificate}
                     onClick={() =>
                        handleChangeNoti(invoice_notificate, billing)
                     }
                  />
                  <div style={{ color: "green" }}>แจ้งยอดแล้ว</div>
               </div>
            ) : (
               <div className="flex flex-col items-center">
                  <Switch
                     checked={invoice_notificate}
                     onClick={() =>
                        handleChangeNoti(invoice_notificate, billing)
                     }
                  />
                  <div style={{ color: "red" }}>ยังไม่แจ้งยอด</div>
               </div>
            )
         },
      },
      // {
      //    title: "check",
      //    dataIndex: "user_id",
      //    width: "120px",
      //    key: "check",
      //    filters: [
      //       {
      //          text: "check",
      //          value: 1,
      //       },
      //       {
      //          text: "not",
      //          value: 0 || null,
      //       },
      //    ],
      //    onFilter: (value, record) => record.check === value,
      //    render: (user_id) => {
      //       const billings = data.filter((ft) => ft.user_id === user_id)
      //       const billing = billings[0]
      //       const check = billing.check === 1
      //       return check ? (
      //          <div>
      //             <span style={{ color: "green" }}>check</span>
      //             <Switch
      //                checked={check}
      //                onClick={() => handleChangeCheck(check, billing)}
      //             />
      //          </div>
      //       ) : (
      //          <div>
      //             <span style={{ color: "red" }}>not</span>
      //             <Switch
      //                checked={check}
      //                onClick={() => handleChangeCheck(check, billing)}
      //             />
      //          </div>
      //       )
      //    },
      // },
      {
         title: "done",
         dataIndex: "user_id",
         width: "60px",
         key: "check_2",
         align: "center",
         filters: [
            {
               text: "done",
               value: 1,
            },
            {
               text: "not done",
               value: 0,
            },
         ],
         onFilter: (value, record) => record.check_2 === value,
         render: (user_id) => {
            const billings = data.filter((ft) => ft.user_id === user_id)
            const billing = billings[0]
            const check = billing.check_2 === 1
            return check ? (
               <div className="flex flex-col items-center">
                  <Switch
                     checked={check}
                     onClick={() => handleChangeCheck2(check, billing)}
                  />
                  <div style={{ color: "green" }}>done</div>
               </div>
            ) : (
               <div className="flex flex-col items-center">
                  <Switch
                     checked={check}
                     onClick={() => handleChangeCheck2(check, billing)}
                  />
                  <div style={{ color: "red" }}>not done</div>
               </div>
            )
         },
      },
      {
         title: "สลิป",
         dataIndex: "slip_image",
         width: "60px",
         key: "slip_image",
         render: (image, item) => {
            if (image) {
               return (
                  <img
                     src={image}
                     alt=""
                     className="w-[100px] h-[100px] object-cover object-center cursor-pointer hover:opacity-50"
                     onClick={() => {
                        setSelectedRow(item)
                        setOpenEditSlipModal(true)
                     }}
                  />
               )
            }
            return (
               <Button
                  type="primary"
                  onClick={() => {
                     setSelectedRow(item)
                     setOpenEditSlipModal(true)
                  }}
                  icon={<PlusCircleFilled />}
               >
                  เพิ่ม
               </Button>
            )
         },
      },
      {
         title: "remark",
         dataIndex: "remark",
         width: "120px",
         key: "remark",
         render: (text) => (text === null || text === "" ? "-" : text),
         ...getColumnSearchProps("remark"),
      },
      {
         title: "จัดการ",
         dataIndex: "user_id",
         key: "manage",
         ellipsis: true,
         width: "90px",
         fixed: "right",
         render: (user_id, item) => {
            const item_manage = [
               {
                  key: "1",
                  label: "แก้ไข",
                  onClick: () => {
                     setSelectedRow(item)
                     setShowEditModal(true)
                  },
               },
               {
                  key: "2",
                  label: "invoice",
                  onClick: () =>
                     window.open(
                        `/shipbilling/invoice?&voyage=${voyageSelect}&user_id=${user_id}`
                     ),
               },
               {
                  key: "23",
                  label: "Qmode",
                  onClick: () =>
                     window.open(
                        `/shipbilling/qmode?&voyage=${voyageSelect}&user_id=${user_id}`
                     ),
               },
            ]
            return (
               <Space>
                  <Dropdown menu={{ items: item_manage }}>
                     <span>
                        จัดการ <DownOutlined />
                     </span>
                  </Dropdown>
               </Space>
            )
         },
      },
   ]
   useEffect(() => {
      setLoading(true)
      ;(async () => {
         const response = await fetch("/api/shipbilling/voyage")
         const responseJson = await response.json()
         setItems(
            responseJson.voyages.reduce(
               (accumulator, currentValue) => [
                  ...accumulator,
                  { label: currentValue.voyage, value: currentValue.voyage },
               ],
               []
            )
         )
      })()
      ;(async () => {
         if (router.query.voyage) {
            await handleChangeSelect(router.query.voyage)
         }
         setLoading(false)
      })()
   }, [])
   const onSelectChange = (newSelectedRowKeys) => {
      // console.log("selectedRowKeys changed: ", newSelectedRowKeys)
      setSelectedRowKeys(newSelectedRowKeys)
   }
   const rowSelection = {
      selectedRowKeys,
      onChange: onSelectChange,
   }
   return (
      <Fragment>
         {loading && (
            <div className="fixed top-0 left-0 right-0 bottom-0 bg-[rgba(0,0,0,0.5)] z-10">
               <div className="fixed top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%]">
                  <Spin size="large" />
               </div>
            </div>
         )}
         <CardHead name="Ship Billing" />
         <div className="container-table">
            <Select
               className="mb-3"
               size="middle"
               defaultValue={voyageSelect}
               value={voyageSelect}
               onChange={handleChangeSelect}
               style={{ width: 200 }}
               options={items}
            />
            <SummaryShipBilling
               selectedRowKeys={selectedRowKeys}
               dataSource={data}
               dataTemp={dataTemp}
               voyage={voyageSelect}
            />
            <div style={{ width: "100%" }}>
               <Table
                  rowSelection={rowSelection}
                  dataSource={data}
                  columns={columns}
                  scroll={{
                     x: 1500,
                     y: 450,
                  }}
               />
            </div>
         </div>
         <EditImageModal
            open={openEditSlipModal}
            onCancel={() => setOpenEditSlipModal(false)}
            item={selectedRow}
            onOk={() => console.log("in")}
            setData={setData}
         />
         <Modal
            title="แก้ไขข้อมูล Ship Billing"
            open={showEditModal}
            onCancel={() => setShowEditModal(false)}
            onOk={handleOkEditModal}
         >
            <div>
               <div className="mb-2">
                  <label>ประเภทการชำระเงิน: </label>
                  <Select
                     className="w-[120px]"
                     options={[
                        { label: "กรุณาเลือก", value: "" },
                        { label: "เงินสด", value: "เงินสด" },
                        { label: "แม่มณี", value: "แม่มณี" },
                        { label: "โอนเงิน", value: "โอนเงิน" },
                        { label: "บัญชีบริษัท", value: "บัญชีบริษัท" },
                        { label: "ไม่มีค่าเรือ", value: "ไม่มีค่าเรือ" },
                     ]}
                     value={selectedRow?.payment_type || ""}
                     onChange={(value) =>
                        setSelectedRow({
                           ...selectedRow,
                           payment_type: value,
                        })
                     }
                  />
               </div>
               <div className="mb-2">
                  <label>จัดส่ง: </label>
                  <Select
                     className="w-[180px] mb-1"
                     options={[
                        { label: "กรุณาเลือกที่อยู่จัดส่ง", value: "" },
                        {
                           label: "ขนส่งเอกชน(ที่อยู่ ลค.)",
                           value: "ขนส่งเอกชน(ที่อยู่ ลค.)",
                        },
                        { label: "รับเอง พระราม 3", value: "รับเอง พระราม 3" },
                        { label: "รับเอง ร่มเกล้า", value: "รับเอง ร่มเกล้า" },
                        { label: "D2U ส่งให้", value: "D2U ส่งให้" },
                        { label: "ฝากไว้ก่อน", value: "ฝากไว้ก่อน" },
                     ]}
                     value={
                        selectedRow.delivery_type === null
                           ? ""
                           : selectedRow.delivery_type
                     }
                     onChange={handleChangeDeliveryType}
                  />
                  <div className="w-full text-red-400">
                     * เลือกบริษัทขนส่งได้ก็ต่อเมื่อเลือก{" "}
                     <span className="font-semibold underline">
                        ขนส่งเอกชน(ที่อยู่ ลค.)
                     </span>
                  </div>
               </div>
               {selectedRow.delivery_type === "ขนส่งเอกชน(ที่อยู่ ลค.)" && (
                  <div className="mb-2">
                     <label>บริษัทขนส่ง: </label>
                     <Select
                        className="w-[180px] mb-1"
                        options={[
                           { label: "กรุณาเลือกบริษัทขนส่ง", value: "" },
                           { label: "FLASH", value: "FLASH" },
                           { label: "KERRY", value: "KERRY" },
                           { label: "J&T", value: "J&T" },
                           { label: "ปณ.", value: "ปณ." },
                           { label: "DHL", value: "DHL" },
                        ]}
                        value={
                           selectedRow.delivery_by === null
                              ? ""
                              : selectedRow.delivery_by
                        }
                        onChange={(value) =>
                           setSelectedRow((prev) => ({
                              ...prev,
                              delivery_by: value,
                           }))
                        }
                     />
                  </div>
               )}
               <div className="mb-2">
                  <label>ที่อยู่จัดส่ง:</label>
                  <TextArea
                     className="mb-1 mt-2"
                     rows={4}
                     value={selectedRow?.address}
                     onChange={(e) =>
                        setSelectedRow({
                           ...selectedRow,
                           address: e.target.value,
                        })
                     }
                  />
               </div>
               <div className="mb-2">
                  <label>หมายเหตุ: </label>
                  <TextArea
                     className="mb-1 mt-2"
                     rows={4}
                     value={selectedRow?.remark}
                     onChange={(e) =>
                        setSelectedRow({
                           ...selectedRow,
                           remark: e.target.value,
                        })
                     }
                  />
               </div>
               {/* <select
                  defaultValue={selectedRow?.payment_type}
                  value={selectedRow?.payment_type || ""}
                  onChange={(e) =>
                     setSelectedRow({
                        ...selectedRow,
                        payment_type: e.target.value,
                     })
                  }
               >
                  <option defaultValue={null}>selected</option>
                  <option value="เงินสด">เงินสด</option>
                  <option value="แม่มณี">แม่มณี</option>
                  <option value="โอนเงิน">โอนเงิน</option>
                  <option value="บัญชีบริษัท">บัญชีบริษัท</option>
                  <option value="ไม่มีค่าเรือ">ไม่มีค่าเรือ</option>
               </select> */}
            </div>
         </Modal>
         <style jsx>
            {`
               .container-table {
                  margin: 10px;
                  padding: 10px;
                  background: white;
               }
            `}
         </style>
      </Fragment>
   )
}

function SummaryShipBilling(props) {
   // console.log(props)
   const datas = props.selectedRowKeys?.reduce((a, c) => {
      const temp = props?.dataSource.find((acc, index, arr) => acc.key === c)
      if (temp === undefined) {
         return a
      }
      const arrTemp = props?.dataTemp.filter(
         (fl) => temp.username === fl.username
      )
      let check_boxNo = []
      let arrTemp_groupBoxNo = []
      for (let i = 0; i < arrTemp.length; i++) {
         let { box_no } = arrTemp[i]
         if (
            check_boxNo.find((acc, index, arr) => arrTemp[i].box_no === acc) !==
            undefined
         ) {
            // eslint-disable-next-line no-continue
            continue
         }
         let count = arrTemp.filter((fl) => fl.box_no === box_no).length
         arrTemp_groupBoxNo.push({ ...arrTemp[i], count })
         check_boxNo.push(arrTemp[i].box_no)
      }
      return [...a, ...arrTemp_groupBoxNo]
   }, [])
   return (
      <Collapse accordion className="mb-3">
         <Collapse.Panel header="ดูสรุปข้อมูล">
            <table className="border-collapse w-full text-center">
               <thead>
                  <tr>
                     <th
                        colSpan={5}
                        className="border-solid border-[1.8px] border-slate-300 py-2 text-[1.1rem] bg-slate-300"
                     >
                        รอบเรือ ({props.voyage})
                     </th>
                  </tr>
                  <tr>
                     <th className="border-solid border-[1.8px] border-slate-300 w-[12.5%] p-2">
                        ชื่อลูกค้า
                     </th>
                     <th className="border-solid border-[1.8px] border-slate-300 w-[12.5%] p-2">
                        จำนวน
                     </th>
                     <th className="border-solid border-[1.8px] border-slate-300 w-[25%] p-2">
                        เลขกล่อง
                     </th>
                     <th className="border-solid border-[1.8px] border-slate-300 w-[25%] p-2">
                        ที่อยู่จัดส่ง
                     </th>
                     <th className="border-solid border-[1.8px] border-slate-300 w-[25%] p-2">
                        หมายเหตุ
                     </th>
                  </tr>
               </thead>
               <tbody>
                  {datas.map((data, index) => (
                     <tr key={index}>
                        <td className="border-solid border-[1.8px] border-slate-300 p-2">
                           {data?.username}
                        </td>
                        <td className="border-solid border-[1.8px] border-slate-300 p-2">
                           {data?.count}
                        </td>
                        <td className="border-solid border-[1.8px] border-slate-300 p-2">
                           {data?.box_no ?? "-"}
                        </td>
                        <td className="border-solid border-[1.8px] border-slate-300 p-2">
                           {data?.address ?? "-"}
                        </td>
                        <td className="border-solid border-[1.8px] border-slate-300 p-2">
                           {data?.remark ?? "-"}
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </Collapse.Panel>
         <Collapse.Panel header="ดูสรุปข้อมูล(PDF)">
            <SummaryPdf datas={datas} voyage={props.voyage} />
         </Collapse.Panel>
      </Collapse>
   )
}

const borderWidth = 0.5
const borderColor = "black"
const styles = StyleSheet.create({
   page: {
      backgroundColor: "white",
      color: "black",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      paddingTop: "10px",
      paddingBottom: "20px",
      paddingLeft: "20px",
      paddingRight: "20px",
      fontFamily: "THSarabun",
   },
   headerPage: {
      width: "100%",
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "start",
      position: "relative",
   },
   headerTable: {
      width: "100%",
      marginTop: 15,
      fontSize: "14px",
      fontFamily: "THSarabunBold",
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      borderTopWidth: borderWidth + 0.5,
      borderTopColor: borderColor,
      borderBottomWidth: borderWidth,
      borderBottomColor: borderColor,
      textAlign: "center",
      backgroundColor: "#cccccc",
   },
   bodyTable: {
      fontSize: "12px",
      width: "100%",
      display: "flex",
      flexDirection: "row",
      fontFamily: "THSarabunBold",
      alignItems: "center",
      borderBottomWidth: borderWidth,
      borderBottomColor: borderColor,
   },
   footerTable: {
      width: "100%",
      display: "flex",
      flexDirection: "row",
      backgroundColor: "#cccccc",
      alignItems: "center",
      borderBottomWidth: borderWidth,
      borderBottomColor: borderColor,
   },
})

function SummaryPdf({ datas, voyage }) {
   useEffect(() => {
      Font.register({
         family: "THSarabun",
         src: "/assets/fonts/THSarabun.ttf",
      })
      Font.register({
         family: "THSarabunBold",
         src: "/assets/fonts/THSarabun Bold.ttf",
      })
   }, [])
   const users = datas.reduce((a, c) => {
      if (a.find((acc, index, arr) => acc === c.username) === undefined) {
         return [...a, c.username]
      }
      return a
   }, [])
   const rows = users.reduce((a, c) => {
      const row = datas.filter((fl) => fl.username === c)
      if (row.length === 0) {
         return a
      }
      const temp = {
         ...row[0],
         count: row.length,
         box_no: row.reduce((a1, c1, index) => {
            if (index === 0) {
               return c1.box_no
            }
            if (`${a1}/${c1.box_no}`.length >= 10) {
               if (a1.split("\n").length > 0) {
                  const last_split = a1.split("\n")[a1.split("\n").length - 1]
                  if (`${last_split}/${c1.box_no}`.length >= 10) {
                     return `${a1}/${c1.box_no}\n`
                  }
               }
               return `${a1}/${c1.box_no}`
            }

            return `${a1}/${c1.box_no}`
         }, ""),
      }
      return [...a, temp]
   }, [])

   return (
      <div>
         <PDFViewer className="w-full h-[300px]">
            <Document title={`รายงานรายการขนส่งประจำรอบเรือ ${voyage}`}>
               <Page size="A4" style={styles.page}>
                  <View style={styles.headerPage}>
                     <Text>บริษัท ดีทูยู ชิปปิ้ง จำกัด</Text>
                     <Text>ข้อมูลประจำรอบเรือ {voyage}</Text>
                  </View>
                  <View style={styles.headerTable}>
                     <Text
                        style={{
                           width: "7%",
                           borderRightColor: borderColor,
                           borderRightWidth: borderWidth,
                           borderLeftColor: borderColor,
                           borderLeftWidth: borderWidth + 0.5,
                           padding: "5px",
                        }}
                     >
                        ลำดับ
                     </Text>
                     <Text
                        style={{
                           width: "18%",
                           borderRightColor: borderColor,
                           borderRightWidth: borderWidth,
                           borderLeftColor: borderColor,
                           borderLeftWidth: borderWidth,
                           padding: "5px",
                        }}
                     >
                        ชื่อลูกค้า
                     </Text>
                     <Text
                        style={{
                           width: "10%",
                           borderRightColor: borderColor,
                           borderRightWidth: borderWidth,
                           borderLeftColor: borderColor,
                           borderLeftWidth: borderWidth,
                           padding: "5px",
                        }}
                     >
                        จำนวน
                     </Text>
                     <Text
                        style={{
                           width: "12%",
                           borderRightColor: borderColor,
                           borderRightWidth: borderWidth,
                           borderLeftColor: borderColor,
                           borderLeftWidth: borderWidth,
                           padding: "5px",
                        }}
                     >
                        เลขกล่อง
                     </Text>
                     <Text
                        style={{
                           width: "25%",
                           borderRightColor: borderColor,
                           borderRightWidth: borderWidth,
                           borderLeftColor: borderColor,
                           borderLeftWidth: borderWidth,
                           padding: "5px",
                        }}
                     >
                        ที่อยู่จัดส่ง
                     </Text>
                     <Text
                        style={{
                           width: "28%",
                           borderRightColor: borderColor,
                           borderRightWidth: borderWidth + 0.5,
                           borderLeftColor: borderColor,
                           borderLeftWidth: borderWidth,
                           padding: "5px",
                        }}
                     >
                        หมายเหตุ
                     </Text>
                  </View>
                  {rows.map((data, index) => (
                     <View
                        key={`summaryVoyagePDF${index}`}
                        style={styles.bodyTable}
                     >
                        <Text
                           style={{
                              width: "7%",
                              height: "100%",
                              textAlign: "center",
                              borderRightColor: borderColor,
                              borderRightWidth: borderWidth,
                              borderLeftColor: borderColor,
                              borderLeftWidth: borderWidth + 0.5,
                              padding: "5px",
                           }}
                        >
                           {index + 1}
                        </Text>
                        <Text
                           style={{
                              width: "18%",
                              height: "100%",
                              textAlign: "center",
                              borderRightColor: borderColor,
                              borderRightWidth: borderWidth,
                              borderLeftColor: borderColor,
                              borderLeftWidth: borderWidth,
                              padding: "5px",
                           }}
                        >
                           {data.username}
                        </Text>
                        <Text
                           style={{
                              width: "10%",
                              height: "100%",
                              textAlign: "center",
                              borderRightColor: borderColor,
                              borderRightWidth: borderWidth,
                              borderLeftColor: borderColor,
                              borderLeftWidth: borderWidth,
                              padding: "5px",
                           }}
                        >
                           {data.count}
                        </Text>
                        <Text
                           style={{
                              width: "12%",
                              height: "100%",
                              textAlign: "center",
                              borderRightColor: borderColor,
                              borderRightWidth: borderWidth,
                              borderLeftColor: borderColor,
                              borderLeftWidth: borderWidth,
                              padding: "5px",
                           }}
                        >
                           {data?.box_no}
                        </Text>
                        <Text
                           style={{
                              width: "25%",
                              height: "100%",
                              textAlign: "center",
                              borderRightColor: borderColor,
                              borderRightWidth: borderWidth,
                              borderLeftColor: borderColor,
                              borderLeftWidth: borderWidth,
                              padding: "5px",
                           }}
                        >
                           {data.address ?? "-"}
                        </Text>
                        <Text
                           style={{
                              width: "28%",
                              height: "100%",
                              textAlign: "center",
                              borderRightColor: borderColor,
                              borderRightWidth: borderWidth + 0.5,
                              borderLeftColor: borderColor,
                              borderLeftWidth: borderWidth,
                              padding: "5px",
                           }}
                        >
                           {data.remark ?? "-"}
                        </Text>
                     </View>
                  ))}
               </Page>
            </Document>
         </PDFViewer>
      </div>
   )
}

ShipBilling.getLayout = function getLayout(page) {
   return <Layout>{page}</Layout>
}

export async function getServerSideProps(context) {
   const session = await getSession({ req: context.req })
   if (!session) {
      return {
         redirect: {
            destination: "/auth/signin",
            permanent: false,
         },
      }
   }
   return {
      props: {
         session,
      },
   }
}
export default ShipBilling
