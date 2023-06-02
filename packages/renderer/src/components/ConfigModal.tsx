import { Component, ComponentProps, Show, createSignal } from 'solid-js';
import { Input } from './Input';
import { ConfigKey, config, saveConfigLS } from '@/logic/config';
import SetKey from './SetKey';
import { delay } from 'lodash';


interface ConfigProps extends ComponentProps<any> {
    closeModal: () => void;
}


const ConfigModal: Component<ConfigProps> = (props) => {
    let form!: HTMLFormElement;
    let delayInput!: HTMLInputElement;
    let dummyInput!: HTMLInputElement;
    let progressInput!: HTMLInputElement;

    const currentConfig = config();

    const [yesKey, setYesKey] = createSignal<ConfigKey>({ code: currentConfig.yes.code, key: currentConfig.yes.key });
    const [noKey, setNoKey] = createSignal<ConfigKey>({ code: currentConfig.no.code, key: currentConfig.no.key });


    function saveConfig(e: SubmitEvent) {
        e.preventDefault();
        const delay = +delayInput.value;
        const dummy = dummyInput.value;
        const showProgressBar = progressInput.checked;

        saveConfigLS({
            delay,
            dummy,
            yes: yesKey(),
            no: noKey(),
            showProgressBar,
        })

        props.closeModal();
    }


    return (
        <div>
            <form ref={form} class='flex flex-col gap-4' onSubmit={saveConfig}>

                <label for='delay'>Задержка между словами в мс
                    <Input ref={delayInput} name='delay' id='delay' placeholder='Задержка' value={currentConfig.delay} ></Input>
                </label>

                <label for='dummy'>Заглушка между словами в экспиременте
                    <Input ref={dummyInput} name='dummy' id='dummy' placeholder='Заглушка' value={currentConfig.dummy} ></Input>
                </label>


                <div class='flex justify-between items-center'>
                    <div>Положительный ответ</div>
                    <SetKey key={yesKey} setKey={setYesKey}></SetKey>
                </div>
                <div class='flex justify-between items-center'>
                    <div>Отрицательный ответ</div>
                    <SetKey key={noKey} setKey={setNoKey}></SetKey>
                </div>
                <div class='text-xs text-gray-600'>Что бы поменять кномку необходимо нажать на неё мышкой, после чего нажать на кнопку на клавиатуре</div>

                <div class="flex items-center mb-4">
                    <input ref={progressInput} id="show-progressBar" type="checkbox" checked={currentConfig.showProgressBar} class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                    <label for="show-progressBar" class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">Показывать Прогресс в эксперимента</label>
                </div>


                <button class='p-2 border border-gray-400 rounded hover:bg-gray-100' type='submit'>Сохранить</button>
            </form>
        </div>
    )
}

export default ConfigModal;