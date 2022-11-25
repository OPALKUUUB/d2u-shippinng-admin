import { Fragment, useState } from "react"
import { signOut } from "next-auth/react"
import Navbar from "./Navbar"
import Sidebar from "./Sidebar"

function layout({ children }) {
   const [slide, setSlide] = useState(false)
   const handleSignOut = async () => {
      await signOut()
   }
   return (
      <Fragment>
         <div className="layout-1">
            <Navbar />
            <div className="layout-2">
               <Sidebar slide={slide}/>
               {/* <Content>{children}</Content> */}
            </div>
         </div>
         <style jsx>
            {`
               .layout-1 {
                  position: relative;
                  width: 100vw;
                  height: 100vh;
                  overflow: hidden;
               }
               .layout-2 {
                  position: absolute;
                  top: 40px;
               }
            `}
         </style>
      </Fragment>
   )
}

export default layout
