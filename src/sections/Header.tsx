import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, PenLine, BookOpen, Sun, Moon } from "lucide-react";
import { useDarkMode } from "../hooks/useDarkMode";
import collegeLogo from "../assets/LOGO.png";
export default function Header() {
  const { isDark, toggle } = useDarkMode();
  const location = useLocation();

  const nav = [
    { path: "/", label: "الرئيسية", icon: Home },
    { path: "/share", label: "شاركنا قصتك", icon: PenLine },
    { path: "/stories", label: "القصص", icon: BookOpen },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-white dark:bg-black border-b border-gray-100 dark:border-gray-800 transition-colors">
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
         <img src={collegeLogo} alt="Logo" className="h-10 w-auto" />
          <span className="text-xl font-bold tracking-tight text-brand">
           الجمعيه الهندسية
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {nav.map((item) => {
            const Icon = item.icon;
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                  active
                    ? "bg-black text-white dark:bg-white dark:text-black"
                    : "text-gray-600 hover:text-black dark:text-gray-300 dark:hover:text-white"
                }`}
              >
                <Icon size={16} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Dark mode toggle */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={toggle}
          className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-100 dark:bg-gray-800 hover:bg-brand hover:text-black transition-colors"
          aria-label="Toggle dark mode"
        >
          {isDark ? <Sun size={18} /> : <Moon size={18} />}
        </motion.button>
      </div>

      {/* Mobile nav strip */}
      <div className="md:hidden border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-black">
        <div className="max-w-5xl mx-auto px-4 flex justify-around py-2">
          {nav.map((item) => {
            const Icon = item.icon;
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center gap-0.5 text-xs font-medium transition-colors ${
                  active ? "text-black dark:text-white" : "text-gray-400"
                }`}
              >
                <Icon size={20} />
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>
    </header>
  );
}
