import mysql from "serverless-mysql"

export const db = mysql({
   config: {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT,
   },
})

export default async function query(queryString, data = []) {
   try {
      const results = await db.query(queryString, data)
      await db.end()
      return results
   } catch (error) {
      throw Error(error.message)
   }
}
