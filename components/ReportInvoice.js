import React, { useEffect } from "react"
import {
   Document,
   Page,
   StyleSheet,
   Text,
   View,
   PDFViewer,
   Font,
} from "@react-pdf/renderer"
import dayjs from "dayjs"

// Define your styles
const borderColor = "#bfbfbf"
const borderWidth = 0.5
const styles = StyleSheet.create({
   page: {
      flexDirection: "column",
      fontFamily: "THSarabun",
      paddingVertical: "20px",
   },
   section: {
      width: "50%",
      display: "flex",
      alignItems: "center",
   },
   table: {
      display: "table",
      width: "90%",
      marginHorizontal: "auto",
      marginBottom: 10,
   },
   tableRow: {
      flexDirection: "row",
   },
   tableColHeader: {
      borderStyle: "solid",
      borderWidth,
      borderColor,
      padding: "4px 5px",
   },
   tableCol: {
      borderStyle: "solid",
      borderWidth,
      borderColor,
      padding: "4px 5px",
   },
   tableCellHeader: {
      fontSize: 12,
      fontWeight: "bold",
      fontFamily: "THSarabunBold",
   },
   tableCell: {
      fontSize: 12,
   },
   sectionFooter: {
      width: "100%",
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-around",
   },
   cellDot: {
      borderTop: "1px",
      borderTopStyle: "dotted",
      paddingTop: "5px",
      fontSize: 10,
      width: "80px",
      textAlign: "center",
   },
   header1: {
      width: "100%",
      textAlign: "right",
      paddingRight: "10px",
      fontSize: 12,
      color: borderColor,
   },
   headerTitle: {
      width: "100%",
      textAlign: "center",
      fontSize: 12,
      fontFamily: "THSarabunBold",
   },
})

function RenderTable({ data }) {
   return (
      <View style={styles.table}>
         <View style={styles.tableRow}>
            <View
               style={{
                  ...styles.tableColHeader,
                  width: "8%",
                  textAlign: "center",
               }}
            >
               <Text style={styles.tableCellHeader}>#</Text>
            </View>
            <View
               style={{
                  ...styles.tableColHeader,
                  width: "15%",
                  textAlign: "center",
               }}
            >
               <Text style={styles.tableCellHeader}>ชื่อผู้ใช้</Text>
            </View>
            <View
               style={{
                  ...styles.tableColHeader,
                  width: "15%",
                  textAlign: "center",
               }}
            >
               <Text style={styles.tableCellHeader}>สถานะ</Text>
            </View>
            <View
               style={{
                  ...styles.tableColHeader,
                  width: "15%",
                  textAlign: "center",
               }}
            >
               <Text style={{ ...styles.tableCellHeader, textAlign: "right" }}>
                  ค่าเรือ
               </Text>
            </View>
            <View
               style={{
                  ...styles.tableColHeader,
                  width: "15%",
                  textAlign: "right",
               }}
            >
               <Text style={styles.tableCellHeader}>ประเภทค่าใช้จ่าย</Text>
            </View>
            <View
               style={{
                  ...styles.tableColHeader,
                  width: "32%",
               }}
            >
               <Text style={styles.tableCellHeader}>ที่อยู่</Text>
            </View>
         </View>
         {data &&
            Array.isArray(data) &&
            data.length >= 0 &&
            data.map((item, index) => {
               const key = `List_data_${index}`
               const contentDataParse = JSON.parse(item?.contentData)
               const addressType = contentDataParse?.addressType
               const addAddressType = contentDataParse?.addAddressType
               const address = contentDataParse?.address
               const addAddress = contentDataParse?.addAddress
               const addressVal = [
                  addressType,
                  address,
                  addAddressType,
                  addAddress,
               ].join("\n")
               return (
                  <View key={key} style={styles.tableRow}>
                     <View
                        style={{
                           ...styles.tableCol,
                           width: "8%",
                           textAlign: "center",
                        }}
                     >
                        <Text style={styles.tableCell}>{index + 1}.</Text>
                     </View>
                     <View
                        style={{
                           ...styles.tableCol,
                           width: "15%",
                           textAlign: "center",
                        }}
                     >
                        <Text style={styles.tableCell}>{item?.username}</Text>
                     </View>
                     <View style={{ ...styles.tableCol, width: "15%", textAlign: "center" }}>
                        <Text style={styles.tableCell}>
                           {item?.shipBillingStatus}
                        </Text>
                     </View>
                     <View
                        style={{
                           ...styles.tableCol,
                           width: "15%",
                           textAlign: "right",
                        }}
                     >
                        <Text
                           style={styles.tableCell}
                        >
                           {(item?.voyagePrice || 0).toLocaleString(undefined, {
                              minimumFractionDigits: 2,
                           })}
                        </Text>
                     </View>
                     <View
                        style={{
                           ...styles.tableCol,
                           width: "15%",
                        }}
                     >
                        <Text style={styles.tableCell}>
                           {item?.paymentType}
                        </Text>
                     </View>
                     <View
                        style={{
                           ...styles.tableCol,
                           width: "32%",
                        }}
                     >
                        <Text style={styles.tableCell}>
                           {addressType || addAddressType ? addressVal : "-"}
                        </Text>
                     </View>
                  </View>
               )
            })}
      </View>
   )
}

function RenderTitle({ voyage }) {
   return (
      <>
         <View style={styles.headerTitle}>
            <Text>บริษัท ดีทูยู ชิปปิ้ง จำกัด</Text>
         </View>
         <View style={styles.headerTitle}>
            <Text>รายงานใบวางบิลประจำรอบเรือ {voyage}</Text>
         </View>
      </>
   )
}

function RenderDocument({ data }) {
   let voyage = ""
   if (data.length > 0) {
      voyage = dayjs(data[0].voyage, "D/M/YYYY").format("DD/MM/YYYY")
   }
   return (
      <Document>
         <Page size="A4" orientation="portrait" style={styles.page}>
            <RenderTitle voyage={voyage} />
            <View style={{ padding: 10 }} />
            <RenderTable data={data} />
         </Page>
      </Document>
   )
}

const ReportInvoice = ({ data }) => {
   useEffect(() => {
      Font.register({
         family: "THSarabun",
         src: "/assets/fonts/THSarabun.ttf",
      })
      Font.register({
         family: "THSarabunBold",
         src: "/assets/fonts/THSarabun Bold.ttf",
      })
   }, [])
   return (
      <PDFViewer width="100%" height="800px">
         <RenderDocument data={data} />
      </PDFViewer>
   )
}

export default ReportInvoice
