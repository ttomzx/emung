import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Image as ImageIcon, 
  Heart, 
  MapPin, 
  Calendar, 
  X, 
  Maximize2,
  PlusCircle,
  Edit,
  Trash2,
  Sparkles
} from "lucide-react";
import MemoryModal from "../components/MemoryModal";
import DeleteConfirmModal from "../components/DeleteConfirmModal";
import Toast from "../components/Toast";
import { API_URL } from "../config";
import { useAuth } from "../context/AuthContext";

const mockMemories = [
  {
    _id: "m1",
    title: "Centennial Family Reunion 2024",
    date: "2024-12-28",
    location: "Imphal Homestead",
    category: "Reunion",
    imageUrl: "https://images.unsplash.com/photo-1511895426328-dc8714191300?q=80&w=1000&auto=format&fit=crop",
    caption: "Over 45 family members gathered from around the world to celebrate our heritage.",
    likes: 24,
  },
  {
    _id: "m2",
    title: "Grandmother Tombi's 70th Celebration",
    date: "2023-09-24",
    location: "Guwahati Garden Resort",
    category: "Birthday",
    imageUrl: "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?q=80&w=1000&auto=format&fit=crop",
    caption: "Four generations smiling together under the fairy light canopy.",
    likes: 38,
  },
  {
    _id: "m3",
    title: "Harvest Festival Rituals",
    date: "2022-11-15",
    location: "Ancestral Paddy Fields",
    category: "Festival",
    imageUrl: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?q=80&w=1000&auto=format&fit=crop",
    caption: "Traditional blessing of the first seasonal rice yield.",
    likes: 19,
  },
  {
    _id: "m4",
    title: "Thoibi's State Badminton Trophy",
    date: "2025-02-10",
    location: "Indira Gandhi Indoor Stadium",
    category: "Milestone",
    imageUrl: "https://images.unsplash.com/photo-1519766304817-4f37bda74a29?q=80&w=1000&auto=format&fit=crop",
    caption: "Proud parents cheering as Thoibi takes home gold in the under-18 championship!",
    likes: 42,
  },
];

