import { twMerge } from "tailwind-merge";

type Props = {
    type?: string | undefined;
    placeholder?: string | undefined;
    className?: string | undefined;
    value?: string | undefined;
    name?: string | undefined;
    onChange?: React.ChangeEventHandler<HTMLInputElement> | undefined;
};

function GenericInputField({
    type,
    value,
    name,
    onChange,
    placeholder,
    className,
}: Props): JSX.Element {
    return (
        <input
            className={twMerge(
                `w-1/3 px-4 py-3 text-sky-300 placeholder:text-sky-300 placeholder:italic bg-transparent border-2 border-sky-400 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500 block mx-auto ${className}`
            )}
            type={type}
            placeholder={placeholder}
            value={value}
            name={name}
            onChange={onChange}
            required={true}
        />
    );
}

export default GenericInputField;
