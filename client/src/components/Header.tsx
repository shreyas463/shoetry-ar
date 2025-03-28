import { FC } from "react";
import { HelpCircle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  title?: string;
  onShowHelp?: () => void;
}

const Header: FC<HeaderProps> = ({ title = "ShoeAR", onShowHelp }) => {
  return (
    <header className="flex justify-between items-center px-5 py-4 bg-white/80 backdrop-blur-md z-20 relative">
      <div className="flex items-center">
        <div className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full p-2 mr-2 shadow-md">
          <Sparkles className="h-5 w-5 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">
            {title}
          </h1>
          <p className="text-xs text-gray-500">Virtual Try-On</p>
        </div>
      </div>
      {onShowHelp && (
        <div>
          <Button 
            variant="outline" 
            size="icon" 
            className="rounded-full border border-purple-200 shadow-sm bg-white hover:bg-purple-50" 
            onClick={onShowHelp}
          >
            <HelpCircle className="h-5 w-5 text-purple-700" />
          </Button>
        </div>
      )}
    </header>
  );
};

export default Header;
