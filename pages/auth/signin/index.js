import React, { useRef } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/router"

function Signin() {
   const router = useRouter()
   const usernameRef = useRef()
   const passwordRef = useRef()
   const handleSignIn = async (e) => {
      e.preventDefault()
      const username = usernameRef.current.value
      const password = passwordRef.current.value
      const response = await signIn("credentials", {
         redirect: false,
         username,
         password,
      })
      if (response.ok) {
         alert("Success!")
         router.replace("/")
      } else {
         alert("Error!")
      }
   }

   return (
      <form onSubmit={handleSignIn}>
         <div>
            <label htmlFor="username">username</label>
            <input type="text" name="username" ref={usernameRef} />
         </div>
         <div>
            <label htmlFor="password">password</label>
            <input type="password" name="password" ref={passwordRef} />
         </div>
         <button type="submit">Sign In</button>
      </form>
   )
}

export default Signin
