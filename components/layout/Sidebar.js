import Link from "next/link"

function Sidebar() {
   return (
      <aside>
         <ul>
            <li>
               <i className="bx bxs-dashboard"/>
               <div>
                  <Link href="/dashboard">Dashboard</Link>
               </div>
            </li>
            <li>
               <i className="bx bx-customize"/>
               <div>Auction Yahoo</div>
               <i className=""/>
               <ul>
                  <li>
                     <Link href="/yahoo-auction/add-auction">Add Auction</Link>
                  </li>
                  <li>
                     <Link href="/yahoo-auction/bidding">Bidding</Link>
                  </li>
                  <li>
                     <Link href="/yahoo-auction/payment">Payment</Link>
                  </li>
                  <li>
                     <Link href="/yahoo-auction/history">History</Link>
                  </li>
               </ul>
            </li>
            <li>
               <i className=""/>
               <div>Tracking</div>
               <ul>
                  <li>
                     <Link href="/tracking/all">All</Link>
                  </li>
                  <li>
                     <Link href="/tracking/shimizu">Shimizu</Link>
                  </li>
                  <li>
                     <Link href="/tracking/mercari">Mercari</Link>
                  </li>
                  <li>
                     <Link href="/tracking/web123">Web 123</Link>
                  </li>
                  <li>
                     <Link href="/tracking/yahoo">Yahoo</Link>
                  </li>
                  <li>
                     <Link href="/tracking/mart">Mart</Link>
                  </li>
               </ul>
            </li>
            <li>
               <i className=""/>
               <div>Mart</div>
               <ul>
                  <li>
                     <Link href="/mart/order">Order</Link>
                  </li>
                  <li>
                     <Link href="/mart/order">Buy List</Link>
                  </li>
                  <li>
                     <Link href="/mart/order">Promotion</Link>
                  </li>
                  <li>
                     <Link href="/mart/order">Gachapong</Link>
                  </li>
                  <li>
                     <Link href="/mart/order">7-Eleven</Link>
                  </li>
                  <li>
                     <Link href="/mart/order">Donki</Link>
                  </li>
                  <li>
                     <Link href="/mart/order">Disney</Link>
                  </li>
                  <li>
                     <Link href="/mart/order">Disneyland</Link>
                  </li>
               </ul>
            </li>
            <li>
               <i className=""/>
               <div>
                  <Link href="/ship-billing">Ship Billing</Link>
               </div>
            </li>
         </ul>
         <div />
      </aside>
   )
}
export default Sidebar
