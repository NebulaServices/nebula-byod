import fs from 'fs';
import path from 'path';

const dbPath = path.resolve('db.json');

type DB = {
    users: Record<string, string[]>;
    domains: string[];
};

export function loadDB(): DB {
    if (!fs.existsSync(dbPath)) {
        fs.writeFileSync(dbPath, JSON.stringify({ users: {}, domains: [] }, null, 2));
    }

    return JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
}

export function saveDB(db: DB) {
    fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
}
