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
   Table,
} from "antd"
import { DownOutlined, SearchOutlined } from "@ant-design/icons"
import { getSession } from "next-auth/react"
import React, { Fragment, useEffect, useRef, useState } from "react"
import Highlighter from "react-highlight-words"
import CardHead from "../../../components/CardHead"
import Layout from "../../../components/layout/layout"

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

function YahooBiddingPage(props) {
   const [data, setData] = useState(props.orders)
   const [filteredInfo, setFilteredInfo] = useState({})
   const [sortedInfo, setSortedInfo] = useState({})
   const [searchText, setSearchText] = useState("")
   const [searchedColumn, setSearchedColumn] = useState("")
   const searchInput = useRef(null)
   const [selectedRow, setSelectedRow] = useState(ordersModel)
   const [showEditModal, setShowEditModal] = useState(false)
   const [showEditStatusModal, setShowEditStatusModal] = useState(false)
   const [statusForm, setStatusForm] = useState({
      status: "ชนะประมูล",
      bid: "",
      tranfer_fee: "",
      delivery_fee: "",
      payment_status: "รอค่าโอนและค่าส่ง",
   })
   const handleShowEditModal = (id) => {
      setSelectedRow(data.find((element) => element.id === id))
      setShowEditModal(true)
   }
   const handleShowEditStatusModal = (id) => {
      setSelectedRow(data.find((element) => element.id === id))
      setShowEditStatusModal(true)
   }
   const handleOkEditModal = () => {
      console.log("ok")
   }
   const handleOkEditStatusModal = () => {
      console.log("ok")
   }
   const handleCancelEditModal = () => {
      console.log("cancel edit modal")
      setShowEditModal(false)
   }
   const handleCancelEditStatusModal = () => {
      console.log("cancel edit status modal")
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
            .toString()
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
         key: "created_at",
         sorter: (a, b) => {
            let datetime_a = a.created_at
            let date_a = datetime_a.split(" ")[0]
            let time_a = datetime_a.split(" ")[1]
            let date_a_f = date_a.split("/")
            let time_a_f = time_a.split(":")
            // [y,m,d,h,m,s]
            let datetime_a_f = [
               parseInt(date_a_f[2], 10),
               parseInt(date_a_f[1], 10),
               parseInt(date_a_f[0], 10),
               parseInt(time_a_f[0], 10),
               parseInt(time_a_f[1], 10),
               parseInt(time_a_f[2], 10),
            ]
            let datetime_b = b.created_at
            let date_b = datetime_b.split(" ")[0]
            let time_b = datetime_b.split(" ")[1]
            let date_b_f = date_b.split("/")
            let time_b_f = time_b.split(":")
            let datetime_b_f = [
               parseInt(date_b_f[2], 10),
               parseInt(date_b_f[1], 10),
               parseInt(date_b_f[0], 10),
               parseInt(time_b_f[0], 10),
               parseInt(time_b_f[1], 10),
               parseInt(time_b_f[2], 10),
            ]
            for (let i = 0; i < 6; i++) {
               if (datetime_a_f[i] - datetime_b_f[i] !== 0) {
                  return datetime_b_f[i] - datetime_a_f[i]
               }
            }
            return 0
         },
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
         filteredValue: null,
         render: (text) => <img src={text} alt="" width="100" />,
         ellipsis: true,
      },
      {
         title: "ชื่อลูกค้า",
         dataIndex: "username",
         key: "username",
         filters: props.orders.reduce(
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
      },
      {
         title: "ลิ้งค์",
         dataIndex: "link",
         key: "link",
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
         title: "ราคาประมูล",
         dataIndex: "maxbid",
         key: "maxbid",
         filteredValue: null,
         render: (text) =>
            new Intl.NumberFormat("ja-JP", {
               currency: "JPY",
               style: "currency",
               minimumFractionDigits: 2,
            }).format(text),
         ellipsis: true,
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
         key: "id",
         filteredValue: null,
         ellipsis: true,
         width: "100px",
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
               <TextArea rows={4} />
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
            <div>
               <label>สถานะประมูล: </label>
               <Select
                  defaultValue={statusForm.status}
                  options={[
                     { value: "ชนะประมูล", label: "ชนะประมูล" },
                     { value: "แพ้ประมูล", label: "แพ้ประมูล" },
                  ]}
               />
               {statusForm.status === "ชนะประมูล" ? (
                  <>
                     <label>*ราคาที่ประมูลได้: </label>
                     <InputNumber value={statusForm.bid} />
                     <label>ค่าธรรมเนียมการโอน(฿): </label>
                     <InputNumber value={statusForm.tranfer_fee} />
                     <label>ค่าขนส่ง(￥): </label>
                     <InputNumber value={statusForm.delivery_fee} />
                     <label>*สถานะการชำระเงิน:</label>
                     <Select
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
                     />
                  </>
               ) : undefined}
            </div>
         </Modal>
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
   const api = process.env.BACKEND_URL + "/api/yahoo/order"
   const response = await fetch(api).then((res) => res.json())
   // console.log(response)
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
         orders: response.orders,
      },
   }
}

export default YahooBiddingPage
