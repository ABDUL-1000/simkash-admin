"use client"

import { useState, useEffect } from "react"
import { ArrowLeftRight, Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Skeleton } from "@/components/ui/skeleton"
import { AuthAPI } from "@/lib/API/api"
import Image from "next/image"

interface Notification {
  id: number
  user_id: number
  notification_type: string
  title: string
  message: string
  read: boolean
  createdAt: string
  updatedAt: string
}

interface NotificationResponse {
  notifications: Notification[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

function NotificationItem({ notification }: { notification: Notification }) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) {
      return "Just now"
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`
    } else {
      const diffInDays = Math.floor(diffInHours / 24)
      return `${diffInDays}d ago`
    }
  }

  const getNotificationIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "transaction":
        return <ArrowLeftRight/>
      case "airtime":
           return <Image src="/telephone-outbound.png" alt="logo" width={20} height={30} className="h-5 w-4 rounded-full bg-[#E47716]"/>
      case "data":
           return <Image src="/bignetworksign.png" alt="logo" width={20} height={30} className="h-5 w-4"/>
      case "bill payment":
           return <Image src="/lightning.png" alt="logo" width={20} height={30} className="h-5 w-4"/>
      case "TV Subscription":
           return <Image src="/sim-icon-dark.png" alt="logo" width={20} height={30} className="h-5 w-4"/>
      case "TV Subscription":
           return <Image src="/sim-icon-dark.png" alt="logo" width={20} height={30} className="h-5 w-4"/>
      default:
        return "🔔"
    }
  }

  const getNotificationColor = (type: string) => {
    switch (type.toLowerCase()) {
      case "transaction":
        return ""
      case "airtime":
        return ""
      default:
        return ""
    }
  }

  return (
    <div
      className={`p-2   rounded-lg ${getNotificationColor(notification.notification_type)}`}
    >
      <div className="flex items-start gap-3">
        <div className="text-[12px] text-[#000000]">{getNotificationIcon(notification.notification_type)}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h4 className="text-sm font-semibold text-gray-900 truncate">{notification.title}</h4>
            <div className="flex items-center gap-2">
              {!notification.read && <div className="w-2 h-2"></div>}
              <span className="text-xs text-gray-500">{formatDate(notification.createdAt)}</span>
            </div>
          </div>
          <p className="text-sm text-gray-600 leading-relaxed">{notification.message}</p>
          <div className="mt-2">
            <Badge variant="secondary" className="text-xs">
           
            </Badge>
          </div>
        </div>
      </div>
    </div>
  )
}

function NotificationsSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="p-4 border rounded-lg">
          <div className="flex items-start gap-3">
            <Skeleton className="w-8 h-8 rounded-full" />
            <div className="flex-1 space-y-2">
              <div className="flex justify-between">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-16" />
              </div>
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-3/4" />
              <Skeleton className="h-5 w-16" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export function NotificationsModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isOpen) {
      fetchNotifications()
    }
  }, [isOpen, pagination.page])

  const fetchNotifications = async () => {
    try {
      setLoading(true)
      const response = await AuthAPI.getAllNotifications({
        page: pagination.page,
        limit: pagination.limit,
      })

      if (response.success && response.data) {
        setNotifications(response.data.notifications)
        setPagination(response.data.pagination)
      }
    } catch (error) {
      console.error("Failed to fetch notifications:", error)
    } finally {
      setLoading(false)
    }
  }

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= pagination.totalPages) {
      setPagination((prev) => ({ ...prev, page }))
    }
  }

  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative rounded-full">
          <Bell className="h-5 w-5 text-gray-600" />
          {unreadCount > 0 && (
            <span className=" absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:w-96 p-0">
        <SheetHeader className="p-6 pb-4 border-b">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-lg font-semibold">Notifications</SheetTitle>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <Badge variant="destructive" className="text-xs">
                  {unreadCount} new
                </Badge>
              )}
            </div>
          </div>
        </SheetHeader>

        <ScrollArea className="flex-1 h-[calc(100vh-140px)]">
          <div className="p-6">
            {loading ? (
              <NotificationsSkeleton />
            ) : notifications.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-4">🔔</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications yet</h3>
                <p className="text-sm text-gray-500">We'll notify you when something important happens.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {notifications.map((notification) => (
                  <NotificationItem key={notification.id} notification={notification} />
                ))}
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Pagination */}
        {!loading && notifications.length > 0 && pagination.totalPages > 1 && (
          <div className="border-t p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm text-gray-500">
                Page {pagination.page} of {pagination.totalPages}
              </div>
              <div className="text-xs text-gray-400">{pagination.total} total notifications</div>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
                className="text-sm rounded-full"
              >
                Previous
              </Button>
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(3, pagination.totalPages) }, (_, i) => {
                  let pageNum
                  if (pagination.totalPages <= 3) {
                    pageNum = i + 1
                  } else if (pagination.page <= 2) {
                    pageNum = i + 1
                  } else if (pagination.page >= pagination.totalPages - 1) {
                    pageNum = pagination.totalPages - 2 + i
                  } else {
                    pageNum = pagination.page - 1 + i
                  }
                  return (
                    <Button
                      key={pageNum}
                      variant={pagination.page === pageNum ? "default" : "outline"}
                      className={`w-8 h-8 p-0 text-sm rounded-full ${pagination.page === pageNum ? "bg-primary text-white" : "bg-white"}`}
                      onClick={() => handlePageChange(pageNum)}
                    >
                      {pageNum}
                    </Button>
                  )
                })}
              </div>
              <Button
                variant="default"
                size="sm"
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.totalPages}
                className="text-sm rounded-full bg-[#111827]"
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
