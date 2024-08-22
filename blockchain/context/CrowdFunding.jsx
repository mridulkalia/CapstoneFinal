import React, { useState, useEffect } from 'react'
import Web3Modal from 'web3modal'
import { ethers } from 'ethers'
import { CrowdFundingABI, CrowdFundingAddress } from './contants'

/**
 * @typedef {Object} Campaign
 * @property {string} title
 * @property {string} description
 * @property {string} amount
 * @property {string} deadline
 */

/**
 * @typedef {Object} CrowdFundingContextType
 * @property {string} titleData
 * @property {string} currentAccount
 * @property {(campaign: Campaign) => Promise<void>} createCampaign
 * @property {() => Promise<any[]>} getCampaigns
 * @property {() => Promise<any[]>} getUserCampaigns
 * @property {(pId: number, amount: string) => Promise<void>} donate
 * @property {(pId: number) => Promise<any[]>} getDonations
 * @property {() => Promise<void>} connectWallet
 */

const fetchContract = signerOrProvider =>
  new ethers.Contract(CrowdFundingAddress, CrowdFundingABI, signerOrProvider)

/** @type {React.Context<CrowdFundingContextType | undefined>} */
export const CrowdFundingContext = React.createContext()

export const CrowdFundingProvider = ({ children }) => {
  const titleData = 'Crowd Funding Contract'
  const [currentAccount, setCurrentAccount] = useState('')
  const [isConnecting, setIsConnecting] = useState(false)

  const createCampaign = async campaign => {
    const { title, description, amount, deadline } = campaign

    try {
      const web3Modal = new Web3Modal()
      const connection = await web3Modal.connect()
      const provider = new ethers.BrowserProvider(connection) // Correct provider setup
      const signer = await provider.getSigner() // Get the signer from the provider
      const contract = fetchContract(signer)

      if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
        console.error('Invalid amount:', amount)
        return
      }

      if (isNaN(new Date(deadline).getTime())) {
        console.error('Invalid deadline:', deadline)
        return
      }

      const transaction = await contract.createCampaign(
        currentAccount,
        title,
        description,
        ethers.parseEther(amount),
        new Date(deadline).getTime()
      )
      await transaction.wait()
      console.log('Contract call Success', transaction)
    } catch (error) {
      console.error('Contract call Failure', error)
    }
  }
  console.log('createCampaign function:', createCampaign)

  const getCampaigns = async () => {
    const provider = new ethers.JsonRpcProvider()
    const contract = fetchContract(provider)

    const campaigns = await contract.getCampaigns()
    const parsedCampaigns = campaigns.map((campaign, i) => ({
      owner: campaign.owner,
      title: campaign.title,
      description: campaign.description,
      target: ethers.formatEther(campaign.target.toString()),
      deadline: campaign.deadline.toNumber(),
      amountCollected: ethers.formatEther(campaign.amountCollected.toString()),
      pId: i
    }))
    return parsedCampaigns
  }

  const getUserCampaigns = async () => {
    const provider = new ethers.JsonRpcProvider()
    const contract = fetchContract(provider)
    const allCampaigns = await contract.getCampaigns()
    const accounts = await window.ethereum.request({
      method: 'eth_accounts'
    })
    const currentUser = accounts[0]
    const filteredCampaigns = allCampaigns.filter(
      campaign =>
        campaign.owner === '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'
    )
    const userData = filteredCampaigns.map((campaign, i) => ({
      owner: campaign.owner,
      title: campaign.title,
      description: campaign.description,
      target: ethers.formatEther(campaign.target.toString()),
      deadline: campaign.deadline.toNumber(),
      amountCollected: ethers.formatEther(campaign.amountCollected.toString()),
      pId: i
    }))
    return userData
  }

  const donate = async (pId, amount) => {
    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
      console.error('Invalid amount value')
      return
    }

    try {
      const web3Modal = new Web3Modal()
      const connection = await web3Modal.connect()
      const provider = new ethers.providers.Web3Provider(connection)
      const signer = provider.getSigner()
      const contract = fetchContract(signer)

      const campaignData = await contract.donateToCampaign(pId, {
        value: ethers.parseEther(amount)
      })
      await campaignData.wait()
      location.reload()
      return campaignData
    } catch (error) {
      console.error('Donation Failure', error)
    }
  }
  const getDonations = async pId => {
    const provider = new ethers.JsonRpcProvider()
    const contract = fetchContract(provider)
    const donations = await contract.getDonators(pId)
    const numberOfDonations = donations[0].length
    const parsedDonations = []
    for (let i = 0; i < numberOfDonations; i++) {
      parsedDonations.push({
        donator: donations[0][i],
        donation: ethers.formatEther(donations[1][i].toString())
      })
    }

    return parsedDonations
  }

  const checkIfWalletConnected = async () => {
    try {
      if (!window.ethereum) {
        return setOpenError(true), setError('Install Metamask')
      }
      const accounts = await window.ethereum.request({
        method: 'eth_accounts'
      })
      if (accounts.length) {
        setCurrentAccount(accounts[0])
      } else {
        console.log('Account Not Found')
      }
    } catch (error) {
      console.log('Something went wrong while connecting to wallet', error)
    }
  }

  useEffect(() => {
    checkIfWalletConnected()
  }, [])

  const connectWallet = async () => {
    if (isConnecting) return // Prevent multiple requests

    setIsConnecting(true)
    try {
      if (!window.ethereum) {
        console.log('Install MetaMask')
        return
      }
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      })
      setCurrentAccount(accounts[0])
    } catch (error) {
      console.log('Error while connecting to wallet', error)
    } finally {
      setIsConnecting(false) // Reset state after request is complete
    }
  }

  return (
    <CrowdFundingContext.Provider
      value={{
        titleData,
        currentAccount,
        createCampaign,
        getCampaigns,
        getUserCampaigns,
        donate,
        getDonations,
        connectWallet
      }}
    >
      {children}
    </CrowdFundingContext.Provider>
  )
}
