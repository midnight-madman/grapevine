import {CheckIcon} from '@heroicons/react/outline'
import {Fragment, useRef} from "react";
import {Dialog, Transition} from '@headlessui/react'
import ConnectWalletButton from "./ConnectWalletButton";
import {useEthers} from "@usedapp/core";
import {classNames, getContributedDAOsFromWalletAddress, sleep} from "./utils";
import {isEmpty} from "lodash";
import {
    LOGIN_STATE_CHECKING_IF_IS_USER,
    LOGIN_STATE_DEFAULT,
    LOGIN_STATE_IS_NO_USER,
    LOGIN_STATE_IS_USER
} from "../pages";
import {truncate} from "lodash/string";

export default function LoginModal({open, setOpen, loginState, setLoginState}) {
    const cancelButtonRef = useRef(null)
    const {isLoading, account} = useEthers();

    const onClickSignup = async () => {
        if (loginState === LOGIN_STATE_DEFAULT && account) {
            setLoginState(LOGIN_STATE_CHECKING_IF_IS_USER);
            await sleep(1000);

            const contributedDaos = await getContributedDAOsFromWalletAddress(account || "0xa24480C19385C4dF1c685DDF1B2A154cc993241A" || null)

            if (isEmpty(contributedDaos)) {
                setLoginState(LOGIN_STATE_IS_NO_USER)
            } else {
                setLoginState(LOGIN_STATE_IS_USER)
            }
        }
    }

    const renderIcon = () => {
        const isPending = isLoading || (loginState === LOGIN_STATE_CHECKING_IF_IS_USER);
        if (isPending) {
            return (
                <div className="mx-auto flex w-12 h-12 items-center justify-center">
                    <svg
                        className="animate-spin w-6 h-6 mr-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                        />
                    </svg>
                </div>)
        }
        if (account && loginState === LOGIN_STATE_IS_USER) {
            return <div><img className="h-16 w-16" src="./happy_emoji.svg" alt="happy emoji"/></div>
        }
        if (account && loginState === LOGIN_STATE_IS_NO_USER) {
            return <div><img className="h-16 w-16" src="./sad_emoji.svg" alt="sad emoji"/></div>
        }

        if (account) {
            return (<div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                <CheckIcon className="h-6 w-6 text-green-600" aria-hidden="true"/>
            </div>)
        }
    }

    const renderTextDescription = () => {
        switch (loginState) {
            case 'LOGIN_STATE_DEFAULT':
                return account ? 'Great, your wallet is connected. Now click the signup button to finish your onboarding to Grapevine.' : 'As a first step, go ahead and connect your wallet. Use the one which you use to receive DAO contributions in order for us to recognize you :)';
            case 'LOGIN_STATE_CHECKING_IF_IS_USER':
                return `Going through our database of contributors...\nChecking for your wallet ${truncate(account, {'length': 8})}`;
            case 'LOGIN_STATE_IS_USER':
                return 'You are in! :) Welcome to Grapevine. You can now see open tasks from your DAOs and their partners';
            case 'LOGIN_STATE_IS_NO_USER':
                return 'Sorry, we could  not find your connected wallet address in our database of contributors =/ If you think this is wrong, you can try a different wallet or talk to us';
        }
    }
    const renderTitle = () => {
        return 'Login & Sign up'
    }

    return (
        <Transition.Root show={open} as={Fragment}>
            <Dialog as="div" className="fixed z-10 inset-0 overflow-y-auto" initialFocus={cancelButtonRef}
                    onClose={setOpen}>
                <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <Dialog.Overlay className="fixed inset-0 bg-gray-700 bg-opacity-75 transition-opacity"/>
                    </Transition.Child>

                    {/* This element is to trick the browser into centering the modal contents. */}
                    <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
            &#8203;
          </span>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        enterTo="opacity-100 translate-y-0 sm:scale-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                        leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                    >
                        <div
                            className="relative inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
                            <div>
                                <div className="mx-auto flex items-center justify-center">
                                    {renderIcon()}
                                </div>
                                <div className="mt-3 text-center sm:mt-5">
                                    <Dialog.Title as="h3" className="text-lg leading-6 font-medium text-gray-900">
                                        {renderTitle()}
                                    </Dialog.Title>
                                    <div className="mt-2">
                                        <p className="text-sm text-gray-500">
                                            {renderTextDescription()}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                                <ConnectWalletButton/>
                                <button
                                    type="button"
                                    onClick={onClickSignup}
                                    className={classNames(!account && 'bg-gray-300 text-gray-700',
                                        account && loginState === LOGIN_STATE_DEFAULT && 'bg-purple-600 text-gray-100 hover:bg-purple-500',
                                        account && loginState === LOGIN_STATE_IS_USER && 'bg-green-600 text-gray-100',
                                        account && loginState === LOGIN_STATE_IS_NO_USER && 'bg-red-600 text-gray-800',
                                        loginState === LOGIN_STATE_DEFAULT ? 'cursor-pointer' : 'cursor-default',
                                        'mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium  focus:outline-none sm:mt-0 sm:col-start-1 sm:text-sm'
                                    )}
                                >
                                    {loginState === LOGIN_STATE_DEFAULT && 'Sign up to Grapevine'}
                                    {loginState === LOGIN_STATE_CHECKING_IF_IS_USER && 'Checking'}
                                    {loginState === LOGIN_STATE_IS_USER && 'Success!'}
                                    {loginState === LOGIN_STATE_IS_NO_USER && 'You\'re not a contributor'}
                                </button>
                                {/*<button*/}
                                {/*    type="button"*/}
                                {/*    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:col-start-1 sm:text-sm"*/}
                                {/*    onClick={() => setOpen(false)}*/}
                                {/*    ref={cancelButtonRef}*/}
                                {/*>*/}
                                {/*    Close*/}
                                {/*</button>*/}
                            </div>
                        </div>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition.Root>
    )
}
