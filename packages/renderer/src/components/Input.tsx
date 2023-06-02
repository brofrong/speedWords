import { Component, JSX, Show, children, createEffect } from "solid-js"

interface props {
    name: string,
    id: string,
    title?: string,
    placeholder?: string,
    onInput?: JSX.InputEventHandlerUnion<HTMLInputElement, InputEvent>,
    class?: JSX.HTMLAttributes<HTMLDivElement>,
    icon?: JSX.Element,
    ref?: HTMLInputElement,
}

export const Input: Component<props> = ({ name, id, title, placeholder, onInput, icon, ref }) => {
    return (
        <>
            <Show when={title}>
                <label for={id} class="block text-sm font-medium leading-6 text-white">{title}</label>
            </Show>
            <div class="relative mt-2 rounded-md shadow-sm">
                <Show when={icon}>
                    <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-2">
                        <span class="fill-gray-500">{icon}</span>
                    </div>
                </Show>

                <input ref={ref} onInput={onInput} type="text" name={name} id={id} class="block w-full rounded-md border-0 py-1.5 pl-1.5 pr-0 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" placeholder={placeholder} />
            </div>
        </>
    )
}
