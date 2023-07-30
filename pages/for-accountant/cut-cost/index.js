/* eslint-disable import/no-named-as-default */
/* eslint-disable import/no-unresolved */
import React, { Fragment, useEffect, useState } from "react"
import { getSession } from "next-auth/react"
import { Col, Divider, Row, Switch, Table, message } from "antd"
import axios from "axios"
import Link from "next/link"
import Layout from "../../../components/layout/layout"
import LoadingPage from "../../../components/LoadingPage"

function CutCostPage() {
   const [loading, setLoading] = useState(false)
   const [data, setData] = useState([])

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
      },
      {
         title: "username",
         dataIndex: "username",
         key: "username",
      },
      {
         title: "ราคา",
         dataIndex: "price",
         key: "price",
      },
      {
         title: "ช่องทาง",
         dataIndex: "channel",
         key: "channel",
      },
      {
         title: "ช่องทางการชำระเงิน",
         dataIndex: "paid_channel",
         key: "paid_channel",
         width: "120px",
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
