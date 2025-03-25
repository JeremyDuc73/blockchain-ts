import * as crypto from 'crypto';
import {Transaction} from "./Transaction";

export class Block {
    nonce: number;
    transaction: Transaction;
    previousHash: string;
    hash: string;

    constructor(transaction: Transaction, previousHash = '') {
        this.nonce = 0;
        this.transaction = transaction;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
    }

    calculateHash(): string {
        const data = this.previousHash + JSON.stringify(this.transaction) + this.nonce;
        return crypto.createHash('sha256').update(data).digest('hex');
    }

    mine(difficulty: number): void {
        while (!this.hash.startsWith('0'.repeat(difficulty))) {
            this.nonce++;
            this.hash = this.calculateHash();
        }
        console.log(`Block miné: ${this.hash}`);
        console.log('\n\n')
    }
}