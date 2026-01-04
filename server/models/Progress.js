const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  completedQuestions: {
    type: Map,
    of: Boolean,
    default: {}
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
});

// Update lastUpdated on every save
progressSchema.pre('save', async function() {
  this.lastUpdated = Date.now();
});

module.exports = mongoose.model('Progress', progressSchema);