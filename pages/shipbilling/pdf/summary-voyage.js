import {
   Page,
   Text,
   View,
   Document,
   StyleSheet,
   PDFViewer,
} from "@react-pdf/renderer"

const styles = StyleSheet.create({
   page: {
      flexDirection: "row",
      backgroundColor: "#ffffff",
      minWidth: 500,
   },
   section: {
      margin: 10,
      padding: 10,
      flexGrow: 1,
   },
})

function SummaryVoyagePdf() {
   return (
      <PDFViewer width="100%">
         <Document>
            <Page size="A4">
               <View></View>
               <View>
                  <Text>Section #2</Text>
               </View>
            </Page>
         </Document>
      </PDFViewer>
   )
}

export default SummaryVoyagePdf
