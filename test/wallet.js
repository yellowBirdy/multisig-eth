const { expectRevert } = require("@openzeppelin/test-helpers");
const Wallet = artifacts.require("Wallet");

contract("Wallet", (accounts) => {
    let wallet;
    beforeEach( async () => {
        wallet = await Wallet.new(accounts.slice(0,3), 2);
        await web3.eth.sendTransaction({from: accounts[0], to: wallet.address, value:10000000 });
    })

    it("Has the right approver addresses  and quorum", async () => {
        const approvers = await wallet.getApprovers();
        const quorum = await wallet.quorum();
        assert(approvers.length === 3);
        assert(approvers[0] === accounts[0]);
        assert(approvers[1] === accounts[1]);
        assert(approvers[2] === accounts[2]);
        assert(quorum.toNumber() === 2);
    });

    it("Should create transfers", async () => {
        await wallet.propose(accounts[6], 77, {from: accounts[0]});
        const transfers = await wallet.getTransfers();
        assert(transfers.length === 1);
        assert(transfers[0].id === "0");
        assert(transfers[0].to === accounts[6]);
        assert(transfers[0].approvals === "1");
        assert(transfers[0].amount === "77");
        assert(transfers[0].sent === false);
    });

    it("Only approver can create transfer", async () => {
        expectRevert(
            wallet.propose(accounts[6], 45, {from: accounts[6]}),
            "Can only be called by an approver."
        );        
    });
    it("Should record approval", async () => {
        await wallet.propose( accounts[6], 78, {from: accounts[0]});
        await wallet.approve(0, {from: accounts[1]});
        const transfer = await wallet.transfers(0);
        const approval = await wallet.approvals(accounts[1], 0);
        assert(transfer.approvals.toNumber() === 2);
        assert(approval === true);
    });
    it("Should send when quorum reached", async () => {
        await wallet.propose( accounts[9], 78, {from: accounts[0]});
        await wallet.approve(0, {from: accounts[1]});
        const transfer = await wallet.transfers(0);
        const balanceAfter = await web3.eth.getBalance(accounts[9]);
        assert(transfer.sent === true);
        assert(balanceAfter.toString() === "100000000000000000078");
    });    
    it("Should not allow aproval from non approver", async () => {
        await wallet.propose( accounts[6], 78, {from: accounts[0]});
        expectRevert(
            wallet.approve(0, {from: accounts[6]}),
            "Can only be called by an approver."
        );
    });
})
