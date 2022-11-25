import Navbar from "./Navbar"
import Sidebar from "./Sidebar"

const container = {
   position: "relative",
   background: "rgba(0,0,0,0.05)",
   width: "100vw",
   height: "100vh",
}
function layout({ children }) {
   return (
      <div style={container}>
         <Sidebar />
         <Navbar />
         <main style={{marginLeft: 200, marginTop: 60}}>{children}</main>
      </div>
   )
}

export default layout
