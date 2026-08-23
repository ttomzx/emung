import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  GitFork,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Filter,
  User,
  Sparkles,
} from "lucide-react";
import { API_URL } from "../config";

function FamilyTree() {
  const [members, setMembers] = useState([]);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [selectedGen, setSelectedGen] = useState("all");
  const [genderFilter, setGenderFilter] = useState("all");
  const [activeTooltip, setActiveTooltip] = useState(null);

  useEffect(() => {
    const fetchTree = async () => {
      try {
        const res = await fetch(`${API_URL}/api/members`);
        if (res.ok) {
          const data = await res.json();
          setMembers(data);
        } else {
          setMembers(mockMembers);
        }
      } catch {
        setMembers(mockMembers);
      }
    };

    fetchTree();
  }, []);


  const filteredMembers = members.filter((m) => {
    if (selectedGen !== "all" && String(m.generation) !== String(selectedGen))
      return false;
    if (genderFilter !== "all" && m.gender !== genderFilter) return false;
    return true;
  });

  const roots = filteredMembers.filter((member) => !member.parent);

  const getChildren = (parentId) => {
    return filteredMembers.filter(
      (member) => member.parent && String(member.parent._id || member.parent) === String(parentId)
    );
  };

  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 0.15, 1.5));
  const handleZoomOut = () =>
    setZoomLevel((prev) => Math.max(prev - 0.15, 0.65));
  const handleResetZoom = () => setZoomLevel(1);

  const renderNode = (member) => {
    const children = getChildren(member._id);
    const isFemale = member.gender === "female";

    return (
      <div key={member._id} className="flex flex-col items-center relative">
        <motion.div
          whileHover={{ scale: 1.05, y: -4 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="relative group"
          onMouseEnter={() => setActiveTooltip(member._id)}
          onMouseLeave={() => setActiveTooltip(null)}
        >
          <Link
            to={`/members/${member._id}`}
            className={`flex flex-col items-center w-52 rounded-2xl border p-4 text-center shadow-md backdrop-blur-md transition-all duration-300 ${
              isFemale
                ? "bg-gradient-to-b from-white via-rose-50/50 to-rose-100/30 border-rose-200/80 hover:border-rose-400 hover:shadow-rose-500/10"
                : "bg-gradient-to-b from-white via-teal-50/50 to-teal-100/30 border-teal-200/80 hover:border-teal-400 hover:shadow-teal-500/10"
            }`}
          >
            <div
              className={`flex h-12 w-12 items-center justify-center rounded-2xl font-bold text-white shadow-xs mb-2 overflow-hidden ${
                isFemale
                  ? "bg-gradient-to-tr from-rose-500 to-amber-400"
                  : "bg-gradient-to-tr from-teal-600 to-emerald-400"
              }`}
            >
              {member.profilePhoto ? (
                <img src={member.profilePhoto} alt={member.name} className="h-full w-full object-cover" />
              ) : member.name ? (
                member.name.charAt(0)
              ) : (
                <User className="w-5 h-5" />
              )}
            </div>

            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 mb-1 border border-slate-200/60">
              Gen {member.generation}
            </span>

            <h3 className="font-serif text-sm font-bold text-slate-900 line-clamp-1 group-hover:text-amber-700 transition">
              {member.name}
            </h3>

            <p className="mt-0.5 text-xs text-amber-800/90 font-medium">
              {member.relation}
            </p>
          </Link>

          <AnimatePresence>
            {activeTooltip === member._id && member.biography && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 4, scale: 0.95 }}
                className="absolute left-1/2 -translate-x-1/2 bottom-full mb-3 w-56 p-3 rounded-xl bg-slate-900 text-white text-xs shadow-2xl z-30 pointer-events-none"
              >
                <p className="font-semibold text-amber-400">{member.name}</p>
                <p className="mt-1 text-slate-300 line-clamp-2">
                  {member.biography}
                </p>
                <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {children.length > 0 && (
          <div className="flex flex-col items-center w-full">
            <div className="h-8 w-0.5 bg-amber-400/80" />

            {children.length > 1 && (
              <div className="w-full relative h-0.5 bg-amber-400/80 mb-0" />
            )}

            <div className="flex justify-center gap-10 pt-4">
              {children.map((child) => (
                <div key={child._id} className="relative flex flex-col items-center">
                  <div className="absolute -top-4 h-4 w-0.5 bg-amber-400/80" />
                  {renderNode(child)}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <main className="min-h-screen bg-[#fdfbf7] py-12">
      <section className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold uppercase tracking-widest border border-amber-200">
            <GitFork className="w-3.5 h-3.5 text-amber-600" />
            <span>Visual Ancestry</span>
          </div>

          <h1 className="mt-3 font-serif text-4xl sm:text-5xl font-extrabold text-slate-900">
            Family Tree
          </h1>

          <p className="mt-3 text-slate-600 text-base">
            Explore generations, lineages, and parent-child connections in our family network.
          </p>
        </div>

        {/* Controls Toolbar */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-xs backdrop-blur-md">
          <div className="flex items-center gap-2">
            <button
              onClick={handleZoomOut}
              className="p-2 rounded-xl border border-slate-200 hover:bg-amber-50 text-slate-700 transition"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>

            <span className="text-xs font-bold text-slate-600 min-w-[50px] text-center">
              {Math.round(zoomLevel * 100)}%
            </span>

            <button
              onClick={handleZoomIn}
              className="p-2 rounded-xl border border-slate-200 hover:bg-amber-50 text-slate-700 transition"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>

            <button
              onClick={handleResetZoom}
              className="p-2 rounded-xl border border-slate-200 hover:bg-amber-50 text-slate-700 transition ml-1"
              title="Reset Zoom"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs">
            <div className="flex items-center gap-1.5 font-semibold text-slate-600">
              <Filter className="w-3.5 h-3.5 text-amber-600" />
              <span>Generation:</span>
            </div>

            <select
              value={selectedGen}
              onChange={(e) => setSelectedGen(e.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-800 outline-none focus:border-amber-500"
            >
              <option value="all">All Generations</option>
              <option value="1">Gen 1 (Patriarchs)</option>
              <option value="2">Gen 2 (Grandparents)</option>
              <option value="3">Gen 3 (Parents)</option>
              <option value="4">Gen 4 (Current)</option>
            </select>

            <select
              value={genderFilter}
              onChange={(e) => setGenderFilter(e.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-800 outline-none focus:border-amber-500"
            >
              <option value="all">All Genders</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>
        </div>

        {/* Tree Canvas */}
        <div className="min-h-[500px] overflow-x-auto rounded-3xl border border-amber-200/60 bg-gradient-to-b from-white/90 via-amber-50/20 to-emerald-50/20 p-8 shadow-inner relative">
          {roots.length === 0 ? (
            <div className="text-center py-20">
              <Sparkles className="w-12 h-12 text-amber-500 mx-auto animate-bounce" />
              <h3 className="mt-3 font-serif text-xl font-bold text-slate-800">
                No tree nodes match filters
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                Try resetting filters.
              </p>
              <button
                onClick={() => {
                  setSelectedGen("all");
                  setGenderFilter("all");
                }}
                className="mt-4 px-4 py-2 rounded-xl bg-amber-100 text-amber-900 text-xs font-bold hover:bg-amber-200 transition"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div
              style={{
                transform: `scale(${zoomLevel})`,
                transformOrigin: "top center",
              }}
              className="transition-transform duration-200 py-6"
            >
              <div className="flex min-w-max justify-center gap-16">
                {roots.map((rootMember) => renderNode(rootMember))}
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

export default FamilyTree;
