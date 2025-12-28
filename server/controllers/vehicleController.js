import Vehicle from '../models/Vehicle.js';
import sendEmail from '../utils/sendEmail.js';

// @desc    Register a new vehicle
// @route   POST /api/vehicles
// @access  Private
export const registerVehicle = async (req, res) => {
  try {
    const {
      type,
      make,
      model,
      year,
      vin,
      licensePlate,
      ownerName,
      ownerContact,
      expiryDate,
    } = req.body;

    // Handle files if present
    const documents = req.files ? req.files.map((file) => file.path) : [];

    const vehicle = await Vehicle.create({
      user: req.user._id,
      type,
      make,
      model,
      year,
      vin,
      licensePlate,
      ownerName,
      ownerContact,
      expiryDate,
      documents,
    });

    res.status(201).json(vehicle);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get all vehicles (Admin) or User vehicles
// @route   GET /api/vehicles
// @access  Private
export const getVehicles = async (req, res) => {
  try {
    let vehicles;
    if (req.user.role === 'admin') {
      vehicles = await Vehicle.find({}).populate('user', 'name email').sort({ createdAt: -1 });
    } else {
      vehicles = await Vehicle.find({ user: req.user._id }).sort({ createdAt: -1 });
    }
    res.json(vehicles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update vehicle status (Admin)
// @route   PUT /api/vehicles/:id/status
// @access  Private/Admin
export const updateVehicleStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const vehicle = await Vehicle.findById(req.params.id);

    if (vehicle) {
      vehicle.status = status;
      const updatedVehicle = await vehicle.save();
      
      // Populate user to get email
      await updatedVehicle.populate('user', 'email name');

      // Send status update email
      try {
        await sendEmail({
          email: updatedVehicle.user.email,
          subject: 'Vehicle Registration Status Update',
          message: `Hi ${updatedVehicle.user.name},\n\nThe status of your vehicle registration for ${updatedVehicle.make} ${updatedVehicle.model} (${updatedVehicle.licensePlate}) has been updated to: ${status}.\n\nRegards,\nVehicle Registration Team`,
        });
      } catch (error) {
        console.error('Email sending failed:', error);
      }

      res.json(updatedVehicle);
    } else {
      res.status(404).json({ message: 'Vehicle not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Renew vehicle registration
// @route   PUT /api/vehicles/:id/renew
// @access  Private
export const renewRegistration = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);

    if (vehicle) {
      // Check if user owns the vehicle
      if (vehicle.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        return res.status(401).json({ message: 'Not authorized' });
      }

      // Extend expiry by 1 year
      const currentExpiry = new Date(vehicle.expiryDate);
      const newExpiry = new Date(currentExpiry.setFullYear(currentExpiry.getFullYear() + 1));
      
      vehicle.expiryDate = newExpiry;
      // Optionally reset status to Pending if renewal requires approval, or keep as Approved
      // vehicle.status = 'Pending'; 
      
      const updatedVehicle = await vehicle.save();
      
      // Populate user to get email
      await updatedVehicle.populate('user', 'email name');

      // Send renewal email
      try {
        await sendEmail({
          email: updatedVehicle.user.email,
          subject: 'Vehicle Registration Renewed',
          message: `Hi ${updatedVehicle.user.name},\n\nYour vehicle registration for ${updatedVehicle.make} ${updatedVehicle.model} (${updatedVehicle.licensePlate}) has been successfully renewed. New expiry date: ${newExpiry.toLocaleDateString()}.\n\nRegards,\nVehicle Registration Team`,
        });
      } catch (error) {
        console.error('Email sending failed:', error);
      }

      res.json(updatedVehicle);
    } else {
      res.status(404).json({ message: 'Vehicle not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get vehicle statistics (Admin)
// @route   GET /api/vehicles/stats
// @access  Private/Admin
export const getVehicleStats = async (req, res) => {
  try {
    const totalVehicles = await Vehicle.countDocuments();
    const pendingVehicles = await Vehicle.countDocuments({ status: 'Pending' });
    const approvedVehicles = await Vehicle.countDocuments({ status: 'Approved' });
    const rejectedVehicles = await Vehicle.countDocuments({ status: 'Rejected' });
    
    // Aggregate by type
    const vehiclesByType = await Vehicle.aggregate([
      { $group: { _id: '$type', count: { $sum: 1 } } }
    ]);

    res.json({
      total: totalVehicles,
      pending: pendingVehicles,
      approved: approvedVehicles,
      rejected: rejectedVehicles,
      byType: vehiclesByType
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Search vehicles
// @route   GET /api/vehicles/search
// @access  Private
export const searchVehicles = async (req, res) => {
  const { query } = req.query;
  try {
    let searchCriteria = {
        $or: [
            { vin: { $regex: query, $options: 'i' } },
            { licensePlate: { $regex: query, $options: 'i' } }
        ]
    };

    if (req.user.role !== 'admin') {
        searchCriteria = { ...searchCriteria, user: req.user._id };
    }

    const vehicles = await Vehicle.find(searchCriteria).populate('user', 'name email');
    res.json(vehicles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete vehicle
// @route   DELETE /api/vehicles/:id
// @access  Private
export const deleteVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);

    if (vehicle) {
      if (vehicle.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        return res.status(401).json({ message: 'Not authorized' });
      }

      await vehicle.deleteOne();
      res.json({ message: 'Vehicle removed' });
    } else {
      res.status(404).json({ message: 'Vehicle not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update vehicle details
// @route   PUT /api/vehicles/:id
// @access  Private
export const updateVehicle = async (req, res) => {
  try {
    const {
      type,
      make,
      model,
      year,
      vin,
      licensePlate,
      ownerName,
      ownerContact,
      expiryDate,
    } = req.body;

    const vehicle = await Vehicle.findById(req.params.id);

    if (vehicle) {
      if (vehicle.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        return res.status(401).json({ message: 'Not authorized' });
      }

      vehicle.type = type || vehicle.type;
      vehicle.make = make || vehicle.make;
      vehicle.model = model || vehicle.model;
      vehicle.year = year || vehicle.year;
      vehicle.vin = vin || vehicle.vin;
      vehicle.licensePlate = licensePlate || vehicle.licensePlate;
      vehicle.ownerName = ownerName || vehicle.ownerName;
      vehicle.ownerContact = ownerContact || vehicle.ownerContact;
      vehicle.expiryDate = expiryDate || vehicle.expiryDate;

      // Reset status to pending if updated by user? 
      // Usually if critical info changes, it should be re-verified.
      // But if admin updates, maybe not.
      if (req.user.role !== 'admin') {
         vehicle.status = 'Pending';
      }

      const updatedVehicle = await vehicle.save();
      res.json(updatedVehicle);
    } else {
      res.status(404).json({ message: 'Vehicle not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single vehicle
// @route   GET /api/vehicles/:id
// @access  Private
export const getVehicleById = async (req, res) => {
    try {
      const vehicle = await Vehicle.findById(req.params.id);
  
      if (vehicle) {
        if (vehicle.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
          return res.status(401).json({ message: 'Not authorized' });
        }
        res.json(vehicle);
      } else {
        res.status(404).json({ message: 'Vehicle not found' });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
