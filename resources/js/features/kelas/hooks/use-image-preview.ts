import { useState } from 'react';

/**
 * Custom hook untuk handle image preview
 * Reusable untuk semua upload image functionality
 */
export function useImagePreview(initialPreview: string | null = null) {
    const [preview, setPreview] = useState<string | null>(initialPreview);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const removeImage = (inputId: string) => {
        setPreview(null);
        const input = document.getElementById(inputId) as HTMLInputElement;
        if (input) input.value = '';
    };

    return {
        preview,
        setPreview,
        handleImageChange,
        removeImage,
    };
}

/**
 * Custom hook untuk handle multiple image previews (untuk quiz images)
 */
export function useMultipleImagePreviews(initialPreviews: { [key: number]: string } = {}) {
    const [previews, setPreviews] = useState<{ [key: number]: string }>(initialPreviews);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviews((prev) => ({
                    ...prev,
                    [index]: reader.result as string,
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const removeImage = (index: number, inputId: string) => {
        setPreviews((prev) => {
            const newPreviews = { ...prev };
            delete newPreviews[index];
            return newPreviews;
        });
        const input = document.getElementById(inputId) as HTMLInputElement;
        if (input) input.value = '';
    };

    return {
        previews,
        setPreviews,
        handleImageChange,
        removeImage,
    };
}
