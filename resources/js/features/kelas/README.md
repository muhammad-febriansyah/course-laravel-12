# Kelas Feature - Clean Architecture

Struktur folder dan file untuk feature Kelas menggunakan Clean Architecture pattern untuk maintainability yang lebih baik.

## 📁 Struktur Folder

```
features/kelas/
├── components/          # Reusable UI components
│   └── kelas-basic-info-form.tsx
├── hooks/              # Custom hooks untuk business logic
│   ├── use-kelas-form.ts
│   └── use-image-preview.ts
├── schemas/            # Validation schemas
│   └── kelas-schema.ts
├── types/              # TypeScript types & interfaces
│   └── index.ts
├── constants/          # Constants & configurations
│   └── index.ts
└── README.md
```

## 🎯 Prinsip Clean Architecture

### 1. **Separation of Concerns**
- **Components**: Hanya fokus pada UI rendering
- **Hooks**: Menghandle business logic dan state management
- **Schemas**: Validation logic terpisah
- **Types**: Type definitions terpusat

### 2. **Reusability**
- Components bisa digunakan ulang
- Hooks bisa digunakan di create & edit
- Types shared across feature

### 3. **Testability**
- Business logic di hooks mudah di-test
- Validation schema bisa di-test terpisah
- Components bisa di-test dengan mock data

## 📝 Penggunaan

### Import Types
```typescript
import { Kelas, Category, Type, Level } from '@/features/kelas/types';
```

### Import Validation Schema
```typescript
import { kelasFormSchema, KelasFormData } from '@/features/kelas/schemas/kelas-schema';
```

### Import Custom Hooks
```typescript
import { useKelasForm } from '@/features/kelas/hooks/use-kelas-form';
import { useImagePreview } from '@/features/kelas/hooks/use-image-preview';
```

### Import Components
```typescript
import { KelasBasicInfoForm } from '@/features/kelas/components/kelas-basic-info-form';
```

### Import Constants
```typescript
import { FORM_STEPS, DEFAULT_FORM_VALUES } from '@/features/kelas/constants';
```

## 🔧 Cara Menggunakan di Page

```typescript
export default function CreateKelas({ categories, types, levels }: Props) {
    // 1. Use custom hook untuk form logic
    const { form, currentStep, nextStep, prevStep, goToStep, onSubmit } = useKelasForm();

    // 2. Use image preview hook
    const { preview, handleImageChange, removeImage } = useImagePreview();

    // 3. Render components
    return (
        <form onSubmit={form.handleSubmit(onSubmit)}>
            {currentStep === 1 && (
                <KelasBasicInfoForm
                    register={form.register}
                    control={form.control}
                    errors={form.formState.errors}
                    categories={categories}
                    types={types}
                    levels={levels}
                    imagePreview={preview}
                    onImageChange={handleImageChange}
                    onImageRemove={() => removeImage('image')}
                />
            )}
        </form>
    );
}
```

## ✅ Keuntungan

1. **Easy to Maintain**: Setiap file punya tanggung jawab yang jelas
2. **Easy to Test**: Logic terpisah dari UI
3. **Easy to Reuse**: Components dan hooks bisa digunakan ulang
4. **Type Safety**: TypeScript types terpusat
5. **Scalable**: Mudah menambah feature baru

## 🚀 Next Steps

Untuk mengimplementasikan full clean architecture:

1. Buat component untuk Step 2 (Sections & Videos)
2. Buat component untuk Step 3 (Quizzes)
3. Buat utils/helpers jika diperlukan
4. Refactor edit.tsx menggunakan pattern yang sama

## 📚 File Descriptions

### Components
- `kelas-basic-info-form.tsx`: Form UI untuk informasi dasar kelas

### Hooks
- `use-kelas-form.ts`: Hook untuk handle semua form logic (submit, validation, steps)
- `use-image-preview.ts`: Hook untuk handle image upload & preview

### Schemas
- `kelas-schema.ts`: Zod validation schema dengan pesan bahasa Indonesia

### Types
- `index.ts`: All TypeScript interfaces & types untuk feature kelas

### Constants
- `index.ts`: Form steps, default values, dan konfigurasi lainnya
