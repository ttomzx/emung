import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Image as ImageIcon, Save, Loader2, Sparkles } from "lucide-react";
import { API_URL } from "../config";
import { useAuth } from "../context/AuthContext";

function MemoryModal({ isOpen, onClose, memoryToEdit, onSaved }) {
  const { token } = useAuth();
  const [formData, setFormData] = useState({
    title: "",
    imageUrl: "",
    category: "Reunion",
    date: new Date().toISOString().split("T")[0],
    location: "",
    caption: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (memoryToEdit) {
      setFormData({
        title: memoryToEdit.title || "",
        imageUrl: memoryToEdit.imageUrl || "",
        category: memoryToEdit.category || "Reunion",
        date: memoryToEdit.date || new Date().toISOString().split("T")[0],
        location: memoryToEdit.location || "",
        caption: memoryToEdit.caption || "",
      });
    } else {
      setFormData({
        title: "",
        imageUrl: "https://images.unsplash.com/photo-1511895426328-dc8714191300?q=80&w=1000&auto=format&fit=crop",
        category: "Reunion",
        date: new Date().toISOString().split("T")[0],
        location: "",
        caption: "",
      });
    }
    setError("");
  }, [memoryToEdit, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.imageUrl.trim()) {
      setError("Memory title and image URL are required.");
      return;
    }

    setLoading(true);
    setError("");

    const isEdit = !!memoryToEdit;
    const url = isEdit
      ? `${API_URL}/api/memories/${memoryToEdit._id || memoryToEdit.id}`
      : `${API_URL}/api/memories`;

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
          likes: memoryToEdit?.likes || 0,
          _id: memoryToEdit?._id || memoryToEdit?.id || `mem-${Date.now()}`,
          id: memoryToEdit?._id || memoryToEdit?.id || `mem-${Date.now()}`,
        };
      }

      onSaved(savedData, isEdit);
      onClose();
    } catch (err) {
      setError(err.message || "Failed to save memory.");
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
          className="w-full max-w-xl overflow-hidden rounded-3xl border border-amber-200 bg-white p-6 sm:p-8 shadow-2xl relative my-8"
        >
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 rounded-full text-slate-400 hover:bg-amber-50 hover:text-amber-900 transition"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3 mb-6 border-b border-amber-100 pb-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-100 text-amber-800 border border-amber-200">
              {memoryToEdit ? <Sparkles className="w-5 h-5" /> : <ImageIcon className="w-5 h-5" />}
            </div>
            <div>
              <h2 className="font-serif text-2xl font-bold text-slate-900">
                {memoryToEdit ? "Edit Memory" : "Add Photo Memory"}
              </h2>
              <p className="text-xs text-slate-500">Upload and catalog family celebrations and portraits.</p>
            </div>
          </div>

          {error && (
            <div className="mb-4 rounded-xl bg-rose-50 p-3 text-xs text-rose-700 border border-rose-200">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Memory Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Centennial Family Reunion 2024"
                required
                className="w-full rounded-xl border border-slate-200 bg-slate-50/80 px-3.5 py-2.5 outline-none focus:border-amber-500 focus:bg-white text-sm"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Image URL *</label>
              <input
                type="url"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleChange}
                placeholder="https://images.unsplash.com/..."
                required
                className="w-full rounded-xl border border-slate-200 bg-slate-50/80 px-3.5 py-2.5 outline-none focus:border-amber-500 focus:bg-white text-xs"
              />
              {formData.imageUrl && (
                <div className="mt-2 h-36 w-full rounded-xl overflow-hidden border border-slate-200 bg-slate-100">
                  <img
                    src={formData.imageUrl}
                    alt="Preview"
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      e.target.src = "https://images.unsplash.com/photo-1511895426328-dc8714191300?q=80&w=1000&auto=format&fit=crop";
                    }}
                  />
                </div>
              )}
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
                  <option value="Reunion">Reunion</option>
                  <option value="Birthday">Birthday</option>
                  <option value="Festival">Festival</option>
                  <option value="Milestone">Milestone</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Date</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/80 px-3.5 py-2 outline-none focus:border-amber-500 focus:bg-white text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Location</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g. Imphal Homestead"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/80 px-3.5 py-2.5 outline-none focus:border-amber-500 focus:bg-white text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Caption / Description</label>
              <textarea
                name="caption"
                value={formData.caption}
                onChange={handleChange}
                rows="3"
                placeholder="Add details, people present, or memorable moments..."
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
                    <span>{memoryToEdit ? "Update Memory" : "Save Memory"}</span>
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

export default MemoryModal;
