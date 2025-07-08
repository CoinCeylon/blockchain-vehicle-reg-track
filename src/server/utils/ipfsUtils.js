const {
  create
} = require('ipfs-http-client');
const {
  Buffer
} = require('buffer');
// Configure IPFS client
const ipfs = create({
  host: process.env.IPFS_HOST || 'ipfs.infura.io',
  port: process.env.IPFS_PORT || 5001,
  protocol: process.env.IPFS_PROTOCOL || 'https',
  headers: {
    authorization: process.env.IPFS_AUTH || ''
  }
});
// Upload file to IPFS
const uploadToIPFS = async (fileData, mimeType) => {
  try {
    // Convert base64 to buffer
    const buffer = Buffer.from(fileData.replace(/^data:.*;base64,/, ''), 'base64');
    // Add file to IPFS
    const result = await ipfs.add(buffer);
    return result.path;
  } catch (error) {
    console.error('IPFS upload error:', error);
    throw new Error('Failed to upload to IPFS');
  }
};
// Get file from IPFS
const getFromIPFS = async ipfsHash => {
  try {
    const chunks = [];
    // Get file from IPFS
    for await (const chunk of ipfs.cat(ipfsHash)) {
      chunks.push(chunk);
    }
    return Buffer.concat(chunks);
  } catch (error) {
    console.error('IPFS retrieval error:', error);
    throw new Error('Failed to retrieve from IPFS');
  }
};
module.exports = {
  uploadToIPFS,
  getFromIPFS
};