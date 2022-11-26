import { useRouter } from "next/router"
import { Fragment, useState } from "react"
import BillingIcon from "../icon/BillingIcon"
import DashboardIcon from "../icon/DashboardIcon"
import DownIcon from "../icon/DownIcon"
import StoreIcon from "../icon/StoreIcon"
import TrackingPackageIcon from "../icon/TrackingPackageIcon"
import YahooIcon from "../icon/YahooIcon"

function Sidebar({ slide }) {
   const router = useRouter()
   const [dropdown1, setDropdown1] = useState(false)
   const [dropdown2, setDropdown2] = useState(false)
   const [dropdown3, setDropdown3] = useState(false)
   return (
      <Fragment>
         <aside className={`${slide ? "close" : null}`}>
            <ul>
               <li>
                  <div
                     className="box"
                     onClick={() => router.replace("/")}
                  >
                     <span className="icon">
                        <DashboardIcon />
                     </span>
                     <span className="text">Dashboard</span>
                  </div>
               </li>
               <li>
                  <div
                     className="box-dropdown"
                     onClick={() => setDropdown1(!dropdown1)}
                  >
                     <span className="icon">
                        <YahooIcon />
                     </span>
                     <span className="text">Auction Yahoo</span>
                     <span className={`db-icon ${dropdown1 ? "up" : null}`}>
                        <DownIcon/>
                     </span>
                  </div>
                  <div className="box-dropdown-list">
                     <ul
                        className={`dropdown-list ${dropdown1 ? "show" : null}`}
                     >
                        <li>
                           <div className="box-dropdown-item">
                              <span
                                 onClick={() =>
                                    router.replace("/yahoo-auction/add-auction")
                                 }
                              >
                                 Add Auction
                              </span>
                           </div>
                        </li>
                        <li>
                           <div className="box-dropdown-item">
                              <span
                                 onClick={() =>
                                    router.replace("/yahoo-auction/bidding")
                                 }
                              >
                                 Bidding
                              </span>
                           </div>
                        </li>
                        <li>
                           <div className="box-dropdown-item">
                              <span
                                 onClick={() =>
                                    router.replace("/yahoo-auction/payment")
                                 }
                              >
                                 Payment
                              </span>
                           </div>
                        </li>
                        <li>
                           <div className="box-dropdown-item">
                              <span
                                 onClick={() =>
                                    router.replace("/yahoo-auction/history")
                                 }
                              >
                                 History
                              </span>
                           </div>
                        </li>
                     </ul>
                  </div>
               </li>
               <li>
                  <div
                     className="box-dropdown"
                     onClick={() => setDropdown2(!dropdown2)}
                  >
                     <span className="icon">
                        <TrackingPackageIcon />
                     </span>
                     <span className="text">Tracking</span>
                     <span className={`db-icon ${dropdown2 ? "up" : null}`}>
                        <DownIcon/>
                     </span>
                  </div>
                  <div className="box-dropdown-list">
                     <ul
                        className={`dropdown-list ${dropdown2 ? "show" : null}`}
                     >
                        <li>
                           <div className="box-dropdown-item">
                              <span
                                 onClick={() => router.replace("/tracking/all")}
                              >
                                 All
                              </span>
                           </div>
                        </li>
                        <li>
                           <div className="box-dropdown-item">
                              <span
                                 onClick={() =>
                                    router.replace("/tracking/shimizu")
                                 }
                              >
                                 Shimizu
                              </span>
                           </div>
                        </li>
                        <li>
                           <div className="box-dropdown-item">
                              <span
                                 onClick={() =>
                                    router.replace("/tracking/mercari")
                                 }
                              >
                                 Mercari
                              </span>
                           </div>
                        </li>
                        <li>
                           <div className="box-dropdown-item">
                              <span
                                 onClick={() =>
                                    router.replace("/tracking/web123")
                                 }
                              >
                                 Web 123
                              </span>
                           </div>
                        </li>
                        <li>
                           <div className="box-dropdown-item">
                              <span
                                 onClick={() =>
                                    router.replace("/tracking/yahoo")
                                 }
                              >
                                 Yahoo
                              </span>
                           </div>
                        </li>
                        <li>
                           <div className="box-dropdown-item">
                              <span
                                 onClick={() =>
                                    router.replace("/tracking/mart")
                                 }
                              >
                                 Mart
                              </span>
                           </div>
                        </li>
                     </ul>
                  </div>
               </li>
               <li>
                  <div
                     className="box-dropdown"
                     onClick={() => setDropdown3(!dropdown3)}
                  >
                     <span className="icon">
                        <StoreIcon />
                     </span>
                     <span className="text">Mart</span>
                     <span className={`db-icon ${dropdown3 ? "up" : null}`}>
                        <DownIcon/>
                     </span>
                  </div>
                  <div className="box-dropdown-list">
                     <ul
                        className={`dropdown-list ${dropdown3 ? "show" : null}`}
                     >
                        <li>
                           <div className="box-dropdown-item">
                              <span
                                 onClick={() => router.replace("/mart/order")}
                              >
                                 Order
                              </span>
                           </div>
                        </li>
                        <li>
                           <div className="box-dropdown-item">
                              <span
                                 onClick={() => router.replace("/mart/order")}
                              >
                                 Buy List
                              </span>
                           </div>
                        </li>
                        <li>
                           <div className="box-dropdown-item">
                              <span
                                 onClick={() => router.replace("/mart/order")}
                              >
                                 Promotion
                              </span>
                           </div>
                        </li>
                        <li>
                           <div className="box-dropdown-item">
                              <span
                                 onClick={() => router.replace("/mart/order")}
                              >
                                 Gachapong
                              </span>
                           </div>
                        </li>
                        <li>
                           <div className="box-dropdown-item">
                              <span
                                 onClick={() => router.replace("/mart/order")}
                              >
                                 7-Eleven
                              </span>
                           </div>
                        </li>
                        <li>
                           <div className="box-dropdown-item">
                              <span
                                 onClick={() => router.replace("/mart/order")}
                              >
                                 Donki
                              </span>
                           </div>
                        </li>
                        <li>
                           <div className="box-dropdown-item">
                              <span
                                 onClick={() => router.replace("/mart/order")}
                              >
                                 Disney
                              </span>
                           </div>
                        </li>
                        <li>
                           <div className="box-dropdown-item">
                              <span
                                 onClick={() => router.replace("/mart/order")}
                              >
                                 Dineyland
                              </span>
                           </div>
                        </li>
                     </ul>
                  </div>
               </li>
               <li>
                  <div
                     className="box"
                     onClick={() => router.replace("/ship-billing")}
                  >
                     <span className="icon">
                        <BillingIcon />
                     </span>
                     <span className="text">Ship Billing</span>
                  </div>
               </li>
            </ul>
            <div />
         </aside>
         <style jsx>
            {`
               aside {
                  width: 200px;
                  max-width: 200px;
                  min-width: 200px;
                  height: 100vh;
                  max-height: 100vh;
                  padding-bottom: 100px;
                  padding-top: 60px;
                  background: white;
                  color: rgba(0, 0, 0, 0.75);
                  transition: all 0.3s ease;
                  overflow-y: auto;
               }
               aside.close {
                  max-width: 0px;
                  min-width: 0px;
                  {/* max-width: 50px; */}
               }

               aside::-webkit-scrollbar {
                  width: 0.5px;
                  height: 0.5px;
               }
               aside::-webkit-scrollbar-thumb {
                  background: rgba(0, 0, 0, 0.12);
                  border-radius: 3px;
                  box-shadow: inset 0 0 5px rgb(0 21 41 / 5%);
               }
               aside::-webkit-scrollbar-track {
                  background: rgba(0, 0, 0, 0.06);
                  border-radius: 3px;
                  box-shadow: inset 0 0 5px rgb(0 21 41 / 5%);
               }
               ul {
                  margin: 0;
                  padding: 0;
               }
               li {
                  list-style: none;
                  cursor: pointer;
               }
               .box,
               .box-dropdown {
                  min-width: 200px;
                  position: relative;
                  padding-top: 10px;
                  padding-bottom: 10px;
                  padding-left: 15px;
               }
               .box:hover,
               .box-dropdown:hover,
               .dropdown-list > li:hover {
                  color: #1890ff;
               }
               .box .icon,
               .box-dropdown .icon {
                  display: inline-block;
                  width: 18px;
                  height: 18px;
                  vertical-align: -0.3rem;
               }
               .box .text,
               .box-dropdown .text {
                  display: inline-block;
                  min-width: 120px;
                  margin-left: 20px;
                  font-size: 0.925rem;
                  font-weight: 400;
                  line-height: 0;
                  text-shadow: 0.1px 0.1px 0.5px rgba(0, 0, 0, 0.75),
                     -0.1px -0.1px 0.5px rgba(0, 0, 0, 0.75);
               }
               .box-dropdown .db-icon {
                  display: inline-block;
                  font-size: 1.2rem;
                  position: absolute;
                  transform: scaleY(1);
                  transition: all 0.2s ease-in-out;
               }
               .box-dropdown .db-icon.up {
                  top: 5px;
                  transform:  scaleY(-1);
               }
               .dropdown-list {
                  overflow: hidden;
                  max-height: 0px;
                  transition: max-height 0.2s ease-in-out;
               }
               .dropdown-list.show {
                  height: auto;
                  max-height: 1000px;
               }
               .box-dropdown-item {
                  padding: 10px 0px 10px 35px;
                  font-size: 0.875rem;
               }
               .box-dropdown-item:hover {
                  background: #e6f7ff;
                  border-right: 3px solid #40a9ff;
               }
               .box-dropdown-list {
                  box-shadow: 1px 1px 10px rgba(0, 0, 0, 0.15) inset;
               }
            `}
         </style>
      </Fragment>
   )
}

// const MenuDropdown = (menuData) => {
//    return (
//       <ul>
//          {menuData.map((menu, index) => (
//             <li key={`MenuSidebar-${menu.id}_item${index}`}>
//                <div className="box-dropdown-item">
//                   <span>{name}</span>
//                </div>
//             </li>
//          ))}
//       </ul>
//    )
// }
export default Sidebar
