import Head from 'next/head'
import {Fragment, useState} from "react";
import {Transition} from '@headlessui/react'
import {CheckCircleIcon} from '@heroicons/react/outline'
import {XIcon} from '@heroicons/react/solid'

const SHOW_DAO_TASKS = 'SHOW_DAO_TASKS';
const DEFAULT_STATE = 'DEFAULT_STATE'

const Home = () => {
    const [userState, setUserState] = useState(DEFAULT_STATE);
    const [show, setShow] = useState(true)

    const renderDaoTasks = () => {
        const posts = [
            {
                title: 'Smart Contract Support',
                href: '#',
                category: {name: 'Request for support', href: '#'},
                description:
                    'Lorem ipsum dolor sit amet consectetur adipisicing elit.',
                date: 'Mar 16, 2020',
                datetime: '2020-03-16',
                imageUrl:
                    'https://images.unsplash.com/photo-1496128858413-b36217c2ce36?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1679&q=80',
                readingTime: '6 min',
                author: {
                    name: 'OlympusDAO (midnight-madman)',
                    href: '#',
                    imageUrl: './olympusdao.png',
                    // 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
                },
            },
            {
                title: 'Frontend Magic with three.js',
                href: '#',
                category: {name: 'Request for support', href: '#'},
                description:
                    'Lorem ipsum dolor sit amet consectetur adipisicing elit. ',
                date: 'Mar 10, 2020',
                datetime: '2020-03-10',
                imageUrl:
                    'https://images.unsplash.com/photo-1547586696-ea22b4d4235d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1679&q=80',
                readingTime: '4 min',
                author: {
                    name: 'Brenna Goyette',
                    href: '#',
                    imageUrl:
                        'https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
                },
            },
            {
                title: 'Improve our contributor onboarding',
                href: '#',
                category: {name: 'Request for support', href: '#'},
                description:
                    'Lorem ipsum dolor sit amet consectetur adipisicing elit. ',
                date: 'Feb 12, 2020',
                datetime: '2020-02-12',
                imageUrl:
                    'https://images.unsplash.com/photo-1492724441997-5dc865305da7?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1679&q=80',
                readingTime: '11 min',
                author: {
                    name: 'DanMetz.eth',
                    href: '#',
                    imageUrl:
                        'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
                },
            },
        ]

        return <div>
            {/*<div className="absolute inset-0">*/}
            {/*    <div className="bg-white h-1/3 sm:h-2/3"/>*/}
            {/*</div>*/}
            <div className="relative max-w-7xl mx-auto">
                <div className="text-center">
                    <h2 className="text-3xl tracking-tight font-extrabold text-indigo-200 sm:text-4xl">Available
                        contributor positions</h2>
                    <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-100 sm:mt-4">
                        Exclusive positions for Grapevine members.
                        These are based on your contributions to DAOs: OlympusDAO
                    </p>
                </div>
                <div className="mt-12 max-w-lg mx-auto grid gap-5 lg:grid-cols-3 lg:max-w-none">
                    {posts.map((post) => (
                        <div key={post.title} className="flex flex-col rounded-lg shadow-lg overflow-hidden">
                            <div className="flex-shrink-0">
                                <img className="h-48 w-full object-cover" src={post.imageUrl} alt=""/>
                            </div>
                            <div className="flex-1 bg-white p-6 flex flex-col justify-between">
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-green-600">
                                        <a href={post.category.href} className="hover:underline">
                                            {post.category.name}
                                        </a>
                                    </p>
                                    <a href={post.href} className="block mt-2">
                                        <p className="text-xl font-semibold text-gray-900">{post.title}</p>
                                        <p className="mt-3 text-base text-gray-500">{post.description}</p>
                                    </a>
                                </div>
                                <div className="mt-6 flex items-center">
                                    <div className="flex-shrink-0">
                                        <a href={post.author.href}>
                                            <span className="sr-only">{post.author.name}</span>
                                            <img className="h-10 w-10 rounded-full" src={post.author.imageUrl} alt=""/>
                                        </a>
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-sm font-medium text-gray-900">
                                            <a href={post.author.href} className="hover:underline">
                                                {post.author.name}
                                            </a>
                                        </p>
                                        {/*<div className="flex space-x-1 text-sm text-gray-500">*/}
                                        {/*    <time dateTime={post.datetime}>{post.date}</time>*/}
                                        {/*    <span aria-hidden="true">&middot;</span>*/}
                                        {/*    <span>{post.readingTime} read</span>*/}
                                        {/*</div>*/}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    }

    function renderNotification() {
        const show = userState !== DEFAULT_STATE
        return <>
            {/* Global notification live region, render this permanently at the end of the document */}
            <div
                aria-live="assertive"
                className="fixed inset-0 flex items-end px-4 py-6 pointer-events-none sm:p-6 sm:items-start"
            >
                <div className="w-full flex flex-col items-center space-y-4 sm:items-end">
                    {/* Notification panel, dynamically insert this into the live region when it needs to be displayed */}
                    <Transition
                        show={show}
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
                                        <CheckCircleIcon className="h-6 w-6 text-green-400" aria-hidden="true"/>
                                    </div>
                                    <div className="ml-3 w-0 flex-1 pt-0.5">
                                        <p className="text-sm font-medium text-gray-900">Successfully saved!</p>
                                        <p className="mt-1 text-sm text-gray-500">Anyone with a link can now view this file.</p>
                                        <div className="mt-4 flex">
                                            <button
                                                onClick={() => setUserState(DEFAULT_STATE)}
                                                type="button"
                                                className="inline-flex items-center px-3 py-2 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                            >
                                                Go back to start
                                            </button>
                                        </div>
                                    </div>
                                    <div className="ml-4 flex-shrink-0 flex">
                                        <button
                                            className="bg-white rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                            onClick={() => {
                                                setUserState(DEFAULT_STATE)
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

    return (
        <div className="min-h-screen bg-gradient-to-tr from-indigo-800 via-purple-700 to-pink-500">
            <Head>
                <title>Grapevine</title>
                <link rel="icon" href="/favicon.ico"/>
            </Head>

            <main>
                {userState === DEFAULT_STATE && (
                    <h1 className="title">
                        Welcome to <span className="font-semibold text-gray-100">Grapevine</span> 🍇
                    </h1>
                )}

                {/*<p className="description">*/}
                {/*  Get started by editing <code>pages/index.js</code>*/}
                {/*</p>*/}
                {userState === SHOW_DAO_TASKS && renderDaoTasks()}
                <div className="grid">
                    <div
                        className="card bg-gray-100 hover:cursor-pointer hover:bg-gray-200 hover:text-gray-600 hover:shadow-xl">
                        <h3>1️⃣ Sign up &rarr;</h3>
                        <p>Join Grapevine to see or submit offers from your DAO partners</p>
                    </div>

                    <div
                        className="card bg-gray-100 hover:cursor-pointer hover:bg-gray-200 hover:text-gray-600 hover:shadow-xl"
                        onClick={() => setUserState(SHOW_DAO_TASKS)}>
                        <h3>2️⃣ See open tasks &rarr;</h3>
                        <p>Learn about Next.js in an interactive course with quizzes!</p>
                    </div>

                    <div
                        className="card bg-gray-100 hover:cursor-pointer hover:bg-gray-200 hover:text-gray-600 hover:shadow-xl">
                        <h3>3️⃣ Raise your hand for work &rarr;</h3>
                        <p>Discover and deploy boilerplate example Next.js projects.</p>
                    </div>

                    <div
                        className="card bg-gray-100 hover:cursor-pointer hover:bg-gray-200 hover:text-gray-600 hover:shadow-xl">
                        <h3>4️⃣ Submit new request &rarr;</h3>
                        <p>
                            Instantly deploy your Next.js site to a public URL with Vercel.
                        </p>
                    </div>
                    {userState !== DEFAULT_STATE && (<div
                        onClick={() => setUserState(DEFAULT_STATE)}
                        className="card bg-gray-100 hover:cursor-pointer hover:bg-gray-200 hover:text-gray-600 hover:shadow-xl">
                        <h3 className="text-center">Close</h3>
                    </div>)}
                </div>
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
            {false && renderNotification()}
        </div>
    )
}

export default Home;
