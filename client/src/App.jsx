import { useState, useEffect } from 'react'
import Web3 from 'web3';
import TransferFundsABI from './TransferFundsABI.json';
import './App.css'
import './index.css'; // or './App.css'
import toast, { Toaster } from 'react-hot-toast';


const CONTRACT_ADDRESS = '0xb96F42bd31D9037D586e87361Ba4d70CFb0c66C7';

function App() {
  const [account, setAccount] = useState('');
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState(0);
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const initWeb3 = async () => {
      try {
        const web3Instance = new Web3("http://127.0.0.1:7545");
        setWeb3(web3Instance);
        console.log("Web3 Instance : ", web3Instance);
        const accounts = await web3Instance.eth.getAccounts();
        setAccount(accounts[0]);
        console.log("Account : ", accounts[0]);
        const contractInstance = new web3Instance.eth.Contract(TransferFundsABI, CONTRACT_ADDRESS);
        setContract(contractInstance);
        console.log("Contract :", contractInstance);
      }
      catch (err) {
        console.error(err);
      }
    };

    initWeb3();

  }, []);

  const handleTransfer = async () => {
    if (contract && web3) {
      try {
        await contract.methods.transfer(recipient).send({
          from: account,
          value: web3.utils.toWei(amount, 'ether'),
          gas: 300000

        });
        toast.success("Transaction Successful");

        //Record transaction
        const newTransaction = {
          recipient,
          amount,
          date: new Date().toLocaleString()
        };
        setTransactions([...transactions, newTransaction]);

        await updateBalance();
      }
      catch (err) {
        console.error(err);
        toast.error("Transaction Failed");
      }
    }
  }

  const updateBalance = async () => {
    if (contract && web3) {
      const balance = await contract.methods.getBalance().call();
      setBalance(web3.utils.fromWei(balance, 'ether'));
      console.log(balance);
    }
  }

  return (
      <>
        <div><Toaster /></div>
        <div className="mainPage">
  
          <div className="container">
            <h1>Transfer Funds</h1>
            <div>
              <label>Recipient Address:</label>
              <input
                type="text"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                placeholder="Enter recipient address"
              />
            </div>
            <div>
              <label>Amount (ETH):</label>
              <input
                type="text"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount in ETH"
              />
            </div>
            <button onClick={handleTransfer}>Transfer Funds</button>
  
            <div className="balance-section">
              <button onClick={updateBalance}>Get Balance</button>
              <p>Account Balance: <b>{balance} ETH</b></p>
              <p><b>1 ETH = Rs 2,17,227</b></p>
            </div>
          </div>
  
          {transactions.length > 0 && (
            <div className="transaction-history-container">
              <h1>Transaction History</h1>
              <table className="transaction-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Recipient</th>
                    <th>Amount (ETH)</th>
                    <th>Amount (Rs.)</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Map through transactions and display rows */}
                  {transactions.map((transaction, index) => (
                    <tr key={index}>
                      <td>{transaction.date}</td>
                      <td>{transaction.recipient}</td>
                      <td>{transaction.amount}</td>
                      <td>{transaction.amount * 217227}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </>
    )
}

export default App
