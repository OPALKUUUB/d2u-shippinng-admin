import { getSession } from "next-auth/react"
import React from "react"
import Layout from "../../../components/layout/layout"

function YahooHistoryPage() {
   return <div>YahooHistoryPage</div>
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