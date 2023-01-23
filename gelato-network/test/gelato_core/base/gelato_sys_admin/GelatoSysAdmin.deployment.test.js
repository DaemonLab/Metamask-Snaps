// running `npx buidler test` automatically makes use of buidler-waffle plugin
// => only dependency we need is "chai"
import { expect } from "chai";

// GelatoSysAdmin creation time variable values
import initialState from "./GelatoSysAdmin.initialState";
const {
  gelatoGasPriceOracle,
  oracleRequestData,
  gelatoMaxGas,
  internalGasRequirement,
  minExecutorStake,
  executorSuccessShare,
  sysAdminSuccessShare,
  totalSuccessShare,
} = initialState;

describe("GelatoCore - GelatoSysAdmin - Deployment", function () {
  // We define the ContractFactory and Signer variables here and assign them in
  // a beforeEach hook.
  let GelatoCore;
  let gelatoCore;
  let owner;

  before(async function () {
    // Get the ContractFactory and Signers here.
    GelatoCore = await ethers.getContractFactory("GelatoCore");
    gelatoCore = await GelatoCore.deploy(gelatoSysAdminInitialState);
    [owner] = await ethers.getSigners();
  });

  // We test different functionality of the contract as normal Mocha tests.
  it("Should initialize only the creation time state variables", async function () {
    expect(await gelatoCore.owner()).to.equal(await owner.getAddress());
    expect(await gelatoCore.gelatoGasPriceOracle()).to.equal(
      gelatoGasPriceOracle
    );
    expect(await gelatoCore.oracleRequestData()).to.equal(oracleRequestData);
    expect(await gelatoCore.gelatoMaxGas()).to.equal(gelatoMaxGas);
    expect(await gelatoCore.internalGasRequirement()).to.equal(
      internalGasRequirement
    );
    expect(await gelatoCore.minExecutorStake()).to.equal(minExecutorStake);
    expect(await gelatoCore.executorSuccessShare()).to.equal(
      executorSuccessShare
    );
    expect(await gelatoCore.sysAdminSuccessShare()).to.equal(
      sysAdminSuccessShare
    );
    expect(await gelatoCore.totalSuccessShare()).to.equal(totalSuccessShare);
  });
});
