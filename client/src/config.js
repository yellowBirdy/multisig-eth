import Web3 from "web3";
import Wallet from "./contracts/Wallet.json";

const getWeb3 = () => {
//    return new Web3("http://127.0.0.1:9545");
    return new Promise( (resolve, reject) => {
        window.addEventListener("load", async () => {
            if (window.ethereum) {
                try {
                    const web3 = new Web3(window.ethereum)
                    await window.ethereum.enable()
                    resolve(web3)
                } catch (err) {
                    reject(err)
                }
            } else if (window.web3) {
                resolve(window.web3)
            } else {
                reject("Multisig: no wallet available.")
            }
        })
    })
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
