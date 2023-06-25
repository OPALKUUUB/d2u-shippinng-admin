/* eslint-disable no-param-reassign */
import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { verifyPassword } from "../../../lib/auth"
import query from "../../../dbs/mysql/connection"

export default NextAuth({
   session: {
      jwt: true,
   },
   providers: [
      CredentialsProvider({
         async authorize(credentials) {
            const users = await query(
               "SELECT * FROM admins WHERE username = ?",
               [credentials.username]
            )
            if (users.length === 0) {
               throw new Error("No user found!")
            }
            const user = users[0]
            const isValid = await verifyPassword(
               credentials.password,
               user.password
            )
            if (!isValid) {
               throw new Error("Could not log you in!")
            }
            return { name: JSON.stringify(user) }
         },
      }),
   ],
   callbacks: {
      async session({ session }) {
         console.log(session)
         const user_data = JSON.parse(session.user.name)
         console.log(user_data)
         session.user.username = user_data.username
         session.user.name = user_data.username
         session.user.real_name = user_data.name
         session.user.role = user_data.role
         return session
      },
   },
})
