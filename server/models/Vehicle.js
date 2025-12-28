import mongoose from 'mongoose';

const vehicleSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, required: true },
  make: { type: String, required: true },
  model: { type: String, required: true },
  year: { type: Number, required: true },
  vin: { type: String, required: true, unique: true },
  licensePlate: { type: String, required: true, unique: true },
  ownerName: { type: String, required: true },
  ownerContact: { type: String, required: true },
  registrationDate: { type: Date, default: Date.now },
  expiryDate: { type: Date, required: true },
  documents: [{ type: String }], // Array of file paths
  status: { type: String, enum: ['Pending', 'Approved', 'Rejected', 'Expired'], default: 'Pending' },
}, { timestamps: true });

const Vehicle = mongoose.model('Vehicle', vehicleSchema);
export default Vehicle;
