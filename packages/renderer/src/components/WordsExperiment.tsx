import { config } from '@/logic/config';
import * as _ from 'lodash';
import { Answer } from 'packages/main/logic/experiment.d';
import { Accessor, Component, ComponentProps, Show, createSignal, onCleanup, onMount } from 'solid-js';
import ProgressBar from './ProgressBar';

interface WordsExperimentProps extends ComponentProps<any> {
    words: { id: string; word: string }[],
    username: Accessor<string>,
    endExperiment: (answers: Answer[]) => void,
    training: boolean;
}

const WordsExperiment: Component<WordsExperimentProps> = (props: WordsExperimentProps) => {
    const answers: Answer[] = [];
    let startTime = Date.now();
    let wordNumber = 0;

    let shuffledQuestions = _.shuffle(props.words);

    let localConfig = config;

    const [currentWord, setCurrentWord] = createSignal<{ id: string, word: string }>(shuffledQuestions[wordNumber]);
    const [wordCounter, setWordCounter] = createSignal(wordNumber);
    const [showDummy, setShowDummy] = createSignal(true);

    function setTimer() {
        setTimeout(() => {
            startTime = Date.now();
            setShowDummy(false);
        }, config().delay)
    }

    function keyPressed(e: KeyboardEvent) {
        if (showDummy()) {
            return;
        }
        switch (e.code) {
            case config().yes.code: addAnswer('yes'); break;
            case config().no.code: addAnswer('no'); break;
        }
    }

    function addAnswer(answer: string) {
        const current = currentWord();
        const delta = Date.now() - startTime;
        answers.push({ answer, user: props.username(), word: current.word, word_id: current.id, end_time: Date.now(), start_time: startTime, delta, training: props.training });
        nextWord();
    }

    function nextWord() {
        if (wordNumber === shuffledQuestions.length - 1) {
            return props.endExperiment(answers);
        }
        wordNumber++;
        setCurrentWord(shuffledQuestions[wordNumber]);
        setWordCounter(wordNumber);

        setShowDummy(true);
        setTimer();
    }

    onMount(() => {
        setTimer()
        document.addEventListener('keydown', keyPressed);
    });

    onCleanup(() => {
        document.removeEventListener('keydown', keyPressed);
    })


    return (
        <div class='h-full flex justify-between flex-col items-center p-4'>
            <Show when={config().showProgressBar} fallback={<div />}><div class='w-full'><ProgressBar progress={(wordCounter()) / shuffledQuestions.length} /></div></Show>
            <div class='text-2xl whitespace-nowrap overflow-visible'>{showDummy() ? config().dummy : currentWord().word}</div>
            <div><span>{config().yes.key}</span>-да / <span>{config().no.key}</span>-нет</div>
        </div>
    )
}

export default WordsExperiment;