import mongoose from "mongoose";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import Family from "./models/Family.js";
import User from "./models/User.js";
import Member from "./models/Member.js";
import Story from "./models/Story.js";
import Memory from "./models/Memory.js";
import Event from "./models/Event.js";

dotenv.config();

const rawMembers = [
  {
    code: "m1",
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
    profilePhoto: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop",
  },
  {
    code: "m2",
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
    profilePhoto: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=400&auto=format&fit=crop",
  },
  {
    code: "m3",
    name: "Sorokhaibam Komol Meitei",
    relation: "Father",
    generation: 2,
    gender: "male",
    parentCode: "m1",
    dateOfBirth: "1972-01-10",
    biography: "Pioneered sustainable agriculture in the valley. Built the family homestead and served as community elder for over 30 years.",
    location: "Imphal East, Manipur",
    profession: "Agronomist",
    interests: ["Horticulture", "Carpentry", "Chess"],
    profilePhoto: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=400&auto=format&fit=crop",
  },
  {
    code: "m4",
    name: "Sorokhaibam Landhoni Leima",
    relation: "Mother",
    generation: 2,
    gender: "female",
    parentCode: "m1",
    dateOfBirth: "1974-09-24",
    biography: "Passionate educator who established the first community literacy center for women in the region.",
    location: "Imphal East, Manipur",
    profession: "Teacher",
    interests: ["Literature", "Calligraphy", "Baking"],
    profilePhoto: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop",
  },
  {
    code: "m5",
    name: "Sorokhaibam Sanakhomba Meitei",
    relation: "Sibling",
    generation: 3,
    gender: "male",
    parentCode: "m3",
    dateOfBirth: "1978-05-18",
    biography: "Civil engineer dedicated to eco-friendly architecture. Enthusiastic nature photographer and family archivist.",
    location: "Guwahati / Imphal",
    profession: "Civil Engineer",
    interests: ["Photography", "Trekking", "Guitar"],
    profilePhoto: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&auto=format&fit=crop",
  },
  {
    code: "m6",
    name: "Sorokhaibam Uttam Meitei",
    relation: "Sibling",
    generation: 3,
    gender: "male",
    parentCode: "m4",
    dateOfBirth: "1982-12-05",
    biography: "Renowned doctor and advocate for rural healthcare outreach. Loves hosting family gatherings.",
    location: "Guwahati",
    profession: "Physician",
    interests: ["Medical Research", "Gardening", "Classical Dance"],
    profilePhoto: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=400&auto=format&fit=crop",
  },
  {
    code: "m7",
    name: "Sorokhaibam Tolentomba Meitei",
    relation: "Son / You",
    generation: 4,
    gender: "male",
    parentCode: "m5",
    dateOfBirth: "2004-08-22",
    biography: "Software developer and UI designer creating modern digital archives to preserve cultural heritage.",
    location: "Bengaluru",
    profession: "Software Engineer",
    interests: ["Web Dev", "Digital Art", "Robotics"],
    profilePhoto: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=400&auto=format&fit=crop",
  },
  {
    code: "m8",
    name: "Thoibi Chanu",
    relation: "Daughter / Sister",
    generation: 4,
    gender: "female",
    parentCode: "m5",
    dateOfBirth: "2008-11-03",
    biography: "Aspiring badminton champion and high school valedictorian. Loves digital illustration and music.",
    location: "Guwahati",
    profession: "Student & Athlete",
    interests: ["Badminton", "Digital Art", "Violin"],
    profilePhoto: "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=400&auto=format&fit=crop",
  },
];

const mockStories = [
  {
    title: "The Golden Harvest of 1974",
    category: "History",
    tag: "Ancestry",
    author: "Sanatomba Meitei",
    date: "October 1974",
    readTime: "4 min read",
    summary: "How Great-Grandfather Ningthouba led the community during the record harvest that saved the village during drought.",
    content: "In the late autumn of 1974, an unexpected early frost threatened the valley crops. Great-Grandfather Ningthouba organized night watches and innovative smoking pots around the paddies. Not only did our family save our harvest, but we shared over 50 bags of grain with neighboring families.",
  },
  {
    title: "Weaving Dreams: The Royal Phanek",
    category: "Tradition",
    tag: "Craft",
    author: "Leimakhubi Chanu",
    date: "May 1989",
    readTime: "5 min read",
    summary: "The story behind the hand-woven silk Phanek crafted for the grand 1989 family reunion.",
    content: "Mastering the loom requires patience, rhythm, and love. Great-Grandmother spent four months weaving intricate floral and geometric motifs onto pure silk. Each pattern represented a branch of our family tree.",
  },
  {
    title: "Childhood at Loktak Lake",
    category: "Memories",
    tag: "Childhood",
    author: "Chaoba Singh",
    date: "July 1995",
    readTime: "3 min read",
    summary: "Unforgettable summer afternoons fishing, floating on phumdis, and watching sunset over the waters.",
    content: "Every summer holiday, Father would take us to Loktak Lake. We built makeshift bamboo rafts and spent hours exploring floating islands, eating fresh lotus seeds, and listening to old folk tales under the stars.",
  },
];

