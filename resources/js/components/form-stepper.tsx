import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Step {
    title: string;
    description?: string;
}

interface FormStepperProps {
    steps: Step[];
    currentStep: number;
    onStepClick?: (step: number) => void;
}

export function FormStepper({ steps, currentStep, onStepClick }: FormStepperProps) {
    return (
        <div className="w-full">
            <nav aria-label="Progress">
                <ol className="flex items-center justify-between">
                    {steps.map((step, index) => {
                        const stepNumber = index + 1;
                        const isCompleted = stepNumber < currentStep;
                        const isCurrent = stepNumber === currentStep;
                        const isUpcoming = stepNumber > currentStep;

                        return (
                            <li
                                key={step.title}
                                className={cn(
                                    'relative flex-1',
                                    index !== steps.length - 1 && 'pr-8 sm:pr-20'
                                )}
                            >
                                {/* Connector Line */}
                                {index !== steps.length - 1 && (
                                    <div
                                        className="absolute top-4 left-0 right-0 -ml-px h-0.5 w-full"
                                        aria-hidden="true"
                                    >
                                        <div
                                            className={cn(
                                                'h-full transition-all duration-300',
                                                isCompleted
                                                    ? 'bg-primary'
                                                    : 'bg-muted'
                                            )}
                                        />
                                    </div>
                                )}

                                <button
                                    type="button"
                                    onClick={() => onStepClick?.(stepNumber)}
                                    className="group relative flex flex-col items-center"
                                    disabled={isUpcoming}
                                >
                                    {/* Step Circle */}
                                    <span
                                        className={cn(
                                            'flex h-8 w-8 items-center justify-center rounded-full transition-all duration-300 relative z-10',
                                            isCompleted &&
                                                'bg-primary text-primary-foreground',
                                            isCurrent &&
                                                'border-2 border-primary bg-background text-primary ring-4 ring-primary/20',
                                            isUpcoming &&
                                                'border-2 border-muted bg-background text-muted-foreground'
                                        )}
                                    >
                                        {isCompleted ? (
                                            <Check className="h-5 w-5" />
                                        ) : (
                                            <span className="text-sm font-semibold">
                                                {stepNumber}
                                            </span>
                                        )}
                                    </span>

                                    {/* Step Label */}
                                    <span className="mt-2 flex flex-col items-center">
                                        <span
                                            className={cn(
                                                'text-sm font-medium transition-colors',
                                                isCurrent && 'text-primary',
                                                isCompleted && 'text-foreground',
                                                isUpcoming && 'text-muted-foreground'
                                            )}
                                        >
                                            {step.title}
                                        </span>
                                        {step.description && (
                                            <span className="text-xs text-muted-foreground mt-0.5 hidden sm:block">
                                                {step.description}
                                            </span>
                                        )}
                                    </span>
                                </button>
                            </li>
                        );
                    })}
                </ol>
            </nav>
        </div>
    );
}
