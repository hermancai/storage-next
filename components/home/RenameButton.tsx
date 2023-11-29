import { Menu } from "@headlessui/react";

type RenameButtonType = {
    onClick: () => void;
};

export default function RenameButton({ onClick }: RenameButtonType) {
    return (
        <Menu.Item
            as="button"
            onClick={onClick}
            className="rounded flex flex-nowrap items-center gap-2 px-2 py-1 transition-colors hover:bg-slate-200"
            title=""
        >
            <div>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.3"
                    stroke="currentColor"
                    className="w-4 h-4"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125"
                    />
                </svg>
            </div>
            Rename
        </Menu.Item>
    );
}
