import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home,
  GitFork,
  Users,
  BookOpen,
  Image as ImageIcon,
  Calendar,
  Menu,
  X,
  Palette,
  Sun,
  Moon,
  Leaf,
} from "lucide-react";
import { useTheme } from "../context/ThemeContext";

function Navbar() {
  const location = useLocation();
  const { theme, changeTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [themeDropdownOpen, setThemeDropdownOpen] = useState(false);

  const navLinks = [
    { path: "/", label: "Home", icon: Home },
    { path: "/family-tree", label: "Family Tree", icon: GitFork },
    { path: "/members", label: "Members", icon: Users },
    { path: "/stories", label: "Stories", icon: BookOpen },
    { path: "/memories", label: "Memories", icon: ImageIcon },
    { path: "/events", label: "Events", icon: Calendar },
  ];

  const themeOptions = [
    { id: "amber", label: "Imperial Amber", icon: Sun, color: "text-amber-500" },
    { id: "emerald", label: "Emerald Sanctuary", icon: Leaf, color: "text-emerald-500" },
    { id: "midnight", label: "Midnight Heritage", icon: Moon, color: "text-indigo-400" },
  ];

  return (
    <header className="sticky top-0 z-40 glass-nav border-b border-amber-100/60 shadow-xs">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 py-3.5">
        {/* Brand Logo */}
        <Link to="/" className="group flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl overflow-hidden shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform border border-amber-300/50">
            <img
              src="/emung-logo-v2.jpg"
              alt="Emung Logo"
              className="h-full w-full object-cover"
            />
          </div>
          <div>
            <span className="font-serif text-2xl font-bold tracking-tight text-slate-900 group-hover:text-amber-700 transition-colors">
              ꯏꯃꯨꯡ
            </span>
            <span className="ml-1.5 text-xs font-semibold uppercase tracking-wider text-amber-700/80 bg-amber-100/60 px-2 py-0.5 rounded-full border border-amber-200/50">
              Emung
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-100/70 p-1.5 rounded-2xl border border-slate-200/60">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.path;

            return (
              <Link
                key={link.path}
                to={link.path}
                className={`relative flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors rounded-xl ${
                  isActive
                    ? "text-amber-900 font-semibold"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
                }`}
              >
                <Icon
                  className={`w-4 h-4 ${isActive ? "text-amber-600" : "text-slate-400"}`}
                />
                <span>{link.label}</span>

                {isActive && (
                  <motion.div
                    layoutId="navbar-active"
                    className="absolute inset-0 bg-white rounded-xl shadow-xs border border-amber-200/50 -z-10"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right Section: Theme Selector & Mobile Hamburger */}
        <div className="flex items-center gap-3">
          {/* Theme Selector Dropdown */}
          <div className="relative">
            <button
              onClick={() => setThemeDropdownOpen(!themeDropdownOpen)}
              className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white/90 px-3 py-1.5 text-xs font-bold text-slate-700 shadow-xs hover:bg-amber-50 hover:border-amber-300 transition"
              title="Change Theme Palette"
            >
              <Palette className="w-3.5 h-3.5 text-amber-600" />
              <span className="hidden sm:inline capitalize">{theme}</span>
            </button>

            <AnimatePresence>
              {themeDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 4, scale: 0.95 }}
                  className="absolute right-0 top-full mt-2 w-48 rounded-2xl border border-slate-200 bg-white p-2 shadow-2xl z-50"
                >
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 py-1.5">
                    Color Theme Palette
                  </div>
                  {themeOptions.map((opt) => {
                    const Icon = opt.icon;
                    const isSelected = theme === opt.id;
                    return (
                      <button
                        key={opt.id}
                        onClick={() => {
                          changeTheme(opt.id);
                          setThemeDropdownOpen(false);
                        }}
                        className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition text-left ${
                          isSelected
                            ? "bg-amber-50 text-amber-900 font-bold"
                            : "text-slate-600 hover:bg-slate-100"
                        }`}
                      >
                        <Icon className={`w-4 h-4 ${opt.color}`} />
                        <span>{opt.label}</span>
                      </button>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-amber-100/50 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-amber-100 bg-white/95 backdrop-blur-xl px-4 py-4 space-y-2 shadow-xl"
          >
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path;

              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition ${
                    isActive
                      ? "bg-amber-50 text-amber-900 border border-amber-200"
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <Icon
                    className={`w-5 h-5 ${isActive ? "text-amber-600" : "text-slate-400"}`}
                  />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

export default Navbar;
