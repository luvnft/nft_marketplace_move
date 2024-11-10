import { PinataSDK } from "pinata-web3";
import 'dotenv/config';

export const pinata = new PinataSDK({
  pinataJwt: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiIwZWJlNGYzMi0xMjJhLTQwMTktYmFkOC00N2RmMWIwNWNhZGYiLCJlbWFpbCI6InVubmF0aGNoaXR0aW1hbGxhQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJwaW5fcG9saWN5Ijp7InJlZ2lvbnMiOlt7ImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxLCJpZCI6IkZSQTEifSx7ImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxLCJpZCI6Ik5ZQzEifV0sInZlcnNpb24iOjF9LCJtZmFfZW5hYmxlZCI6ZmFsc2UsInN0YXR1cyI6IkFDVElWRSJ9LCJhdXRoZW50aWNhdGlvblR5cGUiOiJzY29wZWRLZXkiLCJzY29wZWRLZXlLZXkiOiI0ODc1NGE4N2Y4NjZkNzQwOGZiMSIsInNjb3BlZEtleVNlY3JldCI6IjRiNjNjNDQyNjUwOGY2Njc0NzU4MjhlMmM0Y2MxZmZkMjU3NWM5Yzk3ODk0MmRlN2ZkOTgyNjM2ZGNiN2ExYTEiLCJleHAiOjE3NjI2NjU5NzZ9.2xjWie4o5Hyop8R7WQ8yZSaNXSNakMRlyTG0yDbVl1s',
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
