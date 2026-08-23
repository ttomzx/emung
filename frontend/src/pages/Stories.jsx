import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  BookOpen, 
  Search, 
  Clock, 
  Volume2, 
  X,
  PlusCircle,
  Edit,
  Trash2,
  Sparkles
} from "lucide-react";
import StoryModal from "../components/StoryModal";
import DeleteConfirmModal from "../components/DeleteConfirmModal";
import Toast from "../components/Toast";
import { API_URL } from "../config";
import { useAuth } from "../context/AuthContext";

const mockStories = [
  {
    _id: "s1",
    title: "The Golden Harvest of 1974",
    category: "History",
    tag: "Ancestry",
    author: "Sanatomba Meitei",
    date: "October 1974",
    readTime: "4 min read",
    summary: "How Great-Grandfather Ningthouba led the community during the record harvest that saved the village during drought.",
    content: "In the late autumn of 1974, an unexpected early frost threatened the valley crops. Great-Grandfather Ningthouba organized night watches and innovative smoking pots around the paddies. Not only did our family save our harvest, but we shared over 50 bags of grain with neighboring families.",
  },
  {
    _id: "s2",
    title: "Weaving Dreams: The Royal Phanek",
    category: "Tradition",
    tag: "Craft",
    author: "Leimakhubi Chanu",
    date: "May 1989",
    readTime: "5 min read",
    summary: "The story behind the hand-woven silk Phanek crafted for the grand 1989 family reunion.",
    content: "Mastering the loom requires patience, rhythm, and love. Great-Grandmother spent four months weaving intricate floral and geometric motifs onto pure silk. Each pattern represented a branch of our family tree.",
  },
  {
    _id: "s3",
    title: "Childhood at Loktak Lake",
    category: "Memories",
    tag: "Childhood",
    author: "Chaoba Singh",
    date: "July 1995",
    readTime: "3 min read",
    summary: "Unforgettable summer afternoons fishing, floating on phumdis, and watching sunset over the waters.",
    content: "Every summer holiday, Father would take us to Loktak Lake. We built makeshift bamboo rafts and spent hours exploring floating islands, eating fresh lotus seeds, and listening to old folk tales under the stars.",
  },
];

