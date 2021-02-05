const { expectRevert } = require("@openzeppelin/test-helpers");
const Wallet = artifacts.require("Wallet");

contract("Wallet", (accounts) => {
    let wallet;
    beforeEach( async () => {
        wallet = await Wallet.new(accounts.slice(0,4), 3);
        await web3.eth.sendTransaction({from: accounts[0], to: wallet.address, value:10000000 });
    })

    it("Has the right approver addresses  and quorum", async () => {
        const approvers = await wallet.getApprovers();
        const quorum = await wallet.quorum();
        assert(approvers.length === 4);
        assert(approvers[0] === accounts[0]);
        assert(approvers[1] === accounts[1]);
        assert(approvers[2] === accounts[2]);
        assert(approvers[3] === accounts[3]);
        assert(quorum.toNumber() === 3);
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
        const balanceBefore = web3.utils.toBN(await web3.eth.getBalance(wallet.address));
        await wallet.propose( accounts[6], 78, {from: accounts[0]});
        await wallet.approve(0, {from: accounts[1]});
        const balanceAfter = web3.utils.toBN(await web3.eth.getBalance(wallet.address));
        const transfer = await wallet.transfers(0);
        const approval = await wallet.approvals(accounts[1], 0);
        assert(transfer.approvals.toNumber() === 2);
        assert(approval === true);
        assert(transfer.sent === false);
        assert(balanceBefore.eq(balanceAfter));
    });
    it("Should send when quorum reached", async () => {
        const balanceBefore = web3.utils.toBN(await web3.eth.getBalance(accounts[9]));
        await wallet.propose( accounts[9], 78, {from: accounts[0]});
        await wallet.approve(0, {from: accounts[1]});
        await wallet.approve(0, {from: accounts[2]});
        const transfer = await wallet.transfers(0);
        const balanceAfter = web3.utils.toBN(await web3.eth.getBalance(accounts[9]));
        assert(transfer.sent === true);
        assert(balanceAfter.sub(balanceBefore).toNumber() === 78);
    });    
    it("Should NOT  allow aproval from non approver", async () => {
        await wallet.propose( accounts[6], 78, {from: accounts[0]});
        expectRevert(
            wallet.approve(0, {from: accounts[6]}),
            "Can only be called by an approver."
        );
    });
    it("Should NOT allow approval of a sent transfer", async () => {
        await wallet.propose( accounts[8], 78, {from: accounts[0]});
        await wallet.approve(0, {from: accounts[1]});
        await wallet.approve(0, {from: accounts[2]});
        
        expectRevert(
            wallet.approve(0, {from: accounts[3]}),
            "Transfer already fullfiled."
        );
    });
    it("Should NOT allow double approval from a single acc", async () => {
        await wallet.propose( accounts[8], 78, {from: accounts[0]});
        await wallet.approve(0, {from: accounts[1]});
        
        expectRevert(
            wallet.approve(0, {from: accounts[1]}),
            "Can't approve twice."
        );
    });

})
