import { ComponentProps } from "react";

export function Button(props: ComponentProps<"button"> & { asChild?: boolean }) {
    const { className = "", ...rest } = props;
    return (
        <button
            className={`rounded-xl bg-neutral-200 px-5 py-2.5 font-medium text-neutral-900
        transition hover:bg-white focus:outline-none focus:ring-2 focus:ring-neutral-400
        disabled:opacity-50 ${className}`}
            {...rest}
        />
    );
}
