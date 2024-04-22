export function isEmpty(value) {
   return (
      value == null || (typeof value === "string" && value.trim().length === 0)
   )
}

export const renderUnitFromChannel = (channel) => {
   if (!channel) return "-"
   return ["mercari", "123", "fril"].some((channelItem) =>
      channelItem.includes(channel)
   )
      ? "เยน"
      : "บาท"
}
