/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable prefer-const */
import {
   Button,
   Dropdown,
   Input,
   InputNumber,
   Modal,
   Select,
   Space,
   Switch,
   Table,
} from "antd"
import { DownOutlined, SearchOutlined } from "@ant-design/icons"
import { getSession } from "next-auth/react"
import React, { Fragment, useEffect, useRef, useState } from "react"
import Highlighter from "react-highlight-words"
import CardHead from "../../../components/CardHead"
import Layout from "../../../components/layout/layout"
import sortDateTime from "../../../utils/sortDateTime"
import sortDate from "../../../utils/sortDate"

const { TextArea } = Input

// must have key
const ordersModel = {
   key: "1",
   id: 9,
   user_id: 13,
   admin_maxbid_id: null,
   admin_addbid1_id: null,
   admin_addbid2_id: null,
   date: null,
   image: "https://auctions.c.yimg.jp/images.auctions.yahoo.co.jp/image/dr000/auc0311/users/8a8f2885e18a4dbc0066a428562b16c8927af0c6/i-img1200x1200-1669100123d4a86k51092.jpg",
   link: "https://page.auctions.yahoo.co.jp/jp/auction/q1073037683",
   name: "【DJ】HERMES/エルメス ベルト2点/バックル3点 セット H金具/シェーヌダンクル レザー リバーシブル 送料無料 R9589443386",
   price: 51000,
   maxbid: 300000,
   addbid1: null,
   addbid2: null,
   status: null,
   remark_user: null,
   remark_admin: null,
   created_at: "29/11/2565 10:40:56",
   updated_at: "29/11/2565 10:40:56",
   username: "zorzyyippy",
   admin_maxbid_username: null,
   admin_addbid1_username: null,
   admin_addbid2_username: null,
}

const statusFormModel = {
   status: "ชนะ",
   bid: "",
   tranfer_fee: "",
   delivery_fee: "",
   payment_status: "รอค่าโอนและค่าส่ง",
}

