import { useEffect } from "react"
import { useRecoilValue } from "recoil"
import NProgress from "nprogress"
import { isLoadingState } from "../atom"
import 'nprogress/nprogress.css'

export default function LoadingPage() {
   const isLoading = useRecoilValue(isLoadingState)
   const handleStart = () => NProgress.start()
   const handleComplete = () => NProgress.done()
   useEffect(() => {
      if (isLoading) {
         handleStart()
      } else {
         handleComplete()
      }
   }, [isLoading])
}
