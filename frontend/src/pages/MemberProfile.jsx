import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Briefcase,
  User,
  GitFork,
  Sparkles,
} from "lucide-react";
import { API_URL } from "../config";

function MemberProfile() {
  const { id } = useParams();
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("bio");

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
    </main>
  );
}

export default MemberProfile;
