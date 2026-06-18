import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Layout } from "@/components/layout";
import { LanguageProvider } from "@/i18n/LanguageContext";

import Home from "@/pages/home";
import Rooms from "@/pages/rooms";
import RoomDetail from "@/pages/room-detail";
import Experiences from "@/pages/experiences";
import Restaurants from "@/pages/restaurants";
import Gallery from "@/pages/gallery";
import About from "@/pages/about";
import Contact from "@/pages/contact";
import Book from "@/pages/book";
import Admin from "@/pages/admin";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient();

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/rooms" component={Rooms} />
        <Route path="/rooms/:id" component={RoomDetail} />
        <Route path="/experiences" component={Experiences} />
        <Route path="/restaurants" component={Restaurants} />
        <Route path="/gallery" component={Gallery} />
        <Route path="/about" component={About} />
        <Route path="/contact" component={Contact} />
        <Route path="/book" component={Book} />
        <Route path="/admin" component={Admin} />
        <Route path="/admin/:tab" component={Admin} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <LanguageProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <Router />
          </WouterRouter>
          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
    </LanguageProvider>
  );
}

export default App;
