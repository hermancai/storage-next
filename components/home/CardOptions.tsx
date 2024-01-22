"use client";

import { Menu, Transition } from "@headlessui/react";
import { Fragment, ReactNode } from "react";

type CardOptionsType = {
    children?: ReactNode | undefined;
};

export default function CardOptions({ children }: CardOptionsType) {
    return (
        <Menu as="div" className="relative [display:inherit]" title="Options">
            <Menu.Button>
                <div className="rounded transition-colors hover:bg-zinc-900">
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
                            d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z"
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
                    className="z-10 absolute right-0 top-6 border border-zinc-300 rounded p-1 bg-zinc-900 flex flex-col gap-1 text-zinc-100 origin-top-right max-w-[250px] text-sm"
                >
                    {children}
                </Menu.Items>
            </Transition>
        </Menu>
    );
}
