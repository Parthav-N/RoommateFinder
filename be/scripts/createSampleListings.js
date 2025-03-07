import mongoose from 'mongoose';
import ListerDB from '../Lister/Lister.js';
import AllUserDB from '../AllUsers/allUsers.js';
import dotenv from 'dotenv';

dotenv.config();

const sampleListings = [
  {
    distanceFromUniv: 0.3,
    rent: 1800,
    numberOfRooms: 2,
    numberOfBathrooms: 1,
    squareFoot: 850,
    description: "Cozy 2-bed apartment with modern amenities, walking distance to NEU."
  },
  {
    distanceFromUniv: 1.5,
    rent: 2500,
    numberOfRooms: 3,
    numberOfBathrooms: 2,
    squareFoot: 1200,
    description: "Spacious 3-bed unit with updated kitchen, perfect for students."
  },
  {
    distanceFromUniv: 0.8,
    rent: 1500,
    numberOfRooms: 1,
    numberOfBathrooms: 1,
    squareFoot: 600,
    description: "Studio apartment in historic building, all utilities included."
  },
  {
    distanceFromUniv: 2.1,
    rent: 3200,
    numberOfRooms: 4,
    numberOfBathrooms: 2.5,
    squareFoot: 1800,
    description: "Large 4-bed house with backyard, perfect for group living."
  },
  {
    distanceFromUniv: 0.4,
    rent: 2200,
    numberOfRooms: 2,
    numberOfBathrooms: 2,
    squareFoot: 950,
    description: "Luxury 2-bed with in-unit laundry and parking spot."
  }
];

const sampleListers = [
  {
    username: "john.smith",
    name: "John Smith",
    contactInfo: {
      email: "john.smith@example.com",
      phone: "617-555-0101",
      preferredContact: "email"
    },
    listings: [sampleListings[0], sampleListings[1]]
  },
  {
    username: "mary.jones",
    name: "Mary Jones",
    contactInfo: {
      email: "mary.jones@example.com",
      phone: "617-555-0102",
      preferredContact: "phone"
    },
    listings: [sampleListings[2]]
  },
  {
    username: "david.wilson",
    name: "David Wilson",
    contactInfo: {
      email: "david.wilson@example.com",
      phone: "617-555-0103",
      preferredContact: "email"
    },
    listings: [sampleListings[3], sampleListings[4]]
  }
];

async function createSampleListings() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    // Clear existing sample listers
    await ListerDB.deleteMany({
      username: { $in: sampleListers.map(lister => lister.username) }
    });
    await AllUserDB.deleteMany({
      username: { $in: sampleListers.map(lister => lister.username) }
    });

    // Create listers and their listings
    for (const listerData of sampleListers) {
      const allUserData = {
        username: listerData.username,
        name: listerData.name,
        password: "Password123!",
        hasCompletedOnboarding: true,
        role: 'lister'
      };

      await AllUserDB.create(allUserData);
      await ListerDB.create(listerData);
    }

    console.log('Sample listings created successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error creating sample listings:', error);
    process.exit(1);
  }
}

createSampleListings();