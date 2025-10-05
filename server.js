import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';
import * as cheerio from 'cheerio';

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.static('public'));

// API 1: MangaDex - Popular Manga
app.get('/api/manga/popular', async (req, res) => {
    try {
        const response = await fetch('https://api.mangadex.org/manga?limit=24&order[followedCount]=desc&includes[]=cover_art&contentRating[]=safe');
        const data = await response.json();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// API 2: MangaDex - Latest Updates
app.get('/api/manga/latest', async (req, res) => {
    try {
        const response = await fetch('https://api.mangadex.org/manga?limit=24&order[latestUploadedChapter]=desc&includes[]=cover_art&contentRating[]=safe');
        const data = await response.json();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// API 3: MangaDex - Search
app.get('/api/manga/search', async (req, res) => {
    try {
        const query = req.query.q;
        const response = await fetch(`https://api.mangadex.org/manga?limit=24&title=${encodeURIComponent(query)}&includes[]=cover_art&contentRating[]=safe`);
        const data = await response.json();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// API 4: Get Manga Chapters
app.get('/api/manga/:id/chapters', async (req, res) => {
    try {
        const mangaId = req.params.id;
        const response = await fetch(`https://api.mangadex.org/manga/${mangaId}/feed?limit=50&order[chapter]=desc&translatedLanguage[]=en`);
        const data = await response.json();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// API 5: Get Chapter Pages
app.get('/api/chapter/:id', async (req, res) => {
    try {
        const chapterId = req.params.id;
        const response = await fetch(`https://api.mangadex.org/at-home/server/${chapterId}`);
        const data = await response.json();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// API 6: MangaSee - Fallback API
app.get('/api/mangasee/popular', async (req, res) => {
    try {
        const response = await fetch('https://api.mangasee123.com/popular');
        const data = await response.json();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// API 7: Comick - Alternative API
app.get('/api/comick/search', async (req, res) => {
    try {
        const query = req.query.q;
        const response = await fetch(`https://api.comick.fun/search?q=${encodeURIComponent(query)}&limit=24`);
        const data = await response.json();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 MyMangazen Server running on http://localhost:${PORT}`);
    console.log(`📚 API Endpoints ready!`);
});