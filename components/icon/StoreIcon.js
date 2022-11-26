import React from "react"

function StoreIcon({ fill = "#212121" }) {
   return (
      <svg
         xmlns="http://www.w3.org/2000/svg"
         width="22"
         height="22"
         fill="none"
         viewBox="0 0 16 16"
      >
         <path
            fill={fill}
            d="M9 9.5a.5.5 0 01.5-.5h2a.5.5 0 01.5.5v2a.5.5 0 01-.5.5h-2a.5.5 0 01-.5-.5v-2zm1 1.5h1v-1h-1v1z"
         ></path>
         <path
            fill={fill}
            d="M4.188 1.11l-2.5 2c-.166.132-.188.36-.188.56V5.5c0 .563.186 1.082.5 1.5v7.5a.5.5 0 00.5.5h11a.5.5 0 00.5-.5V7c.314-.418.5-.937.5-1.5V3.666c0-.2-.022-.424-.188-.556l-2.5-2A.5.5 0 0011.5 1h-7a.5.5 0 00-.312.11zM5.5 4v1.5a1.5 1.5 0 11-3 0V4h3zm4 0v1.5a1.5 1.5 0 11-3 0V4h3zm4 0v1.5a1.5 1.5 0 01-3 0V4h3zM6.029 2l-.375 1H3.425l1.25-1H6.03zm.693 1l.375-1H8.89l.333 1H6.722zm3.222-1h1.38l1.25 1h-2.297l-.333-1zM13 7.792V14H8V9.5a.5.5 0 00-.5-.5h-3a.5.5 0 00-.5.5V14H3V7.792A2.496 2.496 0 006 7c.456.607 1.182 1 2 1 .818 0 1.544-.393 2-1a2.496 2.496 0 003 .792zM7 14H5v-4h2v4z"
         ></path>
      </svg>
   )
}

export default StoreIcon
