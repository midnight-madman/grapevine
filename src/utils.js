import Papa from 'papaparse';

import {includes, map, split} from "lodash";
import {flatten} from "lodash/array";
import {toLower} from "lodash/string";

export const classNames = (...classes) => {
    return classes.filter(Boolean)
        .join(' ');
};

export const getContributedDAOsFromWalletAddress = (address) => {
    const daoNames = ['OlympusDAO', 'RomeDAO'];
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
