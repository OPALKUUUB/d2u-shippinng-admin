import React from "react"

function BillingIcon({ stroke = "#000" }) {
   return (
      <svg
         xmlns="http://www.w3.org/2000/svg"
         width="24"
         height="24"
         viewBox="0 0 32 32"
      >
         <path
            d="M4.441 4.003A3.507 3.507 0 001 7.5a.5.5 0 00.5.5H7v16.5c0 1.927 1.573 3.5 3.5 3.5h17c1.927 0 3.5-1.573 3.5-3.5a.5.5 0 00-.5-.5H25V7.5C25 5.573 23.427 4 21.5 4l-17.059.003zM4.5 5c1.19 0 2.037.89 2.293 2H2.207C2.463 5.89 3.309 5 4.5 5zm2.44 0H21.5C22.887 5 24 6.113 24 7.5V24H13.5a.5.5 0 00-.5.5c0 1.387-1.113 2.5-2.5 2.5A2.492 2.492 0 018 24.5v-17c0-.979-.409-1.864-1.06-2.5zm2.93 1.52L11.126 9h-1.25v1h1.758l.135.268V11H9.877v1h1.893v2h1v-2h1.937v-1H12.77v-.648l.177-.352h1.76V9h-1.252l1.258-2.48h-1.139L12.318 9h-.054l-1.258-2.48H9.875zM16.456 9c-.667.034-.616 1.034.05 1h4.985c.676.01.676-1.01 0-1h-4.984a.5.5 0 00-.051 0zm0 3c-.667.034-.616 1.034.05 1h4.985c.676.01.676-1.01 0-1h-4.984a.5.5 0 00-.051 0zm-6 3c-.667.034-.616 1.034.05 1h10.985c.676.01.676-1.01 0-1H10.508a.5.5 0 00-.051 0zm0 3c-.667.034-.616 1.034.05 1h10.985c.676.01.676-1.01 0-1H10.508a.5.5 0 00-.051 0zm0 3c-.667.034-.616 1.034.05 1h10.985c.676.01.676-1.01 0-1H10.508a.5.5 0 00-.051 0zm3.441 4h15.895c-.256 1.11-1.102 2-2.293 2H12.932c.536-.522.85-1.227.966-2z"
            color="#000"
            fontFamily="sans-serif"
            fontWeight="400"
            overflow="visible"
            stroke={stroke}
            style={{
               lineHeight: "normal",
               WebkitTextIndent: "0",
               textIndent: "0",
               WebkitTextAlign: "start",
               textAlign: "start",
               WebkitTextDecorationLine: "none",
               textDecorationLine: "none",
               WebkitTextDecorationStyle: "solid",
               textDecorationStyle: "solid",
               WebkitTextDecorationColor: "#000",
               textDecorationColor: "#000",
               WebkitTextTransform: "none",
               textTransform: "none",
               blockProgression: "tb",
               whiteSpace: "normal",
               isolation: "auto",
               mixBlendMode: "normal",
               solidColor: "#000",
               solidOpacity: "1",
            }}
         ></path>
      </svg>
   )
}

export default BillingIcon
