import * as crypto from "crypto";

export class Transaction {
    sender: string;
    recipient: string;
    amount: number
    signature: string | null;
    signed: boolean;

    constructor(sender: string, recipient: string, amount: number) {
        this.sender = sender;
        this.recipient = recipient;
        this.amount = amount;
        this.signature = null;
        this.signed = false;
    }

    signTransaction(privateKeyPem: string): void {
        try {
            // création de la signature
            const sign = crypto.createSign('sha256');
            sign.update(this.sender + this.recipient + this.amount);
            sign.end();

            // on transforme la string clé privée en Object clé privée (plus robuste)
            const privateKey = crypto.createPrivateKey(privateKeyPem);
            this.signature = sign.sign(privateKey, 'hex');

            const verify = crypto.createVerify('sha256');
            verify.update(this.sender + this.recipient + this.amount);
            verify.end();

            const publicKey = crypto.createPublicKey(this.sender);
            const isValid = verify.verify(publicKey, this.signature, 'hex');

            if (isValid) {
                this.signed = true;
                console.log("Signature validée");
            } else {
                this.signed = false;
                this.signature = null;
                console.error("Signature invalide : la clé privée ne correspond pas à l'expéditeur.")
            }
        } catch (e) {
            console.error("Erreur pendant la signature : ", e)
            this.signed = false;
            this.signature = null;
        }
    }
}