import { Spin } from "antd"

function LoadingPage({ loading }) {
   if (!loading) {
      return null
   }
   return (
      <div className="fixed top-0 left-0 right-0 bottom-0 bg-[rgba(0,0,0,0.5)] z-10">
         <div className="fixed top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%]">
            <Spin size="large" />
         </div>
      </div>
   )
}

export default LoadingPage
