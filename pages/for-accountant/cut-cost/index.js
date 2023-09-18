/* eslint-disable import/no-named-as-default */
/* eslint-disable import/no-unresolved */
import React, { Fragment, useEffect, useRef, useState } from "react"
import { getSession } from "next-auth/react"
import {
   Button,
   Col,
   Divider,
   Input,
   Row,
   Space,
   Switch,
   Table,
   message,
} from "antd"
import axios from "axios"
import Link from "next/link"
import Highlighter from "react-highlight-words"
import { SearchOutlined } from "@ant-design/icons"
import dayjs from "dayjs"
import Layout from "../../../components/layout/layout"
import LoadingPage from "../../../components/LoadingPage"

function CutCostPage() {
   const [loading, setLoading] = useState(false)
   const [data, setData] = useState([])
   const [searchText, setSearchText] = useState("")
   const [searchedColumn, setSearchedColumn] = useState("")
   const searchInput = useRef(null)

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
      onFilter: (value, record) =>{
         const text = record[dataIndex] === null ? '' : record[dataIndex]
         return text
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
               textToHighlight={text ? text.toString() : ""}
            />
         ) : (
            text
         ),
   })

   const fetchCutCostData = async () => {
      setLoading(true)
      try {
         const response = await axios.get("/api/for-accountant/cut-cost")
         const responseData = await response.data.data
         setData(
            responseData.map((item, index) => ({
               key: `MoneyIn_key_${index}`,
               ...item,
            }))
         )
      } catch (error) {
         console.error("Error fetching data:", error.message)
      } finally {
         setLoading(false)
      }
   }

   const handleCheckCbCutCost = async (checked, row, index) => {
      setLoading(true)
      try {
         axios.put(`/api/for-accountant/cut-cost?tracking_id=${row.id}`, {
            cb_cutcost: checked ? 1 : 0,
         })
      } catch (err) {
         console.log(err)
         message.success("อัพเดพข้อมูลล้มเหลว")
      } finally {
         setData((prev) => [
            ...prev.slice(0, index),
            { ...prev[index], cb_cutcost: checked ? 1 : 0 },
            ...prev.slice(index + 1),
         ])
         message.success("อัพเดพข้อมูลสำเร็จ")
         setLoading(false)
      }
   }

   useEffect(() => {
      fetchCutCostData()
   }, [])

   const columns = [
      {
         title: "วันที่",
         dataIndex: "date",
         key: "date",
         ...getColumnSearchProps("date"),
         sorter: (a, b) => {
            const date_a = dayjs(a.date, 'D/M/YYYY').format("YYYYMMDD")
            const date_b = dayjs(b.date, 'D/M/YYYY').format("YYYYMMDD")
            return date_a-date_b
         },
         
      },
      {
         title: "username",
         dataIndex: "username",
         key: "username",
         ...getColumnSearchProps("username"),
      },
      {
         title: "ราคา",
         dataIndex: "price",
         key: "price",
         ...getColumnSearchProps("price"),
      },
      {
         title: "ช่องทาง",
         dataIndex: "channel",
         key: "channel",
         filters: [
            { text: "yahoo", value: "yahoo" },
            { text: "shimizu", value: "shimizu" },
            { text: "mercari", value: "mercari" },
            { text: "fril", value: "fril" },
            { text: "web123", value: "123" },
         ],
         onFilter: (value, record) => record.channel === value,
      },
      {
         title: "ช่องทางการชำระเงิน",
         dataIndex: "paid_channel",
         key: "paid_channel",
         width: "120px",
         filters: [
            { text: "9980", value: "9980" },
            { text: "3493", value: "3493" },
            { text: "บัตรญี่ปุ่น", value: "บัตรญี่ปุ่น" },
            { text: "MERPAY", value: "MERPAY" },
            { text: "PAYPAY", value: "PAYPAY" },
            { text: "COMBINI", value: "COMBINI" },
            { text: "โอนเงิน", value: "โอนเงิน" },
         ],
         onFilter: (value, record) => record.paid_channel === value,
      },
      {
         title: "ลิ้งค์",
         dataIndex: "link",
         key: "link",
         render: (link) => {
            if (link === "" || link === null) return "-"
            return <Link href={link}>Click</Link>
         },
      },
      {
         title: "เช็กตัดยอด",
         dataIndex: "cb_cutcost",
         key: "cb_cutcost",
         render: (check, row, index) => {
            const checked = check === 1
            return (
               <Switch
                  checked={checked}
                  onChange={(value) => handleCheckCbCutCost(value, row, index)}
               />
            )
         },
      },
   ]

   return (
      <Fragment>
         <LoadingPage loading={loading} />
         <div className="p-4">
            <div className="bg-white rounded-lg p-4">
               <div className="font-bold text-[1.2rem] mb-4">รายการตัดยอด</div>

               <Divider className="mt-0" />
               <Row gutter={16}>
                  <Col span={24}>
                     <Table dataSource={data} columns={columns} />
                  </Col>
               </Row>
            </div>
         </div>
      </Fragment>
   )
}

CutCostPage.getLayout = function getLayout(page) {
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

export default CutCostPage
