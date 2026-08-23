import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Users, Search, Filter, Sparkles, UserPlus } from "lucide-react";
import MemberCard from "../components/MemberCard";
import { SkeletonMemberCard } from "../components/SkeletonLoader";
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

function Members() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGen, setSelectedGen] = useState("all");

  // Modals & Actions
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [memberToEdit, setMemberToEdit] = useState(null);
  const [memberToDelete, setMemberToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Toast
  const [toast, setToast] = useState({ message: "", type: "success" });

  const { token, canAddMember, canEditMember, canDeleteMember } = useAuth();

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: "", type: "success" }), 4000);
  };

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const res = await fetch(`${API_URL}/api/members`);
        if (res.ok) {
          const data = await res.json();
          setMembers(data.length > 0 ? data : mockMembers);
        } else {
          setMembers(mockMembers);
        }
      } catch {
        setMembers(mockMembers);
      } fontFinally: {
        setLoading(false);
      }
    };

    fetchMembers();
  }, []);

  const handleOpenAdd = () => {
    setMemberToEdit(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (member) => {
    setMemberToEdit(member);
    setIsModalOpen(true);
  };

  const handleOpenDelete = (member) => {
    setMemberToDelete(member);
  };

  const handleSaved = (savedMember, isEdit) => {
    setMembers((prev) => {
      const id = savedMember._id || savedMember.id;
      if (isEdit) {
        return prev.map((m) => (String(m._id || m.id) === String(id) ? savedMember : m));
      }
      return [savedMember, ...prev];
    });

    showToast(
      isEdit ? `Updated ${savedMember.name} successfully!` : `Added ${savedMember.name} to family directory!`,
      "success"
    );
  };

  const handleDeleteConfirm = async () => {
    if (!memberToDelete) return;
    const targetId = memberToDelete._id || memberToDelete.id;
    setDeleteLoading(true);

    try {
      if (token && !token.startsWith("demo-")) {
        await fetch(`${API_URL}/api/members/${targetId}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      setMembers((prev) => prev.filter((m) => String(m._id || m.id) !== String(targetId)));
      showToast(`Removed ${memberToDelete.name} from family records`, "info");
      setMemberToDelete(null);
    } catch {
      showToast("Failed to remove member", "error");
    } finally {
      setDeleteLoading(false);
    }
  };

  const filteredMembers = members.filter((m) => {
    const matchesSearch =
      m.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.relation?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.profession?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesGen = selectedGen === "all" || String(m.generation) === String(selectedGen);

    return matchesSearch && matchesGen;
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.05 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
  };

  return (
    <main className="min-h-screen bg-[#fdfbf7] py-12">
      <section className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100/90 text-amber-900 text-xs font-bold uppercase tracking-widest border border-amber-200/80 shadow-2xs">
              <Users className="w-3.5 h-3.5 text-amber-600" />
              <span>Ancestral Directory</span>
            </div>

            <h1 className="mt-3 font-serif text-4xl sm:text-5xl font-extrabold text-slate-900">
              Family Members
            </h1>

            <p className="mt-2 text-slate-600 text-base max-w-xl">
              Meet our ancestors, elders, parents, and future generations preserving our heritage.
            </p>
          </div>

          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 shrink-0"
          >
            <UserPlus className="w-4 h-4" />
            <span>Add Family Member</span>
          </button>
        </div>

        {/* Filter and Search Bar */}
        <div className="mb-8 flex flex-col md:flex-row items-center justify-between gap-4 rounded-3xl border border-amber-900/10 bg-white/90 p-4 shadow-sm backdrop-blur-md">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, relation, profession..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50/80 pl-10 pr-4 py-2.5 text-sm outline-none focus:border-amber-500 transition-colors"
            />
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto text-xs font-bold text-slate-600">
            <Filter className="w-3.5 h-3.5 text-amber-600" />
            <span>Generation:</span>
            <select
              value={selectedGen}
              onChange={(e) => setSelectedGen(e.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-800 outline-none focus:border-amber-500 transition-colors shadow-2xs"
            >
              <option value="all">All Generations</option>
              <option value="1">Gen 1 (Patriarchs)</option>
              <option value="2">Gen 2 (Grandparents)</option>
              <option value="3">Gen 3 (Parents)</option>
              <option value="4">Gen 4 (Children)</option>
            </select>
          </div>
        </div>

        {/* Members Cards Grid */}
        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            <SkeletonMemberCard />
            <SkeletonMemberCard />
            <SkeletonMemberCard />
            <SkeletonMemberCard />
          </div>
        ) : filteredMembers.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 shadow-sm">
            <Sparkles className="w-12 h-12 text-amber-500 mx-auto animate-bounce" />
            <h3 className="mt-3 font-serif text-xl font-bold text-slate-800">
              No family members found
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              Try adjusting your search query or generation filter.
            </p>
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          >
            {filteredMembers.map((member) => (
              <motion.div key={member._id || member.id} variants={itemVariants} layout>
                <MemberCard
                  member={member}
                  onEdit={handleOpenEdit}
                  onDelete={handleOpenDelete}
                  canEdit={canEditMember(member)}
                  canDelete={canDeleteMember()}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </section>

      {/* Add / Edit Member Modal */}
      <MemberModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        memberToEdit={memberToEdit}
        onSaved={handleSaved}
        existingMembers={members}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={!!memberToDelete}
        onClose={() => setMemberToDelete(null)}
        onConfirm={handleDeleteConfirm}
        loading={deleteLoading}
        title="Remove Family Member"
        message={`Are you sure you want to remove ${memberToDelete?.name} from the family directory?`}
      />

      {/* Toast Notification */}
      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: "", type: "success" })} />
    </main>
  );
}

export default Members;
