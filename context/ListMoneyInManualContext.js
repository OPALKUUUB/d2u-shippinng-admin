import React, { useState, useEffect } from "react"
import axios from "axios"
import { message } from "antd"
import LoadingPage from "../components/LoadingPage"

const ListMoneyInManualContext = React.createContext(null)

export const ListMoneyInManualProvider = ({ children }) => {
   const [listMoneyInData, setListMoneyInData] = useState([])
   const [searchListMoneyInDataPayload, setSearchListMoneyInDataPayload] =
      useState({
         startDate: "",
         endDate: "",
         username: "",
         moneyInStatus: "",
      })
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
            {
               params: {
                  ...searchListMoneyInDataPayload,
                  pageSize: filter.pageSize,
                  current: filter.current - 1,
               },
            }
         )
         const responseData = await response.data
         if (responseData.code === 200) {
            const { data } = responseData
            if (data && data?.results && data?.results?.length >= 0) {
               const dataList = data?.results?.map((item, _index) => ({
                  key: `MoneyInManualList-${item.mny_id}`,
                  ...item,
                  ...JSON.parse(item.content_data),
               }))
               setListMoneyInData(dataList)
               setPagination((prev) => ({
                  ...prev,
                  current: (data?.current || 0) + 1,
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
   }, [searchListMoneyInDataPayload])

   return (
      <ListMoneyInManualContext.Provider
         value={{
            listMoneyInData,
            handleSearchListMoneyInData,
            pagination,
            loading,
            setLoading,
            // Filter Payload
            searchListMoneyInDataPayload,
            setSearchListMoneyInDataPayload
         }}
      >
         <LoadingPage loading={loading} />
         {children}
      </ListMoneyInManualContext.Provider>
   )
}

export default ListMoneyInManualContext
