/* eslint-disable prefer-const */
import {
   Button,
   DatePicker,
   Dropdown,
   Input,
   InputNumber,
   message,
   Modal,
   Space,
   Table,
} from "antd"
import Highlighter from "react-highlight-words"
import { getSession } from "next-auth/react"
import React, { Fragment, useState, useRef, useEffect } from "react"
import { DownOutlined, SearchOutlined } from "@ant-design/icons"
import dayjs from "dayjs"
import weekday from "dayjs/plugin/weekday"
import localeData from "dayjs/plugin/localeData"
import customParseFormat from "dayjs/plugin/customParseFormat"
import CardHead from "../../../components/CardHead"
import Layout from "../../../components/layout/layout"
import genDate from "../../../utils/genDate"
import sortDate from "../../../utils/sortDate"

const { TextArea } = Input

dayjs.extend(customParseFormat)
dayjs.extend(weekday)
dayjs.extend(localeData)

function YahooTrackingsPage(props) {
   const [data, setData] = useState([])
   const [selectedRow, setSelectedRow] = useState({})
   const [sortedInfo, setSortedInfo] = useState({})
   const [filteredInfo, setFilteredInfo] = useState({})
   const [InputDate, setInputDate] = useState(null)
   const [InputVoyageDate, setInputVoyageDate] = useState(null)
   const [showEditModal, setShowEditModal] = useState(false)
   const [searchText, setSearchText] = useState("")
   const [searchedColumn, setSearchedColumn] = useState("")
   const searchInput = useRef(null)
   const handleOkEditModal = async () => {
      const {
         id,
         date,
         track_no,
         box_no,
         weight,
         voyage,
         remark_admin,
         remark_user,
      } = selectedRow
      try {
         const response = await fetch(`/api/tracking/yahoo?id=${id}`, {
            method: "PUT",
            headers: {
               "Content-Type": "application/json",
            },
            body: JSON.stringify({
               date,
               track_no,
               box_no,
               weight,
               voyage,
               remark_admin,
               remark_user,
            }),
         })
         const responseJson = await response.json()
         setData(
            responseJson.trackings
               .sort((a, b) => sortDate(a.date, b.date))
               .reduce((a, c, i) => [...a, { ...c, key: i }], [])
         )
         message.success("เพิ่มข้อมูลสำเร็จ!")
         setShowEditModal(false)
      } catch (err) {
         console.log(err)
         message.success("เพิ่มข้อมูลผิดพลาด!")
      }
   }
   const handleDeleteRow = async (id) => {
      try {
         const response = await fetch(`/api/tracking/yahoo?id=${id}`, {
            method: "DELETE",
            headers: {
               "Content-Type": "application/json",
            },
         })
         const responseJson = await response.json()
         message.success("ลบข้อมูลเรียบร้อย!")
         setData(
            responseJson.trackings
               .sort((a, b) => sortDate(a.date, b.date))
               .reduce((a, c, i) => [...a, { ...c, key: i }], [])
         )
      } catch (err) {
         console.log(err)
         message.error("ลบข้อมูลผิดพลาด!")
      }
   }
   const handleCancelEditModal = () => {
      setShowEditModal(false)
   }
   const handleShowEditModal = (id) => {
      const temp = data?.filter((ft) => ft.id === id)[0]
      setInputDate(dayjs(temp.date, "D/M/YYYY"))
      setInputVoyageDate(
         temp.voyage === null ? null : dayjs(temp.voyage, "D/M/YYYY")
      )
      setSelectedRow({ ...temp })
      setShowEditModal(true)
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
         title: "วันที่",
         dataIndex: "date",
         width: "120px",
         key: "date",
         ellipsis: false,
         sorter: (a, b) => sortDate(a.date, b.date),
         ...getColumnSearchProps("date"),
      },
      {
         title: "รูปภาพ",
         dataIndex: "image",
         key: "image",
         width: "120px",
         render: (text) => <img src={text} alt="" width="100" />,
      },
      {
         title: "ชื่อลูกค้า",
         dataIndex: "username",
         key: "username",
         ellipsis: true,
         width: "120px",
         ...getColumnSearchProps("username"),
      },
      {
         title: "ลิ้งค์",
         dataIndex: "link",
         key: "link",
         width: "125px",
         render: (text) => {
            const link_code =
               text === null
                  ? "-"
                  : text.split("https://page.auctions.yahoo.co.jp/jp/auction/")
            return (
               <a href={text} target="_blank" rel="noreferrer">
                  {link_code[1]}
               </a>
            )
         },
         ellipsis: false,
      },
      {
         title: "รวม",
         dataIndex: "id",
         key: "sum",
         render: (id) => {
            const payments = data?.filter((ft) => ft.id === id)
            const payment = payments[0]
            const { bid, delivery_fee, tranfer_fee, rate_yen } = payment
            if (!delivery_fee || !tranfer_fee) {
               return "-"
            }
            const s = (bid + delivery_fee) * rate_yen + tranfer_fee
            return new Intl.NumberFormat("th-TH", {
               currency: "THB",
               style: "currency",
            }).format(s)
         },
      },
      {
         title: "เลขแทรกกิงค์",
         dataIndex: "track_no",
         key: "track_no",
         ...getColumnSearchProps("track_no"),
      },
      {
         title: "เลขกล่อง",
         dataIndex: "box_no",
         key: "box_no",
         ...getColumnSearchProps("box_no"),
      },
      {
         title: "น้ำหนัก",
         dataIndex: "weight",
         key: "weight",
         render: (text) => (text === null ? "-" : text),
      },
      {
         title: "รอบเรือ",
         dataIndex: "voyage",
         key: "voyage",
         ...getColumnSearchProps("voyage"),
      },
      {
         title: "หมายเหตุลูกค้า",
         dataIndex: "remark_user",
         key: "remark_user",
         render: (text) => (text === null ? "-" : text),
      },
      {
         title: "หมายเหตุแอดมิน",
         dataIndex: "remark_admin",
         key: "remark_admin",
         render: (text) => (text === null ? "-" : text),
      },
      {
         title: "จัดการ",
         dataIndex: "id",
         key: "manage",
         ellipsis: true,
         width: "90px",
         fixed: "right",
         render: (id) => {
            const items = [
               {
                  key: "1",
                  label: "แก้ไข",
                  onClick: () => handleShowEditModal(id),
               },
               {
                  key: "2",
                  label: "ลบรายการ",
                  onClick: () => handleDeleteRow(id),
               },
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
         const response = await fetch("/api/tracking/yahoo")
         const responseJson = await response.json()
         setData(
            responseJson.trackings
               .sort((a, b) => sortDate(a.date, b.date))
               .reduce((a, c, i) => [...a, { ...c, key: i }], [])
         )
      })()
   }, [])
   return (
      <Fragment>
         <CardHead
            name="Yahoo Tracking"
            description="* แสดงรายการประมูลสินค้าที่ลูกค้าสั่งประมูล"
         />
         <div className="container-table">
            <Table
               dataSource={data}
               columns={columns}
               scroll={{
                  x: 1500,
                  y: 450,
               }}
            />
         </div>
         <Modal
            title="แก้ไขรายการ"
            open={showEditModal}
            onOk={handleOkEditModal}
            onCancel={handleCancelEditModal}
            okText="ยืนยัน"
            cancelText="ยกเลิก"
         >
            <div className="UpdateTrackingModal">
               <label>วันที่: </label>
               <DatePicker
                  defaultValue={null}
                  value={InputDate}
                  format="D/M/YYYY"
                  onChange={(value) => {
                     if (value === null) {
                        setSelectedRow((prev) => ({
                           ...prev,
                           date: null,
                        }))
                        setInputDate(null)
                     } else {
                        setSelectedRow((prev) => ({
                           ...prev,
                           date: genDate(value),
                        }))
                        setInputDate(value)
                     }
                  }}
               />
               <label>เลขแทรกกิงค์: </label>
               <Input
                  value={selectedRow.track_no}
                  onChange={(e) =>
                     setSelectedRow({
                        ...selectedRow,
                        track_no: e.target.value,
                     })
                  }
               />
               <label>เลขกล่อง: </label>
               <Input
                  value={selectedRow.box_no}
                  onChange={(e) =>
                     setSelectedRow({
                        ...selectedRow,
                        box_no: e.target.value,
                     })
                  }
               />
               <label>น้ำหนัก: </label>
               <InputNumber
                  value={selectedRow.weight}
                  onChange={(value) =>
                     setSelectedRow({
                        ...selectedRow,
                        weight: value,
                     })
                  }
               />
               <label>รอบเรือ: </label>
               <DatePicker
                  value={InputVoyageDate}
                  format="D/M/YYYY"
                  onChange={(value) => {
                     if (value === null) {
                        setSelectedRow((prev) => ({
                           ...prev,
                           voyage: null,
                        }))
                        setInputVoyageDate(null)
                     } else {
                        setSelectedRow((prev) => ({
                           ...prev,
                           voyage: genDate(value),
                        }))
                        setInputVoyageDate(value)
                     }
                  }}
               />
               <label>หมายเหตุลูกค้า: </label>
               <TextArea
                  rows={2}
                  value={selectedRow.remark_user}
                  onChange={(e) => {
                     setSelectedRow({
                        ...selectedRow,
                        remark_user: e.target.value,
                     })
                  }}
               />
               <label>หมายเหตุแอดมิน: </label>
               <TextArea
                  rows={2}
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

YahooTrackingsPage.getLayout = function getLayout(page) {
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
export default YahooTrackingsPage
