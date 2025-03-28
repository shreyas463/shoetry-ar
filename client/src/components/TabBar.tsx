import { useLocation, Link } from "wouter";
import { 
  Home as HomeIcon, 
  Compass, 
  Heart, 
  User 
} from "lucide-react";
import { cn } from "@/lib/utils";

const TabBar = () => {
  const [location] = useLocation();
  
  const tabs = [
    {
      name: "Home",
      path: "/",
      icon: HomeIcon
    },
    {
      name: "Explore",
      path: "/explore",
      icon: Compass
    },
    {
      name: "Favorites",
      path: "/favorites",
      icon: Heart
    },
    {
      name: "Profile",
      path: "/profile",
      icon: User
    }
  ];
  
  return (
    <nav className="bg-white border-t border-gray-200 flex justify-around py-2 px-4 z-20 fixed bottom-0 left-0 right-0">
      {tabs.map((tab) => {
        const isActive = location === tab.path;
        return (
          <Link key={tab.path} href={tab.path}>
            <button className="flex flex-col items-center p-2">
              <tab.icon 
                className={cn(
                  "h-5 w-5", 
                  isActive ? "text-primary" : "text-gray-500"
                )} 
              />
              <span 
                className={cn(
                  "text-xs mt-1", 
                  isActive ? "text-primary" : "text-gray-500"
                )}
              >
                {tab.name}
              </span>
            </button>
          </Link>
        );
      })}
    </nav>
  );
};

export default TabBar;
