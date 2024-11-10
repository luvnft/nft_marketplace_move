import React, { useState, useEffect } from "react";
import NFTCard from "../components/NFTCard";
import { AptosClient } from "aptos";

const client = new AptosClient("http://localhost:8080/v1");

const ForSale: React.FC = () => {
    const [forSaleNfts, setForSaleNfts] = useState<any[]>([]);

    useEffect(() => {
        const fetchForSaleNFTs = async () => {
            try {
                const response = await fetch("/for-sale-nfts");
                const data = await response.json();
                setForSaleNfts(data);
            } catch (error) {
                console.error("Error fetching NFTs for sale:", error);
            }
        };

        fetchForSaleNFTs();
    }, []);

    return (
        <div>
            <h1>NFTs For Sale</h1>
            {forSaleNfts.length > 0 ? (
                forSaleNfts.map((nft) => (
                    <NFTCard
                        key={nft.id}
                        song_name={nft.song_name}
                        owner={nft.owner}
                        mp3_url={nft.mp3_url}
                        is_listed={nft.is_listed}
                        price={nft.price}
                        onBuy={() => {}}
                        onList={() => {}}
                    />
                ))
            ) : (
                <p>No NFTs listed for sale.</p>
            )}
        </div>
    );
};

export default ForSale;
