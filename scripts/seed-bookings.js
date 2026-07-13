const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const DB_DIR = path.resolve(process.cwd(), 'data');
const DB_PATH = path.join(DB_DIR, 'bookings.db');

if (!fs.existsSync(DB_DIR)) fs.mkdirSync(DB_DIR, { recursive: true });

const db = new Database(DB_PATH);

function countBookings() {
  const row = db.prepare('SELECT COUNT(*) as cnt FROM bookings').get();
  return row ? row.cnt : 0;
}

const before = countBookings();
console.log('Bookings before:', before);

const bookings = [
  {
    name: 'Aditi Sharma',
    phone: '9876543210',
    package: 'Cinematic Outdoor Session',
    date: '2026-08-15',
    time: '06:00 AM',
    location: 'Kondapalli Hills',
    guests: '2',
    requests: 'Sunrise shoot, candid shots'
  },
  {
    name: 'Ravi & Priya',
    phone: '9988776655',
    package: 'Wedding Day Coverage',
    date: '2026-10-05',
    time: '09:00 AM',
    location: 'Hyderabad Palace Grounds',
    guests: '250',
    requests: 'Highlight reel, drone shots'
  },
  {
    name: 'Baby Shower - Ananya',
    phone: '9123456780',
    package: 'Indoor Studio Session',
    date: '2026-07-25',
    time: '02:30 PM',
    location: 'Studio A',
    guests: '10',
    requests: 'Soft lighting, pastel backdrop'
  },
  {
    name: 'Corporate Event - TechConf',
    phone: '9001122334',
    package: 'Event Highlights',
    date: '2026-09-12',
    time: '11:00 AM',
    location: 'Convention Center',
    guests: '500',
    requests: 'Stage coverage, speaker portraits'
  },
  {
    name: 'Family Portraits - Reddy',
    phone: '9012345678',
    package: 'Cinematic Outdoor Session',
    date: '2026-11-02',
    time: '04:00 PM',
    location: 'Lumbini Park',
    guests: '6',
    requests: 'Group shots + individual portraits'
  }
];

const insert = db.prepare(`INSERT INTO bookings (name, phone, package, date, time, location, guests, requests) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`);
const insertMany = db.transaction((rows) => {
  for (const r of rows) insert.run(r.name, r.phone, r.package, r.date, r.time, r.location, r.guests, r.requests);
});

try {
  insertMany(bookings);
  const after = countBookings();
  console.log('Inserted', bookings.length, 'bookings.');
  console.log('Bookings after:', after);
} catch (err) {
  console.error('Seeding failed:', err);
} finally {
  db.close();
}
