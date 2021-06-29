const SHA256 = require("crypto-js/sha256");

// block class
// block includes timestamp, data, previous block's hash, hash
class Block {
  constructor(timestamp, data, previousHash) {
    this.timestamp = timestamp;
    this.data = data;
    this.previousHash = previousHash;
    this.hash = this.calculateHash();
  }

  calculateHash() {
    return SHA256(
      this.previousHash + this.timestamp + JSON.stringify(this.data)
    ).toString();
  }
}

// blockchain class
class Blockchain {
  constructor() {
    this.chain = [this.createGenesisBlock()];
  }

  createGenesisBlock() {
    return new Block("05/02/2021", "GenesisBlock", "0");
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  addBlock(newBlock) {
    newBlock.previousHash = this.getLatestBlock().hash;
    newBlock.hash = newBlock.calculateHash();
    this.chain.push(newBlock);
  }

  // check block data
  isChainValid() {
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
// add new blocks to blockchain
originalCoin.addBlock(new Block("04/01/2021", { SendCoinToA: 3 }));
originalCoin.addBlock(new Block("04/03/2021", { SendCoinToB: 8 }));

console.log(JSON.stringify(originalCoin, null, 2));
// no change --> return true
console.log(" data:" + originalCoin.isChainValid());

originalCoin.chain[1].data = { SendCoinToA: 200 };

console.log(JSON.stringify(originalCoin, null, 2));

// return false
console.log("Changed block data:" + originalCoin.isChainValid());
