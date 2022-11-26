import BillingIcon from "../icon/BillingIcon"
import DashboardIcon from "../icon/DashboardIcon"
import StoreIcon from "../icon/StoreIcon"
import TrackingPackageIcon from "../icon/TrackingPackageIcon"
import YahooIcon from "../icon/YahooIcon"

// eslint-disable-next-line import/prefer-default-export
const sidebarMenuData = [
   { id: 1, name: "Dashboard", icon: <DashboardIcon />, to: "/" },
   {
      id: 2,
      name: "Auction Yahoo",
      icon: <YahooIcon />,
      childs: [
         { id: 1, name: "Add Auction", to: "/yahoo-auction/add-auction" },
         { id: 2, name: "Bidding",to: "/" },
         { id: 3, name: "Payment",to: "/" },
         { id: 4, name: "History",to: "/" },
      ],
   },
   {
      id: 3,
      name: "Tracking",
      icon: <TrackingPackageIcon />,
      childs: [
         { id: 1, name: "All Tracking",to: "/" },
         { id: 2, name: "Shimizu",to: "/" },
         { id: 3, name: "Mercari",to: "/" },
         { id: 4, name: "Web123",to: "/" },
         { id: 5, name: "Yahoo",to: "/" },
         { id: 6, name: "Mart",to: "/" },
      ],
   },
   {
      id: 4,
      name: "Mart",
      icon: <StoreIcon />,
      childs: [
         { id: 1, name: "Order",to: "/" },
         { id: 2, name: "Buy List",to: "/" },
         { id: 3, name: "Promotion",to: "/" },
         { id: 4, name: "Gachapong",to: "/" },
         { id: 5, name: "7-Eleven",to: "/" },
         { id: 6, name: "Donki",to: "/" },
         { id: 7, name: "Disney",to: "/" },
         { id: 8, name: "Disnayland",to: "/" },
      ],
   },
   { id: 5, name: "Ship Billing", icon: <BillingIcon /> ,to: "/"},
]

export default sidebarMenuData
