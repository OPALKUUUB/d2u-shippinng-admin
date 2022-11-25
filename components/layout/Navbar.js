import { useSetRecoilState } from "recoil"
import { signOut } from "next-auth/react"
import { isLoadingState } from "../../atom"
import styles from "../../styles/Navbar.module.css"
import Link from "next/link"

function Navbar() {
   const setIsLoading = useSetRecoilState(isLoadingState)
   const handleSignOut = async () => {
      setIsLoading(true)
      await signOut()
      setIsLoading(false)
   }
   return (
      <nav className={styles.container}>
         <div className={styles.navLeft}>
            <Link href="/">
               <h1>D2U-Shipping</h1>
            </Link>
         </div>
         <div className={styles.navRight}>
            <div>notification</div>
            <div>profile</div>
         </div>
      </nav>
   )
}

export default Navbar
