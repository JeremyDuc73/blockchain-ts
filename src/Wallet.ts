import {Transaction} from "./Transaction";
import * as crypto from 'crypto';

export class Wallet {
    publicKey: string;
    privateKey: string;

    constructor() {
        const {publicKey, privateKey} = crypto.generateKeyPairSync('rsa', {
            modulusLength: 2048,
            publicKeyEncoding: {type: 'spki', format: 'pem'},
            privateKeyEncoding: {type: 'pkcs8', format: 'pem'}
        });

        this.publicKey = publicKey;
        this.privateKey = privateKey;
    }

    createTransaction(recipient: string, amount: number): Transaction {
        const tx = new Transaction(this.publicKey, recipient, amount);
        tx.signTransaction(this.privateKey);
        return tx;
    }
}