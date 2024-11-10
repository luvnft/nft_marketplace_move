import React, { useState, useEffect } from "react";
import { WalletService } from "../services/walletContext";

const ConnectWalletButton: React.FC = () => {
    const [address, setAddress] = useState<string | null>(null);
    const wallet = WalletService.getInstance();

    useEffect(() => {
        const checkConnection = async () => {
            const isConnected = await wallet.isConnected();
            if (isConnected) {
                setAddress(wallet.getAddress());
            }
        };
        checkConnection();
    }, []);

    const handleConnect = async () => {
        const response = await wallet.connect();
        setAddress(response.address);
    };

    return (
        <div>
            {address ? (
                <p>Connected as: {address}</p>
            ) : (
                <button 
                    onClick={handleConnect}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                    Connect to Petra Wallet
                </button>
            )}
        </div>
    );
};

export default ConnectWalletButton;
