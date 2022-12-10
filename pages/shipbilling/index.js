import { Button, Table, Dropdown, message, Space } from "antd"
import { DownOutlined } from "@ant-design/icons"
import { getSession } from "next-auth/react"
import React, { Fragment, useState } from "react"
import CardHead from "../../components/CardHead"
import Layout from "../../components/layout/layout"

function ShipBilling(props) {
   const { voyages } = props
   const [data, setData] = useState([])
   //    console.log(voyages)
   const onClick = async ({ key }) => {
      message.info(`voyage ${key}`)
      try {
         const response = await fetch(`/api/shipbilling?voyage=${key}`)
         const responseJson = await response.json()
         console.log(responseJson.trackings)
         setData(responseJson.trackings)
      } catch (err) {
         console.log(err)
      }
   }
   const items = voyages.reduce(
      (accumulator, currentValue) => [
         ...accumulator,
         { label: currentValue.voyage, key: currentValue.voyage },
      ],
      []
   )
   const columns = [
      {
         title: "วันที่",
         dataIndex: "created_at",
         width: "120px",
         key: "created_at",
      },
      {
         title: "username",
         dataIndex: "username",
         width: "120px",
         key: "username",
      },
      {
         title: "payment_type",
         dataIndex: "payment_type",
         width: "120px",
         key: "payment_type",
         render: (text) => (text === null ? "-" : text),
      },
      {
         title: "invoice_notificate",
         dataIndex: "invoice_notificate",
         width: "120px",
         key: "invoice_notificate",
         render: (text) => (text === null ? "-" : text),
      },
      {
         title: "check",
         dataIndex: "check",
         width: "120px",
         key: "check",
         render: (text) => (text === null ? "-" : text),
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
         dataIndex: "id",
         width: "120px",
         key: "id",
      },
   ]
   return (
      <Fragment>
         <CardHead name="Ship Billing" />
         <div className="container-table">
            <Dropdown
               menu={{
                  items,
                  onClick,
               }}
            >
               {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
               <a onClick={(e) => e.preventDefault()}>
                  <Space>
                     เลือกรอบเรือ
                     <DownOutlined />
                  </Space>
               </a>
            </Dropdown>
            <Table dataSource={data} columns={columns} />
         </div>
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
   const api = `${process.env.BACKEND_URL}/api/shipbilling/voyage`
   const response = await fetch(api)
   const responseJson = await response.json()
   const { voyages } = await responseJson
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
         voyages,
      },
   }
}
export default ShipBilling
