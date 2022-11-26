import { useRouter } from "next/router"
import { useState } from "react"
import DownIcon from "../icon/DownIcon"
import sidebarMenuData from "./SidebarMenu"
import globalStyles from "./SidebarStyle"

function Sidebar({ slide }) {
   const router = useRouter()
   return (
      <aside className={`${slide ? "close" : null}`}>
         {sidebarMenuData.map((menu) =>
            menu.childs ? (
               <SidebarMenuDropdown
                  key={`SidebarMenuDropdown-${menu.id}`}
                  menu={menu}
               />
            ) : (
               <li key={`SidebarMenu-${menu.id}`}>
                  <div className="box" onClick={() => router.replace(menu.to)}>
                     <span className="icon">{menu.icon}</span>
                     <span className="text">{menu.name}</span>
                  </div>
               </li>
            )
         )}
         <style jsx global>
            {globalStyles}
         </style>
      </aside>
   )
}

const SidebarMenuDropdown = ({ menu }) => {
   const router = useRouter()
   const { id, icon, name, childs } = menu
   const [open, setOpen] = useState(false)
   return (
      <li>
         <div className="box-dropdown" onClick={() => setOpen(!open)}>
            <span className="icon">{icon}</span>
            <span className="text">{name}</span>
            <span className={`db-icon ${open ? "up" : null}`}>
               <DownIcon />
            </span>
         </div>
         <div className="box-dropdown-list">
            <ul className={`dropdown-list ${open ? "show" : null}`}>
               {childs.map((child) => (
                  <li key={`DropdownItem-${id}`}>
                     <div className="box-dropdown-item">
                        <span onClick={() => router.replace(child.to)}>
                           {child.name}
                        </span>
                     </div>
                  </li>
               ))}
            </ul>
         </div>
      </li>
   )
}

export default Sidebar
