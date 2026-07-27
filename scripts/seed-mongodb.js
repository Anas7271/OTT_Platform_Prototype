import { MongoClient } from 'mongodb';
import bcrypt from 'bcryptjs';

const MONGODB_URI = "mongodb+srv://anas71nal:uqQS68UGBGuqPXMQ@cluster0.y9rbyf5.mongodb.net/ott-platform?retryWrites=true&w=majority";

const initialAdmins = [
  {
    username: "AnasAdmin",
    email: "admin@streamflix.com",
    password: "AnasAdmin@123",
    role: "admin",
    subscriptionPlan: "premium",
    status: "Active",
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

const initialMediaList = [
  {
    contentId: "content-1",
    title: "Interstellar",
    type: "Movie",
    industry: "Hollywood",
    category: "Sci-Fi",
    genres: ["Sci-Fi", "Drama", "Adventure"],
    imdbRating: 8.7,
    maturityRating: "PG-13",
    year: 2014,
    duration: "2h 49m",
    posterUrl: "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=800&q=80",
    bannerUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1600&q=80",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
    synopsis: "When Earth becomes uninhabitable, a team of ex-NASA astronauts leads a daring mission through a wormhole near Saturn to find a new home for humanity across interstellar space.",
    cast: ["Matthew McConaughey", "Anne Hathaway", "Jessica Chastain", "Michael Caine"],
    director: "Christopher Nolan",
    isFeatured: true,
    isTrending: true,
    accessLevel: "everyone",
    uploadedBy: "AnasAdmin",
    createdAt: new Date()
  },
  {
    contentId: "content-2",
    title: "RRR",
    type: "Movie",
    industry: "Bollywood",
    category: "Action",
    genres: ["Action", "Drama", "History"],
    imdbRating: 7.8,
    maturityRating: "U/A 16+",
    year: 2022,
    duration: "3h 07m",
    posterUrl: "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=800&q=80",
    bannerUrl: "https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=1600&q=80",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
    synopsis: "A fictitious story about two legendary revolutionaries—Alluri Sitarama Raju and Komaram Bheem—and their journey away from home before they started fighting for their country in the 1920s.",
    cast: ["N.T. Rama Rao Jr.", "Ram Charan", "Ajay Devgn", "Alia Bhatt"],
    director: "S.S. Rajamouli",
    isFeatured: true,
    isTrending: true,
    accessLevel: "everyone",
    uploadedBy: "AnasAdmin",
    createdAt: new Date()
  },
  {
    contentId: "content-3",
    title: "Mirzapur",
    type: "Web Series",
    industry: "Bollywood",
    category: "Crime",
    genres: ["Crime", "Action", "Thriller"],
    imdbRating: 8.5,
    maturityRating: "18+",
    year: 2018,
    duration: "3 Seasons",
    posterUrl: "https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=800&q=80",
    bannerUrl: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&w=1600&q=80",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4",
    synopsis: "A shocking incident at a wedding procession ignites a series of events entangling the lives of two brothers with Kaleen Bhaiya, an un-crowned King of Mirzapur in Purvanchal.",
    cast: ["Pankaj Tripathi", "Ali Fazal", "Divyenndu", "Shweta Tripathi"],
    director: "Karan Anshuman & Gurmmeet Singh",
    isFeatured: true,
    isTrending: true,
    accessLevel: "everyone",
    uploadedBy: "AnasAdmin",
    createdAt: new Date()
  },
  {
    contentId: "content-4",
    title: "Stree 2",
    type: "Movie",
    industry: "Bollywood",
    category: "Comedy",
    genres: ["Comedy", "Horror", "Mystery"],
    imdbRating: 7.5,
    maturityRating: "U/A 13+",
    year: 2024,
    duration: "2h 27m",
    posterUrl: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80",
    bannerUrl: "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1600&q=80",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
    synopsis: "The town of Chanderi is haunted once again by a new headless malevolent entity known as 'Sarkata'. Vicky and his friends team up with a mysterious girl to save Chanderi's women.",
    cast: ["Rajkummar Rao", "Shraddha Kapoor", "Pankaj Tripathi", "Abhishek Banerjee"],
    director: "Amar Kaushik",
    isFeatured: false,
    isTrending: true,
    accessLevel: "everyone",
    uploadedBy: "AnasAdmin",
    createdAt: new Date()
  },
  {
    contentId: "content-5",
    title: "The Dark Knight",
    type: "Movie",
    industry: "Hollywood",
    category: "Action",
    genres: ["Superhero", "Action", "Crime"],
    imdbRating: 9.0,
    maturityRating: "PG-13",
    year: 2008,
    duration: "2h 32m",
    posterUrl: "https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=800&q=80",
    bannerUrl: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1600&q=80",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    synopsis: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
    cast: ["Christian Bale", "Heath Ledger", "Aaron Eckhart", "Gary Oldman"],
    director: "Christopher Nolan",
    isFeatured: true,
    isTrending: true,
    accessLevel: "everyone",
    uploadedBy: "AnasAdmin",
    createdAt: new Date()
  },
  {
    contentId: "content-6",
    title: "Stranger Things",
    type: "Web Series",
    industry: "Hollywood",
    category: "Sci-Fi",
    genres: ["Sci-Fi", "Horror", "Drama"],
    imdbRating: 8.7,
    maturityRating: "TV-14",
    year: 2016,
    duration: "4 Seasons",
    posterUrl: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80",
    bannerUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1600&q=80",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    synopsis: "When a young boy vanishes in the small town of Hawkins, Indiana, his mother, a police chief, and his friends must confront terrifying supernatural forces and a telekinetic girl named Eleven.",
    cast: ["Millie Bobby Brown", "Finn Wolfhard", "Winona Ryder", "David Harbour"],
    director: "The Duffer Brothers",
    isFeatured: false,
    isTrending: true,
    accessLevel: "everyone",
    uploadedBy: "AnasAdmin",
    createdAt: new Date()
  },
  {
    contentId: "content-7",
    title: "Oppenheimer",
    type: "Movie",
    industry: "Hollywood",
    category: "Drama",
    genres: ["Biography", "Drama", "History"],
    imdbRating: 8.9,
    maturityRating: "R",
    year: 2023,
    duration: "3h 00m",
    posterUrl: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&w=800&q=80",
    bannerUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1600&q=80",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    synopsis: "The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb during World War II at the Manhattan Project in Los Alamos.",
    cast: ["Cillian Murphy", "Emily Blunt", "Matt Damon", "Robert Downey Jr."],
    director: "Christopher Nolan",
    isFeatured: true,
    isTrending: true,
    accessLevel: "everyone",
    uploadedBy: "AnasAdmin",
    createdAt: new Date()
  },
  {
    contentId: "content-8",
    title: "Dangal",
    type: "Movie",
    industry: "Bollywood",
    category: "Drama",
    genres: ["Biography", "Drama", "Sport"],
    imdbRating: 8.3,
    maturityRating: "U",
    year: 2016,
    duration: "2h 49m",
    posterUrl: "https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&w=800&q=80",
    bannerUrl: "https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&w=1600&q=80",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WhatCarCanYouGetForAGrand.mp4",
    synopsis: "Former wrestler Mahavir Singh Phogat and his daughters Geeta and Babita train to overcome societal stigmas and win India's first gold medal in female wrestling at the Commonwealth Games.",
    cast: ["Aamir Khan", "Sakshi Tanwar", "Fatima Sana Shaikh", "Sanya Malhotra"],
    director: "Nitesh Tiwari",
    isFeatured: false,
    isTrending: true,
    accessLevel: "everyone",
    uploadedBy: "AnasAdmin",
    createdAt: new Date()
  },
  {
    contentId: "content-9",
    title: "Panchayat",
    type: "Web Series",
    industry: "Bollywood",
    category: "Comedy",
    genres: ["Comedy", "Drama"],
    imdbRating: 8.9,
    maturityRating: "U/A 13+",
    year: 2020,
    duration: "3 Seasons",
    posterUrl: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80",
    bannerUrl: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1600&q=80",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4",
    synopsis: "Abhishek, an engineering graduate, takes up a job as a secretary of a Panchayat office in a remote village called Phulera, Uttar Pradesh due to lack of better job options.",
    cast: ["Jitendra Kumar", "Raghubir Yadav", "Neena Gupta", "Faisal Malik"],
    director: "Deepak Kumar Mishra",
    isFeatured: false,
    isTrending: true,
    accessLevel: "everyone",
    uploadedBy: "AnasAdmin",
    createdAt: new Date()
  },
  {
    contentId: "content-10",
    title: "Spider-Man: Across the Spider-Verse",
    type: "Movie",
    industry: "Hollywood",
    category: "Sci-Fi",
    genres: ["Animation", "Action", "Sci-Fi"],
    imdbRating: 8.7,
    maturityRating: "PG",
    year: 2023,
    duration: "2h 20m",
    posterUrl: "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80",
    bannerUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1600&q=80",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
    synopsis: "Miles Morales catapults across the Multiverse, where he encounters a team of Spider-People charged with protecting its very existence. But when the heroes clash on how to handle a new threat, Miles must redefine what it means to be a hero.",
    cast: ["Shameik Moore", "Hailee Steinfeld", "Oscar Isaac", "Jake Johnson"],
    director: "Joaquim Dos Santos, Kemp Powers, Justin K. Thompson",
    isFeatured: true,
    isTrending: true,
    accessLevel: "everyone",
    uploadedBy: "AnasAdmin",
    createdAt: new Date()
  }
];

async function seedDatabase() {
  const client = new MongoClient(MONGODB_URI);
  try {
    console.log("Connecting to MongoDB Atlas...");
    await client.connect();
    console.log("Connected successfully!");

    const db = client.db('ott-platform');
    const usersCollection = db.collection('users');
    const contentCollection = db.collection('content');

    // 1. Wipe old users & admins
    console.log("Clearing existing users and admins...");
    await usersCollection.deleteMany({});

    // Hash admin password
    const hashedPassword = await bcrypt.hash("AnasAdmin@123", 10);
    const adminUserDoc = {
      username: "AnasAdmin",
      email: "admin@streamflix.com",
      password: hashedPassword,
      role: "admin",
      subscriptionPlan: "premium",
      status: "Active",
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const insertedAdmin = await usersCollection.insertOne(adminUserDoc);
    console.log(`✅ Admin created with ID: ${insertedAdmin.insertedId}`);

    // 2. Wipe old content and seed 10 distinct content types
    console.log("Clearing old content collection...");
    await contentCollection.deleteMany({});

    const docsToInsert = initialMediaList.map(item => ({
      ...item,
      uploadedBy: insertedAdmin.insertedId
    }));

    const result = await contentCollection.insertMany(docsToInsert);
    console.log(`✅ Inserted ${result.insertedCount} content items into MongoDB Atlas!`);

    console.log("\n---------------------------------------------------");
    console.log("🎉 MONGODB ATLAS SEED COMPLETED SUCCESSFULLY!");
    console.log("---------------------------------------------------");
    console.log("Database: ott-platform");
    console.log("Admin Username: AnasAdmin");
    console.log("Admin Email:    admin@streamflix.com");
    console.log("Admin Password: AnasAdmin@123");
    console.log("Content Count:  10 distinct Hollywood & Bollywood titles with 30s videos");
    console.log("---------------------------------------------------\n");

  } catch (error) {
    console.error("❌ Seed Error:", error);
  } finally {
    await client.close();
  }
}

seedDatabase();
