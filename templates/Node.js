const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const axios = require('axios');
const Image = require('./models/Image');

const app = express();
app.use(express.json());
const upload = multer({ dest: 'uploads/' });

mongoose.connect('mongodb+srv://jiosaavn:jiosaavn@cluster0.ouhhe.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');

app.post('/api/upload', upload.single('image'), async (req, res) => {
    try {
        // Simulate evns.sh upload
        const formData = new FormData();
        formData.append('file', req.file);
        const response = await axios.post('https://api.evns.sh/upload', formData, {
            headers: { 'Authorization': 'Bearer YOUR_EVNS_SH_API_KEY' }
        });
        res.json({ url: response.data.url });
    } catch (error) {
        res.status(500).json({ error: 'Upload failed' });
    }
});

app.get('/api/images', async (req, res) => {
    try {
        const search = req.query.search;
        let images;
        if (search) {
            images = await Image.find({ $text: { $search: search } });
        } else {
            images = await Image.find();
        }
        res.json(images);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch images' });
    }
});

app.post('/api/images', async (req, res) => {
    try {
        const image = new Image(req.body);
        await image.save();
        res.json(image);
    } catch (error) {
        res.status(500).json({ error: 'Failed to save image' });
    }
});

app.put('/api/images/:id', async (req, res) => {
    try {
        const image = await Image.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(image);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update image' });
    }
});

app.delete('/api/images/:id', async (req, res) => {
    try {
        await Image.findByIdAndDelete(req.params.id);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete image' });
    }
});

app.listen(3000, () => console.log('Server running on port 5000'));
