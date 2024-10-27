const mapShipBillingStatusToDescription = (status) => {
   const statusMap = {
      D: "Draft",
      K: "Keep",
      KRD: "Keep Recovery Draft",
      SA: "Selected Address",
      WT: "Waiting Tracking",
      WS: "Waiting Slip",
      WCS: "Waiting Confirm Slip",
      F: "Finished",
   }
   return statusMap[status] || status // Return the description or the original status if not found
}

const Helper = {
    mapShipBillingStatusToDescription
}

export default Helper