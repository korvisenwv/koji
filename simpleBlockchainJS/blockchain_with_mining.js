const SHA256 = require("crypto-js/sha256");

class Block {
  constructor(timestamp, data, previousHash) {
    this.timestamp = timestamp;
    this.data = data;
    this.previousHash = previousHash;
    this.hash = this.calculateHash();
    this.nonce = 0; // number only used once
  }

  calculateHash() {
    return SHA256(
      this.previousHash +
        this.timestamp +
        JSON.stringify(this.data) +
        this.nonce
    ).toString();
  }

  // mining method
  // In this case, set a simple condition '00' to save time for mining
  mineBlock() {
    while (this.hash.substring(0, 2) !== "00") {
      this.nonce++; // increment nonce
      this.hash = this.calculateHash();
      console.log(this.hash);
    }
    console.log("A block has been mined: " + this.hash);
  }
}

class Blockchain {
  constructor() {
    this.chain = [this.createGenesisBlock()];
  }

  createGenesisBlock() {
    return new Block("05/02/2019", "GenesisBlock", "0");
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  addBlock(newBlock) {
    newBlock.mineBlock();
    this.chain.push(newBlock);
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

// mining for the second block
console.log("mining for the second block....");
originalCoin.addBlock(new Block("05/02/2021", { SendCoinToA: 3 }));

// mining for the third block
console.log("mining for the third block....");
originalCoin.addBlock(new Block("05/03/2021", { SendCoinToB: 8 }));

console.log(JSON.stringify(originalCoin, null, 2));
