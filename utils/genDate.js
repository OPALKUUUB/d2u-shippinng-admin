const genDate = (d=null) => {
   let date = ''
   if(d===null) {
      date = new Date().toLocaleString("th-Th", { timeZone: "Asia/Bangkok" })
   }else {
      date = new Date(d).toLocaleString("th-Th", { timeZone: "Asia/Bangkok" })
   }
   
   const date_year = parseInt(date.split(" ")[0].split("/")[2], 10) - 543
   return `${date.split(" ")[0].split("/")[0]}/${
      date.split(" ")[0].split("/")[1]
   }/${date_year} ${date.split(" ")[1].split(":")[0]}:${
      date.split(" ")[1].split(":")[1]
   }:${date.split(" ")[1].split(":")[2]}`
}

export default genDate
