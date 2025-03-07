import mongoose from 'mongoose';
import UserDB from '../Users/User.js';
import AllUserDB from '../AllUsers/allUsers.js';
import dotenv from 'dotenv';

dotenv.config();

const sampleUsers = [
  {
    username: "sarah.j",
    name: "Sarah Johnson",
    gender: "Female",
    openToRoommateFind: true,
    budget: 2000,
<<<<<<< HEAD
    leaseDuration: "Long-term",
=======
    leaseDuration: 12,
>>>>>>> c5ed403b8f6f6b60f91f49cd821b9ab5b555b35e
    smoking: false,
    drinking: false,
    openToMixedGender: false,
    profile: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
    contactInfo: {
      email: "sarah.j@example.com",
      phone: "123-456-7890",
      preferredContact: "email"
    }
  },
  {
    username: "michael.c",
    name: "Michael Chen",
    gender: "Male",
    openToRoommateFind: true,
    budget: 1500,
<<<<<<< HEAD
    leaseDuration: "Short-term",
=======
    leaseDuration: 3,
>>>>>>> c5ed403b8f6f6b60f91f49cd821b9ab5b555b35e
    smoking: false,
    drinking: true,
    openToMixedGender: true,
    profile: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
    contactInfo: {
      email: "michael.c@example.com",
      phone: "123-456-7891",
      preferredContact: "phone"
    }
  },
  {
    username: "emma.w",
    name: "Emma Wilson",
    gender: "Female",
    openToRoommateFind: true,
    budget: 2500,
<<<<<<< HEAD
    leaseDuration: "Long-term",
=======
    leaseDuration: 12,
>>>>>>> c5ed403b8f6f6b60f91f49cd821b9ab5b555b35e
    smoking: false,
    drinking: true,
    openToMixedGender: true,
    profile: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80",
    contactInfo: {
      email: "emma.w@example.com",
      phone: "123-456-7892",
      preferredContact: "email"
    }
  },
  {
    username: "david.p",
    name: "David Park",
    gender: "Male",
    openToRoommateFind: true,
    budget: 1800,
<<<<<<< HEAD
    leaseDuration: "Month-to-month",
=======
    leaseDuration: 1,
>>>>>>> c5ed403b8f6f6b60f91f49cd821b9ab5b555b35e
    smoking: true,
    drinking: true,
    openToMixedGender: false,
    profile: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e",
    contactInfo: {
      email: "david.p@example.com",
      phone: "123-456-7893",
      preferredContact: "phone"
    }
  },
  {
    username: "pariv.p",
    name: "Pariv Patel",
    gender: "Male",
    openToRoommateFind: false,
    budget: 1800,
<<<<<<< HEAD
    leaseDuration: "Month-to-month",
=======
    leaseDuration: 1,
>>>>>>> c5ed403b8f6f6b60f91f49cd821b9ab5b555b35e
    smoking: true,
    drinking: true,
    openToMixedGender: false,
    profile: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e",
    contactInfo: {
      email: "pariv.p@example.com",
      phone: "123-456-7893",
      preferredContact: "phone"
    }
  },
  // Add more sample users as needed
];

async function createSampleUsers() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    // Clear existing sample users
    await UserDB.deleteMany({
      username: { $in: sampleUsers.map(user => user.username) }
    });
    await AllUserDB.deleteMany({
      username: { $in: sampleUsers.map(user => user.username) }
    });

    // Create users in both collections
    for (const userData of sampleUsers) {
      const allUserData = {
        username: userData.username,
        name: userData.name,
        password: "Password123!",
        hasCompletedOnboarding: true,
        role: 'user'
      };

      await AllUserDB.create(allUserData);
      await UserDB.create(userData);
    }

    console.log('Sample users created successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error creating sample users:', error);
    process.exit(1);
  }
}

createSampleUsers();