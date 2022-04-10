import {Fragment, useRef, useState} from "react";
import {Dialog, Listbox, Transition} from '@headlessui/react'
import {useEthers} from "@usedapp/core";
import {asciiToHex, classNames} from "./utils";
import {CheckIcon, SelectorIcon} from '@heroicons/react/solid'
import {truncate} from "lodash/string";
import {ethers} from "ethers";
import {Framework} from "@superfluid-finance/sdk-core";
import {alchemyRpcProvider, daos, FLOW_RATE, GRAPEVINE_TREASURY} from "./config";
import {useForm} from 'react-hook-form';

export default function SubmitRequestModal({open, setOpen, setRenderErrorNotification}) {
    const cancelButtonRef = useRef(null)
    const {isLoading, account} = useEthers();
    const [selectedDaoForTask, setSelectedDaoForTask] = useState(daos[0])
    const {
        register,
        handleSubmit,
    } = useForm();


    async function createMoneyStream(recipient, flowRate, userData) {
        console.log('creating money stream with target address:', truncate(GRAPEVINE_TREASURY, 8), 'and flowrate', FLOW_RATE)
        console.log('user account is', truncate(account, 8))
        const provider = alchemyRpcProvider;
        const walletProvider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = walletProvider.getSigner();

        const networkName = 'mumbai';
        const metamaskSuperfluid = await Framework.create({
            networkName,
            provider: walletProvider,

        });
        // const signer = metamaskSuperfluid.createSigner({web3Provider: walletProvider});
        const MATICxToken = "0x96B82B65ACF7072eFEb00502F45757F254c2a0D4"; //testnet
        const fUSDCxToken = "0x42bb40bF79730451B11f6De1CbA222F17b87Afd7"; //testnet
        // const MATICxToken = "0x3aD736904E9e65189c3000c7DD2c8AC8bB7cD4e3"; //mainnet

        try {
            const createFlowOperation = metamaskSuperfluid.cfaV1.createFlow({
                sender: account,
                receiver: recipient,
                flowRate: flowRate,
                superToken: fUSDCxToken,
                gasLimit: 3000000,
                // userData: userData,
            });

            console.log("Creating your stream...");
            const txnResponse = await createFlowOperation.exec(signer);
            const txnReceipt = await txnResponse.wait();

            console.log(txnResponse);
            console.log(txnReceipt);

            console.log(
                `Congrats - you've just created a money stream!
                View Your Stream At: https://app.superfluid.finance/dashboard/${recipient}
                Network: ${networkName},
                Super Token: USDCx
                Sender: ${account}
                Receiver: ${recipient},
                FlowRate: ${flowRate}
                `);
        } catch (error) {
            console.error(error.errorObject);
            setRenderErrorNotification(true)
        }
    }

    const onClickSubmit = async (formData) => {
        let userData = formData;
        userData['dao'] = selectedDaoForTask;
        userData =  asciiToHex(JSON.stringify(formData));

        await createMoneyStream(GRAPEVINE_TREASURY, FLOW_RATE, userData)
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

                            <form onSubmit={handleSubmit(onClickSubmit)} method="POST"
                                  className="space-y-8 divide-y divide-gray-200">
                                <div className="space-y-8 divide-y divide-gray-200">
                                    <div>
                                        <div>
                                            <h3 className="text-lg leading-6 font-medium text-gray-900">
                                                Create task for your DAO on Grapevine 🍇
                                            </h3>
                                            <p className="mt-1 text-sm text-gray-500">
                                                This information will be shared to all contributors
                                                at {selectedDaoForTask.name} and their partner DAOs.
                                                Submit this form to create the request and create a stream of 100 USDC
                                                per month (via Superfluid).

                                            </p>
                                        </div>

                                        <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">

                                            <div className="sm:col-span-6">
                                                <label htmlFor="title"
                                                       className="block text-sm font-medium text-gray-700">
                                                    Request Title
                                                </label>
                                                <div className="mt-1">
                                                    <input
                                                        {...register('title')}
                                                        name="title"
                                                        id="title"
                                                        required
                                                        className="px-3 py-2.5 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border border-gray-300 rounded-md"
                                                        placeholder="[Urgent] Smart Contract Audit"
                                                    />
                                                </div>
                                            </div>
                                            <div className="sm:col-span-6">
                                                <label htmlFor="description"
                                                       className="block text-sm font-medium text-gray-700">
                                                    Task Description
                                                </label>
                                                <div className="mt-1">
                                                <textarea
                                                    {...register('description')}
                                                    id="description"
                                                    name="description"
                                                    rows={3}
                                                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border border-gray-300 rounded-md"
                                                    defaultValue={''}
                                                />
                                                </div>
                                                <p className="mt-2 text-sm text-gray-500">
                                                    Describe the task as detailed as possible. Mention who to reach out
                                                    to and how urgent it is.
                                                </p>
                                            </div>
                                            <div className="sm:col-span-4">
                                                <label htmlFor="username"
                                                       className="block text-sm font-medium text-gray-700">
                                                    Your wallet address
                                                </label>
                                                <div className="mt-1 flex ">
                                                <span
                                                    className="inline-flex rounded-md shadow-sm py-2 items-center px-3 rounded border border border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
                                                  {isLoading ? '...' : truncate(account, 8)}
                                                </span>
                                                    {/*<input*/}
                                                    {/*    type="text"*/}
                                                    {/*    name="username"*/}
                                                    {/*    id="username"*/}
                                                    {/*    autoComplete="username"*/}
                                                    {/*    className="flex-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full min-w-0 rounded-none rounded-r-md sm:text-sm border-gray-300"*/}
                                                    {/*/>*/}
                                                </div>
                                            </div>
                                            <div className="sm:col-span-4">
                                                <Listbox value={selectedDaoForTask} onChange={setSelectedDaoForTask}>
                                                    {({open}) => (
                                                        <>
                                                            <Listbox.Label
                                                                className="block text-sm font-medium text-gray-700">
                                                                From which DAO does the request come
                                                                from?</Listbox.Label>
                                                            <div className="mt-1 relative">
                                                                <Listbox.Button
                                                                    className="bg-white relative w-full border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default sm:text-sm">
                                                                    <span
                                                                        className="block truncate">{selectedDaoForTask.name}</span>
                                                                    <span
                                                                        className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <SelectorIcon className="h-5 w-5 text-gray-400" aria-hidden="true"/>
              </span>
                                                                </Listbox.Button>

                                                                <Transition
                                                                    show={open}
                                                                    as={Fragment}
                                                                    leave="transition ease-in duration-100"
                                                                    leaveFrom="opacity-100"
                                                                    leaveTo="opacity-0"
                                                                >
                                                                    <Listbox.Options
                                                                        className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                                                                        {daos.map((person) => (
                                                                            <Listbox.Option
                                                                                key={person.id}
                                                                                className={({active}) =>
                                                                                    classNames(
                                                                                        active ? 'text-white bg-indigo-600' : 'text-gray-900',
                                                                                        'cursor-default select-none relative py-2 pl-3 pr-9'
                                                                                    )
                                                                                }
                                                                                value={person}
                                                                            >
                                                                                {({selected, active}) => (
                                                                                    <>
                        <span className={classNames(selected ? 'font-semibold' : 'font-normal', 'block truncate')}>
                          {person.name}
                        </span>

                                                                                        {selected ? (
                                                                                            <span
                                                                                                className={classNames(
                                                                                                    active ? 'text-white' : 'text-indigo-600',
                                                                                                    'absolute inset-y-0 right-0 flex items-center pr-4'
                                                                                                )}
                                                                                            >
                                                                                        <CheckIcon className="h-5 w-5"
                                                                                                   aria-hidden="true"/>
                                                                                      </span>
                                                                                        ) : null}
                                                                                    </>
                                                                                )}
                                                                            </Listbox.Option>
                                                                        ))}
                                                                    </Listbox.Options>
                                                                </Transition>
                                                            </div>
                                                        </>
                                                    )}
                                                </Listbox>
                                            </div>
                                            {/*<div className="sm:col-span-6">*/}
                                            {/*    <label htmlFor="cover-photo"*/}
                                            {/*           className="block text-sm font-medium text-gray-700">*/}
                                            {/*        Cover photo*/}
                                            {/*    </label>*/}
                                            {/*    <div*/}
                                            {/*        className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">*/}
                                            {/*        <div className="space-y-1 text-center">*/}
                                            {/*            <svg*/}
                                            {/*                className="mx-auto h-12 w-12 text-gray-400"*/}
                                            {/*                stroke="currentColor"*/}
                                            {/*                fill="none"*/}
                                            {/*                viewBox="0 0 48 48"*/}
                                            {/*                aria-hidden="true"*/}
                                            {/*            >*/}
                                            {/*                <path*/}
                                            {/*                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"*/}
                                            {/*                    strokeWidth={2}*/}
                                            {/*                    strokeLinecap="round"*/}
                                            {/*                    strokeLinejoin="round"*/}
                                            {/*                />*/}
                                            {/*            </svg>*/}
                                            {/*            <div className="flex text-sm text-gray-600">*/}
                                            {/*                <label*/}
                                            {/*                    htmlFor="file-upload"*/}
                                            {/*                    className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"*/}
                                            {/*                >*/}
                                            {/*                    <span>Upload a file</span>*/}
                                            {/*                    <input id="file-upload" name="file-upload" type="file"*/}
                                            {/*                           className="sr-only"/>*/}
                                            {/*                </label>*/}
                                            {/*                <p className="pl-1">or drag and drop</p>*/}
                                            {/*            </div>*/}
                                            {/*            <p className="text-xs text-gray-500">PNG, JPG, GIF up to*/}
                                            {/*                10MB</p>*/}
                                            {/*        </div>*/}
                                            {/*    </div>*/}
                                            {/*</div>*/}
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-5">
                                    <div className="flex justify-end">
                                        <button
                                            onClick={() => setOpen(false)}
                                            type="button"
                                            className="bg-white py-2 px-8 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
                                        >
                                            Close
                                        </button>
                                        <button
                                            // onClick={handleSubmit(onClickSubmit)}
                                            type="submit"
                                            className="ml-3 inline-flex justify-center py-2 px-8 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                                        >
                                            Create task
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition.Root>
    )
}
