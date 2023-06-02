import { Component, ComponentProps } from 'solid-js';

interface ProgressBarProps extends ComponentProps<any> {
    progress: number;
}

const ProgressBar: Component<ProgressBarProps> = (props: ProgressBarProps) => {
    return (
        <div class="w-full bg-gray-200 rounded-full h-1.5 mb-4 dark:bg-gray-700">
            <div class="bg-blue-600 h-1.5 rounded-full dark:bg-blue-500" style={`width: ${props.progress * 100}%`}></div>
        </div>
    )
}

export default ProgressBar;