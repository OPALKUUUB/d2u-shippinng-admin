import { SessionProvider } from "next-auth/react"
import "../styles/globals.css"
import "../styles/boxicons/css/boxicons.css"
import "../styles/boxicons/css/animations.css"
import "../styles/boxicons/css/transformations.css"
import "../styles/ibm.css"
// import "../styles/boxicons.min.css"

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
