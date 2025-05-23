import express from 'express';
import dotenv from 'dotenv';
import { loadDB } from './db.js';

dotenv.config();

const app = express();
const PORT = parseInt(process.env.ASK_PORT || '8080', 10);

//@ts-ignore shut up
app.get('/', (req, res) => {
    const db = loadDB();
    const domain = req.query.domain as string;

    if (!domain) return res.status(400).send('missing domain');
    if (db.domains.includes(domain)) return res.send('ok');

    res.status(403).send('unauthorized');
});

app.listen(PORT, () => {
    console.log(`Caddy ask server running on port: ${PORT}`);
});
