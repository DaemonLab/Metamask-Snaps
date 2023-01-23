import { task } from "@nomiclabs/buidler/config";
import { defaultNetwork } from "../../../../../buidler.config";
import { utils } from "ethers";

export default task(
  "gc-executorstake",
  `Return (or --log) GelatoCore.executorFunds([<gelatoexecutor>: defaults to default gelatoexecutor]) on [--network] (default: ${defaultNetwork})`
)
  .addFlag("log", "Logs return values to stdout")
  .addOptionalPositionalParam(
    "gelatoexecutor",
    "The address of the gelatoexecutor, whose balance we query"
  )
  .setAction(async ({ gelatoexecutor, log }) => {
    try {
      gelatoexecutor = await run("handleGelatoExecutor", { gelatoexecutor });
      const gelatoCore = await run("instantiateContract", {
        contractname: "GelatoCore",
        write: true,
      });
      const executorFunds = await gelatoCore.executorStake(gelatoexecutor);
      const executorBalanceETH = utils.formatEther(executorFunds);
      if (log) {
        console.log(
          `\nExecutor:        ${gelatoexecutor}\
           \nExecutorBalance: ${executorBalanceETH} ETH\
           \nNetwork:         ${network.name}\n`
        );
      }
      return executorFunds;
    } catch (error) {
      console.error(error, "\n");
      process.exit(1);
    }
  });
