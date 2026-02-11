import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { ResumeProvider } from "./contexts/ResumeContext";
import Home from "./pages/Home";
import Editor from "./pages/Editor";

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/editor"} component={Editor} />
      <Route path={"/404"} component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <ResumeProvider>
          <TooltipProvider>
            <Toaster
              toastOptions={{
                style: {
                  background: 'oklch(0.20 0.005 285)',
                  border: '1px solid oklch(0.30 0.005 285)',
                  color: 'oklch(0.93 0.01 80)',
                },
              }}
            />
            <Router />
          </TooltipProvider>
        </ResumeProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
