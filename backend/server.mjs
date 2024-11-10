import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { uploadToPinata } from './services/pinata.mjs';
import nftRoutes from './routes/nft.mjs';
import 'dotenv/config';

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

app.use(cors());
app.use(express.json());

// Direct upload endpoint
app.post('/upload', upload.single('song'), async (req, res) => {
    try {
        console.log('Received upload request:', {
            file: req.file,
            metadata: req.body.metadata
        });
        
        const songBuffer = req.file.buffer;
        const metadata = JSON.parse(req.body.metadata);
        
        const songFile = new File([songBuffer], req.file.originalname, { 
            type: req.file.mimetype 
        });
        
        console.log('Uploading to Pinata:', {
            fileName: songFile.name,
            fileSize: songFile.size
        });
        
        const songResult = await uploadToPinata(songFile);
        console.log('Song upload result:', songResult);
        
        const metadataFile = new File(
            [JSON.stringify(metadata)],
            'metadata.json',
            { type: 'application/json' }
        );
        
        const metadataResult = await uploadToPinata(metadataFile);
        console.log('Metadata upload result:', metadataResult);
        
        res.json({
            songHash: songResult.IpfsHash,
            metadataHash: metadataResult.IpfsHash
        });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ error: 'Error uploading to IPFS' });
    }
});

app.use('/api/nft', nftRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
