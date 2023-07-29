/* eslint-disable import/no-named-as-default */
/* eslint-disable import/no-unresolved */
import React, { Fragment, useEffect, useState } from "react"
import { getSession } from "next-auth/react"
import { Col, Divider, List, Row, Table, Tag, Typography, message } from "antd"
import axios from "axios"
import Layout from "../../../components/layout/layout"
import LoadingPage from "../../../components/LoadingPage"

function CutCostPage() {
   const [loading, setLoading] = useState(false)
   const [data, setData] = useState([])

   const fetchMoneyInData = async () => {
      setLoading(true)
      try {
         const response = await axios.get("/api/for-accountant/money-in")
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

   useEffect(() => {
      fetchMoneyInData()
   }, [])

   const columns = [
      {
         title: "วันที่",
         dataIndex: "datetime",
         key: "datetime",
      },
      {
         title: "username",
         dataIndex: "username",
         key: "username",
      },
      {
         title: "สลิป",
         dataIndex: "image",
         key: "image",
      },
      {
         title: "ประเภทการชำระเงิน",
         dataIndex: "payment_type",
         key: "payment_type",
      },
      {
         title: "จำนวนเงิน(บาท)",
         dataIndex: "total",
         key: "total",
      },
      {
         title: "หมายเหตุ",
         dataIndex: "remark",
         key: "remark",
      },
   ]

   return (
      <Fragment>
         <LoadingPage loading={loading} />
         <div className="p-4">
            <div className="bg-white rounded-lg p-4">
               <div className="font-bold text-[1.2rem] mb-4">
                  รายการตัดยอด
               </div>

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
