import React from 'react'
import Layout from "../../components/layout/layout"
import { getSession } from 'next-auth/react'

function PrivateTransport() {
   return (
      <div>
      test
      </div>
   )
}

PrivateTransport.getLayout = function getLayout(page) {
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

export default PrivateTransport
