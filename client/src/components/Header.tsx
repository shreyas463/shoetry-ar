import { FC } from "react";
import { HelpCircle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  title?: string;
  onShowHelp?: () => void;
}

const Header: FC<HeaderProps> = ({ title = "ShoeAR", onShowHelp }) => {
  return (
    <header className="flex justify-between items-center px-5 py-4 bg-[#1A2640]/80 backdrop-blur-md z-20 relative border-b border-[#3B5BA5]/20">
      <div className="flex items-center">
        <div className="bg-gradient-to-r from-[#3B5BA5] to-[#E87A5D] rounded-full p-2 mr-2 shadow-md">
          <Sparkles className="h-5 w-5 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#E87A5D] to-[#F3B941]">
            {title}
          </h1>
          <p className="text-xs text-[#E87A5D]/80">Virtual Try-On</p>
        </div>
      </div>
      {onShowHelp && (
        <div>
          <Button 
            variant="outline" 
            size="icon" 
            className="rounded-full border border-[#3B5BA5]/30 shadow-sm bg-[#1A3056]/70 hover:bg-[#3B5BA5]/30" 
            onClick={onShowHelp}
          >
            <HelpCircle className="h-5 w-5 text-[#F3B941]" />
          </Button>
        </div>
      )}
    </header>
  );
};

export default Header;
