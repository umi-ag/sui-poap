## Sui POAP by zkLogin & Sponsored Transactions

https://github.com/umi-ag/sui-poap/assets/89327378/d78ad295-7735-4525-8e10-37c946456143

Demo: https://poap.umilabs.org/demo

At Sui Japan Meetup in Tokyo on October 30th, Umi Labs distributed proof of attendance NFTs to the participants.<br>
Here, we combined zkLogin with Sponsored Transactions to provide seamless experience from Google login to gasless transactions on the Sui Mainnet.

## Combination of zkLogin and Sponsored Transactions

zkLogin is a fundamental feature of Sui that enables you to execute transactions from a Sui address using an OAuth credential.<br>
Combined zkLogin with Sponsored Transactions, it enables dApp interaction without wallet extension or for users to handle transaction fees of SUI tokens.<br>
This facilitates seamless onboarding experience for the mass.

## Development

View [`Makefile.toml`](./Makefile.toml)

### local development

```bash
cd ui
npm i
npm run dev
```

## References

zkLogin

- https://docs.sui.io/concepts/cryptography/zklogin

Sponsored Transactions

- https://docs.sui.io/concepts/transactions/sponsored-transactions
