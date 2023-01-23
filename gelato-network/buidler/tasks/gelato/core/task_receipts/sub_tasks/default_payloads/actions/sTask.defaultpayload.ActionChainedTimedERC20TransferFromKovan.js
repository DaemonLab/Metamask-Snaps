import { internalTask } from "@nomiclabs/buidler/config";
import { utils } from "ethers";

export default internalTask(
  "gc-submittask:defaultpayload:ActionChainedTimedERC20TransferFromKovan",
  `Returns a hardcoded actionData of ActionChainedTimedERC20TransferFromKovan`
)
  .addFlag("log")
  .setAction(async ({ log }) => {
    try {
      // ActionERC20TransferFrom Params
      const { devluis: user, luis: destination } = await run("bre-config", {
        addressbookcategory: "EOA"
      });
      const { luis: userProxy } = await run("bre-config", {
        addressbookcategory: "userProxy"
      });
      const { KNC: sendToken } = await run("bre-config", {
        addressbookcategory: "erc20"
      });
      const sendAmount = utils.parseUnits("10", 18);

      // ActionChainedERC20TransferFrom additional Params
      const gelatoProvider = await run("handleGelatoProvider");
      const gelatoExecutor = await run("handleGelatoExecutor");
      const actionChainedTimedERC20TransferFrom = await run("bre-config", {
        deployments: true,
        contractname: "ActionChainedTimedERC20TransferFromKovan"
      });
      const dueDate = Math.floor(Date.now() / 1000); // now
      const timeOffset = 60; // 60 seconds

      // Params as sorted array of inputs for abi.encoding
      const inputs = [
        [user, userProxy],
        [sendToken, destination],
        sendAmount,
        [gelatoProvider, gelatoExecutor],
        actionChainedTimedERC20TransferFrom,
        dueDate,
        timeOffset
      ];
      // Encoding
      const actionChainedTimedERC20TransferFromPayload = await run(
        "abi-encode-withselector",
        {
          contractname: "ActionChainedTimedERC20TransferFromKovan",
          functionname: "action",
          inputs,
          log
        }
      );

      return actionChainedTimedERC20TransferFromPayload;
    } catch (err) {
      console.error(err);
      process.exit(1);
    }
  });
