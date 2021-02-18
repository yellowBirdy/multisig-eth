const Wallet = artifacts.require("Wallet");

module.exports = async function (deployer, _network_, accounts) {
    await deployer.deploy(Wallet, accounts.slice(0,3), 2);
    const walletAddress = (await Wallet.deployed()).address;
    await web3.eth.sendTransaction({from: accounts[0], to: walletAddress, value: 10000});
};
