import axios from "axios"
import { useRouter } from "next/router"
import { useRef } from "react"

function Signup() {
   const router = useRouter()
   const nameRef = useRef()
   const usernameRef = useRef()
   const roleRef = useRef()
   const passwordRef = useRef()
   const confirmPasswordRef = useRef()

   const handleSignUp = async (e) => {
      e.preventDefault()
      if (!/[a-z0-9_]+$/.test(usernameRef.current.value)) {
         alert("username must include only a-z 0-9 '_' !")
      } else if (
         passwordRef.current.value !== confirmPasswordRef.current.value
      ) {
         alert("password and confirm password doesn't match!")
      } else if (roleRef.current.value === "select") {
         alert("Select role!")
      } else {
         const body = {
            name: nameRef.current.value,
            username: usernameRef.current.value,
            role: roleRef.current.value,
            password: passwordRef.current.value,
         }
         try {
            const response = await axios.post("/api/auth/signup", body)
            alert(response.data.message)
            router.replace("/auth/signin")
         } catch (err) {
            alert(err.response.data.message)
         }
      }
   }
   return (
      <form onSubmit={handleSignUp}>
         <div>
            <label htmlFor="name">name</label>
            <input type="text" name="name" ref={nameRef} />
         </div>
         <div>
            <label htmlFor="username">username</label>
            <input type="text" name="username" ref={usernameRef} />
         </div>
         <div>
            <label htmlFor="role">role</label>
            <select name="role" ref={roleRef}>
               <option>select</option>
               <option value="admin">admin</option>
               <option value="user">user</option>
            </select>
         </div>
         <div>
            <label htmlFor="password">password</label>
            <input type="password" name="password" ref={passwordRef} />
         </div>
         <div>
            <label htmlFor="confirm_password">confirm password</label>
            <input
               type="password"
               name="confirm_password"
               ref={confirmPasswordRef}
            />
         </div>
         <button type="submit">signup</button>
      </form>
   )
}

export default Signup
