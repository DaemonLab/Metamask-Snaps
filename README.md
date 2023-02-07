# @team53-interiit-11/Simplify

This repository aims to 
  1. Display a custom confirmation screen in MetaMask
    In Simplify we have displayed a MetaMask popup with personalized text and buttons for accepting or rejecting a decision. This makes it simple to construct opt-in       flows, requests, and confirmations.
  2. Schedule actions with cron jobs
    Execute routine actions at predetermined intervals or dates and hours in smart contract automation.
  3. Populate MetaMask's pre-transaction window with custom transaction insights
    With the transaction insights API, we have integrated security, anti-phishing, and insight solutions into the MetaMask UI.
  4. Control non-EVM accounts and assets in MetaMask
    Our Snaps to support several blockchain protocols and manage keys of the solana and tron network so that transactions can be performed.
  5. Notify users in MetaMask
    A notifications interface is introduced by MetaMask Flask and is used by our Snap that has the notifications permission. For information that is urgent or requires     immediate action, a Snap can send a brief notice text.
  6. Store and manage data on your device
    Encryption is used by default to store, update, and retrieve data securely in the contactbook.

Simplify is a Snap that allows anyone to is a Snap which utilizes the displaying custom message utility, notification and storing data features.

  ○ It delivers a solution to another side of using a decentralized network, that is, high gas and transaction fees by reducing the number of transactions needed by      optimizing the Max-Flow when a number of shared transactions are being done in a relatively bounded group of people.

  ○ It does so by:
    
    i. Allowing users to make groups with other addresses and users and adding them as members
    ii. Now Members of the group can divide their expenses among themselves and the Snap gives them the ability to record their transactions and how much they owe each other.
    iii. The Simplification algorithm efficiently calculates ways to settle all that is owed to one another in a group and reduces overall transaction and hence the user benefits by having to pay less gas and transaction fees while also lowering the load in the network.
    iv. It offers versatility by allowing users to divide expenses with granularity.
    v. It allows users to directly add contacts by asking them nicknames for addresses.

  ○ It utilizes the provided feature to display custom message by notifying the users about all the above mentioned features

## Interaction ( Approval, Rejection, showing data, notifications... )

To interact with Simplify, you will need to install [MetaMask Flask](https://metamask.io/flask/), a canary distribution for developers that provides access to upcoming features.

## This repository is hosted online!!
https://knotty-calendar-production.up.railway.app/

## You can also locally host it by folling the below instructions.

Clone the template-snap repository (https://github.com/team53-interiit-11/Simplify/generate) and setup the development environment:

```shell
yarn install && yarn start
```

## Cloning

Note that the `action-publish-release.yml` workflow contains a step that publishes the frontend of this snap (contained in the `public/` directory) to GitHub pages. If you do not want to publish the frontend to GitHub pages, simply remove the step named "Publish to GitHub Pages" in that workflow.

If you don't wish to use any of the existing GitHub actions in this repository, simply delete the `.github/workflows` directory.

### Testing and Linting

Run `yarn test` to run the tests once.

Run `yarn lint` to run the linter, or run `yarn lint:fix` to run the linter and fix any automatically fixable issues.

## Notes

- Babel is used for transpiling TypeScript to JavaScript, so when building with the CLI,
  `transpilationMode` must be set to `localOnly` (default) or `localAndDeps`.
- For the global `wallet` type to work, you have to add the following to your `tsconfig.json`:
  ```json
  {
    "files": ["./node_modules/@metamask/snap-types/global.d.ts"]
  }
  ```
