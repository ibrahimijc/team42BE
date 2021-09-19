const mongoose = require("mongoose");

const TeamsSchema = new mongoose.Schema({
  teamId: {
    type: String,
    required: true,
  },

  teamName: {
    type: String,
    required: true,
  },
});


const Teams = mongoose.model("Teams", TeamsSchema);
module.exports = Teams;