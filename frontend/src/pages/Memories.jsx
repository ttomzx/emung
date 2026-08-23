import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Image as ImageIcon, 
  Heart, 
  MapPin, 
  Calendar, 
  X, 
  Maximize2
} from "lucide-react";
import { API_URL } from "../config";
import { useAuth } from "../context/AuthContext";

function Memories() {
  const [memories, setMemories] = useState([]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedLightbox, setSelectedLightbox] = useState(null);
  const { token } = useAuth();

  useEffect(() => {
    const fetchMemories = async () => {
      try {
        const res = await fetch(`${API_URL}/api/memories`);
        if (res.ok) {
          const data = await res.json();
          setMemories(data);
        } else {
          setMemories(mockMemories);
        }
      } catch {
        setMemories(mockMemories);
      }
    };

    fetchMemories();
  }, []);

  const handleLike = async (id, e) => {
    e?.stopPropagation();

    // Optimistic UI update
    setMemories((prev) =>
      prev.map((m) => {
        const targetId = m._id || m.id;
        if (String(targetId) === String(id)) {
          return { ...m, likes: (m.likes || 0) + 1 };
        }
        return m;
      })
    );

    if (selectedLightbox) {
      const targetId = selectedLightbox._id || selectedLightbox.id;
      if (String(targetId) === String(id)) {
        setSelectedLightbox((prev) => (prev ? { ...prev, likes: (prev.likes || 0) + 1 } : null));
      }
    }

    try {
      if (token) {
        const targetId = id;
        await fetch(`${API_URL}/api/memories/${targetId}/like`, {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` },
        });
      }
    } catch (err) {
      console.warn("Like sync offline:", err.message);
    }
  };


  const filteredMemories = memories.filter(
    (m) => activeCategory === "all" || m.category?.toLowerCase() === activeCategory.toLowerCase()
  );

  return (
    <main className="min-h-screen bg-[#fdfbf7] py-12">
      <section className="mx-auto max-w-7xl px-4 sm:px-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold uppercase tracking-widest border border-amber-200">
              <ImageIcon className="w-3.5 h-3.5 text-amber-600" />
              <span>Photo & Video Vault</span>
            </div>

            <h1 className="mt-3 font-serif text-4xl sm:text-5xl font-extrabold text-slate-900">
              Family Memories
            </h1>

            <p className="mt-2 text-slate-600 text-base max-w-xl">
              Visual milestones, family reunions, celebrations, and timeless portraits captured through the years.
            </p>
          </div>
        </div>

        {/* Category Filter Chips */}
        <div className="mb-8 flex flex-wrap items-center gap-2">
          {["all", "Reunion", "Birthday", "Festival", "Milestone"].map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition capitalize ${
                activeCategory === cat
                  ? "bg-amber-500 text-white shadow-xs"
                  : "bg-white border border-slate-200 text-slate-600 hover:bg-amber-50"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredMemories.map((mem) => {
            const likesCount = mem.likes || 0;

            return (
              <motion.div
                key={mem._id || mem.id}
                whileHover={{ y: -6 }}
                onClick={() => setSelectedLightbox(mem)}
                className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xs hover:shadow-xl hover:border-amber-300 transition cursor-pointer flex flex-col justify-between"
              >
                {/* Image Container */}
                <div className="relative h-64 w-full overflow-hidden bg-slate-100">
                  <img
                    src={mem.imageUrl}
                    alt={mem.title}
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                  
                  {/* Expand Overlay Button */}
                  <div className="absolute top-3 right-3 p-2 rounded-full bg-black/40 text-white backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity">
                    <Maximize2 className="w-4 h-4" />
                  </div>

                  {/* Category Pill */}
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-white/90 text-slate-900 text-[10px] font-bold uppercase tracking-wider backdrop-blur-md shadow-xs">
                    {mem.category}
                  </div>

                  {/* Bottom title overlay */}
                  <div className="absolute bottom-3 left-4 right-4 text-white">
                    <h3 className="font-serif text-lg font-bold drop-shadow-md">{mem.title}</h3>
                    <div className="flex items-center gap-3 text-xs text-slate-300 mt-1">
                      {mem.date && (
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-amber-400" />
                          {mem.date}
                        </span>
                      )}
                      {mem.location && (
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-amber-400" />
                          {mem.location}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Caption & Likes Footer */}
                <div className="p-4 flex items-center justify-between text-xs text-slate-600 border-t border-slate-100">
                  <p className="line-clamp-1 flex-1 pr-2 font-medium">{mem.caption || "No caption"}</p>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => handleLike(mem._id || mem.id, e)}
                      className="flex items-center gap-1 font-bold text-rose-500 hover:scale-110 transition-transform shrink-0"
                    >
                      <Heart className="w-4 h-4 fill-rose-500" />
                      <span>{likesCount}</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

      </section>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedLightbox && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="w-full max-w-4xl overflow-hidden rounded-3xl border border-slate-700 bg-slate-900 text-white shadow-2xl relative grid grid-cols-1 md:grid-cols-12"
            >
              <button
                onClick={() => setSelectedLightbox(null)}
                className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/60 text-white hover:bg-amber-600 transition"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="md:col-span-8 bg-black flex items-center justify-center min-h-[300px] sm:min-h-[450px]">
                <img
                  src={selectedLightbox.imageUrl}
                  alt={selectedLightbox.title}
                  className="max-h-[80vh] w-full object-contain"
                />
              </div>

              <div className="md:col-span-4 p-6 sm:p-8 flex flex-col justify-between space-y-6">
                <div>
                  <span className="inline-block px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 text-xs font-bold uppercase tracking-wider border border-amber-500/30 mb-3">
                    {selectedLightbox.category}
                  </span>

                  <h2 className="font-serif text-2xl font-bold text-white">{selectedLightbox.title}</h2>

                  <div className="mt-3 space-y-1.5 text-xs text-slate-400">
                    {selectedLightbox.date && (
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-amber-400" />
                        <span>{selectedLightbox.date}</span>
                      </div>
                    )}
                    {selectedLightbox.location && (
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-amber-400" />
                        <span>{selectedLightbox.location}</span>
                      </div>
                    )}
                  </div>

                  <p className="mt-4 text-slate-300 text-sm leading-relaxed">
                    {selectedLightbox.caption}
                  </p>
                </div>

                <div className="border-t border-slate-800 pt-4 flex items-center justify-between">
                  <button
                    onClick={(e) => handleLike(selectedLightbox.id, e)}
                    className="flex items-center gap-2 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30 px-4 py-2 text-xs font-bold hover:bg-rose-500 hover:text-white transition"
                  >
                    <Heart className="w-4 h-4 fill-current" />
                    <span>{selectedLightbox.likes || 0} Likes</span>
                  </button>

                  <span className="text-[10px] text-slate-500">Emung Family Archives</span>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}

export default Memories;
