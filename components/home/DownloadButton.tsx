import { Menu } from "@headlessui/react";

type DownloadButtonType = {
    onClick: () => void;
};

export default function DownloadButton({ onClick }: DownloadButtonType) {
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
                        d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
                    />
                </svg>
            </div>
            Download
        </Menu.Item>
    );
}
