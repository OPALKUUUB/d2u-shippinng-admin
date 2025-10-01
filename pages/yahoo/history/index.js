import { getSession } from "next-auth/react"
import React, { Fragment, useEffect, useState } from "react"
import { Table } from "antd"
import Layout from "../../../components/layout/layout"
import CardHead from "../../../components/CardHead"
import sortDateTime from "../../../utils/sortDateTime"

function YahooHistoryPage(props) {
   const [data, setData] = useState([])
   const columns = [
      {
         title: "วันที่",
         dataIndex: "created_at",
         key: "created_at",
         sorter: (a, b) => sortDateTime(a.created_at, b.created_at),
         render: (text) => (
            <>
               <p>{text.split(" ")[0]}</p>
               <p>{text.split(" ")[1]}</p>
            </>
         ),
      },
      {
         title: "รูปภาพ",
         dataIndex: "image",
         key: "image",
         render: (text) => <img src={text} alt="" width={100} />,
      },
      {
         title: "ลิ้งค์",
         dataIndex: "link",
         key: "link",
         render: (text) => (
            <a href={text} target="_blank" rel="noreferrer">
               {text.split("/").slice(-1)}
            </a>
         ),
      },
      {
         title: "สถานะ",
         dataIndex: "status",
         key: "status",
      },
      {
         title: "สถานะการชำระเงิน",
         dataIndex: "payment_status",
         key: "payment_status",
      },
   ]
   useEffect(() => {
      ;(async () => {
         const response = await fetch("/api/yahoo/order/history")
         const responseJson = await response.json()
         // console.log(responseJson)
         setData(
            responseJson.history
         )
      })()
   }, [])
   return (
      <Fragment>
         <CardHead name="Yahoo Historys Auction" />
         <div className="container-table">
            <Table dataSource={data} columns={columns} />
         </div>
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

YahooHistoryPage.getLayout = function getLayout(page) {
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
      props: { session },
   }
}

export default YahooHistoryPage
