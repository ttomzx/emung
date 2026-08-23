import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import {
  GitFork,
  Users,
  Sparkles,
  ArrowRight,
  HeartHandshake,
  BookOpen,
  Image as ImageIcon,
  Calendar,
} from "lucide-react";
import { mockMembers, mockStories, mockMemories } from "../data/mockFamily";

function Home() {
  const [stats, setStats] = useState({
    generations: 4,
    membersCount: 8,
    storiesCount: 3,
    memoriesCount: 4,
  });

  const [recentStories, setRecentStories] = useState([]);
  const [recentMemories, setRecentMemories] = useState([]);

  useEffect(() => {
    setStats({
      generations: 4,
      membersCount: mockMembers.length,
      storiesCount: mockStories.length,
      memoriesCount: mockMemories.length,
    });

    setRecentStories(mockStories.slice(0, 3));
    setRecentMemories(mockMemories.slice(0, 3));
  }, []);

  const handleConfetti = () => {
    confetti({
      particleCount: 70,
      spread: 80,
      origin: { y: 0.6 },
    });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <div className="relative overflow-hidden">
      {/* HERO SECTION */}
      <section className="relative pt-16 pb-24 lg:pt-24 lg:pb-32 overflow-hidden">
        {/* Animated Background Multi-layered Glow Orbs */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[750px] h-[450px] bg-gradient-to-tr from-amber-300/30 via-orange-200/20 to-emerald-300/25 blur-3xl rounded-full pointer-events-none -z-10 animate-pulse-slow" />
        <div className="absolute top-36 right-10 w-72 h-72 bg-amber-400/15 blur-2xl rounded-full pointer-events-none -z-10 animate-float" />

        <div className="mx-auto max-w-7xl px-6 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="inline-flex items-center gap-2 rounded-full border border-amber-300/70 bg-amber-100/80 px-4.5 py-1.5 text-xs font-bold uppercase tracking-widest text-amber-900 shadow-sm backdrop-blur-md mb-6 hover:border-amber-400 transition"
          >
            <Sparkles
              className="h-3.5 w-3.5 text-amber-600 animate-spin"
              style={{ animationDuration: "7s" }}
            />
            <span>Welcome to ꯏꯃꯨꯡ (Emung) Archives</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="font-serif text-5xl font-extrabold tracking-tight text-slate-900 sm:text-6xl lg:text-7xl max-w-4xl mx-auto leading-[1.14]"
          >
            Our family, <span className="gold-gradient-text">our story.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mx-auto mt-6 max-w-2xl text-lg sm:text-xl text-slate-600 leading-relaxed font-normal"
          >
            A sacred place to preserve our family tree, cherished memories,
            ancestral stories, and heritage for generations to come.
          </motion.p>

          {/* Action CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mt-10 flex flex-wrap justify-center gap-4"
          >
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
              <Link
                to="/family-tree"
                onClick={handleConfetti}
                className="group inline-flex items-center gap-2.5 rounded-2xl bg-slate-900 px-7 py-4 text-base font-bold text-white shadow-xl shadow-slate-900/15 hover:bg-amber-600 hover:shadow-amber-600/30 transition-all duration-300"
              >
                <GitFork className="w-5 h-5 text-amber-400 group-hover:rotate-12 transition-transform duration-300" />
                <span>Explore Family Tree</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform duration-300" />
              </Link>
            </motion.div>

            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
              <Link
                to="/members"
                className="inline-flex items-center gap-2 rounded-2xl border border-slate-300/80 bg-white/90 px-7 py-4 text-base font-bold text-slate-700 shadow-sm backdrop-blur-md hover:bg-amber-50 hover:border-amber-300 hover:text-amber-900 transition-all duration-300"
              >
                <Users className="w-5 h-5 text-amber-600" />
                <span>Meet the Family</span>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* STATISTICS COUNTER BAR */}
      <section className="border-y border-amber-200/60 bg-white/85 backdrop-blur-xl shadow-xs">
        <div className="mx-auto max-w-7xl px-6 py-10">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
          >
            <motion.div
              variants={itemVariants}
              whileHover={{ y: -6, scale: 1.02 }}
              className="p-5 rounded-2xl bg-slate-50/60 border border-slate-200/70 hover:border-amber-300 transition-all duration-300 shadow-xs"
            >
              <div className="font-serif text-4xl sm:text-5xl font-extrabold text-amber-600">
                {stats.generations}
              </div>
              <div className="mt-2 text-xs font-bold tracking-wider uppercase text-slate-500">
                Generations
              </div>
            </motion.div>

            <motion.div
              variants={itemVariants}
              whileHover={{ y: -6, scale: 1.02 }}
              className="p-5 rounded-2xl bg-slate-50/60 border border-slate-200/70 hover:border-amber-300 transition-all duration-300 shadow-xs"
            >
              <div className="font-serif text-4xl sm:text-5xl font-extrabold text-slate-900">
                {stats.membersCount}
              </div>
              <div className="mt-2 text-xs font-bold tracking-wider uppercase text-slate-500">
                Family Members
              </div>
            </motion.div>

            <motion.div
              variants={itemVariants}
              whileHover={{ y: -6, scale: 1.02 }}
              className="p-5 rounded-2xl bg-slate-50/60 border border-slate-200/70 hover:border-emerald-300 transition-all duration-300 shadow-xs"
            >
              <div className="font-serif text-4xl sm:text-5xl font-extrabold text-emerald-600">
                {stats.storiesCount}
              </div>
              <div className="mt-2 text-xs font-bold tracking-wider uppercase text-slate-500">
                Oral Stories
              </div>
            </motion.div>

            <motion.div
              variants={itemVariants}
              whileHover={{ y: -6, scale: 1.02 }}
              className="p-5 rounded-2xl bg-slate-50/60 border border-slate-200/70 hover:border-amber-300 transition-all duration-300 shadow-xs"
            >
              <div className="font-serif text-4xl sm:text-5xl font-extrabold text-amber-600">
                {stats.memoriesCount}
              </div>
              <div className="mt-2 text-xs font-bold tracking-wider uppercase text-slate-500">
                Archived Memories
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* FEATURED STORIES & MEMORIES PREVIEW */}
      <section className="py-20 bg-[#fdfbf7]">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold uppercase tracking-widest border border-amber-200">
                <BookOpen className="w-3.5 h-3.5 text-amber-600" />
                <span>Oral Traditions</span>
              </div>
              <h2 className="mt-3 font-serif text-3xl sm:text-4xl font-bold text-slate-900">
                Preserved Family Stories
              </h2>
            </div>
            <Link
              to="/stories"
              className="inline-flex items-center gap-2 text-sm font-bold text-slate-900 hover:text-amber-600 transition"
            >
              <span>View All Stories</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid gap-6 md:grid-cols-3 mb-20"
          >
            {recentStories.map((story) => (
              <motion.article
                key={story.id}
                variants={itemVariants}
                whileHover={{ y: -8, scale: 1.01 }}
                className="rounded-3xl border border-slate-200/80 bg-white p-7 shadow-sm hover:shadow-2xl hover:border-amber-300 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-xs font-bold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200/60">
                      {story.tag || story.category}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">
                      {story.readTime}
                    </span>
                  </div>

                  <h3 className="font-serif text-xl font-bold text-slate-900 mt-2 hover:text-amber-700 transition">
                    {story.title}
                  </h3>

                  <p className="mt-3 text-sm text-slate-600 leading-relaxed line-clamp-3">
                    {story.summary}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span>Told by {story.author}</span>
                  <Link to="/stories" className="font-bold text-amber-700 hover:underline">
                    Read Story →
                  </Link>
                </div>
              </motion.article>
            ))}
          </motion.div>

          {/* Memories photo showcase */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold uppercase tracking-widest border border-emerald-200">
                <ImageIcon className="w-3.5 h-3.5 text-emerald-600" />
                <span>Visual Milestones</span>
              </div>
              <h2 className="mt-3 font-serif text-3xl sm:text-4xl font-bold text-slate-900">
                Recent Photo Memories
              </h2>
            </div>
            <Link
              to="/memories"
              className="inline-flex items-center gap-2 text-sm font-bold text-slate-900 hover:text-amber-600 transition"
            >
              <span>Explore Photo Vault</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {recentMemories.map((mem) => (
              <motion.div
                key={mem.id}
                variants={itemVariants}
                whileHover={{ y: -8, scale: 1.01 }}
                className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm hover:shadow-2xl transition-all duration-300"
              >
                <div className="relative h-56 w-full overflow-hidden bg-slate-100">
                  <img
                    src={mem.imageUrl}
                    alt={mem.title}
                    className="h-full w-full object-cover group-hover:scale-108 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-4 right-4 text-white">
                    <h4 className="font-serif text-lg font-bold">
                      {mem.title}
                    </h4>
                    <span className="text-xs text-amber-300 flex items-center gap-1 mt-0.5 font-medium">
                      <Calendar className="w-3 h-3" />
                      {mem.date}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA BANNER */}
      <section className="py-20 bg-gradient-to-r from-amber-600 via-amber-500 to-amber-700 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 blur-3xl rounded-full pointer-events-none" />

        <div className="mx-auto max-w-5xl px-6 text-center relative z-10">
          <HeartHandshake className="w-12 h-12 mx-auto text-amber-200 animate-bounce" />
          <h2 className="mt-4 font-serif text-3xl sm:text-4xl lg:text-5xl font-bold">
            Preserving Our Family Heritage
          </h2>
          <p className="mt-4 text-amber-100 text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
            Explore our lineage, traditions, and timeless memories preserved across generations.
          </p>
          <div className="mt-8">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.96 }}>
              <Link
                to="/family-tree"
                className="inline-flex items-center gap-2 rounded-2xl bg-white px-8 py-4 text-base font-bold text-slate-900 shadow-2xl hover:bg-slate-900 hover:text-white transition-all duration-300"
              >
                <span>Explore Family Tree →</span>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
