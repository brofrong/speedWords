import { Component, ComponentProps, Show, createSignal } from 'solid-js';
import { Input } from './Input';
import { parse } from 'csv-parse/browser/esm/sync';

interface addExperimentProps extends ComponentProps<any> {
    addExperiment: (data: { title: string, words: { id: string, word: string }[], examples: string[] }) => void;
}

interface ParsedData { 'id': string, 'word': string, 'training_word': string };

const AddExperimentForm: Component<addExperimentProps> = ({ addExperiment }) => {
    let form!: HTMLFormElement;
    let titleInput!: HTMLInputElement;
    let fileInput!: HTMLInputElement;

    const [error, setError] = createSignal<string | null>(null)

    async function test(e: SubmitEvent) {
        e.preventDefault();
        setError(null);

        const title = titleInput.value;
        if (!title) {
            setError('Введите название эксперимента');
            return;
        }

        const files = fileInput.files;

        if (!(files && files[0])) {
            setError('Приложите файл');
            return;
        }


        const fileText = await files[0].text();

        let parsed: ParsedData[] = []
        try {
            parsed = parse(fileText, { autoParse: true, columns: true, delimiter: [';', ','] });
        } catch (e) {
            setError(JSON.stringify(e));
            return;
        }

        const check = parsed[0];
        if (!check.id) { return setError('Отсутсвует Колонка id') };
        if (!check.word) { return setError('Отсутсвует Колонка word') };
        if (!check.training_word) { return setError('Отсутсвует Колонка training word') };

        const words = parsed.map((it) => ({ id: it.id, word: it.word })).filter(it => it.word !== '');
        const examples = parsed.map((it) => it.training_word).filter(it => it !== '');


        form.reset();
        addExperiment({ title, words, examples });
    }

    return (
        <div>
            <form ref={form} class='flex flex-col gap-4' onSubmit={test}>
                <Input ref={titleInput} name='experimentName' id='experimentName' placeholder='Название эксперимента'></Input>
                <div>
                    <div class='text-sm text-gray-600 mb-2'>Файл должен сожержать 3 колонки: id, word, training_word</div>
                    <input ref={fileInput} class="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" id="file_input" name='file' type="file" accept='.csv' />
                </div>
                <Show when={error()}>
                    <div class='text-red-400'>{error()}</div>
                </Show>
                <button type='submit'>Создать</button>
            </form>
        </div>
    )
}

export default AddExperimentForm;