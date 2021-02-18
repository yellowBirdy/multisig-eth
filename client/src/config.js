import Web3 from "web3";
import Wallet from "./contracts/Wallet.json";

const getWeb3 = () => {
    return new Web3("http://127.0.0.1:9545");
}

const _getContract = async (web3, artifact) => {
    const networkId = await web3.eth.net.getId();
    const deploymentMetadata = artifact.networks[networkId];
    return await new web3.eth.Contract(
        artifact.abi,
        deploymentMetadata.address
    );
}
const getWallet = async (web3) => await _getContract(web3, Wallet);

export {getWeb3, getWallet};
