import { getSession } from "next-auth/react"
import React, { Fragment, useState } from "react"
import { Table } from "antd"
import Layout from "../../../components/layout/layout"
import CardHead from "../../../components/CardHead"

function YahooHistoryPage(props) {
   const [data, setData] = useState(props.historys)
   const columns = [
      {
         title: "วันที่",
         dataIndex: "created_at",
         key: "created_at",
         sorter: (a, b) => {
            const datetime_a = a.created_at
            const date_a = datetime_a.split(" ")[0]
            const time_a = datetime_a.split(" ")[1]
            const date_a_f = date_a.split("/")
            const time_a_f = time_a.split(":")
            // [y,m,d,h,m,s]
            const datetime_a_f = [
               parseInt(date_a_f[2], 10),
               parseInt(date_a_f[1], 10),
               parseInt(date_a_f[0], 10),
               parseInt(time_a_f[0], 10),
               parseInt(time_a_f[1], 10),
               parseInt(time_a_f[2], 10),
            ]
            const datetime_b = b.created_at
            const date_b = datetime_b.split(" ")[0]
            const time_b = datetime_b.split(" ")[1]
            const date_b_f = date_b.split("/")
            const time_b_f = time_b.split(":")
            const datetime_b_f = [
               parseInt(date_b_f[2], 10),
               parseInt(date_b_f[1], 10),
               parseInt(date_b_f[0], 10),
               parseInt(time_b_f[0], 10),
               parseInt(time_b_f[1], 10),
               parseInt(time_b_f[2], 10),
            ]
            for (let i = 0; i < 6; i++) {
               if (datetime_a_f[i] - datetime_b_f[i] !== 0) {
                  return datetime_a_f[i] - datetime_b_f[i]
               }
            }
            return 0
         },
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
   const api = process.env.BACKEND_URL + "/api/yahoo/order/history"

   const response = await fetch(api).then((res) => res.json())
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
         historys: response.history,
      },
   }
}

export default YahooHistoryPage
