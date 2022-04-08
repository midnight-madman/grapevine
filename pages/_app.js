import 'tailwindcss/tailwind.css';
import React from 'react';


function App({Component, pageProps}) {
    return (
        <>
            <div className="layout">
                <Component {...pageProps} />
            </div>
        </>
    );
}

export default App;
