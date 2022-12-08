import { Table } from "antd"
import { getSession } from "next-auth/react"
import React, { Fragment } from "react"
import CardHead from "../../../components/CardHead"
import Layout from "../../../components/layout/layout"

function ShimizuTrackingsPage() {
   return (
      <Fragment>
         <CardHead name="Shimizu Trackings Page" />
         <div>
            <Table />
         </div>
      </Fragment>
   )
}

ShimizuTrackingsPage.getLayout = function getLayout(page) {
   return <Layout>{page}</Layout>
}
export async function getServerSideProps(context) {
   const session = await getSession({ req: context.req })
   // eslint-disable-next-line prefer-template
   const api = process.env.BACKEND_URL + "/api/tracking/yahoo"
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
         trackings: response.trackings,
      },
   }
}
export default ShimizuTrackingsPage
