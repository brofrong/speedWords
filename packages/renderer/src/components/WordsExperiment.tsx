import * as _ from 'lodash';
import { Answer } from 'packages/main/logic/experiment.d';
import { Accessor, Component, ComponentProps, createSignal, onCleanup, onMount } from 'solid-js';

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

    const [currentWord, setCurrentWord] = createSignal<{ id: string, word: string }>(shuffledQuestions[wordNumber]);
    const [wordCounter, setWordCounter] = createSignal(wordNumber);

    function keyPressed(e: KeyboardEvent) {
        switch (e.code) {
            case "KeyF": addAnswer('yes'); break;
            case "KeyJ": addAnswer('no'); break;
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
        startTime = Date.now();
    }

    onMount(() => {
        document.addEventListener('keydown', keyPressed);
    });

    onCleanup(() => {
        document.removeEventListener('keydown', keyPressed);
    })

    return (
        <div class='h-full flex justify-between flex-col items-center p-4'>
            <div>progress {wordCounter() + 1}/{shuffledQuestions.length}</div>
            <div>{currentWord().word}</div>
            <div>F-да / J-нет</div>
        </div>
    )
}

export default WordsExperiment;