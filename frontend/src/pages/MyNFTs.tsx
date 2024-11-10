import React, { useState, useEffect } from "react";
import NFTCard from "../components/NFTCard";
import { AptosClient } from "aptos";

const client = new AptosClient("http://localhost:8080/v1");

const MyNFTs: React.FC = () => {
    const [myNfts, setMyNfts] = useState<any[]>([]);

    useEffect(() => {
        const fetchMyNFTs = async () => {
            try {
                const response = await fetch("/my-nfts");
                const data = await response.json();
                setMyNfts(data);
            } catch (error) {
                console.error("Error fetching my NFTs:", error);
            }
        };

        fetchMyNFTs();
    }, []);

    const listForSale = async (nftId: string, price: number) => {
        try {
            const response = await fetch(`/nft/${nftId}/list`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ price }),
            });

            const data = await response.json();
            console.log("NFT listed for sale:", data);
        } catch (error) {
            console.error("Error listing NFT for sale:", error);
        }
    };

    return (
        <div>
            <h1>My NFTs</h1>
            {myNfts.length > 0 ? (
                myNfts.map((nft) => (
                    <NFTCard
                        key={nft.id}
                        song_name={nft.song_name}
                        owner={nft.owner}
                        mp3_url={nft.mp3_url}
                        is_listed={nft.is_listed}
                        price={nft.price}
                        onBuy={() => {}}
                        onList={() => listForSale(nft.id, 10)} // Example price
                    />
                ))
            ) : (
                <p>You don't own any NFTs yet.</p>
            )}
        </div>
    );
};

export default MyNFTs;
