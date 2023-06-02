import EnterUsername from '@/components/EnterUsername';
import StartExperiment from '@/components/StartExperiment';
import WordsExperiment from '@/components/WordsExperiment';
import { loadQuestions, saveAnswers } from '@/logic/experiment';
import { Link, useParams } from '@solidjs/router';
import { Component, Show, Suspense, createResource, createSignal } from 'solid-js';

enum ExperimentState {
    EnterUser,
    Training,
    BeforeExperiment,
    Experiment,
    Complete,
}

const experiment: Component = () => {
    const params = useParams();
    const [questions] = createResource(params.id, loadQuestions);
    const [state, setState] = createSignal(ExperimentState.EnterUser);
    const [username, setUsername] = createSignal('');

    const normalizeExamples = (examples: string[]): { word: string, id: string }[] => {
        return examples.map((it, index) => ({ word: it, id: `example ${index}` }));
    }

    return (
        <div class='h-full'>
            <Suspense fallback='Загружаю вопросы'>
                <Show when={state() === ExperimentState.EnterUser}><EnterUsername setUserName={(username) => { setUsername(username); setState(ExperimentState.Training) }} /></Show>
                <Show when={state() === ExperimentState.Training}> <WordsExperiment endExperiment={(answers) => { saveAnswers(answers, params.id); setState(ExperimentState.BeforeExperiment) }} username={username} words={normalizeExamples(questions()?.examples || [])} training={true} /></Show>
                <Show when={state() === ExperimentState.BeforeExperiment}><StartExperiment startExperiment={() => setState(ExperimentState.Experiment)} /></Show>
                <Show when={!questions.loading && state() === ExperimentState.Experiment}>
                    <WordsExperiment endExperiment={(answers) => { saveAnswers(answers, params.id); setState(ExperimentState.Complete) }} username={username} words={questions()?.words || []} training={false} />
                </Show>
                <Show when={state() === ExperimentState.Complete}>
                    <div class='h-full flex justify-center items-center flex-col gap-8'>
                        <div class='text-xl font-bold'>Благодарим за прохождение эксперемента</div>
                        <Link class='underline' href='/'>Вернутся</Link>
                    </div>
                </Show>
            </Suspense>
        </div>
    )
}

export default experiment;