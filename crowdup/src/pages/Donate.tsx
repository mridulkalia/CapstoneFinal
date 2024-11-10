import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import TransferFundsABI from './../TransferFundsABI.json';
import {
  Container,
  Paper,
  Title,
  Text,
  Button,
  TextInput,
  Group,
  Loader,
  Badge,
} from '@mantine/core';

// Smart contract address
const CONTRACT_ADDRESS = '0xDA2cCf12f5C48ab6989B1F142b61b1eCf16041D7';

// Type for transactions
interface Transaction {
  recipient: string;
  amount: number;
  date: string;
}

const Donate: React.FC = (): JSX.Element => {
  const [web3, setWeb3] = useState<Web3 | null>(null);
  const [contract, setContract] = useState<any>(null);
  const [senderAddress, setSenderAddress] = useState<string>(''); // User's own address
  const [recipient, setRecipient] = useState<string>('');
  const [amount, setAmount] = useState<number>(0);
  const [balance, setBalance] = useState<number>(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const initWeb3 = async () => {
      setLoading(true);
      try {
        const web3Instance = new Web3("http://127.0.0.1:7545");
        setWeb3(web3Instance);

        const contractInstance = new web3Instance.eth.Contract(TransferFundsABI as any, CONTRACT_ADDRESS);
        setContract(contractInstance);
      } catch (err) {
        console.error('Error initializing web3:', err);
      } finally {
        setLoading(false);
      }
    };

    initWeb3();
  }, []);

  const handleTransfer = async () => {
    if (contract && web3 && senderAddress) {
      try {
        await contract.methods.transfer(recipient).send({
          from: senderAddress, // Use the entered sender address
          value: web3.utils.toWei(amount.toString(), 'ether'),
          gas: 300000,
        });

        // Record transaction
        const newTransaction: Transaction = {
          recipient,
          amount,
          date: new Date().toLocaleString(),
        };
        setTransactions([...transactions, newTransaction]);

        // Update balance after the transfer
        await updateBalance();
      } catch (err) {
        console.error('Error during transfer:', err);
      }
    }
  };

  const updateBalance = async () => {
    if (contract && web3 && senderAddress) {
      try {
        const weiBalance = await contract.methods.getBalance().call({ from: senderAddress });
        const etherBalance = web3.utils.fromWei(weiBalance, 'ether');
        setBalance(parseFloat(etherBalance)); // Convert the string to number
      } catch (err) {
        console.error('Error fetching balance:', err);
      }
    }
  };

  return (
    <Container size="xl" style={{ backgroundColor: "#f4f7fb", paddingBottom: "3rem" }}>
      <Paper shadow="lg" p="md" style={{ borderRadius: "10px" }}>
        <Title order={2} mb="lg" align="center">
          Transfer Funds
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
                style={{ marginBottom: '1rem' }}
              />
            </div>

            <div className="input-container">
              <TextInput
                label="Recipient Address"
                placeholder="Enter recipient address"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                style={{ marginBottom: '1rem' }}
              />
            </div>

            <div className="input-container">
              <TextInput
                label="Amount (ETH)"
                placeholder="Enter amount in ETH"
                value={amount}
                onChange={(e) => setAmount(parseFloat(e.target.value))}
                style={{ marginBottom: '1rem' }}
              />
            </div>

            <Button onClick={handleTransfer} color="teal" fullWidth style={{ marginBottom: '1rem' }}>
              Transfer Funds
            </Button>

            <div className="balance-section">
              <Button onClick={updateBalance} variant="outline" color="teal" fullWidth style={{ marginBottom: '1rem' }}>
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
        <Paper shadow="lg" p="md" style={{ borderRadius: "10px", marginTop: "2rem" }}>
          <Title order={3} mb="lg" align="center">
            Transaction History
          </Title>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>Date</th>
                <th style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>Recipient</th>
                <th style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>Amount (ETH)</th>
                <th style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>Amount (Rs.)</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction, index) => (
                <tr key={index}>
                  <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>{transaction.date}</td>
                  <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>{transaction.recipient}</td>
                  <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>{transaction.amount}</td>
                  <td style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>
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
