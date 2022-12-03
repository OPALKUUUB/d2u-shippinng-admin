import React from "react"

function SortIcon({fill = "rgba(0,0,0,.5)"}) {
   return (
      <svg
         xmlns="http://www.w3.org/2000/svg"
         width="16"
         height="16"
         viewBox="0 0 16 16"
         fill={fill}
      >
         <path fill="#444" d="M11 7H5l3-4zM5 9h6l-3 4z"></path>
      </svg>
   )
}

export default SortIcon
