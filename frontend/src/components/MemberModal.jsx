import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, UserPlus, Save, Loader2, Sparkles, Image as ImageIcon } from "lucide-react";
import { API_URL } from "../config";
import { useAuth } from "../context/AuthContext";

function MemberModal({ isOpen, onClose, memberToEdit, onSaved, existingMembers = [] }) {
  const { token } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    relation: "",
    generation: "3",
    gender: "male",
    dateOfBirth: "",
    dateOfDeath: "",
    location: "",
    profession: "",
    interests: "",
    profilePhoto: "",
    parent: "",
    biography: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (memberToEdit) {
      setFormData({
        name: memberToEdit.name || "",
        relation: memberToEdit.relation || "",
        generation: String(memberToEdit.generation || "3"),
        gender: memberToEdit.gender || "male",
        dateOfBirth: memberToEdit.dateOfBirth ? memberToEdit.dateOfBirth.split("T")[0] : "",
        dateOfDeath: memberToEdit.dateOfDeath ? memberToEdit.dateOfDeath.split("T")[0] : "",
        location: memberToEdit.location || "",
        profession: memberToEdit.profession || "",
        interests: Array.isArray(memberToEdit.interests) ? memberToEdit.interests.join(", ") : memberToEdit.interests || "",
        profilePhoto: memberToEdit.profilePhoto || "",
        parent: memberToEdit.parent?._id || memberToEdit.parent || "",
        biography: memberToEdit.biography || "",
      });
    } else {
      setFormData({
        name: "",
        relation: "",
        generation: "3",
        gender: "male",
        dateOfBirth: "",
        dateOfDeath: "",
        location: "",
        profession: "",
        interests: "",
        profilePhoto: "",
        parent: "",
        biography: "",
      });
    }
    setError("");
  }, [memberToEdit, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setError("Member name is required.");
      return;
    }

    setLoading(true);
    setError("");

    const isEdit = !!memberToEdit;
    const url = isEdit
      ? `${API_URL}/api/members/${memberToEdit._id || memberToEdit.id}`
      : `${API_URL}/api/members`;

    const method = isEdit ? "PUT" : "POST";

    const payload = {
      ...formData,
      generation: Number(formData.generation) || 1,
      interests: formData.interests ? formData.interests.split(",").map((i) => i.trim()) : [],
      parent: formData.parent || null,
      dateOfDeath: formData.dateOfDeath || null,
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

      // Offline / Fallback mock data creation
      if (!savedData) {
        savedData = {
          ...payload,
          _id: memberToEdit?._id || memberToEdit?.id || `m-${Date.now()}`,
          id: memberToEdit?._id || memberToEdit?.id || `m-${Date.now()}`,
        };
      }

      onSaved(savedData, isEdit);
      onClose();
    } catch (err) {
      setError(err.message || "Failed to save family member.");
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
              {memberToEdit ? <Sparkles className="w-5 h-5" /> : <UserPlus className="w-5 h-5" />}
            </div>
            <div>
              <h2 className="font-serif text-2xl font-bold text-slate-900">
                {memberToEdit ? "Edit Family Member" : "Add New Family Member"}
              </h2>
              <p className="text-xs text-slate-500">Preserve lineage details in the Emung digital registry.</p>
            </div>
          </div>

          {error && (
            <div className="mb-4 rounded-xl bg-rose-50 p-3 text-xs text-rose-700 border border-rose-200">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Sorokhaibam Babu Singh"
                  required
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/80 px-3.5 py-2.5 outline-none focus:border-amber-500 focus:bg-white text-sm"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Relation / Role</label>
                <input
                  type="text"
                  name="relation"
                  value={formData.relation}
                  onChange={handleChange}
                  placeholder="e.g. Grandfather, Sister, Cousin"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/80 px-3.5 py-2.5 outline-none focus:border-amber-500 focus:bg-white text-sm"
                />
              </div>
            </div>

            {/* Profile Photo URL Field */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1 flex items-center justify-between">
                <span>Profile Photo URL (Optional)</span>
                <span className="text-[10px] text-slate-400">Direct image link</span>
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="url"
                  name="profilePhoto"
                  value={formData.profilePhoto}
                  onChange={handleChange}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/80 px-3.5 py-2.5 outline-none focus:border-amber-500 focus:bg-white text-xs"
                />
                {formData.profilePhoto ? (
                  <div className="h-10 w-10 shrink-0 rounded-xl overflow-hidden border border-slate-200 shadow-xs">
                    <img src={formData.profilePhoto} alt="Preview" className="h-full w-full object-cover" />
                  </div>
                ) : (
                  <div className="h-10 w-10 shrink-0 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400">
                    <ImageIcon className="w-5 h-5" />
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Generation</label>
                <select
                  name="generation"
                  value={formData.generation}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/80 px-3.5 py-2.5 outline-none focus:border-amber-500 focus:bg-white text-xs font-semibold"
                >
                  <option value="1">Gen 1 (Patriarch / Ancestor)</option>
                  <option value="2">Gen 2 (Grandparent)</option>
                  <option value="3">Gen 3 (Parent / Elder)</option>
                  <option value="4">Gen 4 (Youth / Child)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Gender</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/80 px-3.5 py-2.5 outline-none focus:border-amber-500 focus:bg-white text-xs font-semibold"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Parent (Lineage Link)</label>
                <select
                  name="parent"
                  value={formData.parent}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/80 px-3.5 py-2.5 outline-none focus:border-amber-500 focus:bg-white text-xs"
                >
                  <option value="">None (Top Generation)</option>
                  {existingMembers
                    .filter((m) => String(m._id || m.id) !== String(memberToEdit?._id || memberToEdit?.id))
                    .map((m) => (
                      <option key={m._id || m.id} value={m._id || m.id}>
                        {m.name} ({m.relation || `Gen ${m.generation}`})
                      </option>
                    ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Date of Birth</label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/80 px-3.5 py-2 outline-none focus:border-amber-500 focus:bg-white text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Date of Passing (Optional)</label>
                <input
                  type="date"
                  name="dateOfDeath"
                  value={formData.dateOfDeath}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/80 px-3.5 py-2 outline-none focus:border-amber-500 focus:bg-white text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Location / Residence</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g. Imphal, Manipur"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/80 px-3.5 py-2.5 outline-none focus:border-amber-500 focus:bg-white text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Profession</label>
                <input
                  type="text"
                  name="profession"
                  value={formData.profession}
                  onChange={handleChange}
                  placeholder="e.g. Teacher, Engineer, Weaver"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/80 px-3.5 py-2.5 outline-none focus:border-amber-500 focus:bg-white text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Interests / Hobbies (Comma separated)</label>
              <input
                type="text"
                name="interests"
                value={formData.interests}
                onChange={handleChange}
                placeholder="e.g. Gardening, Calligraphy, Storytelling"
                className="w-full rounded-xl border border-slate-200 bg-slate-50/80 px-3.5 py-2.5 outline-none focus:border-amber-500 focus:bg-white text-xs"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Biography & Heritage Notes</label>
              <textarea
                name="biography"
                value={formData.biography}
                onChange={handleChange}
                rows="3"
                placeholder="Write a brief life summary, achievements, or oral stories..."
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
                    <span>{memberToEdit ? "Update Member" : "Save Member"}</span>
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

export default MemberModal;
