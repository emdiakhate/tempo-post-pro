import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import PostDetailPage from "./pages/PostDetailPage";
import Analytics from "./pages/Analytics";
import QueuePage from "./pages/QueuePage";
import ArchivesPage from "./pages/ArchivesPage";
import CompetitiveIntelligence from "./pages/CompetitiveIntelligence";
import HashtagTracker from "./pages/HashtagTracker";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Routes avec Layout (sidebar permanente) */}
          <Route path="/" element={<Layout><Index /></Layout>} />
          <Route path="/calendar" element={<Layout><Index /></Layout>} />
          <Route path="/analytics" element={<Layout><Analytics /></Layout>} />
          <Route path="/hashtags" element={<Layout><HashtagTracker /></Layout>} />
          <Route path="/queue" element={<Layout><QueuePage /></Layout>} />
          <Route path="/archives" element={<Layout><ArchivesPage /></Layout>} />
          <Route path="/competitors" element={<Layout><CompetitiveIntelligence /></Layout>} />
          
          {/* Route de détail d'un post - avec Layout */}
          <Route path="/post/:id" element={<Layout><PostDetailPage /></Layout>} />
          
          {/* Route 404 - SANS Layout (page d'erreur) */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
