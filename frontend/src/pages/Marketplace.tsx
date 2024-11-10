import React, { useEffect, useState } from "react";
import NFTCard from "../components/NFTCard";
import UploadForm from "../components/UploadForm";
import { AptosClient } from "aptos";
import WalletService from "../services/walletContext";

const client = new AptosClient("http://localhost:8080/v1");

const Marketplace: React.FC = () => {
    const [nfts, setNfts] = useState<any[]>([]);
    const [showUploadForm, setShowUploadForm] = useState(false);
    const wallet = WalletService.getInstance();

    const onList = async (nftId: string, price: number) => {
        try {
            const address = wallet.getAddress();
            if (!address) return;
            
            const response = await fetch(`/nft/${nftId}/list`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ 
                    sellerAddress: address,
                    price: price 
                }),
            });

            const data = await response.json();
            console.log("NFT listed successfully:", data);
            
            fetchNFTs();
            
        } catch (error) {
            console.error("Error listing NFT:", error);
        }
    };

    const fetchNFTs = async () => {
        try {
            const response = await fetch("/nft");
            const data = await response.json();
            setNfts(data);
        } catch (error) {
            console.error("Error fetching NFTs:", error);
        }
    };

    useEffect(() => {
        fetchNFTs();
    }, []);

    const buyNFT = async (nftId: string) => {
        try {
            const buyerAddress = wallet.getAddress();
            if (!buyerAddress) return;

            const response = await fetch(`/nft/${nftId}/buy`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ buyerAddress }),
            });

            const data = await response.json();
            console.log("NFT bought successfully:", data);
            fetchNFTs();
        } catch (error) {
            console.error("Error buying NFT:", error);
        }
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Marketplace</h1>
                <button 
                    onClick={() => setShowUploadForm(!showUploadForm)}
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                    {showUploadForm ? 'Hide Upload Form' : 'Upload New Song'}
                </button>
            </div>

            {showUploadForm && (
                <div className="mb-8">
                    <UploadForm />
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {nfts.length > 0 ? (
                    nfts.map((nft) => (
                        <NFTCard
                            key={nft.id}
                            song_name={nft.song_name}
                            owner={nft.owner}
                            mp3_url={nft.mp3_url}
                            is_listed={nft.is_listed}
                            price={nft.price}
                            onBuy={() => buyNFT(nft.id)}
                            onList={() => onList(nft.id, nft.price)}
                        />
                    ))
                ) : (
                    <p>No NFTs available for sale.</p>
                )}
            </div>
        </div>
    );
};

export default Marketplace;
