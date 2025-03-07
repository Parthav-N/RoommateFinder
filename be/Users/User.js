import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  profile: {
    type: String,
    default: null,
  },
  defaultPic: {
    type: String,
    default: null,
  },
  openToRoommateFind: {
    type: Boolean,
    default: false,
  },
  budget: {
    type: Number,
    required: true,
  },
  leaseDuration: {
    type: String,
    required: true,
    enum: ['Short-term', 'Long-term', 'Month-to-month'],
  },
  smoking: {
    type: Boolean,
    default: false,
  },
  drinking: {
    type: Boolean,
    default: false,
  },
  openToMixedGender: {
    type: Boolean,
    default: false,
  },
  gender: {
    type: String,
    required: true,
    enum: ['Male', 'Female'],
  },
  contactInfo: {
    type: {
      email: {
        type: String,
        required: true,
        trim: true,
      },
      phone: {
        type: String,
        trim: true,
        default: null,
      },
      preferredContact: {
        type: String,
        enum: ['email', 'phone'],
        default: 'email',
      },
    },
    required: true,
  },
  savedListings: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Listing',
    },
  ],
});

const UserDB = mongoose.model('User', userSchema);
export default UserDB;
