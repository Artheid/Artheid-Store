
/* The app that opens on index.html */
const MAIN_APP = "besd";


/* Values used by every app unless the app sets its own */
const DEFAULTS = {
  age: "",
  updated: "",
  android: "7.0+",
  price: "Free",
  website: "",
  page: "",
  logo: "",
  apk: "",
  screenshots: [],
};


/* ---------- THE APPS ---------- */
const APPS = {

  besd: {
    name: "BESD",
    company: "Artheid Studio",
    category: "Emergency",
    about: "Bangladesh Emergency Service & Directory (BESD) - all Bangladesh government hotline numbers and emails in one place.",
    tags: ["emergency", "government", "phone"],
    rating: 1.2,
    reviews: "2K",
    downloads: "5k+",
    size: "10 MB",
    version: "v2.0.0",
    updated: "1 October 2026",
    age: "Ages 3+",
    apk: "besd.apk",
    logo: "besd-logo.png",
    screenshots: [
      "besd-1.jpg",
    "besd-2.jpg",
    "besd-3.jpg",
    "besd-4.jpg",
    "besd-5.jpg",
    ],
    colorFrom: "#fb923c", colorTo: "#dc2626",
    glyph: '<path d="M26 8L12 27h10l-3 13 17-21H26z"/>',
  },

  photolock: {
    name: "PhotoLock",
    company: "Artheid Studio",
    category: "Tools",
    about: "Lock your photos with a password so no one else can see them.",
    tags: ["Lock", "photo", "Offline"],
    logo: "photo-lock-logo.png",
    screenshots: [
      "photolock-1.jpg",
      "photolock-2.jpg",
      "photolock-3.jpg",
      ],
    rating: 1.4, 
    reviews: "1K", 
    downloads: "2k+",
    size: "24 MB", 
    version: "1.0",
    updated: "30 September 2026",
    age: "Ages 5+",
    apk: "PhotoLock.apk",
    colorFrom: "#c084fc", 
    colorTo: "#6d28d9",
    glyph: '<path d="M10 38V16l5 4v-8l5 4 4-6 4 6 5-4v8l5-4v22zM20 38v-8h8v8"/>',
  },

}; 

/* Fill missing values with DEFAULTS (do not edit) */
for (const key in APPS) {
  APPS[key] = { ...DEFAULTS, ...APPS[key] };
}