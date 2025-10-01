import { useState, useEffect } from "react"

const useCustomers = () => {
   const [customers, setCustomers] = useState([])
   const [isLoading, setIsLoading] = useState(true)
   const [error, setError] = useState(null)

   useEffect(() => {
      const fetchCustomers = async () => {
         try {
            const response = await fetch("/api/user")
            if (!response.ok) {
               throw new Error("Failed to fetch customers")
            }
            const responseJson = await response.json()

            const formattedUsers = responseJson.users.map((user) => ({
               label: user.username,
               value: user.username,
               id: user.id,
            }))

            setCustomers(formattedUsers)
         } catch (err) {
            setError(err.message)
            console.error("Error fetching customers:", err)
         } finally {
            setIsLoading(false)
         }
      }

      fetchCustomers()
   }, [])

   return {
      customers,
      isLoading,
      error,
   }
}

export default useCustomers
