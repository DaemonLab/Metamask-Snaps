// running `npx buidler test` automatically makes use of buidler-waffle plugin
// => only dependency we need is "chai"
const { expect } = require("chai");
import { run } from "@nomiclabs/buidler";

// GelatoSysAdmin creation time variable values
import initialState from "./GelatoSysAdmin.initialState";

describe("GelatoCore - GelatoSysAdmin - Setters: GAS/GAS-PRICE", function () {
  // We define the ContractFactory and Signer variables here and assign them in
  // a beforeEach hook.
  let GelatoCore;
  let gelatoCore;
  let owner;
  let notOwner;
  let oracle;
  let oracleAddress;

  beforeEach(async function () {
    // Get the ContractFactory, contract instance, and Signers here.
    GelatoCore = await ethers.getContractFactory("GelatoCore");
    gelatoCore = await GelatoCore.deploy(gelatoSysAdminInitialState);
    await gelatoCore.deployed();
    [owner, notOwner, oracle] = await ethers.getSigners();
    oracleAddress = await oracle.getAddress();
  });

  // We test different functionality of the contract as normal Mocha tests.

  // setGelatoGasPriceOracle
  describe("GelatoCore.GelatoSysAdmin.setGelatoGasPriceOracle", function () {
    it("Should let the owner setGelatoGasPriceOracle", async function () {
      // Every transaction and call is sent with the owner by default
      await expect(gelatoCore.setGelatoGasPriceOracle(oracleAddress))
        .to.emit(gelatoCore, "LogGelatoGasPriceOracleSet")
        .withArgs(initialState.gelatoGasPriceOracle, oracleAddress);

      expect(await gelatoCore.gelatoGasPriceOracle()).to.be.equal(
        oracleAddress
      );
    });

    it("Should NOT let owners setGelatoGasPriceOracle address-Zero", async function () {
      await expect(
        gelatoCore.setGelatoGasPriceOracle(constants.AddressZero)
      ).to.be.revertedWith("GelatoSysAdmin.setGelatoGasPriceOracle: 0");
    });

    it("Should NOT let non-Owners setGelatoGasPriceOracle", async function () {
      await expect(
        gelatoCore.connect(notOwner).setGelatoGasPriceOracle(oracleAddress)
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });
  });

  // setOracleRequestData
  describe("GelatoCore.GelatoSysAdmin.setOracleRequestData", function () {
    it("Should let the owner setOracleRequestData", async function () {
      const newOracleRequestData = await run("abi-encode-withselector", {
        contractname: "GelatoGasPriceOracle",
        functionname: "latestAnswer",
      });
      await expect(gelatoCore.setOracleRequestData(newOracleRequestData))
        .to.emit(gelatoCore, "LogOracleRequestDataSet")
        .withArgs(initialState.oracleRequestData, newOracleRequestData);

      expect(await gelatoCore.oracleRequestData()).to.be.equal(
        newOracleRequestData
      );
    });

    it("Should NOT let non-Owners setOracleRequestData", async function () {
      const newOracleRequestData = await run("abi-encode-withselector", {
        contractname: "GelatoGasPriceOracle",
        functionname: "latestAnswer",
      });
      await expect(
        gelatoCore.connect(notOwner).setOracleRequestData(newOracleRequestData)
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });
  });

  // setGelatoMaxGas
  describe("GelatoCore.GelatoSysAdmin.setGelatoMaxGas", function () {
    it("Should let the owner setGelatoMaxGas", async function () {
      await expect(gelatoCore.setGelatoMaxGas(100))
        .to.emit(gelatoCore, "LogGelatoMaxGasSet")
        .withArgs(initialState.gelatoMaxGas, 100);

      expect(await gelatoCore.gelatoMaxGas()).to.be.equal(100);
    });

    it("Should NOT let non-Owners setGelatoMaxGas", async function () {
      await expect(
        gelatoCore.connect(notOwner).setGelatoMaxGas(100)
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });
  });

  // setInternalGasRequirement
  describe("GelatoCore.GelatoSysAdmin.setInternalGasRequirement", function () {
    it("Should let the owner setInternalGasRequirement", async function () {
      await expect(gelatoCore.setInternalGasRequirement(100))
        .to.emit(gelatoCore, "LogInternalGasRequirementSet")
        .withArgs(initialState.internalGasRequirement, 100);

      expect(await gelatoCore.internalGasRequirement()).to.be.equal(100);
    });

    it("Should NOT let non-Owners setInternalGasRequirement", async function () {
      await expect(
        gelatoCore.connect(notOwner).setInternalGasRequirement(100)
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });
  });
});
