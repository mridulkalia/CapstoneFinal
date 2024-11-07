const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const priorityMapping = {
    'Ventilator': 1,
    'Oxygen Cylinder': 1,
    'ICU Bed': 1,
    'Anesthesia Machine': 1,
    'Infusion Pump': 2,
    'Surgical Equipment': 2,  // Added entry here
    'Wheelchair': 3,
    'Syringes': 3,
    'IV Fluids': 2,
    'Insulin': 1,
    'Chemotherapy Drugs': 1,
    'Antibiotics': 2,  // Added entry here
    'Painkillers': 2,  // Added entry here
    'Blood Thinners': 2,
    'Vaccines': 2,
    'Surgical Sedatives': 2,
    'X-ray Machine': 1,
    'MRI Machine': 1,
    'Ultrasound Machine': 2,
    'Blood Gas Analyzer': 2,
    'ECG Machine': 2,
    'Blood Glucose Meter': 3,
    'Pulse Oximeter': 2,
    'N95 Mask': 3,  // Added entry here
    'Gloves': 3,
    'PPE Kit': 3,
    'Surgical Mask': 4,
    'Disposable Gowns': 4,  // Added entry here
    'Pill Boxes': 4,  // Added entry here
    'Medical Equipment': 1, // Added missing entry
    'Medications': 2, // Added missing entry
    'Blood Bags': 1, // Added missing entry
    'Diagnostics Equipment': 2 // Added missing entry
  };
  

// Inventory Schema
const InventorySchema = new mongoose.Schema({
    registrationNumber: { 
        type: String, 
        ref: 'NGOHospital', 
        required: true 
    },
    lastUpdated: { 
        type: Date, 
        default: Date.now 
    },
    items: [
        {
            itemName: { 
                type: String, 
                required: true,
                enum: Object.keys(priorityMapping)
            },
            category: { 
                type: String, 
                required: true,
                enum: ['Medical Equipment', 'Medications', 'Personal Protective Equipment', 'Beds', 'Surgical Supplies', 'Other']
            },
            quantity: { 
                type: Number, 
                required: true, 
                min: 0
            },
            unit: {
                type: String,
                required: true,
                enum: ['Units', 'Boxes', 'Liters', 'Beds', 'Bags', 'Sets']
            },
            condition: { 
                type: String, 
                enum: ['New', 'Used', 'Damaged'],
                required: true 
            },
            priority: {
                type: Number,
                required: true,
                default: function() {
                    return priorityMapping[this.itemName] || 5;
                }
            }
        }
    ],
    totalScore: { 
        type: Number, 
        default: 0 
    },
    inventoryStatus: { 
        type: String, 
        enum: ['Critical', 'Satisfactory', 'Good', 'Excellent'],
        default: 'Satisfactory'
    },
    isMonitoringStock: { 
        type: Boolean, 
        default: false 
    }
});

module.exports = mongoose.model('Inventory', InventorySchema);
