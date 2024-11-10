import React from "react";

type NFTProps = {
    song_name: string;
    owner: string;
    mp3_url: string;
    is_listed: boolean;
    price: number;
    onBuy: () => void;
    onList: () => void;
};

const NFTCard: React.FC<NFTProps> = ({
    song_name,
    owner,
    mp3_url,
    is_listed,
    price,
    onBuy,
    onList,
}) => (
    <div className="nft-card">
        <h2>{song_name}</h2>
        <p>Owner: {owner}</p>
        <audio controls>
            <source src={mp3_url} type="audio/mpeg" />
            Your browser does not support the audio element.
        </audio>

        {is_listed ? (
            <>
                <p>Price: {price} VC Coins</p>
                <button onClick={onBuy}>Buy</button>
            </>
        ) : (
            <button onClick={onList}>List for Sale</button>
        )}
    </div>
);

export default NFTCard;
