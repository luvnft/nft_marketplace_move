import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import Marketplace from "./pages/Marketplace";
import MyNFTs from "./pages/MyNFTs";
import ForSale from "./pages/ForSale";

const App: React.FC = () => {
    return (
        <Router>
            <div>
                <nav>
                    <Link to="/">Marketplace</Link>
                    <Link to="/my-nfts">My NFTs</Link>
                    <Link to="/for-sale">For Sale</Link>
                </nav>

                <Routes>
                    <Route path="/" element={<Marketplace />} />
                    <Route path="/my-nfts" element={<MyNFTs />} />
                    <Route path="/for-sale" element={<ForSale />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;
