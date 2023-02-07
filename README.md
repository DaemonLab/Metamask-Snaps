<<<<<<< HEAD
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



## You can also locally host it by folling the below instructions.

Clone the template-snap repository (https://github.com/team53-interiit-11/Simplify/generate) and setup the development environment:

Dependencies:
- Yarn
- Java

```shell
npm i --legacy-peer-deps
```

```shell
yarn install && yarn start
```
=======
# @metamask/template-snap-monorepo

This repository demonstrates how to develop a snap with TypeScript. For detailed instructions, see [the MetaMask documentation](https://docs.metamask.io/guide/snaps.html#serving-a-snap-to-your-local-environment).

MetaMask Snaps is a system that allows anyone to safely expand the capabilities of MetaMask. A _snap_ is a program that we run in an isolated environment that can customize the wallet experience.

## Snaps is pre-release software

To interact with (your) Snaps, you will need to install [MetaMask Flask](https://metamask.io/flask/), a canary distribution for developers that provides access to upcoming features.

## Getting Started

Clone the template-snap repository [using this template](https://github.com/MetaMask/template-snap-monorepo/generate) and setup the development environment:

```shell
yarn install && yarn start
```

## Cloning

This repository contains GitHub Actions that you may find useful, see `.github/workflows` and [Releasing & Publishing](https://github.com/MetaMask/template-snap-monorepo/edit/main/README.md#releasing--publishing) below for more information.

If you clone or create this repository outside the MetaMask GitHub organization, you probably want to run `./scripts/cleanup.sh` to remove some files that will not work properly outside the MetaMask GitHub organization.

Note that the `action-publish-release.yml` workflow contains a step that publishes the frontend of this snap (contained in the `public/` directory) to GitHub pages. If you do not want to publish the frontend to GitHub pages, simply remove the step named "Publish to GitHub Pages" in that workflow.

If you don't wish to use any of the existing GitHub actions in this repository, simply delete the `.github/workflows` directory.

## Contributing

### Testing and Linting

Run `yarn test` to run the tests once.

Run `yarn lint` to run the linter, or run `yarn lint:fix` to run the linter and fix any automatically fixable issues.

### Releasing & Publishing

The project follows the same release process as the other libraries in the MetaMask organization. The GitHub Actions [`action-create-release-pr`](https://github.com/MetaMask/action-create-release-pr) and [`action-publish-release`](https://github.com/MetaMask/action-publish-release) are used to automate the release process; see those repositories for more information about how they work.

1. Choose a release version.

- The release version should be chosen according to SemVer. Analyze the changes to see whether they include any breaking changes, new features, or deprecations, then choose the appropriate SemVer version. See [the SemVer specification](https://semver.org/) for more information.

2. If this release is backporting changes onto a previous release, then ensure there is a major version branch for that version (e.g. `1.x` for a `v1` backport release).

- The major version branch should be set to the most recent release with that major version. For example, when backporting a `v1.0.2` release, you'd want to ensure there was a `1.x` branch that was set to the `v1.0.1` tag.

3. Trigger the [`workflow_dispatch`](https://docs.github.com/en/actions/reference/events-that-trigger-workflows#workflow_dispatch) event [manually](https://docs.github.com/en/actions/managing-workflow-runs/manually-running-a-workflow) for the `Create Release Pull Request` action to create the release PR.

- For a backport release, the base branch should be the major version branch that you ensured existed in step 2. For a normal release, the base branch should be the main branch for that repository (which should be the default value).
- This should trigger the [`action-create-release-pr`](https://github.com/MetaMask/action-create-release-pr) workflow to create the release PR.

4. Update the changelog to move each change entry into the appropriate change category ([See here](https://keepachangelog.com/en/1.0.0/#types) for the full list of change categories, and the correct ordering), and edit them to be more easily understood by users of the package.

- Generally any changes that don't affect consumers of the package (e.g. lockfile changes or development environment changes) are omitted. Exceptions may be made for changes that might be of interest despite not having an effect upon the published package (e.g. major test improvements, security improvements, improved documentation, etc.).
- Try to explain each change in terms that users of the package would understand (e.g. avoid referencing internal variables/concepts).
- Consolidate related changes into one change entry if it makes it easier to explain.
- Run `yarn auto-changelog validate --rc` to check that the changelog is correctly formatted.

5. Review and QA the release.

- If changes are made to the base branch, the release branch will need to be updated with these changes and review/QA will need to restart again. As such, it's probably best to avoid merging other PRs into the base branch while review is underway.

6. Squash & Merge the release.

- This should trigger the [`action-publish-release`](https://github.com/MetaMask/action-publish-release) workflow to tag the final release commit and publish the release on GitHub.

7. Publish the release on npm.

- Be very careful to use a clean local environment to publish the release, and follow exactly the same steps used during CI.
- Use `npm publish --dry-run` to examine the release contents to ensure the correct files are included. Compare to previous releases if necessary (e.g. using `https://unpkg.com/browse/[package name]@[package version]/`).
- Once you are confident the release contents are correct, publish the release using `npm publish`.

## Notes

- Babel is used for transpiling TypeScript to JavaScript, so when building with the CLI,
  `transpilationMode` must be set to `localOnly` (default) or `localAndDeps`.
- For the global `wallet` type to work, you have to add the following to your `tsconfig.json`:
  ```json
  {
    "files": ["./node_modules/@metamask/snap-types/global.d.ts"]
  }
  ```
>>>>>>> web3auth
