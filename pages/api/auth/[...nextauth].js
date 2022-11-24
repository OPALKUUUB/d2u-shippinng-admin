import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { verifyPassword } from "../../../lib/auth";
import mysql from "../../../lib/db";

export default NextAuth({
  session: {
    jwt: true,
  },
  providers: [
    CredentialsProvider({
      async authorize(credentials) {
        await mysql.connect();
        const users = await mysql.query("SELECT * FROM admins WHERE username = ?", [
          credentials.username,
        ]);
        if (users.length === 0) {
          await mysql.end()
          throw new Error("No user found!");
        }
        const user = users[0];
        const isValid = await verifyPassword(
          credentials.password,
          user.password
        );
        if (!isValid) {
          await mysql.end()
          throw new Error("Could not log you in!");
        }
        await mysql.end();
        return {  name: user.username  };
      },
    }),
  ],
});
