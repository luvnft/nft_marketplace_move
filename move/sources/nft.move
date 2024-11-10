address addr {
    module nft {
        use std::string::String;
        use aptos_framework::object::{Self, Object, ExtendRef};
        use aptos_framework::coin::{Self};
        use aptos_framework::aptos_coin::AptosCoin;
        use aptos_framework::signer;

        struct SongNFTData has key {
            extend_ref: ExtendRef,
            owner: address,
            song_name: String,
            mp3_url: String,
            price: u64,
            is_listed: bool,
        }

        public entry fun mint(
            song_name: String,
            mp3_url: String,
            price: u64,
            account: &signer
        ) {
            let constructor_ref = object::create_object_from_account(account);
            let object_signer = object::generate_signer(&constructor_ref);
            let extend_ref = object::generate_extend_ref(&constructor_ref);
            
            let song_nft = SongNFTData {
                extend_ref,
                owner: signer::address_of(account),
                song_name,
                mp3_url,
                price,
                is_listed: false,
            };
            move_to(&object_signer, song_nft);
        }

        public entry fun list_for_sale(
            nft_obj: Object<SongNFTData>, 
            price: u64, 
            account: &signer
        ) acquires SongNFTData {
            let nft_address = object::object_address(&nft_obj);
            let song_nft = borrow_global_mut<SongNFTData>(nft_address);
            assert!(song_nft.owner == signer::address_of(account), 0);
            song_nft.is_listed = true;
            song_nft.price = price;
        }

        public entry fun transfer(
            nft_obj: Object<SongNFTData>,
            from: &signer,
            to: address,
        ) {
            object::transfer(from, nft_obj, to);
        }

        public entry fun buy(
            nft_obj: Object<SongNFTData>,
            buyer: &signer
        ) acquires SongNFTData {
            let nft_address = object::object_address(&nft_obj);
            let song_nft = borrow_global_mut<SongNFTData>(nft_address);
            assert!(song_nft.is_listed, 1);
            
            let payment = coin::withdraw<AptosCoin>(buyer, song_nft.price);
            coin::deposit(song_nft.owner, payment);
            
            song_nft.owner = signer::address_of(buyer);
            song_nft.is_listed = false;
        }

        #[view]
        public fun get_owner(nft_obj: Object<SongNFTData>): address acquires SongNFTData {
            let nft_address = object::object_address(&nft_obj);
            borrow_global<SongNFTData>(nft_address).owner
        }

        #[view]
        public fun is_listed(nft_obj: Object<SongNFTData>): bool acquires SongNFTData {
            let nft_address = object::object_address(&nft_obj);
            borrow_global<SongNFTData>(nft_address).is_listed
        }

        #[view]
        public fun get_price(nft_obj: Object<SongNFTData>): u64 acquires SongNFTData {
            let nft_address = object::object_address(&nft_obj);
            borrow_global<SongNFTData>(nft_address).price
        }

        #[view]
        public fun get_song_name(nft_obj: Object<SongNFTData>): String acquires SongNFTData {
            let nft_address = object::object_address(&nft_obj);
            borrow_global<SongNFTData>(nft_address).song_name
        }

        #[view]
        public fun get_mp3_url(nft_obj: Object<SongNFTData>): String acquires SongNFTData {
            let nft_address = object::object_address(&nft_obj);
            borrow_global<SongNFTData>(nft_address).mp3_url
        }
    }
}
