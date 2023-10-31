type SuccessMessageProps = {
    message: string;
};

export default function SuccessMessage({ message }: SuccessMessageProps) {
    return message === "" ? null : (
        <div className="flex flex-row items-end gap-1 text-sm">
            <div>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-5 h-5 text-green-500"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                </svg>
            </div>

            {message}
        </div>
    );
}
