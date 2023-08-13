/* eslint-disable import/no-named-as-default */
import React, { Fragment, useEffect, useRef, useState } from "react"
import { getSession } from "next-auth/react"
import { Button, Divider, Input, Space, Table, Tag } from "antd"
import axios from "axios"
import { SearchOutlined } from "@ant-design/icons"
import Highlighter from "react-highlight-words"
import dayjs from "dayjs"
import Layout from "../../../components/layout/layout"
import LoadingPage from "../../../components/LoadingPage"

const paidChannelOption = [
   { text: "ไม่มีข้อมูล", value: "", color: "default" },
   { text: "9980", value: "9980", color: "magenta" },
   { text: "3493", value: "3493", color: "red" },
   { text: "บัตรญี่ปุ่น", value: "บัตรญี่ปุ่น", color: "volcano" },
   { text: "MERPAY", value: "MERPAY", color: "orange" },
   { text: "PAYPAY", value: "PAYPAY", color: "gold" },
   { text: "COMBINI", value: "COMBINI", color: "green" },
   { text: "โอนเงิน", value: "โอนเงิน", color: "cyan" },
]
const channelOpt = [
   { text: "yahoo", value: "yahoo", color: "orange" },
   { text: "shimizu", value: "shimizu", color: "purple" },
   { text: "mercari", value: "mercari", color: "geekblue" },
   { text: "fril", value: "fril", color: "blue" },
   { text: "web123", value: "123", color: "lime" },
]
function AllTrackingPage() {
   const [loading, setLoading] = useState(false)
   const [selectedRowKeys, setSelectedRowKeys] = useState([])
   const [data, setData] = useState([])
   const [searchText, setSearchText] = useState("")
   const [searchedColumn, setSearchedColumn] = useState("")
   const searchInput = useRef(null)

   const fetchTrackingData = async () => {
      setLoading(true)
      try {
         const response = await axios.get("/api/tracking/all")
         const responseData = await response.data.data
         setData(responseData)
      } catch (error) {
         console.error("Error fetching data:", error.message)
      } finally {
         setLoading(false)
      }
   }

   useEffect(() => {
      fetchTrackingData()
   }, [])

   const THBath = new Intl.NumberFormat("th-TH", {
      style: "currency",
      currency: "THB",
   })

   function formatCurrency(amount) {
      if (amount === null || amount === "") {
         return "-"
      }
      return THBath.format(amount)
   }

   function formatWeight(weight) {
      if (weight === null || weight === "") {
         return "-"
      }
      return `${weight} Kg.`
   }

   function formatText(txt) {
      if (txt === null || txt === "") {
         return "-"
      }
      return txt
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
               color: filtered ? "#1677ff" : undefined,
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
         searchedColumn === dataIndex ? (
            <Highlighter
               highlightStyle={{
                  backgroundColor: "#ffc069",
                  padding: 0,
               }}
               searchWords={[searchText]}
               autoEscape
               textToHighlight={
                  text || (text !== null && text !== "") ? text.toString() : "-"
               }
            />
         ) : (
            formatText(text)
         ),
   })

   const columns = [
      {
         title: "วันที่",
         dataIndex: "date",
         key: "date",
         sorter: (a, b) => {
            const date_a = dayjs(a.date, "D/M/YYYY").format("YYYYMMDD")
            const date_b = dayjs(b.date, "D/M/YYYY").format("YYYYMMDD")
            return date_a - date_b
         },
         ...getColumnSearchProps("date"),
      },
      {
         title: "ชื่อลูกค้า",
         dataIndex: "username",
         key: "username",
         ...getColumnSearchProps("username"),
      },
      {
         title: "ช่องทาง",
         dataIndex: "channel",
         key: "channel",
         filters: channelOpt,
         onFilter: (value, record) => record.channel === value,
         render: (text, record) => {
            const matchOpt = channelOpt.find((fi) => fi.value === text)
            return (
               <Space>
                  <Tag color={matchOpt.color}>{matchOpt.text}</Tag>
                  {record.airbilling === 1 && (
                     <Tag color="volcano">air billing</Tag>
                  )}
               </Space>
            )
         },
      },
      {
         title: "รอบเรือ",
         dataIndex: "voyage",
         key: "voyage",
         ...getColumnSearchProps("voyage"),
      },
      {
         title: "ช่องทางชำระ",
         dataIndex: "paid_channel",
         key: "paid_channel",
         filters: paidChannelOption,
         onFilter: (value, record) => record.paid_channel === value,
         width: "130px",
         render: (text) => {
            const matchOpt = paidChannelOption.find((fi) => fi.value === text)
            return <Tag color={matchOpt.color}>{matchOpt.text}</Tag>
         },
      },
      {
         title: "ราคา",
         dataIndex: "price",
         key: "price",
         render: formatCurrency,
      },
      {
         title: "เลขกล่อง",
         dataIndex: "box_no",
         key: "box_no",
         ...getColumnSearchProps("box_no"),
      },
      {
         title: "Track no.",
         dataIndex: "track_no",
         key: "track_no",
         width: "150px",
         ...getColumnSearchProps("track_no"),
      },
      {
         title: "น้ำหนัก",
         dataIndex: "weight",
         key: "weight",
         render: formatWeight,
      },
      {
         title: "หมายเหตุ",
         dataIndex: "remark_admin",
         key: "remark_admin",
         ...getColumnSearchProps("remark_admin"),
      },
   ]

   return (
      <Fragment>
         <LoadingPage loading={loading} />
         <div className="p-4">
            <div className="bg-white rounded-lg p-4">
               <div className="font-bold text-[1.2rem] mb-4">
                  รายการ Tracking ทั้งหมด
               </div>
               <Divider className="mt-0" />
               <Table
                  dataSource={data}
                  columns={columns}
                  scroll={{
                     x: 1000,
                     y: 500,
                  }}
               />
            </div>
         </div>
      </Fragment>
   )
}

AllTrackingPage.getLayout = function getLayout(page) {
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

export default AllTrackingPage
