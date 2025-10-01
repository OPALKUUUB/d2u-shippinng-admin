/* eslint-disable import/no-extraneous-dependencies */
import React, { useState } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { message, Select } from "antd"
import axios from "axios"
import { getSession } from "next-auth/react"
import { useRouter } from "next/router"
import { Search, DollarSign, User, MessageSquare, FileText } from "lucide-react"

import Layout from "../../../components/layout/layout"
import CardHead from "../../../components/CardHead"
import {
   Card,
   CardHeader,
   CardTitle,
   CardDescription,
   CardContent,
} from "../../../components/ui/card"
import {
   FormField,
   FormLabel,
   FormInput,
   FormTextarea,
   FormError,
   FormButton,
} from "../../../components/ui/form"
import AuctionPreview from "../../../components/ui/auction-preview"
import useCustomers from "../../../hooks/useCustomers"
import { auctionFormSchema } from "../../../schemas/auctionSchema"

function YahooAddPage() {
   const router = useRouter()
   const [auctionData, setAuctionData] = useState(null)
   const [isSearching, setIsSearching] = useState(false)
   const [isSubmitting, setIsSubmitting] = useState(false)
   const { customers, isLoading: customersLoading } = useCustomers()

   const {
      control,
      handleSubmit,
      watch,
      formState: { errors },
   } = useForm({
      resolver: zodResolver(auctionFormSchema),
      defaultValues: {
         customerId: "",
         auctionLink: "",
         maxBid: "",
         customerNote: "",
         adminNote: "",
      },
   })

   const auctionLink = watch("auctionLink")
   const maxBid = watch("maxBid")

   const searchAuction = async () => {
      if (!auctionLink) {
         message.warning("กรุณาใส่ลิงค์ประมูล")
         return
      }

      // Basic URL validation
      if (
         !auctionLink.includes("auctions.yahoo.co.jp/jp/auction/") &&
         !auctionLink.includes("page.auctions.yahoo.co.jp/jp/auction/")
      ) {
         message.error("Link ไม่ถูกต้อง กรุณาใส่ link ประมูล Yahoo")
         return
      }

      setIsSearching(true)

      try {
         const response = await fetch("/api/yahoo/search", {
            method: "POST",
            headers: {
               "Content-type": "application/json",
            },
            body: JSON.stringify({ link: auctionLink }),
         })

         if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
         }

         const responseJson = await response.json()

         if (responseJson.status === 200 && responseJson.data) {
            const { data } = responseJson
            const processedData = {
               title: data.title,
               detail: data.detail || data.title,
               images: data.image || [],
               price: parseInt(
                  (data.price || "0").toString().replace(/[^\d]/g, ""),
                  10
               ),
            }

            setAuctionData(processedData)
            message.success("ค้นหาข้อมูลสำเร็จ!")
         } else {
            throw new Error(responseJson.message || "ไม่พบข้อมูลประมูล")
         }
      } catch (err) {
         console.error("Search error:", err)
         message.error(`เกิดข้อผิดพลาดในการค้นหา: ${err.message}`)
      } finally {
         setIsSearching(false)
      }
   }

   const onSubmit = async (formData) => {
      if (!auctionData) {
         message.warning("กรุณาค้นหาข้อมูลประมูลก่อน")
         return
      }

      if (formData.maxBid < auctionData.price) {
         message.warning(
            `ราคาประมูลต้องไม่ต่ำกว่า ${auctionData.price.toLocaleString()} เยน`
         )
         return
      }

      const selectedCustomer = customers.find(
         (customer) => customer.value === formData.customerId
      )
      if (!selectedCustomer) {
         message.warning("กรุณาเลือกผู้ประมูล")
         return
      }

      setIsSubmitting(true)

      const body = {
         user_id: selectedCustomer.id,
         image: auctionData.images?.[0] || "",
         link: formData.auctionLink,
         name: auctionData.title,
         price: auctionData.price,
         detail:
            typeof auctionData.detail === "string"
               ? auctionData.detail
               : JSON.stringify(auctionData.detail),
         maxbid: parseInt(formData.maxBid, 10),
         remark_user: formData.customerNote || "",
         remark_admin: formData.adminNote || "",
      }

      try {
         await axios.post("/api/yahoo/order", body)
         message.success("เพิ่มข้อมูลการประมูลสำเร็จ!")

         setTimeout(() => {
            router.replace("/yahoo/bidding")
         }, 1000)
      } catch (err) {
         console.error("Submit error:", err)
         const errorMessage =
            err.response?.data?.message || "เพิ่มข้อมูลล้มเหลว!"
         message.error(errorMessage)
      } finally {
         setIsSubmitting(false)
      }
   }
   return (
      <>
         <CardHead
            name="เพิ่มคำสั่งประมูล Yahoo"
            description="เพิ่มข้อมูลการประมูลสินค้าจาก Yahoo Auction สำหรับลูกค้า"
         />

         <div className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto px-4 max-w-4xl">
               <Card className="shadow-lg">
                  <CardHeader className="text-center">
                     <CardTitle className="flex items-center justify-center gap-3">
                        <Search className="h-6 w-6 text-gray-600" />
                        เพิ่มคำสั่งประมูล Yahoo
                     </CardTitle>
                     <CardDescription>
                        ค้นหาและเพิ่มข้อมูลการประมูลสินค้าจาก Yahoo Auction
                     </CardDescription>
                  </CardHeader>

                  <CardContent>
                     <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="space-y-8"
                     >
                        {/* Customer Selection */}
                        <FormField>
                           <FormLabel
                              required
                              className="flex items-center gap-2"
                           >
                              <User className="h-4 w-4 text-gray-600" />
                              เลือกผู้ประมูล
                           </FormLabel>
                           <Controller
                              name="customerId"
                              control={control}
                              render={({ field }) => (
                                 <Select
                                    {...field}
                                    showSearch
                                    size="large"
                                    placeholder="เลือกลูกค้าที่จะประมูลให้"
                                    optionFilterProp="children"
                                    loading={customersLoading}
                                    filterOption={(input, option) =>
                                       (option?.label ?? "")
                                          .toLowerCase()
                                          .includes(input.toLowerCase())
                                    }
                                    filterSort={(optionA, optionB) =>
                                       (optionA?.label ?? "")
                                          .toLowerCase()
                                          .localeCompare(
                                             (
                                                optionB?.label ?? ""
                                             ).toLowerCase()
                                          )
                                    }
                                    options={customers}
                                    className="w-full"
                                    status={errors.customerId ? "error" : ""}
                                 />
                              )}
                           />
                           <FormError>{errors.customerId?.message}</FormError>
                        </FormField>

                        {/* Auction Link Search */}
                        <FormField>
                           <FormLabel
                              required
                              className="flex items-center gap-2"
                           >
                              <Search className="h-4 w-4 text-gray-600" />
                              ลิงค์ประมูล Yahoo
                           </FormLabel>
                           <div className="space-y-3">
                              <Controller
                                 name="auctionLink"
                                 control={control}
                                 render={({ field }) => (
                                    <FormInput
                                       {...field}
                                       placeholder="https://auctions.yahoo.co.jp/jp/auction/..."
                                       error={errors.auctionLink}
                                    />
                                 )}
                              />
                              <FormButton
                                 type="button"
                                 onClick={searchAuction}
                                 loading={isSearching}
                                 variant="outline"
                                 className="w-full"
                                 disabled={!auctionLink}
                              >
                                 <Search className="h-4 w-4 mr-2" />
                                 {isSearching
                                    ? "กำลังค้นหา..."
                                    : "ค้นหาข้อมูลประมูล"}
                              </FormButton>
                           </div>
                           <FormError>{errors.auctionLink?.message}</FormError>
                        </FormField>

                        {/* Auction Preview */}
                        {auctionData && (
                           <AuctionPreview auctionData={auctionData} />
                        )}

                        {/* Max Bid */}
                        {auctionData && (
                           <FormField>
                              <FormLabel
                                 required
                                 className="flex items-center gap-2"
                              >
                                 <DollarSign className="h-4 w-4 text-gray-600" />
                                 ราคาสูงสุดที่จะประมูล (เยน)
                              </FormLabel>
                              <Controller
                                 name="maxBid"
                                 control={control}
                                 render={({ field }) => (
                                    <FormInput
                                       {...field}
                                       type="number"
                                       placeholder={`ขั้นต่ำ ${auctionData.price?.toLocaleString()} เยน`}
                                       min={auctionData.price || 0}
                                       error={errors.maxBid}
                                       onChange={(e) =>
                                          field.onChange(
                                             parseInt(e.target.value, 10) || ""
                                          )
                                       }
                                    />
                                 )}
                              />
                              {maxBid && auctionData.price && (
                                 <div
                                    className={`text-sm mt-1 ${
                                       maxBid >= auctionData.price
                                          ? "text-green-600"
                                          : "text-red-600"
                                    }`}
                                 >
                                    {maxBid >= auctionData.price
                                       ? `✓ ราคาเหมาะสม (มากกว่าราคาปัจจุบัน ${(
                                            maxBid - auctionData.price
                                         ).toLocaleString()} เยน)`
                                       : `⚠️ ราคาต่ำกว่าขั้นต่ำ ${(
                                            auctionData.price - maxBid
                                         ).toLocaleString()} เยน`}
                                 </div>
                              )}
                              <FormError>{errors.maxBid?.message}</FormError>
                           </FormField>
                        )}

                        {/* Customer Note */}
                        <FormField>
                           <FormLabel className="flex items-center gap-2">
                              <MessageSquare className="h-4 w-4 text-gray-600" />
                              หมายเหตุจากลูกค้า
                           </FormLabel>
                           <Controller
                              name="customerNote"
                              control={control}
                              render={({ field }) => (
                                 <FormTextarea
                                    {...field}
                                    placeholder="คำขอพิเศษ หรือ หมายเหตุจากลูกค้า (ถ้ามี)"
                                    error={errors.customerNote}
                                 />
                              )}
                           />
                           <FormError>{errors.customerNote?.message}</FormError>
                        </FormField>

                        {/* Admin Note */}
                        <FormField>
                           <FormLabel className="flex items-center gap-2">
                              <FileText className="h-4 w-4 text-gray-600" />
                              หมายเหตุภายใน (Admin)
                           </FormLabel>
                           <Controller
                              name="adminNote"
                              control={control}
                              render={({ field }) => (
                                 <FormTextarea
                                    {...field}
                                    placeholder="หมายเหตุภายในสำหรับ admin (ไม่แสดงให้ลูกค้า)"
                                    error={errors.adminNote}
                                 />
                              )}
                           />
                           <FormError>{errors.adminNote?.message}</FormError>
                        </FormField>

                        {/* Submit Button */}
                        <FormButton
                           type="submit"
                           variant="primary"
                           size="lg"
                           loading={isSubmitting}
                           disabled={!auctionData}
                           className="w-full"
                        >
                           {isSubmitting ? "กำลังบันทึก..." : "ยืนยันการประมูล"}
                        </FormButton>
                     </form>
                  </CardContent>
               </Card>
            </div>
         </div>

         <style jsx global>{`
            .ant-select-selector {
               border-radius: 8px !important;
               border: 1px solid #d1d5db !important;
               height: 48px !important;
            }

            .ant-select-focused .ant-select-selector {
               border-color: #111827 !important;
               box-shadow: 0 0 0 2px rgba(17, 24, 39, 0.2) !important;
            }

            .ant-select-status-error .ant-select-selector {
               border-color: #ef4444 !important;
            }
         `}</style>
      </>
   )
}

YahooAddPage.getLayout = function getLayout(page) {
   return <Layout>{page}</Layout>
}

export async function getServerSideProps(context) {
   const session = await getSession({ req: context.req })

   if (!session) {
      return {
         redirect: {
            destination: "/auth/signin",
            permanent: false,
         },
      }
   }

   return {
      props: {
         session,
      },
   }
}

export default YahooAddPage
