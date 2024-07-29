import { getSession } from "next-auth/react"
import Layout from "../../../components/layout/layout"
import { InvoiceShipBillingProvider } from "../../../context/InvoiceShipBillingContext"

const Container = ({ children }) => {
   return (
      <div className="w-[98%] min-h-[98%] bg-white mx-auto mt-2 p-3 rounded-md flex flex-col gap-2">
         {children}
      </div>
   )
}
function InvoiceShipBillingKeepPage() {
   return (
      <InvoiceShipBillingProvider>
         <Container>
            {/* <InvoiceShipBillingFilter /> */}
            {/* <InvoiceShipBillingResult /> */}
         </Container>
      </InvoiceShipBillingProvider>
   )
}

InvoiceShipBillingKeepPage.getLayout = function getLayout(page) {
   return <Layout>{page}</Layout>
}

export async function getServerSideProps(context) {
   const session = await getSession({ req: context.req })
   if (!session) {
      return {
         redirect: {
            destination: "/auth/signin",
            permanant: false,
         },
      }
   }
   return {
      props: {
         session,
      },
   }
}

export default InvoiceShipBillingKeepPage
