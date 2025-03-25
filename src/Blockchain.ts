import * as crypto from 'crypto';
import {Block} from "./Block";
import {Transaction} from "./Transaction";

export class Blockchain {
    chain: Block[];
    difficulty: number;

    constructor(genesisRecipient: string) {
        this.difficulty = 2;
        // Plus la difficulté est élevée
        // => plus de zéros requis au début du hash
        // => plus d’essais (nonce) nécessaires
        // => plus de temps/calcul pour miner.

        this.chain = [this.createGenesisBlock(genesisRecipient)];
    }

    private createGenesisBlock(recipient: string): Block {
        const tx = new Transaction('0', recipient, 100);
        tx.signed = true;
        const genesisBlock = new Block(tx, '0');
        genesisBlock.mine(this.difficulty);
        return genesisBlock;
    }


    private getLatestBlock(): Block {
        return this.chain[this.chain.length - 1];
    }

    mine(transaction: Transaction): void {
        if (!transaction.signed) {
            console.error("Transaction refusée : elle n'est pas signée.");
            return;
        }

        if (transaction.sender !== '') {
            const senderBalance = this.getBalance(transaction.sender);
            if (senderBalance < transaction.amount) {
                console.error(`Transaction refusée : le sender n'a pas assez de coins.\n Solde actuel : ${senderBalance}\n Montant demandé : ${transaction.amount} \n\n`);
                return;
            }
        }

        const newBlock = new Block(transaction, this.getLatestBlock().hash);
        newBlock.mine(this.difficulty);
        this.chain.push(newBlock);
    }

    getBalance(address: string): number {
        let balance = 0;

        for (const block of this.chain) {
            const tx = block.transaction;
            if (tx.recipient === address) {
                balance += tx.amount;
            }
            if (tx.sender === address) {
                balance -= tx.amount;
            }
        }

        return balance;
    }
}