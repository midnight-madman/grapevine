import {Fragment, useEffect, useState} from "react";
import {Transition} from '@headlessui/react'
import {XIcon} from '@heroicons/react/solid'
import LoginModal from "../src/LoginModal";
import {classNames, hexToAscii} from "../src/utils";
import {useEthers} from "@usedapp/core";
import SubmitRequestModal from "../src/SubmitRequestModal";
import ChainBanner from "../src/ChainBanner";
import {alchemyRpcProvider, GRAPEVINE_TREASURY} from "../src/config";
import {filter, map} from "lodash/collection";
import {assign} from "lodash/object";
import {isEmpty} from "lodash";
import {Framework} from "@superfluid-finance/sdk-core";
import DaosOnGrapevine from "../src/DaosOnGrapevine";
import {truncate} from "lodash/string";
import {take} from "lodash/array";


const SHOW_DAO_TASKS = 'SHOW_DAO_TASKS';
const DEFAULT_STATE = 'DEFAULT_STATE'
const START_LOGIN = 'START_LOGIN'

export const LOGIN_STATE_DEFAULT = 'LOGIN_STATE_DEFAULT';
export const LOGIN_STATE_CHECKING_IF_IS_USER = 'LOGIN_STATE_CHECKING_IF_IS_USER';
export const LOGIN_STATE_IS_USER = 'LOGIN_STATE_IS_USER';
export const LOGIN_STATE_IS_NO_USER = 'LOGIN_STATE_IS_NO_USER';

const TASK_DEFAULT_VALUES = {
    href: '#',
    category: {name: 'Request for support', href: '#'},
    datetime: '2020-03-16',
    imageUrl:
        'https://images.unsplash.com/photo-1496128858413-b36217c2ce36?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1679&q=80',
    readingTime: '6 min',
    // author: {
    //     name: 'OlympusDAO (midnight-madman)',
    //     imageUrl: './olympusdao.png',
    //     // 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    // }
}

export const getUseStateWithLocalStorage = () => {
    let useStateWithLocalStorage;
    if (typeof window !== 'undefined') {
        useStateWithLocalStorage = (localStorageKey, defaultValue = '') => {
            const [value, setValue] = useState(
                localStorage.getItem(localStorageKey) || defaultValue
            );

            useEffect(() => {
                localStorage.setItem(localStorageKey, value);
            }, [value]);

            return [value, setValue];
        };
    } else {
        useStateWithLocalStorage = (localStorageKey, defaultValue = '') => {
            return useState(defaultValue);
        };
    }

    return useStateWithLocalStorage;
};

