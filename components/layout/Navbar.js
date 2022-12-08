import { Fragment, useEffect, useRef, useState } from "react"
import { useRouter } from "next/router"
import { signOut } from "next-auth/react"
import LogoutIcon from "../icon/LogoutIcon"
import NotiIcon from "../icon/NotiIcon"
import ProfileIcon from "../icon/ProfileIcon"
import SettingProfileIcon from "../icon/SettingProfileIcon"
import MenuIcon from "../icon/MenuIcon"

function Navbar({ slide, setToggleSlide }) {
   const router = useRouter()
   const [showSetting, setShowSetting] = useState(false)

   return (
      <Fragment>
         <nav>
            <div className="nav-left">
               <h1 onClick={() => router.replace("/")}>D2U-Shipping</h1>
               <div className="box-btn-menu">
                  <button
                     className={`btn-menu ${!slide ? "close" : null}`}
                     onClick={setToggleSlide}
                  >
                     <MenuIcon />
                  </button>
               </div>
            </div>
            <div className="nav-right">
               <ul>
                  <li className="noti">
                     <span>
                        <NotiIcon />
                     </span>
                  </li>
                  <li className="profile">
                     <div
                        className="profile-box"
                        onClick={() => setShowSetting(!showSetting)}
                     >
                        <span className="profile-image-box">
                           <ProfileIcon />
                        </span>
                        <span className="profile-text">username</span>
                     </div>
                     <ul className="dropdown-list">
                        <div
                           className={`dropdown-box ${
                              showSetting ? "show" : null
                           }`}
                        >
                           <li>
                              <span className="icon">
                                 <SettingProfileIcon />
                              </span>
                              <span className="text">Manage</span>
                           </li>
                           <li>
                              <span className="icon">
                                 <LogoutIcon />
                              </span>
                              <span className="text" onClick={signOut}>
                                 Sign Out
                              </span>
                           </li>
                        </div>
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
               height: 50px;
               box-sizing: border-box;
               color: white;
               padding: 10px 0;
               box-shadow: rgba(0, 0, 0, 0.16) 0px 3px 6px,
                  rgba(0, 0, 0, 0.23) 0px 3px 6px;
            }
            ul {
               margin: 0;
               padding: 0;
            }
            li {
               list-style: none;
               display: inline-block;
               padding: 0;
            }

            .nav-left {
               float: left;
               width: 200px;
               padding-left: 10px;
            }
            .nav-left h1 {
               display: inline-block;
               width: 150px;
               color: inherit;
               font-size: 1.2rem;
               margin: 0;
               cursor: pointer;
            }
            .box-btn-menu {
               display: inline-block;
               vertical-align: -0.6em;
            }
            .btn-menu {
               padding: 0;
               background: inherit;
               color: white;
               font-size: 1.3rem;
               border: 0;
               height: fit-content;
               cursor: pointer;
               transform: scaleX(-1);
            }
            .btn-menu.close {
               transform: scaleX(1);
            }
            .nav-right {
               float: right;
               min-width: 140px;
            }
            .noti {
               width: 30px;
               height: 30px;
            }
            .noti span {
               display: inline-block;
               vertical-align: -0.52em;
            }
            .profile {
               width: 50px;
               height: 30px;
               font-size: 0.875rem;
               cursor: pointer;
            }
            .profile-box {
               width: 100px;
            }
            .profile-image-box {
               display: inline-block;
               margin-right: 10px;
               height: fit-content;
               vertical-align: -0.6em;
            }
            .profile-text {
               display: inline-block;
               vertical-align: -0.25em;
            }
            .dropdown-list {
               position: relative;
            }
            .dropdown-box {
               position: absolute;
               top: 10px;
               left: -45px;
               width: 150px;
               border-radius: 3px;
               overflow: hidden;
               max-height: 0px;
               opacity: 0;
               transition: max-height 0.2s ease, opacity 0.4s ease;
            }
            .dropdown-box.show {
               opacity: 1;
               max-height: 1000px;
            }
            .dropdown-box li {
               display: block;
               padding: 8px 20px;
               background: white;
               color: rgba(0, 0, 0, 0.8);
               cursor: pointer;
            }
            .dropdown-box li:last-child {
               border-top: 1px solid rgba(0, 0, 0, 0.1);
            }
            .dropdown-box .icon {
               display: inline-block;
               vertical-align: -0.55em;
            }
            .dropdown-box .text {
               display: inline-block;
               margin-left: 7px;
               vertical-align: -0.3em;
            }
         `}</style>
      </Fragment>
   )
}

export default Navbar
