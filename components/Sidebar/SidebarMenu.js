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
         { id: 1, name: "Add Auction", to: "/yahoo/add" },
         { id: 2, name: "Bidding", to: "/yahoo/bidding" },
         { id: 3, name: "Payment", to: "/yahoo/payment" },
         { id: 4, name: "History", to: "/yahoo/history" },
      ],
   },
   {
      id: 3,
      name: "Tracking",
      icon: <TrackingPackageIcon />,
      childs: [
         { id: 1, name: "All Tracking", to: "/tracking" },
         { id: 2, name: "Shimizu", to: "/tracking/shimizu" },
         { id: 3, name: "Mercari", to: "/tracking/mercari" },
         { id: 4, name: "Web123", to: "/tracking/web123" },
         { id: 5, name: "Yahoo", to: "/tracking/yahoo" },
         { id: 6, name: "Mart", to: "/tracking/mart" },
      ],
   },
   {
      id: 4,
      name: "Mart",
      icon: <StoreIcon />,
      childs: [
         { id: 1, name: "Order", to: "/" },
         { id: 2, name: "Buy List", to: "/" },
         { id: 3, name: "Promotion", to: "/" },
         { id: 4, name: "Gachapong", to: "/" },
         { id: 5, name: "7-Eleven", to: "/" },
         { id: 6, name: "Donki", to: "/" },
         { id: 7, name: "Disney", to: "/" },
         { id: 8, name: "Disnayland", to: "/mart/disneyland" },
      ],
   },
   { id: 5, name: "Ship Billing", icon: <BillingIcon />, to: "/shipbilling" },
]

export default sidebarMenuData
