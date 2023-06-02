import { openFile } from '@/logic/experiment';
import { Link } from '@solidjs/router';
import { Experiment } from 'packages/main/logic/experiment.d';
import { Component, ComponentProps } from 'solid-js';

interface experimentCardProps extends ComponentProps<any> {
    experiment: Experiment
}

const ExperimentCard: Component<experimentCardProps> = (props: experimentCardProps) => {
    return (
        <div class='flex gap-4 items-center'>
            <Link class='flex-grow' href={`experiment/${props.experiment.id}`}>
                <div class="p-4 flex shadow rounded bg-white cursor-pointer">
                    <div class='w-6'>{props.experiment.id}</div>
                    <div class='flex-grow'>{props.experiment.title}</div>
                    <div>{new Date(props.experiment.createdAt).toLocaleString()}</div>
                </div>
            </Link>
            <button class='text-sm text-gray-600 p-2 border border-gray-300 bg-white rounded h-fit hover:bg-gray-100' onClick={() => { openFile(props.experiment.id.toString()) }}>Результаты</button>
        </div>

    )
}

export default ExperimentCard;