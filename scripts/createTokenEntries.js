const { ethers } = require('ethers');

const ETHEREUM_CHAINID = 1
const LINEA_CHAINID = 59144
const L2_BRIDGE_ADDRESS = "0x353012dc4a9A6cF55c941bADC267f82004A8ceB9";

const l1Provider = new ethers.getDefaultProvider(ETHEREUM_CHAINID);
const l2Provider = new ethers.getDefaultProvider(LINEA_CHAINID);

const fetchTokenDetails = async (address) => {
  const ERC20_ABI = [
    "function name() view returns (string)",
    "function symbol() view returns (string)",
    "function decimals() view returns (uint8)",
  ];
  
  const L2_BRIDGE_ABI = [
    "function nativeToBridgedToken(uint256, address) view returns (address)"
  ];
  
  const tokenContract = new ethers.Contract(address, ERC20_ABI, l1Provider);
  const bridgeContract = new ethers.Contract(L2_BRIDGE_ADDRESS, L2_BRIDGE_ABI, l2Provider);

  const name = await tokenContract.name();
  const symbol = await tokenContract.symbol();
  const decimals = await tokenContract.decimals();
  const l2Address = await bridgeContract.nativeToBridgedToken(ETHEREUM_CHAINID, address);
  
  return {
    chainId: 59144,
    chainURI: "https://lineascan.build/block/0",
    tokenId: `https://lineascan.build/address/${l2Address}`,
    tokenType: ["bridged"],
    address: l2Address,
    name: name,
    symbol: symbol,
    decimals: decimals,
    createdAt: new Date().toISOString().split('T')[0],
    updatedAt: new Date().toISOString().split('T')[0],
    // Note: You might need to fetch the logoURI from another source.
    logoURI: "THIS NEED TO BE ADDED MANUALLY",
    extension: {
      rootChainId: 1,
      rootChainURI: "https://etherscan.io/block/0",
      rootAddress: address
    }
  };
}

const fetchTokenDetailsForAddresses = async (addresses) => {
  const tokens = [];
  for (let address of addresses) {
    const token = await fetchTokenDetails(address);
    tokens.push(token);
  }
  return tokens;
}

(async () => {
  const ethereumTokenAddresses = [
    // Enter L1 token address here
  ];
  
  console.log(await fetchTokenDetailsForAddresses(ethereumTokenAddresses));
})();
