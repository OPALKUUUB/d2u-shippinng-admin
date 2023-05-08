import { signIn } from "next-auth/react"
import { useRouter } from "next/router"
import { Fragment, useRef, useState } from "react"
import { Spin, message } from "antd"
import ProfileIcon from "./icon/ProfileIcon"
import UnlockIcon from "./icon/UnlockIcon"

function SignInForm() {
   const [loading, setLoading] = useState(false)
   const router = useRouter()
   const usernameRef = useRef()
   const passwordRef = useRef()

   const handleSignIn = async (e) => {
      e.preventDefault()
      setLoading(true)
      try {
         const response = await signIn("credentials", {
            redirect: false,
            username: usernameRef.current.value,
            password: passwordRef.current.value,
         })
         if (response.ok) {
            message.success("Login Success!")
            message.success(`Welcome Back Admin ${usernameRef.current.value}`)
            router.replace("/")
         }else {
            throw new Error(response)
         }
      } catch (err) {
         console.log(err)
         message.error("Your username or password is incorrect!")
      } finally {
         console.log("Success!")
         setLoading(false)
      }
   }

   return (
      <Fragment>
         {loading && (
            <div className="fixed top-0 left-0 right-0 bottom-0 bg-[rgba(0,0,0,0.5)] z-10">
               <div className="fixed top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%]">
                  <Spin size="large" />
               </div>
            </div>
         )}
         <form onSubmit={handleSignIn}>
            <div className="input-container">
               <div className="input-icon">
                  <span className="icon">
                     <ProfileIcon fill="black" width="20" height="20" />
                  </span>
                  <input name="username" type="text" ref={usernameRef} />
               </div>
               <div className="input-icon">
                  <span className="icon">
                     <UnlockIcon width="20" height="20" />
                  </span>
                  <input name="password" type="password" ref={passwordRef} />
               </div>
            </div>
            <button type="submit">Sign In</button>
         </form>
         <style jsx>
            {`
               .input-container {
                  display: flex;
                  flex-direction: column;
               }
               .input-icon {
                  position: relative;
                  margin-bottom: 0.75rem;
                  box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;
               }
               .input-icon > .icon {
                  display: inline-block;
                  height: fit-content;
                  position: absolute;
                  top: 65%;
                  left: 5px;
                  transform: translate(0, -50%);
               }
               .input-icon > input {
                  width: 100%;
                  padding-left: 30px;
                  border: 1px solid rgba(0, 0, 0, 0.5);
                  border-radius: 2px;
                  transition: all 0.2s ease;
               }
               .input-icon > input:focus {
                  outline: 1px solid rgba(0, 0, 0, 0.9);
                  box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 12px;
               }
               .input-icon:last-child {
                  margin-bottom: 1rem;
               }
               button {
                  cursor: pointer;
                  width: 100%;
                  border: 1px solid rgba(0, 0, 0, 0.1);
                  border-radius: 2px;
                  box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;
                  font-weight: 600;
                  text-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
                  transition: all 0.2s ease;
               }
               button:hover {
                  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
                  transform: scale(1.01);
               }
               button:active {
                  box-shadow: rgba(0, 0, 0, 0.05) 0px 6px 24px 0px,
                     rgba(0, 0, 0, 0.08) 0px 0px 0px 1px;
                  transform: scale(1);
               }
            `}
         </style>
      </Fragment>
   )
}

export default SignInForm
