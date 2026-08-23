import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Users, Search, Filter, Sparkles } from "lucide-react";
import MemberCard from "../components/MemberCard";
import { SkeletonMemberCard } from "../components/SkeletonLoader";
import { API_URL } from "../config";

function Members() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGen, setSelectedGen] = useState("all");

  useEffect(() => {
    const fetchMembers = async () => {
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
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, []);


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
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
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
              Meet our ancestors, elders, parents, and future generations.
            </p>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="mb-8 flex flex-col md:flex-row items-center justify-between gap-4 rounded-3xl border border-slate-200/80 bg-white/90 p-4 shadow-sm backdrop-blur-md">
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
              <motion.div key={member._id} variants={itemVariants} layout>
                <MemberCard member={member} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </section>
    </main>
  );
}

export default Members;
