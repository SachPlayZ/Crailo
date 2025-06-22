import mongoose from 'mongoose';

export interface IUser extends mongoose.Document {
  email: string;
  name: string;
  image?: string;
  googleId?: string;
  isKycVerified: boolean;
  kycData?: {
    fullName: string;
    address: string;
    phoneNumber: string;
    aadharNumber: string;
    dateOfBirth: string;
    submittedAt: Date;
    verifiedAt?: Date;
    status: 'pending' | 'approved' | 'rejected';
  };
  role: 'user' | 'validator' | 'admin';
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new mongoose.Schema<IUser>({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
  googleId: {
    type: String,
    unique: true,
    sparse: true,
  },
  isKycVerified: {
    type: Boolean,
    default: false,
  },
  kycData: {
    fullName: String,
    address: String,
    phoneNumber: String,
    aadharNumber: String,
    dateOfBirth: String,
    submittedAt: Date,
    verifiedAt: Date,
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
  },
  role: {
    type: String,
    enum: ['user', 'validator', 'admin'],
    default: 'user',
  },
}, {
  timestamps: true,
});

const voteSchema = new mongoose.Schema({
  productId: {
    type: String,
    required: true,
  },
  yesVotes: {
    type: Number,
    default: 0,
  },
  noVotes: {
    type: Number,
    default: 0,
  },
  voterAddresses: {
    type: [String],
    default: []
  }
})

export default mongoose.models.User || mongoose.model<IUser>('User', userSchema); 
export const Vote = mongoose.models.Vote || mongoose.model('Vote', voteSchema);