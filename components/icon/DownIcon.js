import React from "react"

function DownIcon({fill="black", width="20", height="20"}) {
   return (
      <svg
         xmlns="http://www.w3.org/2000/svg"
         width={width}
         height={height}
         viewBox="0 0 24 24"
      >
         <path fill={fill} d="M17 9.17a1 1 0 00-1.41 0L12 12.71 8.46 9.17a1 1 0 00-1.41 0 1 1 0 000 1.42l4.24 4.24a1 1 0 001.42 0L17 10.59a1 1 0 000-1.42z"></path>
      </svg>
   )
}

export default DownIcon
