const fs = require('fs');

// Define the TokenType enum
const TokenType = {
  ETH: 'ETH',
  USDC: 'USDC',
  ERC20: 'ERC20'
};

const parseTokenListToConfig = (tokenListFile) => {
  const data = JSON.parse(fs.readFileSync(tokenListFile, 'utf8'));
  console.log(data);
  return data.tokens.map(token => {
    let type;
    switch (token.symbol) {
      case 'ETH':
        type = TokenType.ETH;
        break;
      case 'USDC':
        type = TokenType.USDC;
        break;
      default:
        type = TokenType.ERC20;
    }

    return {
      name: token.name,
      symbol: token.symbol,
      decimals: token.decimals,
      type: type,
      L1: token.extension.rootAddress,
      L2: token.address,
      UNKNOWN: null,
      image: token.logoURI
    };
  });
};
console
console.log(parseTokenListToConfig('json/linea-mainnet-token-shortlist.json'));
