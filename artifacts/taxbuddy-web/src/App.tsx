import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import { Layout } from "@/components/layout/Layout";
import Dashboard from "@/pages/dashboard";
import Einnahmen from "@/pages/einnahmen";
import Ausgaben from "@/pages/ausgaben";
import Buchungen from "@/pages/buchungen";
import Fahrtenbuch from "@/pages/fahrtenbuch";
import Dokumente from "@/pages/dokumente";
import SteuerCheck from "@/pages/steuer-check";
import Tipps from "@/pages/tipps";
import KiAssistent from "@/pages/ki-assistent";
import Profil from "@/pages/profil";

const queryClient = new QueryClient();

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/"               component={Dashboard} />
        <Route path="/einnahmen"      component={Einnahmen} />
        <Route path="/ausgaben"       component={Ausgaben} />
        <Route path="/buchungen"      component={Buchungen} />
        <Route path="/fahrtenbuch"    component={Fahrtenbuch} />
        <Route path="/dokumente"      component={Dokumente} />
        <Route path="/steuer-check"   component={SteuerCheck} />
        <Route path="/tipps"          component={Tipps} />
        <Route path="/ki-assistent"   component={KiAssistent} />
        <Route path="/profil"         component={Profil} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base="/web">
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
