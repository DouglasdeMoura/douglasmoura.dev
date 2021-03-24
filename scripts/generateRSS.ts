import fs from 'fs/promises';

export default async function generateRSS(feed) {
  await fs.writeFile('./public/rss.xml', feed.xml({ indent: true }));
}
