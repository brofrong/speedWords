import { Accessor, Component, ComponentProps, JSX, Setter, Show, createSignal, onCleanup, onMount } from 'solid-js';

interface modalProps extends ComponentProps<any> {
    modal: Accessor<boolean>,
    setModal: Setter<boolean>,
    title: string
    children: JSX.Element,
}

const Modal: Component<modalProps> = (props: modalProps) => {
    const [test] = createSignal()
    let container!: HTMLDivElement;

    function isClickedOutside(e: MouseEvent) {
        if (e?.target === container) {
            close();
        }
    }

    function close() {
        if (props.modal()) {
            props.setModal(false);
        }
    }

    onMount(() => {
        window.addEventListener('click', isClickedOutside);
    })

    onCleanup(() => {
        window.removeEventListener('click', isClickedOutside);
    });

    return (
        <div ref={container} class={`absolute top-0 left-0 w-screen h-screen z-40 backdrop-blur flex justify-center align-middle overflow-hidden ${props.modal() ? '' : 'hidden'}`}>
            <div class='bg-white m-auto w-2/4 border border-gray-400 rounded p-2'>
                <h2 class='text-xl font-bold mb-4'>{props.title}</h2>
                {props.children}
            </div>
        </div>

    )
}

export default Modal;