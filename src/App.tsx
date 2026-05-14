import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { StoryProvider } from "@/context/StoryContext";
import Header from "@/sections/Header";
import Footer from "@/sections/Footer";
import Home from "@/pages/Home";
import ShareStory from "@/pages/ShareStory";
import StoriesFeed from "@/pages/StoriesFeed";

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.25 }}
      >
        <Routes location={location}>
          <Route path="/" element={<Home />} />
          <Route path="/share" element={<ShareStory />} />
          <Route path="/stories" element={<StoriesFeed />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <StoryProvider>
      <div className="min-h-screen flex flex-col bg-white dark:bg-black text-black dark:text-white transition-colors">
        <Header />
        <main className="flex-1">
          <AnimatedRoutes />
        </main>
        <Footer />
      </div>
    </StoryProvider>
  );
}
