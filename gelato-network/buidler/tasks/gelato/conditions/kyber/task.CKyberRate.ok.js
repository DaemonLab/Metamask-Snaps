import { task } from "@nomiclabs/buidler/config";
import { defaultNetwork } from "../../../../../buidler.config";
import { utils } from "ethers";

export default task(
  "g-ckyberrate-ok",
  `Calls <trigername>.ok(<conditionData>) on [--network] (default: ${defaultNetwork})`
)
  .addFlag("log", "Logs return values to stdout")
  .setAction(async ({ log }) => {
    try {
      // Handle condition payloadsWithSelector
      // Params
      const { DAI: src, KNC: dest } = await run("bre-config", {
        addressbookcategory: "erc20"
      });
      const srcamt = utils.parseUnits("10", 18);
      const [expectedRate] = await run("gc-kyber-getexpectedrate", {
        src,
        dest,
        srcamt
      });
      const refRate = utils
        .bigNumberify(expectedRate)
        .add(utils.parseUnits("1", 17));
      const greaterElseSmaller = false;

      // ConditionRead Instance
      const conditionContract = await run("instantiateContract", {
        contractname: "ConditionKyberRate",
        read: true
      });
      // submitTask TX (payable)
      const ok = await conditionContract.ok(
        src,
        srcamt,
        dest,
        refRate,
        greaterElseSmaller
      );

      if (log)
        console.log(
          `\nCondition: ConditionKyberRate\
           \nReached?: ${ok}\n`
        );
      return ok;
    } catch (error) {
      console.error(error, "\n");
      process.exit(1);
    }
  });
