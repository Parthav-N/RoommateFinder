import mongoose from 'mongoose';

const adminSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  profilePicture: {
    type: String,
    default: null,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
});

const AdminDB = mongoose.model('Admin', adminSchema);
export default AdminDB;
