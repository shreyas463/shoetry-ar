import { Switch, Route, useLocation, Link } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Explore from "@/pages/Explore";
import Favorites from "@/pages/Favorites";
import Profile from "@/pages/Profile";
import TabBar from "@/components/TabBar";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/explore" component={Explore} />
      <Route path="/favorites" component={Favorites} />
      <Route path="/profile" component={Profile} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [location] = useLocation();

  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex flex-col h-screen w-full bg-neutral-light text-neutral-dark overflow-hidden">
        <Router />
        {(location === "/" || location === "/explore" || location === "/favorites" || location === "/profile") && (
          <TabBar />
        )}
        <Toaster />
      </div>
    </QueryClientProvider>
  );
}

export default App;
