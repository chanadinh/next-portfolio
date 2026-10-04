// Rasterize the editable SVG mark with Next.js's bundled Sharp dependency.
const fs = require('node:fs/promises');
const path = require('node:path');
const sharp = require('sharp');

async function main() {
  const root = path.resolve(__dirname, '../public');
  const source = path.join(root, 'favicon.svg');
  const sizes = [16, 32, 48, 64, 128, 150, 180, 310];
  const images = new Map();
  for (const size of sizes) images.set(size, await sharp(source).resize(size, size).png().toBuffer());
  for (const size of [32, 64, 128]) await fs.writeFile(path.join(root, `favicon-${size}x${size}.png`), images.get(size));
  await fs.writeFile(path.join(root, 'apple-touch-icon.png'), images.get(180));
  for (const size of [150, 310]) await fs.writeFile(path.join(root, `mstile-${size}.png`), images.get(size));

  const iconSizes = [16, 32, 48];
  const directory = Buffer.alloc(6 + 16 * iconSizes.length);
  directory.writeUInt16LE(1, 2);
  directory.writeUInt16LE(iconSizes.length, 4);
  let offset = directory.length;
  for (const [index, size] of iconSizes.entries()) {
    const entry = 6 + index * 16;
    const png = images.get(size);
    directory[entry] = size; directory[entry + 1] = size;
    directory.writeUInt16LE(1, entry + 4); directory.writeUInt16LE(32, entry + 6);
    directory.writeUInt32LE(png.length, entry + 8); directory.writeUInt32LE(offset, entry + 12);
    offset += png.length;
  }
  await fs.writeFile(path.join(root, 'favicon.ico'), Buffer.concat([directory, ...iconSizes.map(size => images.get(size))]));
  console.log('Generated SVG-based PNG, ICO, Apple touch, and Windows tile icons.');
}
main().catch(error => { console.error(error); process.exitCode = 1; });
