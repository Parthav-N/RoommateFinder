import express from "express";
import UserDB from "./User.js";
import AllUserDB from "../AllUsers/allUsers.js";
import { authenticateToken } from "../middleware/auth.js";
import ListerDB from "../Lister/Lister.js"

const userRouter = express.Router();

// Complete profile route
userRouter.post("/complete-profile", authenticateToken, async (req, res) => {
  try {
    const existingUser = await AllUserDB.findOne({ username: req.user.username });
    if (!existingUser) {
      return res.status(404).json({ message: "User not found in AllUsers database" });
    }

    // Log the incoming data
    console.log('Creating profile with data:', {
      ...req.body,
      username: req.user.username,
      name: existingUser.name
    });

    // Create new user profile with explicit schema matching
    const userProfile = new UserDB({
      username: req.user.username,
      name: existingUser.name,
      gender: req.body.gender,
      openToRoommateFind: req.body.openToRoommateFind,
      budget: req.body.budget,
      leaseDuration: req.body.leaseDuration,
      smoking: req.body.smoking,
      drinking: req.body.drinking,
      openToMixedGender: req.body.openToMixedGender,
      contactInfo: {
        email: req.body.contactInfo.email,
        phone: req.body.contactInfo.phone,
        preferredContact: req.body.contactInfo.preferredContact
      }
    });

    // Log the user profile before saving
    console.log('User profile before save:', userProfile);

    // Save the profile
    await userProfile.save();

    // Fetch the saved profile to verify data
    const savedProfile = await UserDB.findById(userProfile._id);
    console.log('Saved profile from database:', savedProfile);

    // Update AllUsers
    await AllUserDB.findOneAndUpdate(
      { username: req.user.username },
      { hasCompletedOnboarding: true }
    );

    // Create response with explicit inclusion of contactInfo
    const responseData = {
      message: "Profile completed successfully",
      user: {
        ...savedProfile.toObject(),
        role: existingUser.role,
        hasCompletedOnboarding: true,
        contactInfo: savedProfile.contactInfo // Explicitly include contactInfo
      }
    };

    console.log('Final response data:', responseData);
    res.status(201).json(responseData);

  } catch (error) {
    console.error('Profile completion error:', error);
    res.status(500).json({
      message: "Error completing profile",
      error: error.message,
      stack: error.stack
    });
  }
});

// Get user profile
userRouter.get("/profile", authenticateToken, async (req, res) => {
  try {
    const user = await UserDB.findOne({ username: req.user.username });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ message: "Server error" });
  }
});



userRouter.get("/getId", authenticateToken, async (req, res) => {
  try {
    const user = await UserDB.findOne({ username: req.user.username });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user._id);
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ message: "Server error" });
  }
})

