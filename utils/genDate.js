const genDate = () => {
  return new Date().toLocaleString("th-Th", { timeZone: "Asia/Bangkok" });
};

export default genDate;
