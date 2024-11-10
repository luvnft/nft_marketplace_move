declare global {
    interface Window {
        petra: any;
    }
}

export const PETRA_EVENTS = {
    ACCOUNT_CHANGED: 'petra_accountChanged',
    NETWORK_CHANGED: 'petra_networkChanged',
    DISCONNECT: 'petra_disconnect'
} as const;

export type WalletEventType = keyof typeof PETRA_EVENTS;

export interface WalletResponse {
    address: string;
    publicKey: string;
}

export class WalletService {
    private static instance: WalletService;
    private address: string | null = null;
    private isInitialized: boolean = false;

    private constructor() {
        this.initializeListeners();
    }

    static getInstance(): WalletService {
        if (!WalletService.instance) {
            WalletService.instance = new WalletService();
        }
        return WalletService.instance;
    }

    private initializeListeners(): void {
        if (this.isInitialized) return;
        
        window.addEventListener(PETRA_EVENTS.ACCOUNT_CHANGED, this.handleAccountChange);
        window.addEventListener(PETRA_EVENTS.NETWORK_CHANGED, this.handleNetworkChange);
        window.addEventListener(PETRA_EVENTS.DISCONNECT, this.handleDisconnect);
        
        this.isInitialized = true;
    }

    private handleAccountChange = async () => {
        const petra = window.petra;
        if (petra) {
            const account = await petra.account();
            this.address = account.address;
        }
    }

    private handleNetworkChange = () => {
        console.log('Network changed');
    }

    private handleDisconnect = () => {
        this.address = null;
    }

    async connect(): Promise<WalletResponse> {
        const petra = window.petra;
        if (!petra) throw new Error("Petra wallet not found");
        
        const response = await petra.connect();
        this.address = response.address;
        return response;
    }

    async disconnect(): Promise<void> {
        const petra = window.petra;
        if (petra) {
            await petra.disconnect();
            this.address = null;
        }
    }

    getAddress(): string | null {
        return this.address;
    }

    async isConnected(): Promise<boolean> {
        const petra = window.petra;
        return petra ? await petra.isConnected() : false;
    }

    async signTransaction(transaction: any): Promise<any> {
        const petra = window.petra;
        if (!petra) throw new Error("Petra wallet not found");
        return await petra.signTransaction(transaction);
    }

    async signMessage(message: string): Promise<any> {
        const petra = window.petra;
        if (!petra) throw new Error("Petra wallet not found");
        return await petra.signMessage(message);
    }

    cleanup(): void {
        window.removeEventListener(PETRA_EVENTS.ACCOUNT_CHANGED, this.handleAccountChange);
        window.removeEventListener(PETRA_EVENTS.NETWORK_CHANGED, this.handleNetworkChange);
        window.removeEventListener(PETRA_EVENTS.DISCONNECT, this.handleDisconnect);
        this.isInitialized = false;
    }
}

export default WalletService;
