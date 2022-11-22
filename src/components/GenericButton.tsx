import { twMerge } from "tailwind-merge";

type Props = {
    onClick?: React.MouseEventHandler<HTMLButtonElement> | undefined;
    isDisabled?: boolean | undefined;
    text?: string | undefined;
    className?: string | undefined;
};

function GenericButton({
    onClick,
    isDisabled,
    text,
    className,
}: Props): JSX.Element {
    return (
        <button
            className={twMerge(
                `px-4 py-2 text-sky-400 border-2 border-sky-400 rounded-full hover:bg-sky-500 font-semibold hover:text-white hover:border-transparent ${className}`
            )}
            onClick={onClick}
            disabled={isDisabled}
        >
            {text}
        </button>
    );
}

export default GenericButton;
