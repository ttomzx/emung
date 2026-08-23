import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  CheckCircle2, 
  PartyPopper
} from "lucide-react";
import { API_URL } from "../config";
import { useAuth } from "../context/AuthContext";

function Events() {
  const [events, setEvents] = useState([]);
  const [filterType, setFilterType] = useState("all");
  const { user, token } = useAuth();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch(`${API_URL}/api/events`);
        if (res.ok) {
          const data = await res.json();
          // Check if current user email is in rsvps list
          const formatted = data.map((e) => ({
            ...e,
            isAttending: user ? e.rsvps?.includes(user.email) : false,
          }));
          setEvents(formatted);
        } else {
          setEvents(mockEvents);
        }
      } catch {
        setEvents(mockEvents);
      }
    };

    fetchEvents();
  }, [user]);

  const handleRSVP = async (id) => {
    const targetId = id;
    const updated = events.map((e) => {
      const evtId = e._id || e.id;
      if (String(evtId) === String(targetId)) {
        const currentCount = typeof e.attendees === "number" ? e.attendees : 1;
        const isAttending = e.isAttending;
        return {
          ...e,
          attendees: isAttending ? currentCount - 1 : currentCount + 1,
          isAttending: !isAttending,
        };
      }
      return e;
    });

    setEvents(updated);
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });

    try {
      if (token) {
        await fetch(`${API_URL}/api/events/${targetId}/rsvp`, {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` },
        });
      }
    } catch (err) {
      console.warn("RSVP sync offline:", err.message);
    }
  };


  const filteredEvents = events.filter(
    (e) => filterType === "all" || e.type?.toLowerCase() === filterType.toLowerCase()
  );

  const heroEvent = events.find((e) => e.isUpcoming) || events[0];

  return (
    <main className="min-h-screen bg-[#fdfbf7] py-12">
      <section className="mx-auto max-w-7xl px-4 sm:px-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold uppercase tracking-widest border border-amber-200">
              <Calendar className="w-3.5 h-3.5 text-amber-600" />
              <span>Milestones & Reunions</span>
            </div>

            <h1 className="mt-3 font-serif text-4xl sm:text-5xl font-extrabold text-slate-900">
              Family Events
            </h1>

            <p className="mt-2 text-slate-600 text-base max-w-xl">
              Stay connected with upcoming reunions, festival feasts, birthdays, and ancestral tribute dates.
            </p>
          </div>
        </div>

        {/* Hero Upcoming Event Highlight Card */}
        {heroEvent && (
          <div className="mb-12 overflow-hidden rounded-3xl border border-amber-300 bg-gradient-to-r from-slate-950 via-slate-900 to-amber-950 text-white p-6 sm:p-10 shadow-2xl relative">
            <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 blur-3xl rounded-full pointer-events-none" />

            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
              <div className="space-y-4 max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold uppercase tracking-wider border border-amber-500/30">
                  <PartyPopper className="w-4 h-4" />
                  <span>Next Featured Gathering</span>
                </div>

                <h2 className="font-serif text-3xl sm:text-4xl font-extrabold tracking-tight">
                  {heroEvent.title}
                </h2>

                <p className="text-slate-300 text-sm leading-relaxed">
                  {heroEvent.description}
                </p>

                <div className="flex flex-wrap items-center gap-6 text-xs text-amber-200 pt-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-amber-400" />
                    <span>{heroEvent.date} ({heroEvent.time})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-amber-400" />
                    <span>{heroEvent.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-amber-400" />
                    <span>{heroEvent.attendees || 1} Confirmed</span>
                  </div>
                </div>
              </div>

              {/* RSVP Box */}
              <div className="rounded-2xl border border-white/10 bg-white/10 backdrop-blur-md p-6 text-center shrink-0 space-y-3">
                <span className="block text-xs font-bold uppercase tracking-widest text-slate-300">Are you attending?</span>
                <button
                  onClick={() => handleRSVP(heroEvent._id || heroEvent.id)}
                  className={`w-full px-6 py-3.5 rounded-xl text-sm font-bold shadow-md transition flex items-center justify-center gap-2 ${
                    heroEvent.isAttending
                      ? "bg-emerald-600 text-white"
                      : "bg-amber-500 text-slate-950 hover:bg-amber-400"
                  }`}
                >
                  {heroEvent.isAttending ? (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>You're Attending!</span>
                    </>
                  ) : (
                    <span>RSVP Yes, Count Me In</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Filter Chips */}
        <div className="mb-8 flex items-center gap-2">
          {["all", "Festival", "Birthday", "Workshop", "Reunion"].map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition capitalize ${
                filterType === type
                  ? "bg-amber-500 text-white shadow-xs"
                  : "bg-white border border-slate-200 text-slate-600 hover:bg-amber-50"
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        {/* Events Timeline List */}
        <div className="space-y-4">
          {filteredEvents.map((evt) => (
            <motion.div
              key={evt._id || evt.id}
              whileHover={{ x: 4 }}
              className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs hover:border-amber-300 transition flex flex-col sm:flex-row sm:items-center justify-between gap-6"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-2xl bg-amber-100 text-amber-900 border border-amber-200/60 font-bold">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-amber-700">
                    {evt.date ? evt.date.split("-")[1] || "EVENT" : "EVENT"}
                  </span>
                  <span className="text-lg font-extrabold leading-none">
                    {evt.date ? evt.date.split("-")[2] || "15" : "15"}
                  </span>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/50">
                      {evt.type}
                    </span>
                  </div>

                  <h3 className="font-serif text-xl font-bold text-slate-900">{evt.title}</h3>
                  <p className="mt-1 text-xs text-slate-600 leading-relaxed">{evt.description}</p>

                  <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-amber-600" />
                      {evt.time}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-amber-600" />
                      {evt.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-amber-600" />
                      {evt.attendees || 1} Attending
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => handleRSVP(evt._id || evt.id)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold transition ${
                    evt.isAttending
                      ? "bg-emerald-100 text-emerald-900 border border-emerald-300"
                      : "bg-slate-900 text-white hover:bg-amber-600"
                  }`}
                >
                  {evt.isAttending ? "RSVP Confirmed ✓" : "RSVP Event"}
                </button>
              </div>
            </motion.div>
          ))}
        </div>

      </section>
    </main>
  );
}

export default Events;
