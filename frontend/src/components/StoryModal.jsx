import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, BookOpen, Save, Loader2, Sparkles } from "lucide-react";
import { API_URL } from "../config";
import { useAuth } from "../context/AuthContext";

function StoryModal({ isOpen, onClose, storyToEdit, onSaved }) {
  const { token, user } = useAuth();
  const [formData, setFormData] = useState({
    title: "",
    category: "Tradition",
    tag: "Ancestry",
    author: user?.name || "Family Elder",
    readTime: "3 min read",
    summary: "",
    content: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (storyToEdit) {
      setFormData({
        title: storyToEdit.title || "",
        category: storyToEdit.category || "Tradition",
        tag: storyToEdit.tag || storyToEdit.category || "Ancestry",
        author: storyToEdit.author || user?.name || "Family Elder",
        readTime: storyToEdit.readTime || "3 min read",
        summary: storyToEdit.summary || "",
        content: storyToEdit.content || "",
      });
    } else {
      setFormData({
        title: "",
        category: "Tradition",
        tag: "Ancestry",
        author: user?.name || "Family Elder",
        readTime: "3 min read",
        summary: "",
        content: "",
      });
    }
    setError("");
  }, [storyToEdit, isOpen, user]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.summary.trim()) {
      setError("Story title and summary are required.");
      return;
    }

    setLoading(true);
    setError("");

    const isEdit = !!storyToEdit;
    const url = isEdit
      ? `${API_URL}/api/stories/${storyToEdit._id || storyToEdit.id}`
      : `${API_URL}/api/stories`;

    const method = isEdit ? "PUT" : "POST";

    try {
      let savedData = null;

      if (token && !token.startsWith("demo-")) {
        const res = await fetch(url, {
          method,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        });

        if (res.ok) {
          savedData = await res.json();
        }
      }

      if (!savedData) {
        savedData = {
          ...formData,
          _id: storyToEdit?._id || storyToEdit?.id || `s-${Date.now()}`,
          id: storyToEdit?._id || storyToEdit?.id || `s-${Date.now()}`,
        };
      }

      onSaved(savedData, isEdit);
      onClose();
    } catch (err) {
      setError(err.message || "Failed to save story.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="w-full max-w-2xl overflow-hidden rounded-3xl border border-amber-200 bg-white p-6 sm:p-8 shadow-2xl relative my-8"
        >
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 rounded-full text-slate-400 hover:bg-amber-50 hover:text-amber-900 transition"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3 mb-6 border-b border-amber-100 pb-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-100 text-amber-800 border border-amber-200">
              {storyToEdit ? <Sparkles className="w-5 h-5" /> : <BookOpen className="w-5 h-5" />}
            </div>
            <div>
              <h2 className="font-serif text-2xl font-bold text-slate-900">
                {storyToEdit ? "Edit Family Story" : "Preserve a New Oral Story"}
              </h2>
              <p className="text-xs text-slate-500">Record ancestral legends, folklore, and personal recollections.</p>
            </div>
          </div>

          {error && (
            <div className="mb-4 rounded-xl bg-rose-50 p-3 text-xs text-rose-700 border border-rose-200">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Story Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. The Golden Harvest of 1974"
                required
                className="w-full rounded-xl border border-slate-200 bg-slate-50/80 px-3.5 py-2.5 outline-none focus:border-amber-500 focus:bg-white text-sm"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/80 px-3.5 py-2.5 outline-none focus:border-amber-500 focus:bg-white text-xs font-semibold"
                >
                  <option value="History">History</option>
                  <option value="Tradition">Tradition</option>
                  <option value="Memories">Memories</option>
                  <option value="Folklore">Folklore</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Narrator / Author</label>
                <input
                  type="text"
                  name="author"
                  value={formData.author}
                  onChange={handleChange}
                  placeholder="e.g. Sanatomba Meitei"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/80 px-3.5 py-2.5 outline-none focus:border-amber-500 focus:bg-white text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Estimated Read Time</label>
                <input
                  type="text"
                  name="readTime"
                  value={formData.readTime}
                  onChange={handleChange}
                  placeholder="e.g. 4 min read"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/80 px-3.5 py-2.5 outline-none focus:border-amber-500 focus:bg-white text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Short Summary *</label>
              <textarea
                name="summary"
                value={formData.summary}
                onChange={handleChange}
                rows="2"
                placeholder="A quick overview of what this story is about..."
                required
                className="w-full rounded-xl border border-slate-200 bg-slate-50/80 px-3.5 py-2.5 outline-none focus:border-amber-500 focus:bg-white text-xs leading-relaxed"
              ></textarea>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Full Story Content</label>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleChange}
                rows="6"
                placeholder="Write the full story narrative in detail..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50/80 px-3.5 py-2.5 outline-none focus:border-amber-500 focus:bg-white text-xs leading-relaxed"
              ></textarea>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-md transition disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>{storyToEdit ? "Update Story" : "Save Story"}</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

export default StoryModal;
