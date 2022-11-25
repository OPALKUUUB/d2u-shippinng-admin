import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/router"
import { Input, Tooltip, notification } from "antd"
import {
   InfoCircleOutlined,
   UserOutlined,
   LockOutlined,
} from "@ant-design/icons"
import { useSetRecoilState } from "recoil"
import {  isLoadingState } from "../atom"
import styles from "../styles/SignInForm.module.css"

function SignInForm() {
   const router = useRouter()
   const [username, setUsername] = useState()
   const [password, setPassword] = useState()
   const setIsLoading = useSetRecoilState(isLoadingState)

   const handleSignIn = async (e) => {
      e.preventDefault()
      setIsLoading(true)
      const response = await signIn("credentials", {
         redirect: false,
         username,
         password,
      })
      if (response.ok) {
         notification.open({
            message: "Sign In Success!"
         })
         router.replace("/")
      } else {
         notification.open({
            message: "Sign In Fail!",
            description:
               "Please sign in again.",
            
         })
      }
      setIsLoading(false)
   }

   const handleChangePassword = (e) => {
      setPassword(e.target.value)
   }
   const handleChangeUsername = (e) => {
      setUsername(e.target.value)
   }

   return (
      <form onSubmit={handleSignIn} className={styles.container}>
         <Input
            name="username"
            value={username}
            onChange={handleChangeUsername}
            size="large"
            placeholder="Enter your username"
            prefix={<UserOutlined />}
            suffix={
               <Tooltip title="Your Username Account">
                  <InfoCircleOutlined />
               </Tooltip>
            }
         />
         <Input
            type="password"
            name="password"
            value={password}
            onChange={handleChangePassword}
            size="large"
            placeholder="Enter your Password"
            prefix={<LockOutlined />}
            suffix={
               <Tooltip title="Your Password Account">
                  <InfoCircleOutlined />
               </Tooltip>
            }
         />
         <button type="submit" className="bttn-fill bttn-md bttn-primary">
            Sign In
         </button>
      </form>
   )
}

export default SignInForm
