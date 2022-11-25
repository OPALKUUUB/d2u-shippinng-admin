import { SessionProvider } from "next-auth/react"
import { RecoilRoot} from "recoil"
import LoadingPage from "../components/LoadingPage"
import "../styles/globals.css"

function MyApp({ Component, pageProps }) {
   const getLayout = Component.getLayout || ((page) => page)
   
   return (
      <RecoilRoot>
         <SessionProvider
            session={pageProps.session}
            refetchInterval={5 * 60}
            refetchOnWindowFocus
         >
            <LoadingPage/>
            {getLayout(<Component {...pageProps} />)}
         </SessionProvider>
      </RecoilRoot>
   )
}

export default MyApp
