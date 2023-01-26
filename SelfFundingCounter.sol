//SPDX-License-Identifier: MIT
pragma solidity 0.8.6;

import {AutomationRegistryBaseInterface} from '@chainlink/contracts/src/v0.8/interfaces/AutomationRegistryInterface1_2.sol';
import{KeeperRegistryInterface, State, Config} from '@chainlink/contracts/src/v0.8/interfaces/KeeperRegistryInterface1_2.sol';
import {LinkTokenInterface} from '@chainlink/contracts/src/v0.8/interfaces/LinkTokenInterface.sol';

import '@openzeppelin/contracts/utils/Counters.sol';


interface KeeperRegistrarInterface{
    function register(
        string memory name,
        bytes calldata encryptedEmail,
        address upkeepContract,
        uint32 gasLimit,
        address adminAddress,
        bytes calldata checkData,
        uint96 amount,
        uint8 source,
        address sender
    )external;
}

contract SelfAutomatingCounters {

    using Counters for Counters.Counter;

    Counters.Counter private _counterIdCounter;

    mapping(uint256=> uint256) public counterToValue;

    mapping(uint256 => uint256) public counterToLastTimeStamp;

    mapping(uint256 => uint256) public counterToUpkeepID;

    uint256 interval = 60;

    LinkTokenInterface public immutable i_link;
    address public immutable registrar;
    AutomationRegistryBaseInterface public immutable i_registry;
    bytes4 registerSig = KeeperRegistrarInterface.register.selector;

    constructor(
        LinkTokenInterface _link,
        address _registrar,
        AutomationRegistryBaseInterface _registry
    ) {
        // Example 0xFf7eA549a8D5973a1C7BCcb9a22F44B51bc22025 Goerli
        i_link = _link;

        // Example 0x9806cf6fBc89aBF286e8140C42174B94836e36F2 Goerli
        registrar = _registrar;
        // 0x02777053d6764996e594c3E88AF1D58D5363a2e6 Goerli
        i_registry = _registry;
    }
    

    function createNewCounter() public returns (uint256){

        uint256 counterID = _counterIdCounter.current();

        _counterIdCounter.increment();

        counterToValue[counterID] = 0;

        counterToLastTimeStamp[counterID] =block.timestamp;

        return counterID;
    }

    function registerAndPredictID(
        string memory name,
        uint32 gasLimit,
        uint96 amount
    ) public {

        uint256 counterID = createNewCounter();
        (State memory state, Config memory _c, address[] memory _k) = i_registry.getState();
        uint256 oldNonce =state.nonce;

        bytes memory checkData = abi.encodePacked(counterID);

        bytes memory payload = abi.encode(
            name,
            '0x0000000000000000000000000000000000000000', //Edit this to the address 
            address(this),
            gasLimit, // 999999
            address(msg.sender),
            checkData, 
            amount, //5000000000000000000
            0,
            address(this)
        );
    

        i_link.transferAndCall(registrar, amount, bytes.concat(registerSig, payload));
        (state, _c, _k) = i_registry.getState();
        uint256 newNonce = state.nonce;
        if ( newNonce == oldNonce +1 ){
            uint256 upkeepID = uint256(
                keccak256(
                    abi.encodePacked(
                        blockhash(block.number - 1),
                        address(i_registry),
                        uint32(oldNonce)
                    )
                )
            );

            counterToUpkeepID[counterID] = upkeepID;
        } else {
            revert('auto-approve disabled');
        }
    }

    function checkUpKeep(bytes calldata checkData)
    external
    view
    returns ( bool upkeepNeeded, bytes memory performData)
    {
        uint256 counterID =  abi.decode(checkData, (uint256));

        upkeepNeeded = (block.timestamp - counterToLastTimeStamp[counterID])> interval;
    
        performData = checkData;
    }

    function performUpKeep(bytes calldata performData) external {

        uint256 counterID =abi.decode(performData,(uint256));

        if ((block.timestamp - counterToLastTimeStamp[counterID])>interval){

            counterToLastTimeStamp[counterID] = block.timestamp;

            counterToValue[counterID] = counterToValue[counterID] +1;
        }
    }
}