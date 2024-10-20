import express from 'express';
import multer from 'multer';
import cors from 'cors';
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import sharp from 'sharp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = 3001;

app.use(cors());

const upload = multer({ storage: multer.memoryStorage() });

app.post('/remove-background', upload.single('image'), async (req, res) => {
  if (!req.file) {
    return res.status(400).send('No image file uploaded.');
  }

  try {
    // Convert the uploaded image to PNG format
    const pngBuffer = await sharp(req.file.buffer).png().toBuffer();

    const rembg = spawn('rembg', ['i', '-', '-']);

    rembg.stdin.write(pngBuffer);
    rembg.stdin.end();

    const chunks = [];
    rembg.stdout.on('data', (chunk) => chunks.push(chunk));
    rembg.stderr.on('data', (data) => console.error(`rembg stderr: ${data}`));

    rembg.on('close', (code) => {
      if (code !== 0) {
        console.error(`rembg process exited with code ${code}`);
        return res.status(500).send('An error occurred while processing the image.');
      }

      const resultBuffer = Buffer.concat(chunks);
      res.set('Content-Type', 'image/png');
      res.send(resultBuffer);
    });
  } catch (error) {
    console.error('Error removing background:', error);
    res.status(500).send('An error occurred while processing the image.');
  }
});

app.use(express.static(join(__dirname, 'dist')));

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});