import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Briefcase,
  User,
  GitFork,
  Sparkles,
  Edit,
  Trash2,
} from "lucide-react";
import MemberModal from "../components/MemberModal";
import DeleteConfirmModal from "../components/DeleteConfirmModal";
import Toast from "../components/Toast";
import { API_URL } from "../config";
import { useAuth } from "../context/AuthContext";

const mockMembers = [
  {
    _id: "m1",
    name: "Sorokhaibam Babu Singh",
    relation: "Grandfather",
    generation: 1,
    gender: "male",
    dateOfBirth: "1937-03-15",
    dateOfDeath: "2023-10-23",
    biography: "Founder of the family estate in Kakmayai. Known for his wisdom, devotion to traditional craftsmanship, and community leadership.",
    location: "Yairipok Kakmayai, Manipur",
    profession: "Scholar & Historian",
    interests: ["Manipuri Culture", "Gardening", "Storytelling"],
  },
  {
    _id: "m2",
    name: "Sorokhaibam Ahanbi Devi",
    relation: "Grandmother",
    generation: 1,
    gender: "female",
    dateOfBirth: "1939-07-09",
    dateOfDeath: "2003-04-12",
    biography: "Keeper of family traditions, master weaver of sacred Phanek textiles, and cherished storyteller for 4 generations.",
    location: "Imphal West, Manipur",
    profession: "Master Weaver",
    interests: ["Textile Weaving", "Folk Music", "Cooking"],
  },
  {
    _id: "m3",
    name: "Sorokhaibam Komol Meitei",
    relation: "Father",
    generation: 2,
    gender: "male",
    dateOfBirth: "1972-01-10",
    biography: "Pioneered sustainable agriculture in the valley. Built the family homestead and served as community elder for over 30 years.",
    location: "Imphal East, Manipur",
    profession: "Agronomist",
    interests: ["Horticulture", "Carpentry", "Chess"],
  },
  {
    _id: "m4",
    name: "Sorokhaibam Landhoni Leima",
    relation: "Mother",
    generation: 2,
    gender: "female",
    dateOfBirth: "1974-09-24",
    biography: "Passionate educator who established the first community literacy center for women in the region.",
    location: "Imphal East, Manipur",
    profession: "Teacher",
    interests: ["Literature", "Calligraphy", "Baking"],
  },
  {
    _id: "m5",
    name: "Sorokhaibam Sanakhomba Meitei",
    relation: "Sibling",
    generation: 3,
    gender: "male",
    dateOfBirth: "1978-05-18",
    biography: "Civil engineer dedicated to eco-friendly architecture. Enthusiastic nature photographer and family archivist.",
    location: "Guwahati / Imphal",
    profession: "Civil Engineer",
    interests: ["Photography", "Trekking", "Guitar"],
  },
  {
    _id: "m6",
    name: "Sorokhaibam Uttam Meitei",
    relation: "Sibling",
    generation: 3,
    gender: "male",
    dateOfBirth: "1982-12-05",
    biography: "Renowned doctor and advocate for rural healthcare outreach. Loves hosting family gatherings.",
    location: "Guwahati",
    profession: "Physician",
    interests: ["Medical Research", "Gardening", "Classical Dance"],
  },
  {
    _id: "m7",
    name: "Sorokhaibam Tolentomba Meitei",
    relation: "Son / You",
    generation: 4,
    gender: "male",
    dateOfBirth: "2004-08-22",
    biography: "Software developer and UI designer creating modern digital archives to preserve cultural heritage.",
    location: "Bengaluru",
    profession: "Software Engineer",
    interests: ["Web Dev", "Digital Art", "Robotics"],
  },
  {
    _id: "m8",
    name: "Thoibi Chanu",
    relation: "Daughter / Sister",
    generation: 4,
    gender: "female",
    dateOfBirth: "2008-11-03",
    biography: "Aspiring badminton champion and high school valedictorian. Loves digital illustration and music.",
    location: "Guwahati",
    profession: "Student & Athlete",
    interests: ["Badminton", "Digital Art", "Violin"],
  },
];

function MemberProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("bio");

  // Modals & Actions
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [toast, setToast] = useState({ message: "", type: "success" });
  const { token, canEditMember, canDeleteMember } = useAuth();

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: "", type: "success" }), 4000);
  };

  useEffect(() => {
    const fetchMember = async () => {
      try {
        const res = await fetch(`${API_URL}/api/members/${id}`);
        if (res.ok) {
          const data = await res.json();
          setMember(data);
        } else {
          const found = mockMembers.find((m) => String(m._id) === String(id));
          if (found) setMember(found);
        }
      } catch {
        const found = mockMembers.find((m) => String(m._id) === String(id));
        if (found) setMember(found);
      } finally {
        setLoading(false);
      }
    };

    fetchMember();
  }, [id]);

  const handleSaved = (updatedMember) => {
    setMember(updatedMember);
    showToast(`Updated ${updatedMember.name}'s profile successfully!`, "success");
  };

  const handleDeleteConfirm = async () => {
    if (!member) return;
    setDeleteLoading(true);

    try {
      if (token && !token.startsWith("demo-")) {
        await fetch(`${API_URL}/api/members/${member._id || member.id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      showToast(`Removed ${member.name} from directory`, "info");
      setTimeout(() => navigate("/members"), 1000);
    } catch {
      showToast("Failed to delete member profile", "error");
      setDeleteLoading(false);
    }
  };

  if (loading) {
    return (
      <main className="mx-auto max-w-4xl px-6 py-20 text-center">
        <Sparkles className="w-10 h-10 text-amber-500 mx-auto animate-bounce" />
        <p className="mt-3 text-slate-500 font-medium">Loading member profile...</p>
      </main>
    );
  }

  if (!member) {
    return (
      <main className="mx-auto max-w-4xl px-6 py-20 text-center">
        <h1 className="font-serif text-3xl font-bold text-slate-900">Member Not Found</h1>
        <p className="mt-2 text-slate-600">The requested family member profile could not be found.</p>
        <Link to="/members" className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-amber-700 hover:underline">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Members</span>
        </Link>
      </main>
    );
  }

  const isFemale = member.gender === "female";

  return (
    <main className="min-h-screen bg-[#fdfbf7] py-12">
      <section className="mx-auto max-w-4xl px-4 sm:px-6">
        <Link
          to="/members"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-amber-700 transition mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Members</span>
        </Link>

        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl">
          <div className="h-48 sm:h-56 bg-gradient-to-r from-amber-600 via-amber-500 to-emerald-600 relative overflow-hidden">
            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-amber-900 shadow-xs border border-white/50">
              Generation {member.generation}
            </div>
          </div>

          <div className="px-6 sm:px-10 pb-10 relative">
            <div className="-mt-16 sm:-mt-20 flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-6">
              <div className="flex items-end gap-5">
                <div
                  className={`flex h-28 w-28 sm:h-36 sm:w-36 items-center justify-center rounded-3xl text-white font-bold text-4xl shadow-xl ring-8 ring-white overflow-hidden ${
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
                    <User className="w-12 h-12" />
                  )}
                </div>

                <div className="mb-2">
                  <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                    {member.name}
                  </h1>
                  <span className="inline-block mt-1 text-xs font-bold text-amber-900 bg-amber-100 px-3 py-1 rounded-full border border-amber-200">
                    {member.relation}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 mb-2">
                {canEditMember(member) && (
                  <button
                    onClick={() => setIsEditModalOpen(true)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-100 text-amber-900 hover:bg-amber-200 text-xs font-bold transition border border-amber-300"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    <span>Edit Profile</span>
                  </button>
                )}

                {canDeleteMember() && (
                  <button
                    onClick={() => setIsDeleteModalOpen(true)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-100 text-rose-900 hover:bg-rose-200 text-xs font-bold transition border border-rose-300"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200/80 mb-8 text-xs text-slate-600">
              {member.dateOfBirth && (
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-amber-600 shrink-0" />
                  <div>
                    <span className="block text-[10px] uppercase font-bold text-slate-400">
                      Lifespan / DOB
                    </span>
                    <span className="font-semibold text-slate-800">
                      {member.dateOfBirth} {member.dateOfDeath ? `— ${member.dateOfDeath}` : ""}
                    </span>
                  </div>
                </div>
              )}

              {member.profession && (
                <div className="flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-amber-600 shrink-0" />
                  <div>
                    <span className="block text-[10px] uppercase font-bold text-slate-400">
                      Profession
                    </span>
                    <span className="font-semibold text-slate-800">{member.profession}</span>
                  </div>
                </div>
              )}

              {member.location && (
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-amber-600 shrink-0" />
                  <div>
                    <span className="block text-[10px] uppercase font-bold text-slate-400">
                      Location
                    </span>
                    <span className="font-semibold text-slate-800">{member.location}</span>
                  </div>
                </div>
              )}
            </div>

            <div className="border-b border-slate-200 mb-6 flex gap-6 text-sm font-bold">
              <button
                onClick={() => setActiveTab("bio")}
                className={`pb-3 border-b-2 transition ${
                  activeTab === "bio"
                    ? "border-amber-600 text-amber-900"
                    : "border-transparent text-slate-500 hover:text-slate-900"
                }`}
              >
                Biography & History
              </button>
              <button
                onClick={() => setActiveTab("relations")}
                className={`pb-3 border-b-2 transition ${
                  activeTab === "relations"
                    ? "border-amber-600 text-amber-900"
                    : "border-transparent text-slate-500 hover:text-slate-900"
                }`}
              >
                Lineage & Relations
              </button>
              {member.interests && member.interests.length > 0 && (
                <button
                  onClick={() => setActiveTab("interests")}
                  className={`pb-3 border-b-2 transition ${
                    activeTab === "interests"
                      ? "border-amber-600 text-amber-900"
                      : "border-transparent text-slate-500 hover:text-slate-900"
                  }`}
                >
                  Interests & Passions
                </button>
              )}
            </div>

            {activeTab === "bio" && (
              <div className="space-y-4">
                <h3 className="font-serif text-xl font-bold text-slate-900">About {member.name}</h3>
                <p className="text-slate-700 leading-relaxed text-base">
                  {member.biography || "No biography has been added yet for this family member."}
                </p>
              </div>
            )}

            {activeTab === "relations" && (
              <div className="space-y-4">
                <h3 className="font-serif text-xl font-bold text-slate-900">Family Connections</h3>
                <div className="p-6 rounded-2xl bg-amber-50/50 border border-amber-200/60 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">
                      Tree Position
                    </span>
                    <p className="text-sm font-semibold text-slate-900 mt-1">
                      Generation {member.generation} ({member.relation})
                    </p>
                  </div>
                  <Link
                    to="/family-tree"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 hover:underline"
                  >
                    <GitFork className="w-4 h-4" />
                    <span>View on Tree Canvas</span>
                  </Link>
                </div>
              </div>
            )}

            {activeTab === "interests" && member.interests && (
              <div className="space-y-4">
                <h3 className="font-serif text-xl font-bold text-slate-900">Passions & Interests</h3>
                <div className="flex flex-wrap gap-2">
                  {member.interests.map((item, idx) => (
                    <span
                      key={idx}
                      className="px-3.5 py-1.5 rounded-xl bg-amber-100/70 border border-amber-200 text-amber-900 font-semibold text-xs"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Edit Member Modal */}
      <MemberModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        memberToEdit={member}
        onSaved={handleSaved}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        loading={deleteLoading}
        title="Delete Member Profile"
        message={`Are you sure you want to delete ${member?.name}'s profile?`}
      />

      {/* Toast Notification */}
      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: "", type: "success" })} />
    </main>
  );
}

export default MemberProfile;
