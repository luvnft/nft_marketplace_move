import { PinataSDK } from "pinata-web3";
import 'dotenv/config';

export const pinata = new PinataSDK({
  pinataJwt: '<YOUR_PINATA_JWT>',
  pinataGateway: 'https://gateway.pinata.cloud/ipfs/',
});
export async function uploadToPinata(file) {
  try {
    console.log('Starting Pinata upload for:', file.name);
    const upload = await pinata.upload.file(file);
    console.log('Pinata upload successful:', upload);
    return upload;
  } catch (error) {
    console.error('Pinata upload failed:', error);
    throw new Error(`Failed to upload to Pinata: ${error}`);
  }
}
export async function getFromPinata(ipfsHash) {
  try {
    const data = await pinata.gateways.get(ipfsHash);
    return data;
  } catch (error) {
    throw new Error(`Failed to retrieve from Pinata: ${error}`);
  }
}
