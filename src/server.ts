import express from 'express';
import bodyParser from 'body-parser';
import { Wallet } from "./Wallet";
import { Transaction } from "./Transaction";
import { Blockchain } from "./Blockchain";

const app = express();
const port = 36000;

app.use(bodyParser.json());

const master = new Wallet();
const blockchain = new Blockchain(master.publicKey);

app.get('/balance', (req, res) => {
    const address = req.body.address;
    const balance = blockchain.getBalance(address);
    res.json({address, balance});
});

app.get('/blockchain', (req, res) => {
    res.json(blockchain);
});

app.get('/wallet/new', (req, res) => {
    const wallet = new Wallet();
    res.json({
        publicKey: wallet.publicKey,
        privateKey: wallet.privateKey,
    });
});

app.post('/transaction', (req, res) => {
    const { senderPrivateKey, senderPublicKey, recipient, amount } = req.body;
    if (!senderPrivateKey || !senderPublicKey || !recipient || !amount) {
        return res.status(400).json({error: 'Missing required fields'});
    }
    const tx = new Transaction(master.publicKey, recipient, amount);
    tx.signTransaction(senderPrivateKey);
    if (!tx.signed) {
        return res.status(400).json({error: 'Invalid signature' });
    }
    const senderBalance = blockchain.getBalance(senderPublicKey);
    if (senderBalance < amount) {
        return res.status(400).json({error: 'Insufficient balance' });
    }
    blockchain.mine(tx);
    res.json({message: 'Transaction has been mined!', tx});
})

app.listen(port, () => {
    console.log(`🚀 API Blockchain en ligne sur http://localhost:${port}`);
})