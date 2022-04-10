import {useEthers} from "@usedapp/core";

export default function ConnectWalletButton() {
    const {activateBrowserWallet, isLoading, account} = useEthers();

    function handleConnectWallet() {
        activateBrowserWallet();
    }

    return account ? (
        <button
            type="button"
            className="cursor-default w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white sm:col-start-2 sm:text-sm"
        >
            Logged In
        </button>
    ) : (
        <button
            onClick={handleConnectWallet}
            type="button"
            className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-purple-600 text-base font-medium text-white hover:bg-purple-700 focus:outline-none sm:col-start-2 sm:text-sm"
        >
            {isLoading ? 'Loading...' : 'Connect your Wallet'}
        </button>
    );
}
