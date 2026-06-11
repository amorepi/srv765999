import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  firstName: { 
    type: String, 
    required: true, 
    trim: true 
  },
  lastName: { 
    type: String, 
    required: true, 
    trim: true 
  },
  fullName: { 
    type: String, 
    trim: true 
  },
  email: { 
    type: String, 
    required: true, 
    unique: true, 
    trim: true, 
    lowercase: true 
  },
  password: { 
    type: String, 
    required: true 
  },
  auth: {
    profile: { type: Number, default: 0 },
    billing: { type: Number, default: 0 },
    reports: { type: Number, default: 0 }
  }
}, { 
  timestamps: true 
});

// Calcolo automatico del fullName prima del salvataggio
userSchema.pre('save', function(next) {
  if (this.firstName || this.lastName) {
    this.fullName = `${this.firstName} ${this.lastName}`.trim();
  }
  next();
});

const User = mongoose.model('User', userSchema);
export { User };
