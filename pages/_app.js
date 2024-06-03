import { SessionProvider } from "next-auth/react"
import "../styles/globals.css"
import "../styles/ibm.css"
import "antd/dist/reset.css"
import dayjs from "dayjs"
import advancedFormat from "dayjs/plugin/advancedFormat"
import customParseFormat from "dayjs/plugin/customParseFormat"
import localeData from "dayjs/plugin/localeData"
import weekday from "dayjs/plugin/weekday"
import weekOfYear from "dayjs/plugin/weekOfYear"
import weekYear from "dayjs/plugin/weekYear"

dayjs.extend(customParseFormat)
dayjs.extend(advancedFormat)
dayjs.extend(weekday)
dayjs.extend(localeData)
dayjs.extend(weekOfYear)
dayjs.extend(weekYear)

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