function YahooBiddingPage(props) {
   const [data, setData] = useState([])
   const [filteredInfo, setFilteredInfo] = useState({})
   const [sortedInfo, setSortedInfo] = useState({})
   const [searchText, setSearchText] = useState("")
   const [searchedColumn, setSearchedColumn] = useState("")
   const searchInput = useRef(null)
   const [selectedRow, setSelectedRow] = useState(ordersModel)
   const [showEditModal, setShowEditModal] = useState(false)
   const [showEditStatusModal, setShowEditStatusModal] = useState(false)
   const [statusForm, setStatusForm] = useState(statusFormModel)
   const handleCheck = async (name, check, id) => {
      try {
         const response = await fetch(`/api/yahoo/order/addbid/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
               name,
               check,
            }),
         })
         const responseJson = await response.json()
         // setCheck(!check)
         setData(
            responseJson.orders
               .sort((a, b) => sortDateTime(a.created_at, b.created_at))
               .reduce((a, c, i) => [...a, { ...c, key: i }], [])
         )
      } catch (err) {
         console.log(err)
         alert("Error!")
      }
   }
   const handleShowEditModal = (id) => {
      setSelectedRow(data.find((element) => element.id === id))
      setShowEditModal(true)
   }
   const handleShowEditStatusModal = (id) => {
      setSelectedRow(data.find((element) => element.id === id))
      setShowEditStatusModal(true)
   }
   const handleOkEditModal = async () => {
      // console.log("ok")
      console.log(selectedRow.remark_admin)
      const { id } = selectedRow
      const remark = selectedRow.remark_admin
      try {
         // eslint-disable-next-line prefer-template
         const response = await fetch("/api/yahoo/order/remark-admin/" + id, {
            method: "PUT",
            headers: {
               "Content-Type": "application/json",
            },
            body: JSON.stringify({ remark }),
         })
         const responseJson = await response.json()
         setShowEditModal(false)
         setData(
            responseJson.orders
               .sort((a, b) => sortDateTime(a.created_at, b.created_at))
               .reduce((a, c, i) => [...a, { ...c, key: i }], [])
         )
      } catch (err) {
         console.log(err)
         alert("Error!")
      }
   }
   const handleOkEditStatusModal = async () => {
      const { id, user_id } = selectedRow
      const order_id = id
      const { status, bid, tranfer_fee, delivery_fee, payment_status } =
         statusForm
      try {
         const response = await fetch("/api/yahoo/payment", {
            method: "POST",
            headers: {
               "Content-Type": "application/json",
            },
            body: JSON.stringify({
               order_id,
               user_id,
               bid,
               delivery_fee,
               tranfer_fee,
               payment_status,
               status,
            }),
         })
         const responseJson = await response.json()
         alert("Add Payment Success!")
         setData(
            responseJson.orders
               .sort((a, b) => sortDateTime(a.created_at, b.created_at))
               .reduce((a, c, i) => [...a, { ...c, key: i }], [])
         )
         setShowEditStatusModal(false)
      } catch (err) {
         console.log(err)
         alert("Error!")
      }
   }
   const handleCancelEditModal = () => {
      console.log("cancel edit modal")
      setShowEditModal(false)
   }
   const handleCancelEditStatusModal = () => {
      setStatusForm(statusFormModel)
      setShowEditStatusModal(false)
   }
   const handleChange = (pagination, filters, sorter) => {
      console.log(filters, sorter)
      setFilteredInfo(filters)
      setSortedInfo(sorter)
   }
   const handleSearch = (selectedKeys, confirm, dataIndex) => {
      confirm()
      setSearchText(selectedKeys[0])
      setSearchedColumn(dataIndex)
   }
   const handleReset = (clearFilterSearch) => {
      clearFilterSearch()
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
      onFilter: (value, record) =>
         record[dataIndex]
            ?.toString()
            .toLowerCase()
            .includes(value.toLowerCase()),
      onFilterDropdownOpenChange: (visible) => {
         if (visible) {
            setTimeout(() => searchInput.current?.select(), 100)
         }
      },
      render: (text) =>
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
         ) : (
            text
         ),
   })
   const columns = [
      {
         title: "วันที่",
         dataIndex: "created_at",
         width: "100px",
         key: "created_at",
         sorter: (a, b) => sortDateTime(a.created_at, b.created_at),
         sortOrder:
            sortedInfo.columnKey === "created_at" ? sortedInfo.order : null,
         render: (text) => (
            <div>
               <p>{text.split(" ")[0]}</p>
               <p>{text.split(" ")[1]}</p>
            </div>
         ),
         ellipsis: true,
      },
      {
         title: "รูปภาพ",
         dataIndex: "image",
         key: "image",
         width: "120px",
         filteredValue: null,
         render: (text) => <img src={text} alt="" width="100" />,
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
         width: "120px",
      },
      {
         title: "ลิ้งค์",
         dataIndex: "link",
         key: "link",
         width: "125px",
         render: (text, record, index) => {
            const link_code = text.split(
               "https://page.auctions.yahoo.co.jp/jp/auction/"
            )
            return (
               <a href={text} target="_blank" rel="noreferrer">
                  {link_code[1]}
               </a>
            )
         },
         filteredValue: null,
         ellipsis: false,
      },
      {
         title: "ราคาประมูล#1",
         dataIndex: "id",
         key: "maxbid",
         filteredValue: null,
         width: "130px",
         render: (id) => {
            const orders = data.filter((ft) => ft.id === id)
            const order = orders[0]
            const check = order.admin_maxbid_id !== null
            return (
               <div>
                  <span>
                     {new Intl.NumberFormat("ja-JP", {
                        currency: "JPY",
                        style: "currency",
                        minimumFractionDigits: 2,
                     }).format(order.maxbid)}
                  </span>
                  <br />
                  <Switch
                     checked={check}
                     onClick={() => handleCheck("maxbid", check, id)}
                  />
                  <span>{order.admin_maxbid_username}</span>
               </div>
            )
         },
      },
      {
         title: "ราคาประมูล#2",
         dataIndex: "id",
         key: "addbid1",
         filteredValue: null,
         render: (id) => {
            const orders = data.filter((ft) => ft.id === id)
            const order = orders[0]
            const check = order.admin_addbid1_id !== null
            if (order.addbid1 === null) {
               return new Intl.NumberFormat("ja-JP", {
                  currency: "JPY",
                  style: "currency",
                  minimumFractionDigits: 2,
               }).format(order.addbid1)
            }
            return (
               <div>
                  <span>
                     {new Intl.NumberFormat("ja-JP", {
                        currency: "JPY",
                        style: "currency",
                        minimumFractionDigits: 2,
                     }).format(order.addbid1)}
                  </span>
                  <br />
                  <Switch
                     checked={check}
                     onClick={() => handleCheck("addbid1", check, id)}
                  />
                  <span>{order.admin_addbid1_username}</span>
               </div>
            )
         },
         width: "130px",
      },
      {
         title: "ราคาประมูล#3",
         dataIndex: "id",
         key: "addbid2",
         filteredValue: null,
         render: (id) => {
            const orders = data.filter((ft) => ft.id === id)
            const order = orders[0]
            const check = order.admin_addbid2_id !== null
            if (order.addbid2 === null) {
               return new Intl.NumberFormat("ja-JP", {
                  currency: "JPY",
                  style: "currency",
                  minimumFractionDigits: 2,
               }).format(order.addbid2)
            }
            return (
               <div>
                  <span>
                     {new Intl.NumberFormat("ja-JP", {
                        currency: "JPY",
                        style: "currency",
                        minimumFractionDigits: 2,
                     }).format(order.addbid2)}
                  </span>
                  <br />
                  <Switch
                     checked={check}
                     onClick={() => handleCheck("addbid2", check, id)}
                  />
                  <span>{order.admin_addbid2_username}</span>
               </div>
            )
         },
         width: "130px",
      },
      {
         title: "หมายเหตุลูกค้า",
         dataIndex: "remark_user",
         key: "remark_user",
         filteredValue: filteredInfo.remark_user || null,
         ellipsis: true,
         ...getColumnSearchProps("remark_user"),
      },
      {
         title: "หมายเหตุแอดมิน",
         dataIndex: "remark_admin",
         key: "remark_admin",
         filteredValue: filteredInfo.remark_admin || null,
         ellipsis: true,
         ...getColumnSearchProps("remark_admin"),
      },
      {
         title: "จัดการ",
         dataIndex: "id",
         key: "manage",
         filteredValue: null,
         ellipsis: true,
         width: "90px",
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
               { key: "3", label: "ลบรายการ" },
            ]
            return (
               <Space>
                  <Dropdown menu={{ items }}>
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
         const response = await fetch("/api/yahoo/order")
         const responseJson = await response.json()
         setData(
            responseJson.orders
               .sort((a, b) => sortDateTime(a.created_at, b.created_at))
               .reduce((a, c, i) => [...a, { ...c, key: i }], [])
         )
      })()
   }, [])
   return (
      <Fragment>
         <CardHead
            name="Yahoo Bidding Auction"
            description="* แสดงรายการประมูลสินค้าที่ลูกค้าสั่งประมูล"
         />
         <div className="container-table">
            <Table
               columns={columns}
               dataSource={data}
               onChange={handleChange}
               scroll={{
                  x: 1500,
                  y: 450,
               }}
            />
         </div>
         {/* Edit Modal */}
         <Modal
            title="แก้ไขหมายเหตุแอดมิน"
            open={showEditModal}
            onOk={handleOkEditModal}
            onCancel={handleCancelEditModal}
            okText="ยืนยัน"
            cancelText="ยกเลิก"
         >
            <div>
               <label>หมายเหตุแอดมิน: </label>
               <TextArea
                  rows={4}
                  value={selectedRow.remark_admin}
                  onChange={(e) =>
                     setSelectedRow({
                        ...selectedRow,
                        remark_admin: e.target.value,
                     })
                  }
               />
            </div>
         </Modal>
         {/* Edit Status Modal */}
         <Modal
            title="เปลี่ยนสถานะการประมูล"
            open={showEditStatusModal}
            onOk={handleOkEditStatusModal}
            onCancel={handleCancelEditStatusModal}
            okText="ยืนยันการเปลี่ยนสถานะ"
            cancelText="ยกเลิก"
         >
            <div className="UpdateStatusModal">
               <label>สถานะประมูล: </label>
               <Select
                  defaultValue={statusForm.status}
                  options={[
                     { value: "ชนะ", label: "ชนะประมูล" },
                     { value: "แพ้", label: "แพ้ประมูล" },
                  ]}
                  onChange={(value) =>
                     setStatusForm({ ...statusForm, status: value })
                  }
               />
               {statusForm.status === "ชนะ" ? (
                  <>
                     <label>*ราคาที่ประมูลได้: </label>
                     <InputNumber
                        value={statusForm.bid}
                        onChange={(value) =>
                           setStatusForm({ ...statusForm, bid: value })
                        }
                     />
                     <label>ค่าธรรมเนียมการโอน(฿): </label>
                     <InputNumber
                        value={statusForm.tranfer_fee}
                        onChange={(value) =>
                           setStatusForm({ ...statusForm, tranfer_fee: value })
                        }
                     />
                     <label>ค่าขนส่ง(￥): </label>
                     <InputNumber
                        value={statusForm.delivery_fee}
                        onChange={(value) =>
                           setStatusForm({ ...statusForm, delivery_fee: value })
                        }
                     />
                     <label>*สถานะการชำระเงิน:</label>
                     <Select
                        name="payment_status"
                        defaultValue={statusForm.payment_status}
                        options={[
                           {
                              value: "รอค่าโอนและค่าส่ง",
                              label: "รอค่าโอนและค่าส่ง",
                           },
                           {
                              value: "รอการชำระเงิน",
                              label: "รอการชำระเงิน",
                           },
                        ]}
                        onChange={(value) =>
                           setStatusForm({
                              ...statusForm,
                              payment_status: value,
                           })
                        }
                     />
                  </>
               ) : undefined}
            </div>
         </Modal>
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
         <style jsx>
            {`
               .container-table {
                  margin: 10px;
                  background: white;
                  padding: 10px;
               }
            `}
         </style>
      </Fragment>
   )
}

YahooBiddingPage.getLayout = function getLayout(page) {
   return <Layout>{page}</Layout>
}

export async function getServerSideProps(context) {
   const session = await getSession({ req: context.req })
   // eslint-disable-next-line prefer-template

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

export default YahooBiddingPage