// Update user profile
userRouter.put("/update-profile", authenticateToken, async (req, res) => {
  try {
    console.log('Received update request:', req.body);

    // Explicitly structure the update data
    const updateData = {
      name: req.body.name,
      gender: req.body.gender,
      openToRoommateFind: req.body.openToRoommateFind,
      budget: req.body.budget,
      leaseDuration: req.body.leaseDuration,
      smoking: req.body.smoking,
      drinking: req.body.drinking,
      openToMixedGender: req.body.openToMixedGender,
      contactInfo: {
        email: req.body.contactInfo?.email,
        phone: req.body.contactInfo?.phone,
        preferredContact: req.body.contactInfo?.preferredContact
      }
    };

    console.log('Structured update data:', updateData);

    const updatedUser = await UserDB.findOneAndUpdate(
      { username: req.user.username },
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    console.log('Updated user in database:', updatedUser);
    res.json(updatedUser);
  } catch (error) {
    console.error('Update error:', error);
    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
});

// Public route for searching roommates
userRouter.get("/potential-roommates", async (req, res) => {
  try {
    const query = { openToRoommateFind: true };

    // Add budget filter
    if (req.query.budget) {
      const [min, max] = req.query.budget.split('-').map(Number);
      query.budget = { $gte: min, $lte: max };
    }

    // Add lease duration filter
    if (req.query.leaseDuration) {
      query.leaseDuration = parseInt(req.query.leaseDuration);
    }

    // Add smoking filter
    if (req.query.smoking) {
      query.smoking = req.query.smoking === 'smoking';
    }

    // Add drinking filter
    if (req.query.drinking) {
      query.drinking = req.query.drinking === 'drinking';
    }

    // Add gender preference filter
    if (req.query.genderPreference) {
      query.openToMixedGender = req.query.genderPreference === 'multiple-gender';
    }

    console.log('Final query:', query);

    const potentialRoommates = await UserDB.find(query);

    console.log('Found potential roommates:', potentialRoommates.length);

    res.json(potentialRoommates);
  } catch (error) {
    console.error('Error fetching potential roommates:', error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get user profile by ID - Modified to handle public access
userRouter.get("/profile/:userId", async (req, res) => {
  try {
    const userProfile = await UserDB.findById(req.params.userId);

    if (!userProfile) {
      return res.status(404).json({ message: "User profile not found" });
    }

    // Create a public version of the profile without sensitive information
    const publicProfile = {
      name: userProfile.name,
      budget: userProfile.budget,
      leaseDuration: userProfile.leaseDuration,
      gender: userProfile.gender,
      smoking: userProfile.smoking,
      drinking: userProfile.drinking,
      openToMixedGender: userProfile.openToMixedGender,
      profile: userProfile.profile
    };

    res.json(publicProfile);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get full user profile by ID (protected route)
userRouter.get("/profile/:userId/full", authenticateToken, async (req, res) => {
  try {
    const userProfile = await UserDB.findById(req.params.userId);

    if (!userProfile) {
      return res.status(404).json({ message: "User profile not found" });
    }

    res.json(userProfile);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get all the saved listings from the user
userRouter.get("/saved-listings", authenticateToken, async (req, res) => {
  try {

    const user = await UserDB.findOne({ username: req.user.username });

    // If the user is not found, return a 404 error
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Fetch listings based on the savedListing IDs in the user's savedListings array
    const listings = await ListerDB.aggregate([
      { $unwind: "$listings" }, // Flatten the embedded listings array
      {
        $match: {
          "listings._id": { $in: user.savedListings }, // Match saved listing IDs
        },
      },
      {
        $replaceRoot: { newRoot: "$listings" }, // Replace the root with the listings
      },
    ]);

    // Respond with the populated listings
    console.log("Saved listing", listings)
    res.status(200).json({ savedListings: listings });
  } catch (error) {
    console.error("Error fetching saved listings:", error);
    res.status(500).json({ message: "Server error" });
  }
});



// Post a save listings to the user
userRouter.post("/saved-listings/:userId/:listingId", authenticateToken, async (req, res) => {
  try {
    console.log("first")

    const userId = req.params.userId
    const listingId = req.params.listingId;


    const user = await UserDB.findById(userId);

    console.log(userId, listingId, user)

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.savedListings.includes(listingId)) {
      user.savedListings.push(listingId);
      await user.save();
    }

    res.status(200).json({ message: "Listing added to saved listings", savedListings: user.savedListings });
  } catch (error) {
    console.error('Error adding listing to saved listings:', error);
    res.status(500).json({ message: "Server error" });
  }
});

// Delete a saved listing from the user
userRouter.delete("/saved-listings/:listingId", authenticateToken, async (req, res) => {
  try {

    const user = await UserDB.findOne({ username: req.user.username });

    const listingId = req.params.listingId

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const index = user.savedListings.indexOf(listingId);
    if (index === -1) {
      return res.status(400).json({ message: "Listing not found in saved listings" });
    }

    user.savedListings.splice(index, 1);
    await user.save();

    res.status(200).json({ message: "Listing removed from saved listings", savedListings: user.savedListings });
  } catch (error) {
    console.error('Error deleting listing from saved listings:', error);
    res.status(500).json({ message: "Server error" });
  }
});


export default userRouter;