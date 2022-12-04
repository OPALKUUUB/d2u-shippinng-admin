import { SessionProvider } from "next-auth/react"
import "../styles/globals.css"
import "../styles/ibm.css"
import "antd/dist/reset.css"

function MyApp({ Component, pageProps }) {
   const getLayout = Component.getLayout || ((page) => page)

   return (
      <SessionProvider
         session={pageProps.session}
         refetchInterval={5 * 60}
         refetchOnWindowFocus
      >
         {getLayout(<Component {...pageProps} />)}
      </SessionProvider>
   )
}

export default MyApp
