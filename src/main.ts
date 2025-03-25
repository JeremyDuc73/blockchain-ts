import { Wallet } from './Wallet';
import { Blockchain } from './Blockchain';
import {Transaction} from "./Transaction";

const jeremy = new Wallet();
const bob = new Wallet();

console.log("Voici le wallet de Jérémy : \n", jeremy);
console.log('\n\n')

const blockchain = new Blockchain(jeremy.publicKey);

console.log("Voici la blockchain : \n", blockchain);
console.log("Solde de Jérémy au début :", blockchain.getBalance(jeremy.publicKey));
console.log("Premier block : ", blockchain.chain[0])
console.log('\n\n')

const tx1 = jeremy.createTransaction(bob.publicKey, 30);
blockchain.mine(tx1);
console.log("Voici la blockchain après la transaction : \n",blockchain);
console.log("Solde de Jérémy :", blockchain.getBalance(jeremy.publicKey));
console.log("Solde de Bob :", blockchain.getBalance(bob.publicKey));
console.log('\n\n')


const tx2 = jeremy.createTransaction(bob.publicKey, 80);
blockchain.mine(tx2);
console.log("Voici la blockchain après la deuxième transaction : \n",blockchain);
console.log("Solde de Jérémy :", blockchain.getBalance(jeremy.publicKey));
console.log("Solde de Bob :", blockchain.getBalance(bob.publicKey));
console.log('\n\n')


const tx3 = new Transaction(jeremy.publicKey, bob.publicKey, 10);
tx3.signTransaction(bob.privateKey);
blockchain.mine(tx3);
console.log("Voici la blockchain après la troisième transaction (invalide) : \n", blockchain);
console.log("Solde de Jérémy :", blockchain.getBalance(jeremy.publicKey));
console.log("Solde de Bob :", blockchain.getBalance(bob.publicKey));
