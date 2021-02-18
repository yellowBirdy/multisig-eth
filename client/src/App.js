import React, {useState, useEffect} from "react";
import {getWeb3, getWallet} from "./config";
import {Transfers, Propose} from "./components";

function App() {
    const [web3, setWeb3] = useState(undefined);
    const [wallet, setWallet] = useState(undefined);
    const [accounts, setAccounts] = useState([]);
    const [approvers, setApprovers] = useState([]);
    const [quorum, setQuorum] = useState(undefined);
    const [loading, setLoading] = useState(false);
    const [transfers, setTransfers] = useState([]);
    
    useEffect(()=>{
        const init = async ()=>{
            setLoading(true);
            let web3 = await getWeb3();    window.web3 = web3;
            let wallet = await getWallet(web3);
            let accounts = await web3.eth.getAccounts();
            let approvers = await wallet.methods.getApprovers().call();
            let quorum = await wallet.methods.quorum().call();
            let transfers = await wallet.methods.getTransfers().call();
            setLoading(false);
            setWeb3(web3);
            setWallet(wallet);
            setAccounts(accounts);
            setApprovers(approvers);
            setQuorum(quorum);
            setTransfers(transfers);
        }
        init();
    }, [])


    const doPropose = ({amount, to }) => {
        wallet.methods.propose(to, amount)
            .send({from: accounts[0], gas: 159999})
            .then(r=>wallet.methods.getTransfers().call())
            .then(t=>setTransfers(t))
    };
    const doApprove = ({id}) => {
        wallet.methods.approve(id)
            .send({from: accounts[0], gas: 159999})
            .then(r=>wallet.methods.getTransfers().call())
            .then(t=>setTransfers(t))
    };

    if (loading) return <h1>LOADING...</h1> 

    return (
        <div className="App">
          <header className="App-header">
            <h1> Multisig Etherium Wallet</h1>
            <p>Approvers: {approvers.join(", ")}</p>
            <p>Quorum: {quorum}</p>
          </header>
          <Propose doPropose={doPropose} defaultTarget={accounts[9]} />
          <Transfers transfers={transfers} onClick={doApprove} />
        </div>
    );
}

export default App;
