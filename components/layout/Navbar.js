import Link from "next/link"
import { Fragment } from "react"

function Navbar() {
   return (
      <Fragment>
         <nav>
            <div className="nav-left">
               {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
               <Link href="/#" style={{textDecoration: "none", color: "white"}}>
                  <h1>D2U-Shipping</h1>
               </Link>
            </div>
            <div className="nav-center"/>
            <div className="nav-right">
               <ul>
                  <li style={{ display: "inline-block" }}>
                     <div>notification</div>
                  </li>
                  <li style={{ display: "inline-block" }}>
                     <div>profile</div>
                     <ul style={{ display: "none" }}>
                        <li>manage</li>
                        <li>
                           <button>signout</button>
                        </li>
                     </ul>
                  </li>
               </ul>
            </div>
         </nav>
         <style jsx>{`
            nav {
               position: fixed;
               top: 0;
               width: 100%;
               background: #001529;
               height: 40px;
               box-sizing: border-box;
               padding-top: 5px;
            }
            .nav-left {
               display: inline-block;
               width: 20%;
               padding-left: 10px;
            }
            .nav-left h1 {
               color: white;
               font-size: 1.2rem;
            }
            .nav-center {
               display: inline-block;
               width: 50%;
            }
            .nav-right {
               display: inline-block;
               color: white;
               width: 30%;
               text-align: right;
               padding-right: 20px;
            }
            ul {
               margin: 0;
            }
         `}</style>
      </Fragment>
   )
}

export default Navbar
