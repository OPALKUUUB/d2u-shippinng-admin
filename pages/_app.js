import { SessionProvider } from "next-auth/react"
import Layout from "../components/layout/layout"
import "../styles/globals.css"

function MyApp({ Component, pageProps }) {
   return (
      <SessionProvider
         session={pageProps.session}
         refetchInterval={5 * 60}
         refetchOnWindowFocus
      >
         <Layout>
            <Component {...pageProps} />
         </Layout>
      </SessionProvider>
   )
}

export default MyApp
