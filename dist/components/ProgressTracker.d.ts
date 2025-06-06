import React from 'react';
interface Stage {
    id: number;
    title: string;
    description: string;
    status: 'completed' | 'in-progress' | 'pending';
    date?: string;
}
interface ProgressTrackerProps {
    stages: Stage[];
    currentStage: number;
}
declare const ProgressTracker: ({ stages, currentStage }: ProgressTrackerProps) => React.JSX.Element;
export default ProgressTracker;