function Stories() {
  const [stories, setStories] = useState([]);
  const [selectedTag, setSelectedTag] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeStoryModal, setActiveStoryModal] = useState(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // CRUD State
  const [isStoryModalOpen, setIsStoryModalOpen] = useState(false);
  const [storyToEdit, setStoryToEdit] = useState(null);
  const [storyToDelete, setStoryToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [toast, setToast] = useState({ message: "", type: "success" });
  const { token, canEditStory, canDeleteStory } = useAuth();

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: "", type: "success" }), 4000);
  };

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const res = await fetch(`${API_URL}/api/stories`);
        if (res.ok) {
          const data = await res.json();
          setStories(data.length > 0 ? data : mockStories);
        } else {
          setStories(mockStories);
        }
      } catch {
        setStories(mockStories);
      }
    };

    fetchStories();
  }, []);

  const handleOpenAdd = () => {
    setStoryToEdit(null);
    setIsStoryModalOpen(true);
  };

  const handleOpenEdit = (story, e) => {
    e?.stopPropagation();
    setStoryToEdit(story);
    setIsStoryModalOpen(true);
  };

  const handleOpenDelete = (story, e) => {
    e?.stopPropagation();
    setStoryToDelete(story);
  };

  const handleSaved = (savedStory, isEdit) => {
    setStories((prev) => {
      const id = savedStory._id || savedStory.id;
      if (isEdit) {
        return prev.map((s) => (String(s._id || s.id) === String(id) ? savedStory : s));
      }
      return [savedStory, ...prev];
    });

    showToast(isEdit ? "Story updated successfully!" : "Story published to oral archive!", "success");
  };

  const handleDeleteConfirm = async () => {
    if (!storyToDelete) return;
    const targetId = storyToDelete._id || storyToDelete.id;
    setDeleteLoading(true);

    try {
      if (token && !token.startsWith("demo-")) {
        await fetch(`${API_URL}/api/stories/${targetId}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      setStories((prev) => prev.filter((s) => String(s._id || s.id) !== String(targetId)));
      showToast("Story removed from archive", "info");
      setStoryToDelete(null);
    } catch {
      showToast("Failed to delete story", "error");
    } finally {
      setDeleteLoading(false);
    }
  };

  const filteredStories = stories.filter((s) => {
    const matchesTag = selectedTag === "all" || s.category?.toLowerCase() === selectedTag.toLowerCase();
    const matchesSearch =
      s.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.summary?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.author?.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesTag && matchesSearch;
  });

  return (
    <main className="min-h-screen bg-[#fdfbf7] py-12">
      <section className="mx-auto max-w-7xl px-4 sm:px-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold uppercase tracking-widest border border-amber-200">
              <BookOpen className="w-3.5 h-3.5 text-amber-600" />
              <span>Oral Traditions & Heritage</span>
            </div>

            <h1 className="mt-3 font-serif text-4xl sm:text-5xl font-extrabold text-slate-900">
              Family Stories
            </h1>

            <p className="mt-2 text-slate-600 text-base max-w-xl">
              Discover legends, wisdom, childhood recollections, and historic events passed down through generations.
            </p>
          </div>

          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 shrink-0"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Tell a Story</span>
          </button>
        </div>

        {/* Toolbar */}
        <div className="mb-8 flex flex-col md:flex-row items-center justify-between gap-4 rounded-2xl border border-amber-900/10 bg-white/90 p-4 shadow-xs">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search stories by title, summary, narrator..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 py-2 text-sm outline-none focus:border-amber-500"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            {["all", "History", "Tradition", "Memories", "Folklore"].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedTag(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition capitalize ${
                  selectedTag === cat
                    ? "bg-amber-600 text-white shadow-xs"
                    : "bg-slate-100 text-slate-600 hover:bg-amber-50 hover:text-amber-900"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Stories Cards Grid */}
        {filteredStories.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 shadow-sm">
            <Sparkles className="w-12 h-12 text-amber-500 mx-auto animate-bounce" />
            <h3 className="mt-3 font-serif text-xl font-bold text-slate-800">
              No stories found
            </h3>
            <p className="mt-1 text-sm text-slate-500">Be the first to record a family story or adjust your search filter.</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-3">
            {filteredStories.map((story) => {
              const storyId = story._id || story.id;
              return (
                <motion.article
                  key={storyId}
                  whileHover={{ y: -6 }}
                  className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs hover:shadow-xl hover:border-amber-300 transition flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="text-xs font-bold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200/60">
                        {story.tag || story.category}
                      </span>
                      <span className="inline-flex items-center gap-1 text-xs text-slate-400 font-medium">
                        <Clock className="w-3 h-3" />
                        {story.readTime}
                      </span>
                    </div>

                    <h3 className="font-serif text-xl font-bold text-slate-900 mt-2 hover:text-amber-700 transition">
                      {story.title}
                    </h3>

                    <p className="mt-3 text-sm text-slate-600 leading-relaxed line-clamp-3">
                      {story.summary}
                    </p>
                  </div>

                  <div>
                    <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                      <span className="font-medium">Told by {story.author}</span>
                      
                      <div className="flex items-center gap-2">
                        {canEditStory(story) && (
                          <button
                            onClick={(e) => handleOpenEdit(story, e)}
                            title="Edit Story"
                            className="p-1 rounded text-slate-400 hover:text-amber-700 transition"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                        )}
                        {canDeleteStory(story) && (
                          <button
                            onClick={(e) => handleOpenDelete(story, e)}
                            title="Delete Story"
                            className="p-1 rounded text-slate-400 hover:text-rose-600 transition"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <button
                          onClick={() => setActiveStoryModal(story)}
                          className="font-bold text-amber-700 hover:text-amber-900 underline ml-1"
                        >
                          Read →
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </div>
        )}
      </section>

      {/* Story Reader Modal */}
      <AnimatePresence>
        {activeStoryModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-3xl border border-amber-200 bg-white p-6 sm:p-10 shadow-2xl space-y-6 relative"
            >
              <button
                onClick={() => { setActiveStoryModal(null); setIsPlayingAudio(false); }}
                className="absolute top-6 right-6 p-2 rounded-full hover:bg-slate-100 text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-bold text-amber-900 bg-amber-100 px-3 py-1 rounded-full border border-amber-200">
                    {activeStoryModal.tag || activeStoryModal.category}
                  </span>
                </div>

                <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-slate-900">
                  {activeStoryModal.title}
                </h2>

                <p className="mt-2 text-xs font-semibold text-slate-500">
                  Written & Narrated by <span className="text-amber-700">{activeStoryModal.author}</span> • {activeStoryModal.readTime}
                </p>
              </div>

              {/* Audio Narration Bar */}
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200/80 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                    className={`flex h-10 w-10 items-center justify-center rounded-full text-white shadow-xs transition ${
                      isPlayingAudio ? "bg-amber-600 animate-pulse" : "bg-slate-900 hover:bg-amber-600"
                    }`}
                  >
                    <Volume2 className="w-5 h-5" />
                  </button>
                  <div>
                    <span className="block text-xs font-bold text-slate-900">
                      {isPlayingAudio ? "Playing Audio Narration..." : "Listen to Audio Narration"}
                    </span>
                    <span className="text-[10px] text-slate-500">Narrated in original Meiteilon / English</span>
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-4 font-serif text-base text-slate-800 leading-relaxed space-y-4">
                <p>{activeStoryModal.content || activeStoryModal.summary}</p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add / Edit Story Modal */}
      <StoryModal
        isOpen={isStoryModalOpen}
        onClose={() => setIsStoryModalOpen(false)}
        storyToEdit={storyToEdit}
        onSaved={handleSaved}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={!!storyToDelete}
        onClose={() => setStoryToDelete(null)}
        onConfirm={handleDeleteConfirm}
        loading={deleteLoading}
        title="Delete Story"
        message={`Are you sure you want to remove "${storyToDelete?.title}" from the oral tradition archives?`}
      />

      {/* Toast Notification */}
      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: "", type: "success" })} />
    </main>
  );
}

export default Stories;
