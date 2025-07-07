import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { HelpCircle, MessageCircle, Phone, Mail, FileText, ExternalLink, PhoneCall } from "lucide-react"

export function SupportHelpTab() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
           Need assistance? We're here to help.
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="  space-y-6">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <MessageCircle className="w-5 h-5 text-blue-500" />
                <div className="space-y-1">
                  <p className="text-sm font-medium">Chat with Us (Recommended)</p>
                  <p className="text-sm text-gray-500">Start a WhatsApp chat with a support agent.</p>
                </div>
              </div>
              <Button variant="outline" size="sm">
                Start Chat
              </Button>
            </div>

          

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-purple-500" />
                <div  className="space-y-1">
                  <p className="text-sm font-medium">Email Support</p>
                  <p className="text-sm text-gray-500">Reach us at: support@simkash.ng</p>
                </div>
              </div>
              <Button variant="outline" size="sm">
                Send Email
              </Button>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <PhoneCall className="w-5 h-5 text-orange-500" />
                <div >
                  <p className="text-sm font-medium">Call Center</p>
                  <p className="text-sm text-gray-500">Available 9am–5pm (Mon–Fri) - +234 800 123 4567</p>
                </div>
              </div>
              <Button variant="outline" size="sm" className="bg-l[#132939]">
               
                Call
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

     
    </div>
  )
}
