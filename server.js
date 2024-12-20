const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');


const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect('mongodb+srv://iamsumankd:%40Dreambig9810@healthygame.qqiis.mongodb.net/?retryWrites=true&w=majority&appName=HealthyGame')
.then(() => console.log('Successfully connected to MongoDB.'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

/// Player Schema
const playerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    level: { type: Number, default: 0 },
    points: { type: Number, default: 0 }
});

const Player = mongoose.model('Player', playerSchema);

// Routes
app.post('/api/players', async (req, res) => {
    try {
        const { name } = req.body;
        let player = await Player.findOne({ name });
        
        if (!player) {
            player = new Player({ name });
            await player.save();
        }
        
        res.json(player);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});
  
app.get('/api/leaderboard', async (req, res) => {
    try {
        const leaders = await Player
            .find()
            .sort({ points: -1 }) // -1 means descending order (highest to lowest)
            .limit(10); // Gets top 10 players
        res.json(leaders);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
  
app.put('/api/players/:name', async (req, res) => {
    try {
        const { level, points } = req.body;
        const player = await Player.findOneAndUpdate(
            { name: req.params.name },
            { level, points },
            { new: true }
        );
        res.json(player);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});
  
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
