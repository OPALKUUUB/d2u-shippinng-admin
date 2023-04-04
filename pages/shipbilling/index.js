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
} from "antd"
import { getSession } from "next-auth/react"
import React, { Fragment, useEffect, useState, useRef } from "react"
import { useRouter } from "next/router"
import { DownOutlined, SearchOutlined } from "@ant-design/icons"
import Highlighter from "react-highlight-words"
import {
   Page,
   Text,
   View,
   Document,
   StyleSheet,
   PDFViewer,
   Font,
} from "@react-pdf/renderer"
import CardHead from "../../components/CardHead"
import Layout from "../../components/layout/layout"

const { TextArea } = Input

function ShipBilling() {
   const router = useRouter()
   const [data, setData] = useState([])
   const [dataTemp, setDataTemp] = useState([])
   const [voyageSelect, setVoyageSelect] = useState("เลือกรอบเรือ")
   const [items, setItems] = useState([])
   const [showEditModal, setShowEditModal] = useState(false)
   const [selectedRow, setSelectedRow] = useState({
      shipbilling_id: "",
      user_id: "",
      payment_type: "",
      remark: "",
   })
   const [selectedRowKeys, setSelectedRowKeys] = useState([])
   const [searchText, setSearchText] = useState("")
   const [searchedColumn, setSearchedColumn] = useState("")
   const searchInput = useRef(null)
   const handleChangeSelect = async (value) => {
      message.info(`voyage ${value}`)
      setVoyageSelect(value)
      if (router.query.voyage !== value) {
         router.push({ query: { voyage: value } })
      }
      try {
         const response = await fetch(`/api/shipbilling?voyage=${value}`)
         const responseJson = await response.json()
         setDataTemp(responseJson.trackings)
         setData(
            responseJson.trackings
               .sort((a, b) => {
                  if (a.username.toLowerCase() < b.username.toLowerCase()) {
                     return -1
                  }
                  if (a.username.toLowerCase() > b.username.toLowerCase()) {
                     return 1
                  }
                  return 0
               })
               .reduce((a, c, idx) => {
                  const group_user = a.find(
                     (acc, index, arr) => acc.username === c.username
                  )
                  if (group_user !== undefined) {
                     return a
                  }
                  return [...a, { ...c, key: idx }]
               }, [])
         )
      } catch (err) {
         console.log(err)
      }
   }

   const handleShowEditModal = (user_id) => {
      setSelectedRow(data.filter((ft) => ft.user_id === user_id)[0])
      setShowEditModal(true)
   }
   const handleOkEditModal = async () => {
      // console.log(selectedRow)
      let { shipbilling_id } = selectedRow
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
            payment_type: selectedRow.payment_type,
         }),
      })
      const responseJson = await response.json()
      const { billing } = responseJson
      setData((prev) => {
         const index = prev.findIndex(
            (f) => f.user_id === billing.user_id && f.voyage === billing.voyage
         )
         // console.log(index)
         return [
            ...prev.slice(0, index),
            { ...billing, username: selectedRow.username },
            ...prev.slice(index + 1),
         ]
      })
      message.success("success!")
   }

   const handleClickAddressCustomer = async () => {
      const { user_id } = selectedRow
      const response = await fetch(`/api/user/all?user_id=${user_id}`)
      const responseJson = await response.json()
      // eslint-disable-next-line no-unsafe-optional-chaining
      const txt = selectedRow.address + responseJson.user?.address
      setSelectedRow((prev) => ({ ...prev, address: txt }))
   }

   const handleChangeNoti = async (status, bill) => {
      // console.log(bill)
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
         // console.log(index)
         return [
            ...prev.slice(0, index),
            { ...billing  },
            ...prev.slice(index + 1),
         ]
      })
      message.success("success!")
   }
   const handleChangeCheck = async (status, bill) => {
      // console.log(bill)
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
      console.log(bill)
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
         width: "120px",
         key: "username",
         ...getColumnSearchProps("username"),
      },
      {
         title: "ที่อยู่จัดส่ง",
         dataIndex: "address",
         width: "120px",
         key: "payment_type",
         render: (text) => (text === null ? "-" : text),
      },
      {
         title: "payment_type",
         dataIndex: "payment_type",
         width: "120px",
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
         render: (text) => (text === null ? "-" : text),
      },
      {
         title: "invoice_notificate",
         dataIndex: "user_id",
         width: "120px",
         key: "invoice_notificate",
         filters: [
            {
               text: "จ่ายเงินแล้ว",
               value: 1,
            },
            {
               text: "รอจ่ายเงิน",
               value: 0 || null,
            },
         ],
         onFilter: (value, record) => record.invoice_notificate === value,
         render: (user_id) => {
            const billings = data.filter((ft) => ft.user_id === user_id)
            const billing = billings[0]
            const invoice_notificate = billing.invoice_notificate === 1
            return invoice_notificate ? (
               <div>
                  <span style={{ color: "green" }}>จ่ายเงินแล้ว</span>
                  <Switch
                     checked={invoice_notificate}
                     onClick={() =>
                        handleChangeNoti(invoice_notificate, billing)
                     }
                  />
               </div>
            ) : (
               <div>
                  <span style={{ color: "red" }}>รอจ่ายเงิน</span>
                  <Switch
                     checked={invoice_notificate}
                     onClick={() =>
                        handleChangeNoti(invoice_notificate, billing)
                     }
                  />
               </div>
            )
         },
      },
      {
         title: "check",
         dataIndex: "user_id",
         width: "120px",
         key: "check",
         filters: [
            {
               text: "check",
               value: 1,
            },
            {
               text: "not",
               value: 0 || null,
            },
         ],
         onFilter: (value, record) => record.check === value,
         render: (user_id) => {
            const billings = data.filter((ft) => ft.user_id === user_id)
            const billing = billings[0]
            const check = billing.check === 1
            return check ? (
               <div>
                  <span style={{ color: "green" }}>check</span>
                  <Switch
                     checked={check}
                     onClick={() => handleChangeCheck(check, billing)}
                  />
               </div>
            ) : (
               <div>
                  <span style={{ color: "red" }}>not</span>
                  <Switch
                     checked={check}
                     onClick={() => handleChangeCheck(check, billing)}
                  />
               </div>
            )
         },
      },
      {
         title: "done",
         dataIndex: "user_id",
         width: "120px",
         key: "check_2",
         filters: [
            {
               text: "done",
               value: 1,
            },
            {
               text: "not done",
               value: 0 || null,
            },
         ],
         onFilter: (value, record) => record.check_2 === value,
         render: (user_id) => {
            const billings = data.filter((ft) => ft.user_id === user_id)
            const billing = billings[0]
            const check = billing.check_2 === 1
            return check ? (
               <div>
                  <span style={{ color: "green" }}>done</span>
                  <Switch
                     checked={check}
                     onClick={() => handleChangeCheck2(check, billing)}
                  />
               </div>
            ) : (
               <div>
                  <span style={{ color: "red" }}>not done</span>
                  <Switch
                     checked={check}
                     onClick={() => handleChangeCheck2(check, billing)}
                  />
               </div>
            )
         },
      },
      {
         title: "remark",
         dataIndex: "remark",
         width: "120px",
         key: "remark",
         render: (text) => (text === null ? "-" : text),
      },
      {
         title: "จัดการ",
         dataIndex: "user_id",
         key: "manage",
         ellipsis: true,
         width: "90px",
         fixed: "right",
         render: (user_id) => {
            const item_manage = [
               {
                  key: "1",
                  label: "แก้ไข",
                  onClick: () => handleShowEditModal(user_id),
               },
               {
                  key: "2",
                  label: "invoice",
                  onClick: () =>
                     window.open(
                        `/shipbilling/invoice?&voyage=${voyageSelect}&user_id=${user_id}`
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
      ;(async () => {
         const response = await fetch("/api/shipbilling/voyage")
         const responseJson = await response.json()
         console.log(responseJson)
         setItems(
            responseJson.voyages
               .reduce(
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
         <Modal
            open={showEditModal}
            onCancel={() => setShowEditModal(false)}
            onOk={handleOkEditModal}
         >
            <div>
               <label>จัดส่ง: </label>
               <Button
                  onClick={() =>
                     setSelectedRow({
                        ...selectedRow,
                        address: "รับเอง พระราม 3",
                     })
                  }
               >
                  รับเอง พระราม 3
               </Button>
               <Button
                  onClick={() =>
                     setSelectedRow({
                        ...selectedRow,
                        address: "รับเอง ร่มเกล้า",
                     })
                  }
               >
                  รับเอง ร่มเกล้า
               </Button>
               <Button
                  onClick={() =>
                     setSelectedRow({ ...selectedRow, address: "D2U ส่งให้" })
                  }
               >
                  D2U ส่งให้
               </Button>
               <Button onClick={handleClickAddressCustomer}>
                  ขนส่งเอกชน(ที่อยู่ ลค.)
               </Button>
               <TextArea
                  rows={4}
                  value={selectedRow?.address}
                  onChange={(e) =>
                     setSelectedRow({ ...selectedRow, address: e.target.value })
                  }
               />
               <label>หมายเหตุ: </label>
               <TextArea
                  rows={4}
                  value={selectedRow?.remark}
                  onChange={(e) =>
                     setSelectedRow({ ...selectedRow, remark: e.target.value })
                  }
               />
               <label>payment_type: </label>
               <select
                  value={selectedRow.payment_type}
                  onChange={(e) =>
                     setSelectedRow({
                        ...selectedRow,
                        payment_type: e.target.value,
                     })
                  }
               >
                  <option value={null}>selected</option>
                  <option value="เงินสด">เงินสด</option>
                  <option value="โอนเงิน">โอนเงิน</option>
                  <option value="ไม่มีค่าเรือ">ไม่มีค่าเรือ</option>
               </select>
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
