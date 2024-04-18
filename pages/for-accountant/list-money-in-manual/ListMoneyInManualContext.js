import React, { useState, useEffect } from "react"
import axios from "axios"
import LoadingPage from "../../../components/LoadingPage"
import { message } from "antd"

const ListMoneyInManualContext = React.createContext(null)

const ListMoneyInManualProvider = ({ children }) => {
   const [listMoneyInData, setListMoneyInData] = useState([])
   const [pagination, setPagination] = useState({
      current: 1,
      pageSize: 10,
      total: 0,
      defaultPageSize: 10,
      pageSizeOptions: [1, 10, 20, 50, 100],
      showSizeChanger: true,
   })
   const [loading, setLoading] = useState(false)

   const handleSearchListMoneyInData = async (
      filter = { pageSize: 10, current: 1 }
   ) => {
      setLoading(true)
      try {
         const response = await axios.get(
            "/api/for-accountant/money-in-manual",
            { params: { ...filter, current: filter.current - 1 } }
         )
         const responseData = await response.data
         if (responseData.code === 200) {
            const { data } = responseData
            if (data && data?.results && data?.results?.length >= 0) {
               const dataList = data?.results?.map((item, _index) => {
                  return {
                     key: `MoneyInManualList-${item.mny_id}`,
                     ...item,
                     ...JSON.parse(item.content_data),
                  }
               })
               setListMoneyInData(dataList)
               setPagination((prev) => ({
                  ...prev,
                  current: data?.current + 1,
                  pageSize: data?.pageSize,
                  total: data?.total,
               }))
            }
         }
      } catch (error) {
         console.log(error)
         message.error("ดึงข้อมูลไม่สำเร็จ!")
      } finally {
         setLoading(false)
      }
   }

   useEffect(() => {
      handleSearchListMoneyInData()
   }, [])

   return (
      <ListMoneyInManualContext.Provider
         value={{
            listMoneyInData,
            pagination,
            handleSearchListMoneyInData,
         }}
      >
         <LoadingPage loading={loading} />
         {children}
      </ListMoneyInManualContext.Provider>
   )
}

export { ListMoneyInManualProvider, ListMoneyInManualContext }
