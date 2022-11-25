import React from "react"
import styles from "../../styles/Sidebar.module.css"

function Sidebar() {
   return (
      <aside className={styles.container}>
         <ul>
            <li>
               <div>Dashboard</div>
               <ul>
                  <li>dashboard1</li>
                  <li>dashboard1</li>
                  <li>dashboard1</li>
               </ul>
            </li>
            <li>
               <div>Auction Yahoo</div>
               <ul>
                  <li>Add Auction</li>
                  <li>Bidding</li>
                  <li>Payment</li>
                  <li>History</li>
               </ul>
            </li>
            <li>
               <div>Tracking</div>
               <ul>
                  <li>All</li>
                  <li>Shimizu</li>
                  <li>Mercari</li>
                  <li>Web 123</li>
                  <li>Yahoo</li>
                  <li>Mart</li>
               </ul>
            </li>
            <li>
               <div>Mart</div>
               <ul>
                  <li>Order</li>
                  <li>Buy List</li>
                  <li>Promotion</li>
                  <li>Gachapong</li>
                  <li>7-Eleven</li>
                  <li>Donki</li>
                  <li>Disney</li>
                  <li>Disneyland</li>
               </ul>
            </li>
            <li>
               <div>Ship Billing</div>
            </li>
         </ul>
      </aside>
   )
}
export default Sidebar
