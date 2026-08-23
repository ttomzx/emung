import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { User, ArrowRight, Calendar, MapPin } from "lucide-react";

function MemberCard({ member }) {
  const isFemale = member.gender === "female";

  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.015 }}
      transition={{ type: "spring", stiffness: 350, damping: 25 }}
      className="group relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white/90 p-6 shadow-sm hover:shadow-2xl hover:shadow-amber-500/10 hover:border-amber-300/80 backdrop-blur-md transition-all duration-300 flex flex-col justify-between"
    >
      {/* Background Accent Gradient Blur Mesh */}
      <div
        className={`absolute -top-14 -right-14 h-36 w-36 rounded-full blur-2xl transition-opacity duration-500 opacity-25 group-hover:opacity-60 pointer-events-none ${
          isFemale ? "bg-rose-400" : "bg-teal-400"
        }`}
      />

      <div>
        {/* Top Badges */}
        <div className="flex items-center justify-between gap-2 mb-4">
          <span className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full bg-amber-100/90 text-amber-900 border border-amber-200/60 shadow-2xs">
            Gen {member.generation}
          </span>
          {member.dateOfBirth && (
            <span className="inline-flex items-center gap-1 text-xs text-slate-500 font-medium">
              <Calendar className="w-3.5 h-3.5 text-amber-600/80" />
              {member.dateOfBirth.split("-")[0]}
            </span>
          )}
        </div>

        {/* Member Avatar & Main Info */}
        <div className="flex items-start gap-4">
          <div
            className={`relative flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl shadow-md font-bold text-2xl overflow-hidden transition-transform duration-300 group-hover:scale-105 ${
              isFemale
                ? "bg-gradient-to-tr from-rose-500 via-amber-400 to-rose-400 text-white ring-4 ring-rose-50"
                : "bg-gradient-to-tr from-teal-600 via-emerald-400 to-teal-400 text-white ring-4 ring-teal-50"
            }`}
          >
            {member.profilePhoto ? (
              <img
                src={member.profilePhoto}
                alt={member.name}
                className="h-full w-full object-cover"
              />
            ) : member.name ? (
              member.name.charAt(0)
            ) : (
              <User className="w-7 h-7" />
            )}
          </div>

          <div className="min-w-0 flex-1">
            <h3 className="font-serif text-lg font-extrabold tracking-tight text-slate-900 group-hover:text-amber-700 transition-colors line-clamp-1">
              {member.name}
            </h3>
            <span className="inline-block text-xs font-bold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-md mt-1 border border-amber-200/50">
              {member.relation}
            </span>
          </div>
        </div>

        {/* Short details / biography */}
        {member.biography && (
          <p className="mt-4 text-xs text-slate-600 line-clamp-2 leading-relaxed font-normal">
            {member.biography}
          </p>
        )}

        {member.location && (
          <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-500 font-medium">
            <MapPin className="w-3.5 h-3.5 text-amber-600/70" />
            <span className="line-clamp-1">{member.location}</span>
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
        <Link
          to={`/members/${member._id}`}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-800 hover:text-amber-600 transition-colors"
        >
          <span>View Full Profile</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1.5 transition-transform duration-300" />
        </Link>
      </div>
    </motion.div>
  );
}

export default MemberCard;
