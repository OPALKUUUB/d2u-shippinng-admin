import { Fragment, useState } from "react"
import Sidebar from "../Sidebar/Sidebar"
import Navbar from "./Navbar"

function layout({ children }) {
   const [slide, setSlide] = useState(false)

   return (
      <Fragment>
         <div className="layout-1">
            <Navbar setToggleSlide={() => setSlide(!slide)} slide={slide} />
            <div className="layout-2">
               <Sidebar slide={slide} />
               <div className="content">{children}</div>
            </div>
         </div>
         <style jsx>
            {`
               .layout-1 {
                  position: relative;
                  width: 100vw;
                  height: 100vh;
                  background: rgba(0, 0, 0, 0.1);
                   {
                     /* overflow: hidden; */
                  }
               }
               .layout-2 {
                  display: flex;
               }
               .content {
                  padding-top: 50px;
                  padding-bottom: 20px;
                  width: 100%;
                  max-height: 100vh;
                  overflow: auto;
               }
            `}
         </style>
      </Fragment>
   )
}

export default layout
