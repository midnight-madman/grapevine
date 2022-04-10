export const ethers = require("ethers");

// Ethers.js provider initialization
export const mumbaiCustomRpcUrl =
    "https://polygon-mumbai.g.alchemy.com/v2/XL0UkjC8ALyRf8qnP6Tb5u_7XEIrMnbm";
export const alchemyRpcProvider = new ethers.providers.JsonRpcProvider(mumbaiCustomRpcUrl);

export const daos = [
    {id: 1, name: 'RomeDAO'},
    {id: 2, name: 'OlympusDAO'},
    {id: 3, name: 'Yearn'},
    // { id: 4, name: 'Tom Cook' },
    // { id: 5, name: 'Tanya Fox' },
    // { id: 6, name: 'Hellen Schmidt' },
    // { id: 7, name: 'Caroline Schultz' },
    // { id: 8, name: 'Mason Heaney' },
    // { id: 9, name: 'Claudie Smitham' },
    // { id: 10, name: 'Emil Schaefer' },
]
export const FLOW_RATE = '35922000000000'; // ~100 USD per month
export const GRAPEVINE_TREASURY = '0xa24480C19385C4dF1c685DDF1B2A154cc993241A';
