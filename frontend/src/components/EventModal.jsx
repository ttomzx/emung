import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar, Save, Loader2, Sparkles } from "lucide-react";
import { API_URL } from "../config";
import { useAuth } from "../context/AuthContext";

function EventModal({ isOpen, onClose, eventToEdit, onSaved }) {
  const { token } = useAuth();
  const [formData, setFormData] = useState({
    title: "",
    date: new Date().toISOString().split("T")[0],
    time: "12:00 PM",
    location: "",
    type: "Festival",
    description: "",
    attendees: 1,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (eventToEdit) {
      setFormData({
        title: eventToEdit.title || "",
        date: eventToEdit.date || new Date().toISOString().split("T")[0],
        time: eventToEdit.time || "12:00 PM",
        location: eventToEdit.location || "",
        type: eventToEdit.type || "Festival",
        description: eventToEdit.description || "",
        attendees: eventToEdit.attendees || 1,
      });
    } else {
      setFormData({
        title: "",
        date: new Date().toISOString().split("T")[0],
        time: "12:00 PM",
        location: "",
        type: "Festival",
        description: "",
        attendees: 1,
      });
    }
    setError("");
  }, [eventToEdit, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.date) {
      setError("Event title and date are required.");
      return;
    }

    setLoading(true);
    setError("");

    const isEdit = !!eventToEdit;
    const url = isEdit
      ? `${API_URL}/api/events/${eventToEdit._id || eventToEdit.id}`
      : `${API_URL}/api/events`;

    const method = isEdit ? "PUT" : "POST";

    const payload = {
      ...formData,
      attendees: Number(formData.attendees) || 1,
    };

    try {
      let savedData = null;

      if (token && !token.startsWith("demo-")) {
        const res = await fetch(url, {
          method,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });

        if (res.ok) {
          savedData = await res.json();
        }
      }

      if (!savedData) {
        savedData = {
          ...payload,
          isUpcoming: true,
          rsvps: eventToEdit?.rsvps || [],
          _id: eventToEdit?._id || eventToEdit?.id || `evt-${Date.now()}`,
          id: eventToEdit?._id || eventToEdit?.id || `evt-${Date.now()}`,
        };
      }

      onSaved(savedData, isEdit);
      onClose();
    } catch (err) {
      setError(err.message || "Failed to save event.");
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
              {eventToEdit ? <Sparkles className="w-5 h-5" /> : <Calendar className="w-5 h-5" />}
            </div>
            <div>
              <h2 className="font-serif text-2xl font-bold text-slate-900">
                {eventToEdit ? "Edit Family Event" : "Host New Gathering"}
              </h2>
              <p className="text-xs text-slate-500">Plan reunions, festivals, birthdays, and ancestral tribute dates.</p>
            </div>
          </div>

          {error && (
            <div className="mb-4 rounded-xl bg-rose-50 p-3 text-xs text-rose-700 border border-rose-200">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Event Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Annual Ningol Chakouba Feast"
                required
                className="w-full rounded-xl border border-slate-200 bg-slate-50/80 px-3.5 py-2.5 outline-none focus:border-amber-500 focus:bg-white text-sm"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Event Type</label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/80 px-3.5 py-2.5 outline-none focus:border-amber-500 focus:bg-white text-xs font-semibold"
                >
                  <option value="Festival">Festival</option>
                  <option value="Birthday">Birthday</option>
                  <option value="Reunion">Reunion</option>
                  <option value="Workshop">Workshop</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Date *</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/80 px-3.5 py-2 outline-none focus:border-amber-500 focus:bg-white text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Time</label>
                <input
                  type="text"
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  placeholder="e.g. 12:00 PM - 5:00 PM"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/80 px-3.5 py-2.5 outline-none focus:border-amber-500 focus:bg-white text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Location / Venue</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g. Ancestral Homestead, Imphal"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/80 px-3.5 py-2.5 outline-none focus:border-amber-500 focus:bg-white text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Initial Confirmed Attendees</label>
                <input
                  type="number"
                  name="attendees"
                  min="1"
                  value={formData.attendees}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/80 px-3.5 py-2.5 outline-none focus:border-amber-500 focus:bg-white text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Description & Gathering Info</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="3"
                placeholder="Share venue directions, program agenda, or RSVP notes..."
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
                    <span>{eventToEdit ? "Update Event" : "Save Event"}</span>
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

export default EventModal;
