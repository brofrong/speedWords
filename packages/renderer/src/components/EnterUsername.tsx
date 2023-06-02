import { Component, ComponentProps, onCleanup, onMount } from 'solid-js';
import { Input } from './Input';
import { config } from '@/logic/config';

interface EnterusernameProps extends ComponentProps<any> {
    setUserName: (username: string) => void,
}

const EnterUsername: Component<EnterusernameProps> = (props: EnterusernameProps) => {
    let username = '';

    function keyPressed(e: KeyboardEvent) {
        if (e.code === 'Space') {
            props.setUserName(username);
        }
    }

    onMount(() => {
        document.addEventListener('keydown', keyPressed);
    });

    onCleanup(() => {
        document.removeEventListener('keydown', keyPressed);
    })


    return (
        <div class='max-w-2xl p-4 m-auto flex flex-col justify-between h-full'>
            <div class='mb-4'>
                <Input id='username' name='username' placeholder='id участника' onInput={(e) => username = e.target.value}></Input>
            </div>

            <div>
                <p class='mb-4 text-center'>Вы должны прочитать его и решить существует это слово в языке или нет.</p>
                <p class='mb-4 text-center'>Нажмите <b class='uppercase'>«{config().yes.key}»</b> если перед Вами слово, нажмите <b class='uppercase'>«{config().no.key}»</b> если  <b>не</b> слово.</p>
                <p class='mb-12 text-center'>Старайтесь отвечать как можно быстрее, но при этом правильно.</p>
                <p class='mb-4 text-center'>Нажмите на <b>«Пробел»</b> что бы начать</p>
            </div>

            <div></div>
        </div>
    )
}

export default EnterUsername;