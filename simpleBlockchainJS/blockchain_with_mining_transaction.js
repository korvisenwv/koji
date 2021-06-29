const SHA256 = require("crypto-js/sha256");

class Transaction {
  constructor(senderAddress, recipientAddress, amount) {
    this.senderAddress = senderAddress;
    this.recipientAddress = recipientAddress;
    this.amount = amount;
  }
}

class Block {
  constructor(timestamp, transactions, previousHash) {
    this.timestamp = timestamp;
    this.transactions = transactions;
    this.previousHash = previousHash;
    this.hash = this.calculateHash();
    this.nonce = 0;
  }

  calculateHash() {
    return SHA256(
      this.previousHash +
        this.timestamp +
        JSON.stringify(this.transactions) +
        this.nonce
    ).toString();
  }

  mineBlock() {
    while (this.hash.substring(0, 2) !== "00") {
      this.nonce++;
      this.hash = this.calculateHash();
    }
    console.log("block was mined" + this.hash);
  }
}

class Blockchain {
  constructor() {
    this.chain = [this.createGenesisBlock()];
    this.pendingTransactions = [];
    this.miningReward = 12.5;
  }

  createGenesisBlock() {
    return new Block("05/02/2019", [], "0");
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  minePendingTransactions(miningRewardAddress) {
    let block = new Block(
      Date.now(),
      this.pendingTransactions,
      this.getLatestBlock().hash
    );
    block.mineBlock();

    console.log("ブロックが正常にマイニングされました");
    this.chain.push(block);

    this.pendingTransactions = [
      new Transaction(null, miningRewardAddress, this.miningReward),
    ];
  }

  createTransaction(transaction) {
    this.pendingTransactions.push(transaction);
  }

  getBalanceOfAddress(address) {
    let balance = 0;

    for (const block of this.chain) {
      for (const trans of block.transactions) {
        if (trans.senderAddress === address) {
          balance -= trans.amount;
        }
        if (trans.recipientAddress === address) {
          balance += trans.amount;
        }
      }
    }
    return balance;
  }

  isChainVaild() {
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i - 1];

      if (currentBlock.hash !== currentBlock.calculateHash()) {
        return false;
      }

      if (currentBlock.previousHash !== previousBlock.hash) {
        return false;
      }
    }

    return true;
  }
}

let originalCoin = new Blockchain();

originalCoin.createTransaction(new Transaction(null, "your-address", 12.5));
originalCoin.createTransaction(new Transaction("address1", "your-address", 10));
originalCoin.createTransaction(new Transaction("your-address", "address2", 2));

console.log("\n started mining");
originalCoin.minePendingTransactions("your-address");

console.log(
  "\n your balance",
  originalCoin.getBalanceOfAddress("your-address")
);

Copiedconsole.log("\n restarted mining");

originalCoin.minePendingTransactions("your-address");

Copiedconsole.log(
  "\n your balanceは",
  originalCoin.getBalanceOfAddress("your-address")
);
