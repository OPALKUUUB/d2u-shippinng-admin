// format d/m/yyyy
function sortDate(date_a, date_b) {
   const datetime_a = date_a
   const date_a_f = datetime_a.split("/")
   // [y,m,d,h,m,s]
   const datetime_a_f = [
      parseInt(date_a_f[2], 10),
      parseInt(date_a_f[1], 10),
      parseInt(date_a_f[0], 10),
   ]
   const datetime_b = date_b
   const date_b_f = datetime_b.split("/")
   const datetime_b_f = [
      parseInt(date_b_f[2], 10),
      parseInt(date_b_f[1], 10),
      parseInt(date_b_f[0], 10),
   ]
   for (let i = 0; i < 3; i++) {
      if (datetime_a_f[i] - datetime_b_f[i] !== 0) {
         return datetime_b_f[i] - datetime_a_f[i]
      }
   }
   return 0
}

export default sortDate