const Home = () => {
    const [userState, setUserState] = useState(DEFAULT_STATE);
    const [isLoginModalOpen, setLoginModalOpen] = useState(false);
    const [isCreateTaskModalOpen, setCreateTaskModalOpen] = useState(false);
    const [tasks, setTasks] = useState([]);
    const [loginState, setLoginState] = useState(LOGIN_STATE_DEFAULT);
    const {chainId, isLoading, account} = useEthers();
    const [renderErrorNotification, setRenderErrorNotification] = useState(false);

    const getSuperfluidStreams = async () => {
        const provider = alchemyRpcProvider;
        const networkName = 'mumbai';
        const metamaskSuperfluid = await Framework.create({
            networkName,
            provider,

        });

        const res = await metamaskSuperfluid.query.listStreams({receiver: GRAPEVINE_TREASURY});
        console.log(res);
        const streams = map(res.data, (stream, idx) => {
            const streamEvents = map(stream.flowUpdatedEvents, (event) => {
                if (event.userData !== '0x') {
                    const userData = JSON.parse(hexToAscii(event.userData));
                    return assign(userData, TASK_DEFAULT_VALUES)
                }
                return {isActive: event.type !== 2}
            });
            return assign(...filter(streamEvents, 'title'))
        })
        setTasks(filter(streams, stream => !isEmpty(stream)));
    }

    useEffect(() => {
        getSuperfluidStreams();
    }, []);

    const renderDaoTasks = () => {
        if (isEmpty(tasks)) {
            return <div>nothing to see</div>
        }

        return <div>
            {/*<div className="absolute inset-0">*/}
            {/*    <div className="bg-white h-1/3 sm:h-2/3"/>*/}
            {/*</div>*/}
            <div className="relative max-w-5xl mx-auto">
                <div className="text-center">
                    <h2 className="text-3xl tracking-tight font-extrabold text-indigo-200 sm:text-4xl">
                        Available contributor positions</h2>
                    <p className="mt-3  mx-auto text-xl text-gray-100 sm:mt-4">
                        Exclusive positions for Grapevine members.
                        These are based on your contributions to DAOs: OlympusDAO
                    </p>
                </div>
                <div className="mt-12 mx-auto grid gap-5 lg:grid-cols-3 lg:max-w-none">
                    {take(tasks, 3).map((task) => (
                        <div key={task.title} className="flex flex-col rounded-lg shadow-lg overflow-hidden">
                            {/*<div className="flex-shrink-0">*/}
                            {/*    <img className="h-48 w-full object-cover" src={task.imageUrl} alt=""/>*/}
                            {/*</div>*/}
                            <div className="flex-1 bg-white p-6 flex flex-col justify-between">

                                <div className="flex-1">
                                    <p className="text-sm font-medium text-green-600">
                                        <a href={task.category.href} className="hover:underline">
                                            {task.category.name}
                                        </a>
                                    </p>
                                    <a href={task.href} className="block mt-2">
                                        <p className="text-xl font-semibold text-gray-900">{task.title}</p>
                                        <p className="mt-3 text-base text-gray-500">{task.description}</p>
                                    </a>
                                </div>
                                <div className="mt-6 flex items-center">
                                    <div className="flex-shrink-0">
                                        <div>
                                            <span
                                                className="sr-only">{task.author && task.author.name || '0x29d7d1dd5b6f9c864d9db560d72a247c178ae86b'}</span>
                                            <img className="h-10 w-10 rounded-full"
                                                 src={task.author && task.author.imageUrl || "data:image/png;base64,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"}
                                                 alt=""/>
                                        </div>
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-sm font-medium text-gray-900">
                                            <div className="hover:underline">
                                                {truncate(task.author && task.author.name || '0x29d7d1dd5b6f9c864d9db560d72a247c178ae86b', {'length': 16})}
                                            </div>
                                        </p>
                                        <div className="flex space-x-1 text-sm text-gray-500">
                                            <time>{task.date}</time>
                                            {/*    <span aria-hidden="true">&middot;</span>*/}
                                            {/*    <span>{post.readingTime} read</span>*/}
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-4 flex-1">
                                    <p className="text-sm font-medium text-green-600">
                                        <button
                                            type="button"
                                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-full shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                        >
                                            Message via Discord
                                        </button>
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    }

    function onClickHideNotification() {
        setUserState(DEFAULT_STATE)
        setRenderErrorNotification(false)
    }

    function renderNotification() {
        return <>
            {/* Global notification live region, render this permanently at the end of the document */}
            <div
                aria-live="assertive"
                className="fixed inset-0 flex items-end px-4 py-6 pointer-events-none sm:p-6 sm:items-start"
            >
                <div className="w-full flex flex-col items-center space-y-4 sm:items-end">
                    {/* Notification panel, dynamically insert this into the live region when it needs to be displayed */}
                    <Transition
                        show={renderErrorNotification}
                        as={Fragment}
                        enter="transform ease-out duration-300 transition"
                        enterFrom="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
                        enterTo="translate-y-0 opacity-100 sm:translate-x-0"
                        leave="transition ease-in duration-100"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div
                            className="max-w-sm w-full bg-white shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden">
                            <div className="p-4">
                                <div className="flex items-start">
                                    <div className="flex-shrink-0">
                                        <XIcon className="h-6 w-6 text-red-400" aria-hidden="true"/>
                                    </div>
                                    <div className="ml-3 w-0 flex-1 pt-0.5">
                                        <p className="text-sm font-medium text-gray-900">Something went wrong 😰</p>
                                        <p className="mt-1 text-sm text-gray-500">
                                            Some sleep and coffee for Grapevine will fix this soon
                                        </p>
                                        <div className="mt-4 flex">
                                            <button
                                                onClick={() => onClickHideNotification()}
                                                type="button"
                                                className="inline-flex items-center px-3 py-2 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
                                            >
                                                Go back to start
                                            </button>
                                        </div>
                                    </div>
                                    <div className="ml-4 flex-shrink-0 flex">
                                        <button
                                            className="bg-white rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                            onClick={() => {
                                                setRenderErrorNotification(false)
                                            }}
                                        >
                                            <span className="sr-only">Close</span>
                                            <XIcon className="h-5 w-5" aria-hidden="true"/>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Transition>
                </div>
            </div>
        </>;
    }

    function onClickLogin() {
        setUserState(START_LOGIN);
        setLoginModalOpen(true)
    }

    function onClickCreateRequest() {
        if (account && loginState === LOGIN_STATE_IS_USER && chainId === 80001) {
            setCreateTaskModalOpen(true)
        }
    }

    return (
        <>
            {account && chainId !== 80001 && <ChainBanner/>}
            {renderNotification()}
            <LoginModal open={isLoginModalOpen}
                        setOpen={setLoginModalOpen}
                        loginState={loginState}
                        setLoginState={setLoginState}/>
            <SubmitRequestModal open={isCreateTaskModalOpen} setOpen={setCreateTaskModalOpen}
                                setRenderErrorNotification={setRenderErrorNotification}/>
            <div className="min-h-screen bg-gradient-to-tr from-indigo-800 via-purple-700 to-pink-500">
                <main>
                    {userState !== SHOW_DAO_TASKS && (
                        <div className="text-center">
                            <h1 className="title text-gray-100">
                                Welcome to <span className="font-semibold"
                                                 style={{color: '#FFC600'}}>Grapevine</span> 🍇
                            </h1>
                            <p className="mt-3 max-w-md mx-auto text-base text-gray-100 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
                                The <span className="text-semibold">#1 place for Talent Corridors</span>&nbsp;
                                between friendly DAOs where projects can be matched to trusted contributors
                            </p>
                        </div>
                    )}

                    {/*<p className="description">*/}
                    {/*  Get started by editing <code>pages/index.js</code>*/}
                    {/*</p>*/}
                    {userState === SHOW_DAO_TASKS && renderDaoTasks()}
                    <div className="grid select-none">
                        <div
                            onClick={() => onClickLogin()}
                            className="card bg-gray-100 hover:cursor-pointer hover:bg-gray-200 hover:text-gray-600 hover:shadow-xl">
                            <h3>1️⃣ Login & Sign up &rarr;</h3>
                            <p>Join Grapevine to see or submit offers from your DAO partners</p>
                        </div>

                        <div
                            className={classNames(account && loginState === LOGIN_STATE_IS_USER ?
                                    'cursor-pointer bg-gray-100 hover:bg-gray-200 hover:text-gray-600 hover:shadow-xl' : 'cursor-default bg-gray-300',
                                'card'
                            )}
                            // onClick={() => account && loginState === LOGIN_STATE_IS_USER && setUserState(SHOW_DAO_TASKS)}>
                            onClick={() => setUserState(SHOW_DAO_TASKS)}>
                            <h3>2️⃣ See open tasks &rarr;</h3>
                            <p>See exclusive projects for you to contribute at 23 different DAOs</p>
                        </div>

                        <div
                            className={classNames(account && loginState === LOGIN_STATE_IS_USER ?
                                    'cursor-pointer bg-gray-100 hover:bg-gray-200 hover:text-gray-600 hover:shadow-xl' : 'cursor-default bg-gray-300',
                                'card'
                            )}>
                            <h3>3️⃣ Raise your hand for work &rarr;</h3>
                            <p>Ping other DAOs that you are looking for a new project right now.</p>
                        </div>

                        <div
                            onClick={() => onClickCreateRequest()}
                            className={classNames(account && loginState === LOGIN_STATE_IS_USER && chainId === 80001 ?
                                    'cursor-pointer bg-gray-100 hover:bg-gray-200 hover:text-gray-600 hover:shadow-xl' : 'cursor-default bg-gray-300',
                                'card'
                            )}>
                            <h3>4️⃣ Submit new request &rarr;</h3>
                            <p>
                                Looking for more hands on deck right now?
                            </p>
                        </div>
                        {userState === SHOW_DAO_TASKS && (<div
                            onClick={() => setUserState(DEFAULT_STATE)}
                            className="card bg-gray-100 hover:cursor-pointer hover:bg-gray-200 hover:text-gray-600 hover:shadow-xl">
                            <h3 className="text-center">Close</h3>
                        </div>)}
                    </div>
                    <DaosOnGrapevine/>
                </main>

                <footer>
                </footer>

                <style jsx>{`
                  .container {
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                  }

                  main {
                    padding: 5rem 0;
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                  }

                  footer {
                    width: 100%;
                    height: 100px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                  }

                  footer a {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                  }

                  a {
                    color: inherit;
                    text-decoration: none;
                  }


                  .title {
                    margin: 0;
                    line-height: 1.15;
                    font-size: 4rem;
                  }

                  .title,
                  .description {
                    text-align: center;
                  }

                  .description {
                    line-height: 1.5;
                    font-size: 1.5rem;
                  }

                  .grid {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-wrap: wrap;

                    max-width: 800px;
                    margin-top: 3rem;
                  }

                  .card {
                    margin: 1rem;
                    flex-basis: 45%;
                    padding: 1.5rem;
                    border: 1px solid #eaeaea;
                    border-radius: 10px;
                    transition: color 0.15s ease, border-color 0.15s ease;
                  }

                  .card h3 {
                    margin: 0 0 1rem 0;
                    font-size: 1.5rem;
                  }

                  .card p {
                    margin: 0;
                    font-size: 1.25rem;
                    line-height: 1.5;
                  }

                  .logo {
                    height: 1em;
                  }

                  @media (max-width: 600px) {
                    .grid {
                      width: 100%;
                      flex-direction: column;
                    }
                  }
                `}</style>

                <style jsx global>{`
                  html,
                  body {
                    padding: 0;
                    margin: 0;
                  }

                  * {
                    box-sizing: border-box;
                  }
                `}</style>
            </div>
        </>
    )
}

export default Home;
