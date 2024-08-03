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
      flexDirection: "row",
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
      borderWidth: borderWidth,
      borderColor: borderColor,
      padding: "4px 5px",
   },
   tableCol: {
      borderStyle: "solid",
      borderWidth: borderWidth,
      borderColor: borderColor,
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

function RenderTable({ data, summary, title }) {
   return (
      <View style={styles.table}>
         <View style={styles.tableRow}>
            <View style={{ ...styles.tableColHeader, width: "100%" }}>
               <Text style={{ ...styles.tableCellHeader, textAlign: "center" }}>
                  {title}
               </Text>
            </View>
         </View>
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
               <Text style={styles.tableCellHeader}>ช่องทาง</Text>
            </View>
            <View style={{ ...styles.tableColHeader, width: "32%" }}>
               <Text style={styles.tableCellHeader}>Track No.</Text>
            </View>
            <View
               style={{
                  ...styles.tableColHeader,
                  width: "15%",
                  textAlign: "center",
               }}
            >
               <Text style={styles.tableCellHeader}>Box No.</Text>
            </View>
            <View
               style={{
                  ...styles.tableColHeader,
                  width: "15%",
                  textAlign: "right",
               }}
            >
               <Text style={styles.tableCellHeader}>น้ำหนัก</Text>
            </View>
            <View
               style={{
                  ...styles.tableColHeader,
                  width: "15%",
                  textAlign: "right",
               }}
            >
               <Text style={styles.tableCellHeader}>COD(¥)</Text>
            </View>
         </View>
         {data &&
            Array.isArray(data) &&
            data.length >= 0 &&
            data.map((item, index) => {
               return (
                  <View style={styles.tableRow}>
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
                        <Text style={styles.tableCell}>
                           {item?.channel === "123" ? "web123" : item?.channel}
                        </Text>
                     </View>
                     <View style={{ ...styles.tableCol, width: "32%" }}>
                        <Text style={styles.tableCell}>{item?.track_no}</Text>
                     </View>
                     <View
                        style={{
                           ...styles.tableCol,
                           width: "15%",
                           textAlign: "center",
                        }}
                     >
                        <Text style={styles.tableCell}>{item?.box_no}</Text>
                     </View>
                     <View
                        style={{
                           ...styles.tableCol,
                           width: "15%",
                           textAlign: "right",
                        }}
                     >
                        <Text style={styles.tableCell}>
                           {(item?.weight || 0).toLocaleString(undefined, {
                              minimumFractionDigits: 2,
                           })}
                        </Text>
                     </View>
                     <View
                        style={{
                           ...styles.tableCol,
                           width: "15%",
                           textAlign: "right",
                        }}
                     >
                        <Text style={styles.tableCell}>
                           {(item?.cod || 0).toLocaleString(undefined, {
                              minimumFractionDigits: 2,
                           })}
                        </Text>
                     </View>
                  </View>
               )
            })}
         {summary &&
            Array.isArray(summary) &&
            summary.length >= 0 &&
            summary
               .filter((item) => item.value !== 0)
               .map((item) => {
                  return (
                     <View style={styles.tableRow}>
                        <View
                           style={{
                              ...styles.tableCol,
                              width: "70%",
                              textAlign: "right",
                           }}
                        >
                           <Text style={styles.tableCellHeader}>
                              {item?.label} :
                           </Text>
                        </View>
                        <View
                           style={{
                              ...styles.tableCol,
                              width: "15%",
                              textAlign: "right",
                           }}
                        >
                           <Text style={styles.tableCell}>
                              {(item?.value).toLocaleString(undefined, {
                                 minimumFractionDigits: 2,
                              })}
                           </Text>
                        </View>
                     </View>
                  )
               })}
      </View>
   )
}

function RenderSignSection() {
   return (
      <View style={styles.sectionFooter}>
         <Text style={styles.cellDot}>สำหรับลูกค้า</Text>
         <Text style={styles.cellDot}>สำหรับพนักงาน</Text>
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
            <Text>ใบวางบิลประจำรอบเรือ {voyage}</Text>
         </View>
      </>
   )
}

function RenderDocument({ data, summary, voyage, user }) {
   const voyageFormat = dayjs(voyage, "D/M/YYYY").format("DD/MM/YYYY")
   const title = `${user.username} รอบเรือ ${voyageFormat}`
   return (
      <Document title={title}>
         <Page size="A4" orientation="landscape" style={styles.page}>
            <View
               style={{ ...styles.section, borderRight: "0.1px solid black" }}
            >
               <View style={styles.header1}>
                  <Text>ลูกค้า</Text>
               </View>
               <RenderTitle voyage={voyageFormat} />
               <View style={{ padding: 10 }} />
               <RenderTable data={data} summary={summary} title={title} />
               <View style={{ padding: 20 }} />
               <RenderSignSection />
            </View>
            <View style={styles.section}>
               <View style={styles.header1}>
                  <Text>พนักงาน</Text>
               </View>
               <RenderTitle voyage={voyageFormat} />
               <View style={{ padding: 10 }} />
               <RenderTable data={data} summary={summary} title={title} />
               <View style={{ padding: 20 }} />
               <RenderSignSection />
            </View>
         </Page>
      </Document>
   )
}

const ReportShipBillingInvoice = ({ data, summary, title, voyage, user }) => {
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
         <RenderDocument
            data={data}
            summary={summary}
            title={title}
            voyage={voyage}
            user={user}
         />
      </PDFViewer>
   )
}

export default ReportShipBillingInvoice
