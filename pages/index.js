import { getSession } from "next-auth/react"
import Layout from "../components/layout/layout"

function Home() {
   return <div>home</div>
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
      props: { session },
   }
}

Home.getLayout = function getLayout(page) {
   return <Layout>{page}</Layout>
}

export default Home
