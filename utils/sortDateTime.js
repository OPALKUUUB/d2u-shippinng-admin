function sortDateTime(datetime_a_in, datetime_b_in) {
   let datetime_a = datetime_a_in
   let datetime_b = datetime_b_in
   if (!datetime_a.includes(" ")) {
      datetime_a += " 00:00:00"
   }
   if (!datetime_b.includes(" ")) {
      datetime_b += " 00:00:00"
   }
   const date_a = datetime_a.split(" ")[0]
   const time_a = datetime_a.split(" ")[1]
   const date_a_f = date_a.split("/")
   const time_a_f = time_a.split(":")
   // [y,m,d,h,m,s]
   const datetime_a_f = [
      parseInt(date_a_f[2], 10),
      parseInt(date_a_f[1], 10),
      parseInt(date_a_f[0], 10),
      parseInt(time_a_f[0], 10),
      parseInt(time_a_f[1], 10),
      parseInt(time_a_f[2], 10),
   ]
   const date_b = datetime_b.split(" ")[0]
   const time_b = datetime_b.split(" ")[1]
   const date_b_f = date_b.split("/")
   const time_b_f = time_b.split(":")
   const datetime_b_f = [
      parseInt(date_b_f[2], 10),
      parseInt(date_b_f[1], 10),
      parseInt(date_b_f[0], 10),
      parseInt(time_b_f[0], 10),
      parseInt(time_b_f[1], 10),
      parseInt(time_b_f[2], 10),
   ]
   for (let i = 0; i < 6; i++) {
      if (datetime_a_f[i] - datetime_b_f[i] !== 0) {
         return datetime_b_f[i] - datetime_a_f[i]
      }
   }
   return 0
}
export default sortDateTime
