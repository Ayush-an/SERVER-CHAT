//User.js
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: String, class: String, mobile: String,
  joinedAt: { type: Date, default: Date.now },
});
export default mongoose.model('User', userSchema);