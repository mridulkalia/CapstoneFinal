import React, { useState, useEffect } from "react";
import Web3 from "web3";
import TransferFundsABI from "./../TransferFundsABI.json";
import {
  Container,
  Paper,
  Title,
  Text,
  Button,
  TextInput,
  Group,
  Loader,
} from "@mantine/core";
import { useParams } from "react-router-dom";

// Smart contract address
const CONTRACT_ADDRESS = "0xDA2cCf12f5C48ab6989B1F142b61b1eCf16041D7";

// Type for transactions
interface Transaction {
  recipient: string;
  amount: number;
  date: string;
}

interface Campaign {
  _id: string;
  title: string;
  description: string;
  ethereumAddress: string;
  targetAmount: number;
  amount: number;
  deadline: string;
}

const Donate: React.FC = (): JSX.Element => {
  const [web3, setWeb3] = useState<Web3 | null>(null);
  const [contract, setContract] = useState<any>(null);
  const [senderAddress, setSenderAddress] = useState<string>(""); // User's own address
  const [recipient, setRecipient] = useState<string>("");
  const [amount, setAmount] = useState<number>(0);
  const [balance, setBalance] = useState<number>(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [campaign, setCampaign] = useState<Campaign | null>(null);

  const { id: campaignId } = useParams(); // Extract the campaignId from URL params
  console.log("Campaign ID from URL:", campaignId); // Ensure this logs the correct ID
  useEffect(() => {
    const initWeb3 = async () => {
      setLoading(true);
      try {
        const web3Instance = new Web3("http://127.0.0.1:7545");
        setWeb3(web3Instance);

        const contractInstance = new web3Instance.eth.Contract(
          TransferFundsABI as any,
          CONTRACT_ADDRESS
        );
        setContract(contractInstance);
        console.log("Campaign ID:", campaignId);
        const campaignResponse = await fetch(
          `http://localhost:8000/campaigns/${campaignId}`
        );
        if (!campaignResponse.ok) {
          throw new Error(`HTTP error! Status: ${campaignResponse.status}`);
        }
        const campaignData = await campaignResponse.json();
        console.log(567476545);
        console.log("Parsed Campaign Data:", campaignData);
        console.log("Ethereum Address:", campaignData.campaign.ethereumAddress);
        setCampaign(campaignData.campaign);
        setRecipient(campaignData.campaign.ethereumAddress);
      } catch (err) {
        console.error("Error initializing web3:", err);
      } finally {
        setLoading(false);
      }
    };

    initWeb3();
  }, [campaignId]);

  const handleTransfer = async () => {
    if (contract && web3 && senderAddress) {
      try {
        // Perform the Ethereum transfer
        await contract.methods.transfer(recipient).send({
          from: senderAddress, // Use the entered sender address
          value: web3.utils.toWei(amount.toString(), "ether"),
          gas: 300000,
        });

        // Create a new transaction object
        const newTransaction: Transaction = {
          recipient: recipient,
          amount: amount,
          date: new Date().toLocaleString(), // Ensure date is formatted as a string
        };

        // API request to save the transaction in the database
        const response = await fetch(
          `http://localhost:8000/campaigns/${campaignId}/transactions`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              donorAddress: senderAddress,
              amount: amount * 217227,
            }),
          }
        );

        if (response.ok) {
          const result = await response.json();
          console.log("Transaction added:", result.message);

          // Update the local transaction state
          setTransactions([...transactions, newTransaction]);

          // Update balance after the transfer
          await updateBalance();
        } else {
          throw new Error("Failed to add transaction");
        }
      } catch (err) {
        console.error("Error during transfer:", err);
      }
    }
  };

  const updateBalance = async () => {
    if (contract && web3 && senderAddress) {
      try {
        const weiBalance = await contract.methods
          .getBalance()
          .call({ from: senderAddress });
        const etherBalance = web3.utils.fromWei(weiBalance, "ether");
        setBalance(parseFloat(etherBalance)); // Convert the string to number
      } catch (err) {
        console.error("Error fetching balance:", err);
      }
    }
  };

  return (
    <Container
      size="xl"
      style={{ backgroundColor: "#f4f7fb", paddingBottom: "3rem" }}
    >
      <Paper shadow="lg" p="md" style={{ borderRadius: "10px" }}>
        <Title order={2} mb="lg" align="center">
          Donate to {campaign?.title || "Campaign"}
        </Title>

        {loading ? (
          <Group position="center">
            <Loader size="xl" color="teal" />
          </Group>
        ) : (
          <div>
            {/* Sender Address Input */}
            <div className="input-container">
              <TextInput
                label="Your Address"
                placeholder="Enter your address"
                value={senderAddress}
                onChange={(e) => setSenderAddress(e.target.value)}
                style={{ marginBottom: "1rem" }}
              />
            </div>

            {/* Recipient Address Input - Locked (Unchangeable) */}
            <div className="input-container">
              <TextInput
                label="Recipient Address"
                value={recipient || "Loading..."} // Display loading text until recipient is set
                readOnly
                style={{ marginBottom: "1rem", backgroundColor: "#f0f0f0" }}
              />
            </div>

            <div className="input-container">
              <TextInput
                label="Amount (ETH)"
                placeholder="Enter amount in ETH"
                value={amount}
                onChange={(e) => setAmount(parseFloat(e.target.value))}
                style={{ marginBottom: "1rem" }}
              />
            </div>

            <Button
              onClick={handleTransfer}
              color="teal"
              fullWidth
              style={{ marginBottom: "1rem" }}
            >
              Transfer Funds
            </Button>

            <div className="balance-section">
              <Button
                onClick={updateBalance}
                variant="outline"
                color="teal"
                fullWidth
                style={{ marginBottom: "1rem" }}
              >
                Get Balance
              </Button>
              <Text align="center" size="lg">
                Account Balance: <b>{balance} ETH</b>
              </Text>
              <Text align="center" size="sm" color="dimmed">
                <b>1 ETH = Rs 2,17,227</b>
              </Text>
            </div>
          </div>
        )}
      </Paper>

      {transactions.length > 0 && (
        <Paper
          shadow="lg"
          p="md"
          style={{ borderRadius: "10px", marginTop: "2rem" }}
        >
          <Title order={3} mb="lg" align="center">
            Transaction History
          </Title>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>
                  Date
                </th>
                <th style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>
                  Recipient
                </th>
                <th style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>
                  Amount (ETH)
                </th>
                <th style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>
                  Amount (Rs.)
                </th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction, index) => (
                <tr key={index}>
                  <td
                    style={{ padding: "10px", borderBottom: "1px solid #ddd" }}
                  >
                    {transaction.date}
                  </td>
                  <td
                    style={{ padding: "10px", borderBottom: "1px solid #ddd" }}
                  >
                    {transaction.recipient}
                  </td>
                  <td
                    style={{ padding: "10px", borderBottom: "1px solid #ddd" }}
                  >
                    {transaction.amount}
                  </td>
                  <td
                    style={{ padding: "10px", borderBottom: "1px solid #ddd" }}
                  >
                    {transaction.amount * 217227}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Paper>
      )}
    </Container>
  );
};

export default Donate;
