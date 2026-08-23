import { Link } from "react-router-dom";
import {
  Sparkles,
  GitFork,
  BookOpen,
  Image as ImageIcon,
  Calendar,
} from "lucide-react";

function Footer() {
  return (
    <footer className="border-t border-amber-500/20 bg-slate-950 text-slate-300 relative overflow-hidden">
      {/* Glow effect */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-24 bg-amber-500/10 blur-3xl rounded-full pointer-events-none" />

      <div className="mx-auto max-w-7xl px-6 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Col 1: Brand & Tagline */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl overflow-hidden border border-amber-400/40 shadow-sm">
                <img
                  src="/emung-logo-v2.jpg"
                  alt="Emung Logo"
                  className="h-full w-full object-cover"
                />
              </div>
              <span className="font-serif text-2xl font-bold tracking-tight text-white">
                ꯏꯃꯨꯡ{" "}
                <span className="text-amber-400 font-sans text-xs tracking-widest uppercase bg-amber-500/20 px-2 py-0.5 rounded-full border border-amber-500/30">
                  Emung
                </span>
              </span>
            </div>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed font-normal">
              Preserving our heritage, stories, memories, and family
              relationships for current and future generations to cherish.
            </p>
            <div className="flex items-center gap-2 text-xs text-amber-400 font-semibold bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 rounded-lg w-fit">
              <span>"Our family, our story."</span>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="space-y-3">
            <h4 className="font-serif text-sm font-semibold uppercase tracking-wider text-amber-400">
              Explore
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/family-tree"
                  className="flex items-center gap-2 text-slate-400 hover:text-white transition"
                >
                  <GitFork className="w-3.5 h-3.5 text-amber-400" />
                  <span>Family Tree</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/members"
                  className="flex items-center gap-2 text-slate-400 hover:text-white transition"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Family Members</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/stories"
                  className="flex items-center gap-2 text-slate-400 hover:text-white transition"
                >
                  <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                  <span>Family Stories</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Archives */}
          <div className="space-y-3">
            <h4 className="font-serif text-sm font-semibold uppercase tracking-wider text-amber-400">
              Archives
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/memories"
                  className="flex items-center gap-2 text-slate-400 hover:text-white transition"
                >
                  <ImageIcon className="w-3.5 h-3.5 text-amber-400" />
                  <span>Photo Gallery</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/events"
                  className="flex items-center gap-2 text-slate-400 hover:text-white transition"
                >
                  <Calendar className="w-3.5 h-3.5 text-amber-400" />
                  <span>Milestones & Events</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="mt-12 border-t border-slate-800/80 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-500">
          <p>© 2026 ꯏꯃꯨꯡ (Emung). Crafted with love for the family.</p>
          <div className="flex items-center gap-1 text-slate-400">
            <span>Built with React & Tailwind CSS</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
