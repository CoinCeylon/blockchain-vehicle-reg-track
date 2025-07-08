import { BrowserWallet, Wallet } from '@meshsdk/core'


export class BrowserWallet {
  static async enable(walletName: string) {
    console.log(` enabling ${walletName} wallet`)
    return {
      getNetworkId: async () => 1,
      getChangeAddress: async () => 'addr1mock_change_address_123456789',
      getUsedAddresses: async () => ['addr1mock_used_address_123456789'],
      getBalance: async () => ({ lovelace: '42000000' }),
    }
  }
  static getInstalledWallets(): string[] {

    return ['Lace', 'Eternl', 'Nami']
  }
}

// Get available wallets
export const getAvailableWallets = async (): Promise<string[]> => {
  try {
    return BrowserWallet.getInstalledWallets()
  } catch (error) {
    console.error('Error getting available wallets:', error)
    return []
  }
}

// Connect to wallet
export const connectWallet = async (walletName: string): Promise<any> => {
  try {
    const wallet = await BrowserWallet.enable(walletName)
    const networkId = await wallet.getNetworkId()
    const changeAddress = await wallet.getChangeAddress()
    const usedAddresses = await wallet.getUsedAddresses()
    const balance = await wallet.getBalance()
    console.log(`Connected to ${walletName} wallet`)
    console.log(`Network ID: ${networkId}`)
    console.log(`Change Address: ${changeAddress}`)
    return {
      wallet,
      networkId,
      changeAddress,
      usedAddresses,
      balance,
    }
  } catch (error) {
    console.error('Error connecting to wallet:', error)
    throw new Error(
      `Failed to connect to ${walletName} wallet. Please make sure it's installed and unlocked.`,
    )
  }
}

// Disconnect wallet
export const disconnectWallet = (): void => {

  console.log('Wallet disconnected')
  
}

// Sign transaction
export const signTransaction = async (
  wallet: Wallet,
  tx: any,
): Promise<string> => {
  try {

    const witnessSet = await wallet.signTx(tx)
    return witnessSet
  } catch (error) {
    console.error('Error signing transaction:', error)
    throw new Error('Failed to sign transaction with wallet')
  }
}

// Submit transaction
export const submitTransaction = async (
  wallet: Wallet,
  tx: any,
  witnessSet: any,
): Promise<string> => {
  try {
  
    const txHash = await wallet.submitTx(tx, witnessSet)
    return txHash
  } catch (error) {
    console.error('Error submitting transaction:', error)
    throw new Error('Failed to submit transaction')
  }
}

// Get wallet UTXOs
export const getWalletUtxos = async (wallet: Wallet): Promise<any[]> => {
  try {
    const utxos = await wallet.getUtxos()
    return utxos
  } catch (error) {
    console.error('Error getting wallet UTXOs:', error)
    throw new Error('Failed to get wallet UTXOs')
  }
}

export default {
  getAvailableWallets,
  connectWallet,
  disconnectWallet,
  signTransaction,
  submitTransaction,
  getWalletUtxos,
}
