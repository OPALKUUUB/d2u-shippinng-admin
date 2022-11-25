import { LockOutlined } from "@ant-design/icons"
import SignInForm from "../../../components/SignInForm"
import styles from "../../../styles/SignInPage.module.css"

function SignInPage() {
   return (
      <div className={styles.container}>
         <div className={styles.card}>
            <h2>
               <div className={styles.lockIcon}>
                  <LockOutlined />
               </div>
               SIGN IN<span>(D2U-ADMIN)</span>
            </h2>
            <SignInForm />
         </div>
      </div>
   )
}

export default SignInPage
