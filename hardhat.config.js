require("@nomiclabs/hardhat-waffle");

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();
  
  for (const account of accounts) {
    console.log(account.address);
  }

  console.log("I'm alive!");
});

DEFAULT_HARDHAT_ACCOUNT = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";
  module.exports = {
  defaultNetwork: "localhost",
  networks: {
    hardhat: {
      chainId: 1,
      forking: {
        url: `${PRIVATE_NODE_KEY}`, // url to RPC node, ${PRIVATE_NODE_KEY} - must be your API key
        // accounts: [DEFAULT_HARDHAT_ACCOUNT, process.env.MAIN_BOT_PRIVATE_KEY],
        // blockNumber: 13971397-1, // a specific block number which you want to work
      },
    },
    localhost: {
      url: `${PRIVATE_NODE_KEY}`,
    //   accounts: [DEFAULT_HARDHAT_ACCOUNT, process.env.MAIN_BOT_PRIVATE_KEY],
    },
    mainnet: {
        url: `${PRIVATE_NODE_KEY}`, // url to RPC node, ${PRIVATE_NODE_KEY} - must be your API key
    }
  },
  solidity: {
      compilers: [
        {
            version: "0.8.0",
            settings: {
                optimizer: {
                    enabled: true,
                    runs: 1000
                },
            }
        },
        {
            version: "0.8.1",
            settings: {
                optimizer: {
                    enabled: true,
                    runs: 1000
                },
            }
        },
    ]
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  },
  mocha: {
    timeout: 20000
  }
}
