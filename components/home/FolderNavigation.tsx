"use client";

import { Fragment } from "react";
import Link from "next/link";
import { Menu, Transition } from "@headlessui/react";

type FolderType = {
    name: string;
    id: string;
    parent?: string | null;
};

type FolderNavigationType = {
    folderPath: FolderType[];
};

type FolderLinkType = {
    folder: FolderType;
    active?: boolean;
};

function Chevron() {
    return (
        <div>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-4 h-4 text-slate-700"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8.25 4.5l7.5 7.5-7.5 7.5"
                />
            </svg>
        </div>
    );
}

function FolderLink({ folder, active }: FolderLinkType) {
    return (
        <Link
            href={`/home/folder/${folder.id}`}
            className={`px-2 py-1 rounded whitespace-nowrap overflow-hidden min-w-[50px] overflow-ellipsis ${
                active
                    ? "text-slate-900 underline cursor-default"
                    : "text-slate-700 hover:text-slate-900 hover:bg-slate-200 transition-colors"
            }`}
            title={folder.name}
        >
            {folder.name}
        </Link>
    );
}

function HomeLink() {
    return (
        <Link
            href="/home"
            className="px-2 py-1 rounded whitespace-nowrap overflow-hidden min-w-min overflow-ellipsis text-slate-700 hover:text-slate-900 transition-colors hover:bg-slate-200"
            title="Home"
        >
            Home
        </Link>
    );
}

export default function FolderNavigation({ folderPath }: FolderNavigationType) {
    return (
        <div className="flex flex-row-reverse justify-end items-center gap-1">
            {folderPath.length > 3 ? (
                <>
                    <FolderLink folder={folderPath[0]} active />
                    <Chevron />
                    <FolderLink folder={folderPath[1]} />
                    <Chevron />
                    <Menu as="div" className="relative [display:inherit]">
                        <Menu.Button>
                            <div className="px-2 py-1 rounded transition-colors hover:bg-slate-200">
                                {" "}
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth="1.3"
                                    stroke="currentColor"
                                    className="w-6 h-6"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M6.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM18.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
                                    />
                                </svg>
                            </div>
                        </Menu.Button>
                        <Transition
                            as={Fragment}
                            enter="transition ease-out duration-100"
                            enterFrom="transform opacity-0 scale-95"
                            enterTo="transform opacity-100 scale-100"
                            leave="transition ease-in duration-75"
                            leaveFrom="transform opacity-100 scale-100"
                            leaveTo="transform opacity-0 scale-95"
                        >
                            <Menu.Items
                                as="div"
                                className="absolute left-0 top-9 border-2 border-slate-400 rounded p-1 bg-white flex flex-col gap-1 text-slate-800 origin-top-left max-w-[250px]"
                            >
                                {folderPath.slice(2).map((folder) => {
                                    if (folder.parent === null) {
                                        return <HomeLink key={folder.id} />;
                                    }
                                    return (
                                        <FolderLink
                                            key={folder.id}
                                            folder={folder}
                                        />
                                    );
                                })}
                            </Menu.Items>
                        </Transition>
                    </Menu>
                </>
            ) : (
                folderPath.map((folder, i) => {
                    if (folder.parent === null) {
                        return <HomeLink key={folder.id} />;
                    }
                    return (
                        <Fragment key={folder.id}>
                            <FolderLink folder={folder} active={i === 0} />
                            <Chevron />
                        </Fragment>
                    );
                })
            )}
        </div>
    );
}