const mockMemories = [
  {
    title: "Centennial Family Reunion 2024",
    date: "2024-12-28",
    location: "Imphal Homestead",
    category: "Reunion",
    imageUrl: "https://images.unsplash.com/photo-1511895426328-dc8714191300?q=80&w=1000&auto=format&fit=crop",
    caption: "Over 45 family members gathered from around the world to celebrate our heritage.",
    likes: 24,
  },
  {
    title: "Grandmother Tombi's 70th Celebration",
    date: "2023-09-24",
    location: "Guwahati Garden Resort",
    category: "Birthday",
    imageUrl: "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?q=80&w=1000&auto=format&fit=crop",
    caption: "Four generations smiling together under the fairy light canopy.",
    likes: 38,
  },
  {
    title: "Harvest Festival Rituals",
    date: "2022-11-15",
    location: "Ancestral Paddy Fields",
    category: "Festival",
    imageUrl: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?q=80&w=1000&auto=format&fit=crop",
    caption: "Traditional blessing of the first seasonal rice yield.",
    likes: 19,
  },
  {
    title: "Thoibi's State Badminton Trophy",
    date: "2025-02-10",
    location: "Indira Gandhi Indoor Stadium",
    category: "Milestone",
    imageUrl: "https://images.unsplash.com/photo-1519766304817-4f37bda74a29?q=80&w=1000&auto=format&fit=crop",
    caption: "Proud parents cheering as Thoibi takes home gold in the under-18 championship!",
    likes: 42,
  },
];

const mockEvents = [
  {
    title: "Annual Ningol Chakouba Feast",
    date: "2026-10-18",
    time: "12:00 PM - 5:00 PM",
    location: "Ancestral Homestead, Imphal",
    type: "Festival",
    description: "Grand annual celebration honoring sisters and daughters with a traditional feast and blessings.",
    attendees: 32,
    isUpcoming: true,
  },
  {
    title: "Grandfather Sanatomba's 75th Birthday",
    date: "2026-09-10",
    time: "6:00 PM onwards",
    location: "Valley Banquet Hall",
    type: "Birthday",
    description: "Special evening dinner and memory slideshow celebrating 75 wonderful years.",
    attendees: 28,
    isUpcoming: true,
  },
  {
    title: "Family Tree Heritage Documentation Drive",
    date: "2026-08-30",
    time: "10:00 AM",
    location: "Online Zoom / Studio",
    type: "Workshop",
    description: "Collecting vintage photos and oral history recordings for the Emung digital archive.",
    attendees: 15,
    isUpcoming: true,
  },
];

export const seedDatabase = async () => {
  try {
    if (mongoose.connection.readyState === 0) {
      await connectDB();
    }

    console.log("Cleaning database collections...");
    await Family.deleteMany({});
    await User.deleteMany({});
    await Member.deleteMany({});
    await Story.deleteMany({});
    await Memory.deleteMany({});
    await Event.deleteMany({});

    // 1. Create Default Family
    const family = await Family.create({
      name: "Emung Family Heritage",
      familyCode: "EMUNG-MAIN",
      settings: { allowMemberAddMember: true, allowMemberCreateEvent: true },
    });

    // 2. Create Members (Resolve Parents)
    const codeToIdMap = {};

    // First pass: create without parent links
    for (const item of rawMembers) {
      const { code, parentCode, ...data } = item;
      const created = await Member.create({
        ...data,
        family: family._id,
      });
      codeToIdMap[code] = created._id;
    }

    // Second pass: link parent IDs
    for (const item of rawMembers) {
      if (item.parentCode && codeToIdMap[item.parentCode]) {
        await Member.findByIdAndUpdate(codeToIdMap[item.code], {
          parent: codeToIdMap[item.parentCode],
        });
      }
    }

    console.log("Family Members seeded.");

    // 3. Create Admin & Member Users
    const adminUser = await User.create({
      name: "Laishram Admin",
      email: "admin@emung.org",
      password: "admin123",
      role: "admin",
      family: family._id,
      memberProfile: codeToIdMap["m5"],
    });

    const memberUser = await User.create({
      name: "Yaiphaba Member",
      email: "member@emung.org",
      password: "member123",
      role: "member",
      family: family._id,
      memberProfile: codeToIdMap["m7"],
    });

    console.log("Admin and Member users created.");

    // 4. Create Stories
    for (const s of mockStories) {
      await Story.create({
        ...s,
        authorUser: adminUser._id,
        family: family._id,
      });
    }

    // 5. Create Memories
    for (const m of mockMemories) {
      await Memory.create({
        ...m,
        authorUser: adminUser._id,
        family: family._id,
      });
    }

    // 6. Create Events
    for (const e of mockEvents) {
      await Event.create({
        ...e,
        authorUser: adminUser._id,
        family: family._id,
        rsvps: [adminUser.email, memberUser.email],
      });
    }

    console.log("Database seeded successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
};

if (process.argv[1].endsWith("seed.js")) {
  seedDatabase().then(() => mongoose.connection.close());
}