function Memories() {
  const [memories, setMemories] = useState([]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedLightbox, setSelectedLightbox] = useState(null);

  // CRUD State
  const [isMemoryModalOpen, setIsMemoryModalOpen] = useState(false);
  const [memoryToEdit, setMemoryToEdit] = useState(null);
  const [memoryToDelete, setMemoryToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [toast, setToast] = useState({ message: "", type: "success" });
  const { token, canEditMemory, canDeleteMemory } = useAuth();

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: "", type: "success" }), 4000);
  };

  useEffect(() => {
    const fetchMemories = async () => {
      try {
        const res = await fetch(`${API_URL}/api/memories`);
        if (res.ok) {
          const data = await res.json();
          setMemories(data.length > 0 ? data : mockMemories);
        } else {
          setMemories(mockMemories);
        }
      } catch {
        setMemories(mockMemories);
      }
    };

    fetchMemories();
  }, []);

  const handleOpenAdd = () => {
    setMemoryToEdit(null);
    setIsMemoryModalOpen(true);
  };

  const handleOpenEdit = (mem, e) => {
    e?.stopPropagation();
    setMemoryToEdit(mem);
    setIsMemoryModalOpen(true);
  };

  const handleOpenDelete = (mem, e) => {
    e?.stopPropagation();
    setMemoryToDelete(mem);
  };

  const handleSaved = (savedMemory, isEdit) => {
    setMemories((prev) => {
      const id = savedMemory._id || savedMemory.id;
      if (isEdit) {
        return prev.map((m) => (String(m._id || m.id) === String(id) ? savedMemory : m));
      }
      return [savedMemory, ...prev];
    });

    showToast(isEdit ? "Photo memory updated!" : "New memory cataloged in vault!", "success");
  };

  const handleDeleteConfirm = async () => {
    if (!memoryToDelete) return;
    const targetId = memoryToDelete._id || memoryToDelete.id;
    setDeleteLoading(true);

    try {
      if (token && !token.startsWith("demo-")) {
        await fetch(`${API_URL}/api/memories/${targetId}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      setMemories((prev) => prev.filter((m) => String(m._id || m.id) !== String(targetId)));
      showToast("Memory deleted from vault", "info");
      setMemoryToDelete(null);
    } catch {
      showToast("Failed to delete memory", "error");
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleLike = async (id, e) => {
    e?.stopPropagation();

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
      if (token && !token.startsWith("demo-")) {
        await fetch(`${API_URL}/api/memories/${id}/like`, {
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

          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 shrink-0"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Photo Memory</span>
          </button>
        </div>

        {/* Category Filter Chips */}
        <div className="mb-8 flex flex-wrap items-center gap-2">
          {["all", "Reunion", "Birthday", "Festival", "Milestone"].map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition capitalize ${
                activeCategory === cat
                  ? "bg-amber-600 text-white shadow-xs"
                  : "bg-white border border-slate-200 text-slate-600 hover:bg-amber-50 hover:text-amber-900"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        {filteredMemories.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 shadow-sm">
            <Sparkles className="w-12 h-12 text-amber-500 mx-auto animate-bounce" />
            <h3 className="mt-3 font-serif text-xl font-bold text-slate-800">No photo memories found</h3>
            <p className="mt-1 text-sm text-slate-500">Upload a photo to start building your visual family vault.</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredMemories.map((mem) => {
              const memId = mem._id || mem.id;
              const likesCount = mem.likes || 0;

              return (
                <motion.div
                  key={memId}
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

                  {/* Caption & Actions Footer */}
                  <div className="p-4 flex items-center justify-between text-xs text-slate-600 border-t border-slate-100">
                    <p className="line-clamp-1 flex-1 pr-2 font-medium">{mem.caption || "No caption"}</p>

                    <div className="flex items-center gap-3 shrink-0">
                      <button
                        onClick={(e) => handleLike(memId, e)}
                        className="flex items-center gap-1 font-bold text-rose-500 hover:scale-110 transition-transform"
                      >
                        <Heart className="w-4 h-4 fill-rose-500" />
                        <span>{likesCount}</span>
                      </button>

                      {canEditMemory(mem) && (
                        <button
                          onClick={(e) => handleOpenEdit(mem, e)}
                          title="Edit Memory"
                          className="p-1 text-slate-400 hover:text-amber-700 transition"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                      )}

                      {canDeleteMemory(mem) && (
                        <button
                          onClick={(e) => handleOpenDelete(mem, e)}
                          title="Delete Memory"
                          className="p-1 text-slate-400 hover:text-rose-600 transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
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
                    onClick={(e) => handleLike(selectedLightbox._id || selectedLightbox.id, e)}
                    className="flex items-center gap-2 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30 px-4 py-2 text-xs font-bold hover:bg-rose-500 hover:text-white transition"
                  >
                    <Heart className="w-4 h-4 fill-current" />
                    <span>{selectedLightbox.likes || 0} Likes</span>
                  </button>

                  <span className="text-[10px] text-slate-500">Emung Archives</span>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add / Edit Memory Modal */}
      <MemoryModal
        isOpen={isMemoryModalOpen}
        onClose={() => setIsMemoryModalOpen(false)}
        memoryToEdit={memoryToEdit}
        onSaved={handleSaved}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={!!memoryToDelete}
        onClose={() => setMemoryToDelete(null)}
        onConfirm={handleDeleteConfirm}
        loading={deleteLoading}
        title="Delete Photo Memory"
        message={`Are you sure you want to remove "${memoryToDelete?.title}" from the family memory vault?`}
      />

      {/* Toast Notification */}
      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: "", type: "success" })} />
    </main>
  );
}

export default Memories;
