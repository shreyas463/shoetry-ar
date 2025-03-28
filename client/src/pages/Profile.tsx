import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { 
  User, 
  Settings, 
  HelpCircle, 
  ShoppingBag, 
  Heart, 
  LogOut, 
  ChevronRight 
} from "lucide-react";
import { Link } from "wouter";

export default function Profile() {
  return (
    <div className="flex flex-col h-full pb-16">
      <Header title="Profile" />
      
      <div className="flex-1 overflow-y-auto p-4">
        <div className="text-center mb-6">
          <div className="bg-primary/10 w-24 h-24 rounded-full mx-auto mb-4 flex items-center justify-center">
            <User className="h-10 w-10 text-primary" />
          </div>
          <h1 className="text-xl font-semibold">Demo User</h1>
          <p className="text-gray-500">demo@example.com</p>
        </div>
        
        <Card className="mb-6">
          <CardContent className="p-4">
            <h2 className="text-lg font-medium mb-3">Account</h2>
            
            <div className="space-y-3">
              <Button variant="ghost" className="w-full justify-between font-normal py-5">
                <div className="flex items-center">
                  <Settings className="h-5 w-5 mr-3 text-gray-500" />
                  <span>Settings</span>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </Button>
              
              <Separator />
              
              <Link href="/favorites">
                <Button variant="ghost" className="w-full justify-between font-normal py-5">
                  <div className="flex items-center">
                    <Heart className="h-5 w-5 mr-3 text-gray-500" />
                    <span>Favorites</span>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </Button>
              </Link>
              
              <Separator />
              
              <Button variant="ghost" className="w-full justify-between font-normal py-5">
                <div className="flex items-center">
                  <ShoppingBag className="h-5 w-5 mr-3 text-gray-500" />
                  <span>Order History</span>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card className="mb-6">
          <CardContent className="p-4">
            <h2 className="text-lg font-medium mb-3">Support</h2>
            
            <div className="space-y-3">
              <Button 
                variant="ghost" 
                className="w-full justify-between font-normal py-5"
                onClick={() => window.location.href = "mailto:support@shoear.example.com"}
              >
                <div className="flex items-center">
                  <HelpCircle className="h-5 w-5 mr-3 text-gray-500" />
                  <span>Help & Support</span>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <div className="text-center">
          <Button 
            variant="outline" 
            className="text-gray-600 border-gray-300"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  );
}
