
import express from 'express';
import { AptosClient } from 'aptos';
import multer from 'multer';
import { uploadToPinata } from '../services/pinata.mjs';
const router = express.Router();
const client = new AptosClient("http://localhost:8080/v1");
const upload = multer({ storage: multer.memoryStorage() });

// Get all NFTs
// Get all NFTs
router.get('/', async (req, res) => {
    try {
        console.log('Fetching NFTs from blockchain...');
        
        // Get NFT data from contract
        const resources = await client.getAccountResources(
            '0x02ca0cd188d92438f11c0284b9ea5ed30b59da4d829e85539bfd9b8ce52989eb::nft::mint'
        );
        
        // Filter for NFT resources
        const nftResource = resources.find(
            (r) => r.type === `0x02ca0cd188d92438f11c0284b9ea5ed30b59da4d829e85539bfd9b8ce52989eb::nft::mint::nft::SongNFTData`
        );
        
        if (!nftResource) {
            console.log('No NFTs found');
            return res.json([]);
        }

        // Transform blockchain data to frontend format
        const nfts = nftResource.data.map(nft => ({
            id: nft.id,
            song_name: nft.song_name,
            owner: nft.owner,
            mp3_url: `https://gateway.pinata.cloud/ipfs/${nft.mp3_url}`,
            price: nft.price,
            is_listed: nft.is_listed
        }));

        console.log('Found NFTs:', nfts.length);
        res.json(nfts);
    } catch (error) {
        console.error('Error fetching NFTs:', error);
        res.status(500).json({ error: 'Error fetching NFTs' });
    }
});



router.post('/upload', upload.single('song'), async (req, res) => {
    try {
        console.log('Received upload request:', {
            file: req.file,
            metadata: req.body.metadata
        });
        
        const songBuffer = req.file.buffer;
        const metadata = JSON.parse(req.body.metadata);
        
        // Convert buffer to File object
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

// List an NFT for sale
router.post('/:id/list', async (req, res) => {
    try {
        const { id } = req.params;
        const { price, sellerAddress } = req.body;

        const txn = await client.submitTransaction(
            sellerAddress,
            {
                function: `0x02ca0cd188d92438f11c0284b9ea5ed30b59da4d829e85539bfd9b8ce52989eb::nft::list_for_sale`,
                arguments: [id, price],
            }
        );

        res.json({ message: "NFT listed for sale", txn });
    } catch (error) {
        res.status(500).json({ error: 'Error listing NFT for sale' });
    }
});

// Buy an NFT
router.post('/:id/buy', async (req, res) => {
    try {
        const { id } = req.params;
        const { buyerAddress } = req.body;

        const txn = await client.submitTransaction(
            buyerAddress,
            {
                function: `0x02ca0cd188d92438f11c0284b9ea5ed30b59da4d829e85539bfd9b8ce52989eb::nft::buy`,
                arguments: [id],
            }
        );

        res.json({ message: "NFT purchased", txn });
    } catch (error) {
        res.status(500).json({ error: 'Error purchasing NFT' });
    }
});

export default router;