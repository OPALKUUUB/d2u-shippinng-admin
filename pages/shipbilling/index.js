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
} from "antd"
import { getSession } from "next-auth/react"
import React, { Fragment, useEffect, useState, useRef } from "react"
import { useRouter } from "next/router"
import { DownOutlined, SearchOutlined } from "@ant-design/icons"
import Highlighter from "react-highlight-words"
import CardHead from "../../components/CardHead"
import Layout from "../../components/layout/layout"

const { TextArea } = Input

function ShipBilling() {
   const router = useRouter()
   const [data, setData] = useState([])
   const [voyageSelect, setVoyageSelect] = useState("เลือกรอบเรือ")
   const [items, setItems] = useState([])
   const [showEditModal, setShowEditModal] = useState(false)
   const [selectedRow, setSelectedRow] = useState({
      shipbilling_id: "",
      user_id: "",
      payment_type: "",
      remark: "",
   })
   const [address, setAddress] = useState("")
   const [caseAddress, setCaseAddress] = useState(5)
   const [searchText, setSearchText] = useState("")
   const [searchedColumn, setSearchedColumn] = useState("")
   const searchInput = useRef(null)
   const handleChangeSelect = async (value) => {
      message.info(`voyage ${value}`)
      setVoyageSelect(value)
      try {
         const response = await fetch(`/api/shipbilling?voyage=${value}`)
         const responseJson = await response.json()
         console.log("trackings", responseJson.trackings)
         setData(
            responseJson.trackings.sort((a, b) => {
               if (a.username.toLowerCase() < b.username.toLowerCase()) {
                  return -1
               }
               if (a.username.toLowerCase() > b.username.toLowerCase()) {
                  return 1
               }
               return 0
            })
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
         console.log(index)
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
            invoice_notificate: status ? 0 : 1,
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
            { ...billing, username: selectedRow.username },
            ...prev.slice(index + 1),
         ]
      })
      message.success("success!")
   }
   const handleChangeCheck = async (status, bill) => {
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
            { ...billing, username: selectedRow.username },
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
            { ...billing, username: selectedRow.username },
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
   console.log("data", data)
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
      // {
      //    title: "จัดการ",
      //    fixed: "right",
      //    dataIndex: "user_id",
      //    width: "80px",
      //    key: "user_id",
      //    render: (user_id) => (
      //       <button onClick={() => handleSelectRow(user_id)}>manage</button>
      //    ),
      // },
   ]
   useEffect(() => {
      ;(async () => {
         const response = await fetch("/api/shipbilling/voyage")
         const responseJson = await response.json()
         setItems(
            responseJson.voyages
               .sort((a, b) => {
                  const date_a = a.voyage
                  const date_b = b.voyage
                  const date_a_f = date_a.split("/")
                  // [y,m,d]
                  const datetime_a_f = [
                     parseInt(date_a_f[2], 10) > 2500
                        ? parseInt(date_a_f[2], 10) - 543
                        : parseInt(date_a_f[2], 10),
                     parseInt(date_a_f[1], 10),
                     parseInt(date_a_f[0], 10),
                  ]
                  const date_b_f = date_b.split("/")
                  // [y,m,d]
                  const datetime_b_f = [
                     parseInt(date_b_f[2], 10) > 2500
                        ? parseInt(date_b_f[2], 10) - 543
                        : parseInt(date_b_f[2], 10),
                     parseInt(date_b_f[1], 10),
                     parseInt(date_b_f[0], 10),
                  ]

                  for (let i = 0; i < 3; i++) {
                     if (datetime_a_f[i] - datetime_b_f[i] !== 0) {
                        return datetime_b_f[i] - datetime_a_f[i]
                     }
                  }
                  return 0
               })
               .reduce(
                  (accumulator, currentValue) => [
                     ...accumulator,
                     { label: currentValue.voyage, value: currentValue.voyage },
                  ],
                  []
               )
         )
      })()
   }, [])
   console.log("items", items)
   return (
      <Fragment>
         <CardHead name="Ship Billing" />
         <div className="container-table">
            <Select
               size="middle"
               defaultValue={voyageSelect}
               onChange={handleChangeSelect}
               style={{ width: 200 }}
               options={items}
            />
            <div style={{ width: "100%" }}>
               <Table
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

ShipBilling.getLayout = function getLayout(page) {
   return <Layout>{page}</Layout>
}

export async function getServerSideProps(context) {
   const session = await getSession({ req: context.req })
   // const api = `/api/shipbilling/voyage`
   // const response = await fetch(api)
   // const responseJson = await response.json()
   // const { voyages } = await responseJson
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
         // voyages,
         session,
      },
   }
}
export default ShipBilling
