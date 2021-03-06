import 'tailwindcss/tailwind.css';
import React from 'react';
import Head from "next/head";
import {DAppProvider} from "@usedapp/core";

function App({Component, pageProps}) {
    const config = {}

    return (
        <>
            <Head>
                <title>Grapevine</title>
                <link rel="icon" href="/favicon.svg"/>
            </Head>
            <DAppProvider config={config}>
                <div className="layout">
                    <Component {...pageProps} />
                </div>
            </DAppProvider>
        </>
    );
}

export default App;
