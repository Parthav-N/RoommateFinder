import mongoose from "mongoose";
const Schema = mongoose.Schema;

const allUsersSchema = new Schema({
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
  name: {
    type: String,
    required: true,
    trim: true,
  },
  role: {
    type: String,
    enum: ['admin', 'user', 'lister'],
    default: 'user',
  },
  hasCompletedOnboarding: {
    type: Boolean,
    default: false
  }
});

const AllUserDB = mongoose.model('AllUser', allUsersSchema);

export default AllUserDB;
