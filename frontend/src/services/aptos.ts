import { AptosClient, AptosAccount, Types } from "aptos";

const client = new AptosClient("http://127.0.0.1:8080/");

export const mintSongNFT = async (
    song_name: string,
    mp3_url: string,
    account: AptosAccount
) => {
    const payload: Types.EntryFunctionPayload = {
        function: "0x02ca0cd188d92438f11c0284b9ea5ed30b59da4d829e85539bfd9b8ce52989eb::nft::mint",
        type_arguments: [],
        arguments: [song_name, mp3_url],
    };
    
    const txnRequest = await client.generateTransaction(account.address(), payload);
    const signedTxn = await client.signTransaction(account, txnRequest);
    const response = await client.submitTransaction(signedTxn);
    
    return response;
};
