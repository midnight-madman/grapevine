import Papa from 'papaparse';

import {includes, map, split} from "lodash";
import {flatten} from "lodash/array";
import {toLower} from "lodash/string";

export const classNames = (...classes) => {
    return classes.filter(Boolean)
        .join(' ');
};

export const getContributedDAOsFromWalletAddress = (address) => {
    const daoNames = ['OlympusDAO', 'RomeDAO', 'BanklessDAO', 'NounsDAO', 'DeveloperDAO'];
    const filenames = map(daoNames, daoName => `data/${daoName}/${daoName}_contributors.csv`)

    return Promise.all([...filenames].map((file) =>
        new Promise((resolve, reject) =>
            Papa.parse(file, {
                download: true,
                complete: resolve,
                error: reject,
            }),
        )),
    ).then((results) => {
        let contributedDaos = [];

        results.forEach((result, index) => {
            if (includes(flatten(result.data), toLower(address))) {
                const daoName = split(result.data[0], '_')[0]
                contributedDaos = contributedDaos.concat(daoName)
            }
        })
        return contributedDaos // now since .then() excutes after all promises are resolved, filesData contains all the parsed files.
    }).catch((err) => console.log('Something went wrong with parsing contributor files :(', err))
}
export const sleep = ms => new Promise(r => setTimeout(r, ms));



// copied from web3
/**
 * Should be called to get ascii from it's hex representation
 *
 * @method hexToAscii
 * @param {String} hex
 * @returns {String} ascii string representation of hex value
 */
export const hexToAscii = function(hex) {
    if (!isHexStrict(hex))
        throw new Error('The parameter must be a valid HEX string.');

    var str = "";
    var i = 0, l = hex.length;
    if (hex.substring(0, 2) === '0x') {
        i = 2;
    }
    for (; i < l; i+=2) {
        var code = parseInt(hex.substr(i, 2), 16);
        str += String.fromCharCode(code);
    }

    return str;
};

/**
 * Check if string is HEX, requires a 0x in front
 *
 * @method isHexStrict
 * @param {String} hex to be checked
 * @returns {Boolean}
 */
export const isHexStrict = function (hex) {
    return ((typeof hex === 'string' || typeof hex === 'number') && /^(-)?0x[0-9a-f]*$/i.test(hex));
};

/**
 * Should be called to get hex representation (prefixed by 0x) of ascii string
 *
 * @method asciiToHex
 * @param {String} str
 * @returns {String} hex representation of input string
 */
export const asciiToHex = function(str) {
    if(!str)
        return "0x00";
    var hex = "";
    for(var i = 0; i < str.length; i++) {
        var code = str.charCodeAt(i);
        var n = code.toString(16);
        hex += n.length < 2 ? '0' + n : n;
    }

    return "0x" + hex;
};
