import express from 'express';
import AdminDB from './Admin.js'; // Assuming admin.js is in the same directory
import AllUserDB from '../AllUsers/allUsers.js';
import ListerDB from '../Lister/Lister.js';
import UserDB from '../Users/User.js';

const adminRouter = express.Router();

// CREATE: Add a new admin
adminRouter.post('/admin', async (req, res) => {
    try {
      const { username, password, name, profilePicture } = req.body;
  
      // Check if username already exists in the AllUserDB database
      const existingUser = await AllUserDB.findOne({ username });
      if (existingUser) {
        return res.status(400).json({ message: 'Username already exists in AllUsers database' });
      }
  
      // Check if admin already exists in AdminDB
      const existingAdmin = await AdminDB.findOne({ username });
      if (existingAdmin) {
        return res.status(400).json({ message: 'Admin with this username already exists' });
      }
  
      // Create new entry in AllUser database with role 'admin'
      const newUser = new AllUserDB({
        username,
        password,
        role: 'admin', // Set role to admin
      });
      await newUser.save();
  
      // Create new entry in AdminDB
      const newAdmin = new AdminDB({
        username,
        password,
        name,
        profilePicture,
      });
      await newAdmin.save();
  
      res.status(201).json({ message: 'Admin and user created successfully', admin: newAdmin });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error });
    }
});
  

// READ: Get all admins
adminRouter.get('/admins', async (req, res) => {
  try {
    const admins = await AdminDB.find();
    res.status(200).json({ admins });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// READ: Get a specific admin by ID
adminRouter.get('/admin/:username', async (req, res) => {
  try {
    const admin = await AdminDB.findById(req.params.username);
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }
    res.status(200).json({ admin });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// UPDATE: Edit an admin's details
adminRouter.put('/admin/:username', async (req, res) => {
  try {
    const { username, password, name, profilePicture } = req.body;
    const updatedAdmin = await AdminDB.findByIdAndUpdate(
      req.params.username,
      { username, password, name, profilePicture },
      { new: true }
    );
    if (!updatedAdmin) {
      return res.status(404).json({ message: 'Admin not found' });
    }
    res.status(200).json({ message: 'Admin updated successfully', admin: updatedAdmin });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// DELETE: Remove an admin from both AdminDB and AllUser DB
adminRouter.delete('/admin/:username', async (req, res) => {
    try {
      const { username } = req.params;
      const deletedAdmin = await AdminDB.findOneAndDelete({ username });
      if (!deletedAdmin) {
        return res.status(404).json({ message: 'Admin not found in AdminDB' });
      }
      const deletedUser = await AllUserDB.findOneAndDelete({ username });
      if (!deletedUser) {
        return res.status(404).json({ message: 'User not found in AllUser DB' });
      }
      res.status(200).json({ message: 'Admin and user deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error });
    }
  });
  

// Get all users (excluding admins and listers)
adminRouter.get('/users', async (req, res) => {
  try {
    const users = await UserDB.find().select('-password');
    res.status(200).json({ users });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error: error.message });
  }
});

// Get all listers
adminRouter.get('/listers', async (req, res) => {
  try {
    const listers = await ListerDB.find({});
    res.status(200).json({ listers });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching listers', error: error.message });
  }
});

// Get all listings (across all listers)
adminRouter.get('/listings', async (req, res) => {
  try {
    const listers = await ListerDB.find({});
    const allListings = listers.reduce((acc, lister) => {
      return [...acc, ...lister.listings.map(listing => ({
        ...listing.toObject(),
        listerUsername: lister.username
      }))];
    }, []);
    
    res.status(200).json({ listings: allListings });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching listings', error: error.message });
  }
});

// Remove a user
adminRouter.delete('/users/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    await UserDB.findByIdAndDelete(userId);
    await AllUserDB.findOneAndDelete({ username: userId });
    res.status(200).json({ message: 'User removed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error removing user', error: error.message });
  }
});

// Remove a lister
adminRouter.delete('/listers/:listerId', async (req, res) => {
  try {
    const { listerId } = req.params;
    const lister = await ListerDB.findById(listerId);
    if (!lister) {
      return res.status(404).json({ message: 'Lister not found' });
    }
    
    // Remove from both ListerDB and AllUserDB
    await ListerDB.findByIdAndDelete(listerId);
    await AllUserDB.findOneAndDelete({ username: lister.username });
    
    res.status(200).json({ message: 'Lister removed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error removing lister', error: error.message });
  }
});

// Delete a listing
adminRouter.delete('/listings/:listingId', async (req, res) => {
  try {
    const { listingId } = req.params;
    
    // Find the lister that has this listing
    const lister = await ListerDB.findOne({ 'listings._id': listingId });
    
    if (!lister) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    // Remove the listing from the lister's listings array
    lister.listings = lister.listings.filter(
      listing => listing._id.toString() !== listingId
    );
    
    await lister.save();
    res.status(200).json({ message: 'Listing removed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error removing listing', error: error.message });
  }
});

export default adminRouter;
