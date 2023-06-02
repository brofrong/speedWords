import { Component, ComponentProps, onCleanup, onMount } from 'solid-js';

interface StartExperimentProps extends ComponentProps<any> {
    startExperiment: () => void,
}

const StartExperiment: Component<StartExperimentProps> = (props: StartExperimentProps) => {


    function keyPressed(e: KeyboardEvent) {
        if (e.code === 'Space') {
            props.startExperiment();
        }
    }

    onMount(() => {
        document.addEventListener('keydown', keyPressed);
    });

    onCleanup(() => {
        document.removeEventListener('keydown', keyPressed);
    })



    return (
        <div class='h-full justify-center align-middle'>
            <h2>Нажмите на <b>«Пробел»</b> что бы продолжить</h2>
        </div>
    )
}

export default StartExperiment;