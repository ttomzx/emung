import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import FamilyTree from "./pages/FamilyTree";
import Members from "./pages/Members";
import MemberProfile from "./pages/MemberProfile";
import Stories from "./pages/Stories";
import Memories from "./pages/Memories";
import Events from "./pages/Events";

function PageWrapper({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.28, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

function App() {
  const location = useLocation();

  return (
    <div className="flex min-h-screen flex-col bg-[#fdfbf7] text-slate-800 antialiased selection:bg-amber-500 selection:text-white">
      <Navbar />

      <main className="flex-1">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route
              path="/"
              element={
                <PageWrapper>
                  <Home />
                </PageWrapper>
              }
            />
            <Route
              path="/family-tree"
              element={
                <PageWrapper>
                  <FamilyTree />
                </PageWrapper>
              }
            />
            <Route
              path="/members"
              element={
                <PageWrapper>
                  <Members />
                </PageWrapper>
              }
            />
            <Route
              path="/members/:id"
              element={
                <PageWrapper>
                  <MemberProfile />
                </PageWrapper>
              }
            />
            <Route
              path="/stories"
              element={
                <PageWrapper>
                  <Stories />
                </PageWrapper>
              }
            />
            <Route
              path="/memories"
              element={
                <PageWrapper>
                  <Memories />
                </PageWrapper>
              }
            />
            <Route
              path="/events"
              element={
                <PageWrapper>
                  <Events />
                </PageWrapper>
              }
            />
          </Routes>
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  );
}

export default App;
