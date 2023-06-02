import { ConfigKey } from '@/logic/config';
import { Accessor, Component, ComponentProps, Setter, createSignal, onCleanup } from 'solid-js';

interface SetKeyProps extends ComponentProps<any> {
    key: Accessor<ConfigKey>,
    setKey: Setter<ConfigKey>,
}

const SetKey: Component<SetKeyProps> = (props: SetKeyProps) => {

    const [canEdit, setCanEdit] = createSignal(false);

    function setKey(e: KeyboardEvent) {
        props.setKey({ key: e.key, code: e.code });

        document.removeEventListener('keydown', setKey);
        setCanEdit(false);
    }

    function startEdit() {
        setCanEdit(true);
        document.addEventListener('keydown', setKey);
    }

    onCleanup(() => {
        document.removeEventListener('keydown', setKey);
    })

    return (
        <div class='flex'>
            <div class='py-1 px-2 w-14 text-center cursor-pointer rounded bg-white shadow hover:bg-gray-50' onClick={() => startEdit()}>{canEdit() ? 'жду' : props.key().key}</div>
        </div>
    )
}

export default SetKey;