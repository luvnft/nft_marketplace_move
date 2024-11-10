import React, { useState, useEffect } from 'react';
import WalletService from '../services/walletContext';

const UploadForm: React.FC = () => {
    const [file, setFile] = useState<File | null>(null);
    const [metadata, setMetadata] = useState({
        title: '',
        description: '',
        price: ''
    });
    const [status, setStatus] = useState('');
    const wallet = WalletService.getInstance();

    useEffect(() => {
        const checkConnection = async () => {
            const isConnected = await wallet.isConnected();
            console.log('Wallet connected:', isConnected);
            if (isConnected) {
                const address = wallet.getAddress();
                console.log('Connected address:', address);
            }
        };
        checkConnection();
    }, []);

    const connectWallet = async () => {
        try {
            const response = await wallet.connect();
            console.log('Wallet connected successfully:', response.address);
            setStatus('Wallet connected');
        } catch (error) {
            console.error('Wallet connection failed:', error);
            setStatus('Failed to connect wallet');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Starting upload process...');
        
        const address = wallet.getAddress();
        if (!file || !address) {
            console.log('Missing required data:', { file: !!file, address });
            setStatus('Please connect wallet and select a file');
            return;
        }

        try {
            setStatus('Uploading to IPFS...');
            const formData = new FormData();
            formData.append('song', file);
            formData.append('metadata', JSON.stringify({
                ...metadata,
                creator: address
            }));

            console.log('Uploading to IPFS with metadata:', metadata);
            console.log('FormData being sent:', {
                file: file?.name,
                metadata: metadata
            });
            
            const response = await fetch('http://localhost:5000/upload', {
                method: 'POST',
                body: formData
            });
            

            const { songHash, metadataHash } = await response.json();
            console.log('IPFS upload successful:', { songHash, metadataHash });

            // Prepare mint transaction
            const mintTxn = {
                function: `0x02ca0cd188d92438f11c0284b9ea5ed30b59da4d829e85539bfd9b8ce52989eb::nft::mint`,
                arguments: [metadata.title, songHash, Number(metadata.price)],
                type_arguments: []
            };

            setStatus('Minting NFT...');
            const signedTxn = await wallet.signTransaction(mintTxn);
            console.log('NFT minted successfully:', signedTxn);

            // List on marketplace
            const listingResponse = await fetch(`http://localhost:5000/api/nft/${signedTxn.hash}/list`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    sellerAddress: address,
                    price: metadata.price
                })
            });

            const listingResult = await listingResponse.json();
            console.log('NFT listed successfully:', listingResult);

            setStatus('Success! NFT minted and listed on marketplace');
            setFile(null);
            setMetadata({ title: '', description: '', price: '' });
        } catch (error) {
            console.error('Upload process failed:', error);
            setStatus(`Error: ${error}`);
        }
    };

    return (
        <div className="max-w-lg mx-auto p-6">
            {!wallet.getAddress() && (
                <button 
                    onClick={connectWallet}
                    className="w-full mb-4 bg-blue-500 text-white p-2 rounded"
                >
                    Connect Petra Wallet
                </button>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium">Music File</label>
                    <input 
                        type="file" 
                        accept="audio/*"
                        onChange={e => {
                            const selectedFile = e.target.files?.[0];
                            console.log('File selected:', selectedFile?.name);
                            setFile(selectedFile || null);
                        }}
                        className="w-full p-2 border rounded"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium">Title</label>
                    <input
                        type="text"
                        placeholder="Song Title"
                        value={metadata.title}
                        onChange={e => setMetadata({...metadata, title: e.target.value})}
                        className="w-full p-2 border rounded"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium">Description</label>
                    <textarea
                        placeholder="Description"
                        value={metadata.description}
                        onChange={e => setMetadata({...metadata, description: e.target.value})}
                        className="w-full p-2 border rounded"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium">Price (APT)</label>
                    <input
                        type="number"
                        placeholder="Price in APT"
                        value={metadata.price}
                        onChange={e => setMetadata({...metadata, price: e.target.value})}
                        className="w-full p-2 border rounded"
                    />
                </div>

                <button 
                    type="submit"
                    disabled={!wallet.getAddress() || !file}
                    className="w-full bg-green-500 text-white p-2 rounded disabled:bg-gray-300"
                >
                    Upload & Mint NFT
                </button>

                {status && (
                    <div className="mt-4 p-2 bg-gray-100 rounded">
                        Status: {status}
                    </div>
                )}
            </form>
        </div>
    );
};

export default UploadForm;
