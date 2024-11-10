# nft_marketplace_move
NFT Marketplace where you can upload, sell and buy music NFTs which are stored on decentralized IPFS locations, and integrated with PetraWallet. Smart Contracts Programmed in Move Language and tested locally with Aptos

```markdown
# Installation Commands

## Frontend Setup
```bash
npx create-next-app frontend --typescript
cd frontend
npm install @aptos-labs/wallet-adapter-react aptos pinata-web3 @types/node
```

## Backend Setup
```bash
mkdir backend
cd backend
npm init -y
npm install express cors dotenv multer aptos pinata-web3 @types/express @types/multer
```

## Aptos Setup Commands
### Install Aptos CLI
```bash
curl -fsSL "https://aptos.dev/scripts/install_cli.py" | python3
```

### Generate New Keys
```bash
aptos key generate --output-file my_keys.txt
```

### Initialize Local Network
```bash
aptos init --network local
```

### Start Local Testnet
```bash
aptos node run-local-testnet --with-faucet
```

### Fund Account
```bash
aptos account fund-with-faucet --account <address> --amount 100000000
```

### Deploy Contract
```bash
aptos move publish --named-addresses addr=<your_address>
```

## Environment Variables

### Backend (`.env`)
```plaintext
PINATA_JWT=your_jwt_here
PINATA_GATEWAY=https://gateway.pinata.cloud/ipfs/
PORT=5000
```

### Frontend (`.env.local`)
```plaintext
NEXT_PUBLIC_MODULE_ADDRESS=your_contract_address
```

## Start Development Servers

### Frontend
```bash
cd frontend
npm run dev
```

### Backend
```bash
cd backend
npm run dev
```

### Local Testnet
```bash
aptos node run-local-testnet --with-faucet
```

## Testing Flow
1. Start local testnet
2. Deploy NFT contract
3. Connect Petra wallet
4. Fund test accounts
5. Upload & mint NFTs
6. List on marketplace
7. Test buying flow

## Network Configuration
- **Local Testnet URL**: `http://localhost:8080/v1`
- **Frontend**: `http://localhost:3000`
- **Backend API**: `http://localhost:5000`

## Key Features
- NFT Minting
- IPFS Storage
- Marketplace Listing
- Wallet Integration
- Music File Upload
- Smart Contract Integration
```

Let me know if you'd like any adjustments!
