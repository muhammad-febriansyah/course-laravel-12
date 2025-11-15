import { forwardRef, useState, useEffect } from 'react';
import { Input } from './ui/input';

interface CurrencyInputProps {
    value: string | number;
    onChange: (value: string) => void;
    onBlur?: () => void;
    placeholder?: string;
    disabled?: boolean;
    className?: string;
}

export const CurrencyInput = forwardRef<HTMLInputElement, CurrencyInputProps>(
    ({ value, onChange, onBlur, placeholder = '0', disabled, className }, ref) => {
        const [displayValue, setDisplayValue] = useState('');

        // Format number to IDR currency
        const formatCurrency = (value: string | number): string => {
            if (!value) return '';

            // Remove non-numeric characters
            const numericValue = value.toString().replace(/\D/g, '');

            if (!numericValue) return '';

            // Format with thousand separators
            return new Intl.NumberFormat('id-ID').format(parseInt(numericValue));
        };

        // Update display value when prop value changes
        useEffect(() => {
            setDisplayValue(formatCurrency(value));
        }, [value]);

        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const inputValue = e.target.value;

            // Remove non-numeric characters
            const numericValue = inputValue.replace(/\D/g, '');

            // Update display with formatted value
            setDisplayValue(formatCurrency(numericValue));

            // Pass raw numeric value to parent
            onChange(numericValue);
        };

        return (
            <div className="relative">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                    <span className="text-muted-foreground text-sm">Rp</span>
                </div>
                <Input
                    ref={ref}
                    type="text"
                    value={displayValue}
                    onChange={handleChange}
                    onBlur={onBlur}
                    placeholder={placeholder}
                    disabled={disabled}
                    className={`pl-10 ${className || ''}`}
                    inputMode="numeric"
                />
            </div>
        );
    }
);

CurrencyInput.displayName = 'CurrencyInput';
