import { Dialog } from "@headlessui/react";
import Modal from "@/components/shared/Modal";
import Image from "next/image";
import { ImageType } from "@/types/components";

type ImageModalType = {
    image: ImageType;
    isOpen: boolean;
    closeModal: () => void;
};

export default function ImageModal({
    image,
    isOpen,
    closeModal,
}: ImageModalType) {
    return (
        <Modal isOpen={isOpen} onClose={closeModal}>
            <Dialog.Panel className="flex flex-col w-[80%] h-[80%] text-zinc-100 bg-zinc-900 border border-zinc-500 rounded p-1">
                <div className="flex flex-nowrap justify-between w-full py-1 px-2">
                    <p
                        className="whitespace-nowrap text-ellipsis overflow-hidden"
                        title={image.name}
                    >
                        {image.name}
                    </p>
                    <button
                        onClick={closeModal}
                        className="border border-transparent hover:border-zinc-100 rounded transition-colors"
                    >
                        <div>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="1.5"
                                stroke="currentColor"
                                className="w-6 h-6"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </div>
                    </button>
                </div>
                <div className="relative h-full w-full">
                    <Image
                        src={image.signedUrl}
                        alt={image.name}
                        fill
                        style={{
                            objectFit: "contain",
                        }}
                        unoptimized
                    />
                </div>
            </Dialog.Panel>
        </Modal>
    );
}
