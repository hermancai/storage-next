import Link from "next/link";

function Feature({ text }: { text: string }) {
    return (
        <div className="flex flex-nowrap gap-1 items-center text-zinc-200">
            <div>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    data-slot="icon"
                    className="w-4 h-4"
                >
                    <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z"
                        clipRule="evenodd"
                    />
                </svg>
            </div>
            <p>{text}</p>
        </div>
    );
}

type PricingCardType = {
    subtitle: string;
    price: string;
    features: string[];
    banner?: string;
    buttonText: string;
};

function PricingCard(props: PricingCardType) {
    return (
        <div
            className={`flex flex-col w-full h-full rounded ${
                props.banner ? "bg-orange-400" : ""
            }`}
        >
            <div
                className={`h-8 w-full flex items-center justify-center rounded text-zinc-900 ${
                    props.banner ? "visible" : "invisible hidden sm:block"
                }`}
            >
                {props.banner}
            </div>
            <div
                className={`shadow flex flex-col items-center border grow rounded w-full h-full ${
                    props.banner ? "border-orange-400" : "border-slate-500"
                }`}
            >
                <div className="flex flex-col items-center px-4 pb-4 pt-2 rounded w-full h-full bg-zinc-900">
                    <p className="italic text-zinc-400">{props.subtitle}</p>
                    <p className="text-5xl mb-1 text-zinc-100">
                        {props.price}
                        <span className="text-base text-zinc-400">/month</span>
                    </p>
                    <span className="w-full h-0 border-b border-zinc-500 my-2" />
                    <div className="flex flex-col gap-2 mt-1 mb-3">
                        {props.features.map((feature, i) => (
                            <Feature key={i} text={feature} />
                        ))}
                    </div>
                    <Link
                        href="/signup"
                        className={`shadow px-2 py-1 rounded border transition-colors mt-auto ${
                            props.banner
                                ? "text-zinc-900 border-zinc-900 bg-zinc-100 hover:bg-zinc-300"
                                : "border-zinc-100 text-zinc-100 hover:bg-zinc-700"
                        }`}
                    >
                        {props.buttonText}
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default function Pricing() {
    return (
        <div className="w-full flex flex-col justify-center items-center bg-zinc-800 px-4 pb-12">
            <p className="text-zinc-100 text-3xl py-6">
                &#8212; Pricing &#8212;
            </p>
            <div className="flex flex-col sm:flex-row items-end justify-center gap-4 text-slate-900 max-w-5xl w-full h-full">
                <PricingCard
                    subtitle="Free"
                    price="$0"
                    features={["5 GB of storage", "Community forums"]}
                    buttonText="Get Started"
                />
                <PricingCard
                    subtitle="Standard"
                    price="$5"
                    features={[
                        "2 TB of storage",
                        "Community forums",
                        "Automatic backups",
                    ]}
                    buttonText="Try for Free"
                    banner="RECOMMENDED"
                />
                <PricingCard
                    subtitle="Premium"
                    price="$10"
                    features={[
                        "5 TB of storage",
                        "Community forums",
                        "Automatic backups",
                        "Email & phone support",
                    ]}
                    buttonText="Try for Free"
                />
            </div>
        </div>
    );
}
