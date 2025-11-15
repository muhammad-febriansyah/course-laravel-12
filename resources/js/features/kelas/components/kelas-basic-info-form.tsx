import { Controller, Control, FieldErrors, UseFormRegister } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { BookOpen, Upload, X, ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CurrencyInput } from '@/components/currency-input';
import { KelasFormData } from '../schemas/kelas-schema';
import { Category, Type, Level } from '../types';

interface KelasBasicInfoFormProps {
    register: UseFormRegister<KelasFormData>;
    control: Control<KelasFormData>;
    errors: FieldErrors<KelasFormData>;
    categories: Category[];
    types: Type[];
    levels: Level[];
    imagePreview: string | null;
    onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onImageRemove: () => void;
}

/**
 * Form component untuk informasi dasar kelas (Step 1)
 * Terpisah untuk reusability dan maintainability
 */
export function KelasBasicInfoForm({
    register,
    control,
    errors,
    categories,
    types,
    levels,
    imagePreview,
    onImageChange,
    onImageRemove,
}: KelasBasicInfoFormProps) {
    return (
        <Card>
            <CardHeader className="pb-4">
                <div className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    <CardTitle>Informasi Dasar</CardTitle>
                </div>
            </CardHeader>
            <CardContent className="space-y-4 px-6 pb-6">
                <div className="grid grid-cols-2 gap-4">
                    {/* Judul */}
                    <div className="col-span-2 space-y-2">
                        <Label htmlFor="title">
                            Judul Kelas
                            <span className="text-destructive">*</span>
                        </Label>
                        <Input
                            id="title"
                            {...register('title')}
                            placeholder="Masukkan judul kelas"
                        />
                        {errors.title && (
                            <p className="text-sm text-destructive">
                                {errors.title.message}
                            </p>
                        )}
                    </div>

                    {/* Kategori */}
                    <div className="space-y-2">
                        <Label htmlFor="category_id">
                            Kategori
                            <span className="text-destructive">*</span>
                        </Label>
                        <Controller
                            name="category_id"
                            control={control}
                            render={({ field }) => (
                                <Select
                                    onValueChange={field.onChange}
                                    value={field.value}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih kategori" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories.map((cat) => (
                                            <SelectItem
                                                key={cat.id}
                                                value={String(cat.id)}
                                            >
                                                {cat.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        {errors.category_id && (
                            <p className="text-sm text-destructive">
                                {errors.category_id.message}
                            </p>
                        )}
                    </div>

                    {/* Tipe */}
                    <div className="space-y-2">
                        <Label htmlFor="type_id">
                            Tipe
                            <span className="text-destructive">*</span>
                        </Label>
                        <Controller
                            name="type_id"
                            control={control}
                            render={({ field }) => (
                                <Select
                                    onValueChange={field.onChange}
                                    value={field.value}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih tipe" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {types.map((type) => (
                                            <SelectItem
                                                key={type.id}
                                                value={String(type.id)}
                                            >
                                                {type.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        {errors.type_id && (
                            <p className="text-sm text-destructive">
                                {errors.type_id.message}
                            </p>
                        )}
                    </div>

                    {/* Level */}
                    <div className="space-y-2">
                        <Label htmlFor="level_id">
                            Level
                            <span className="text-destructive">*</span>
                        </Label>
                        <Controller
                            name="level_id"
                            control={control}
                            render={({ field }) => (
                                <Select
                                    onValueChange={field.onChange}
                                    value={field.value}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih level" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {levels.map((level) => (
                                            <SelectItem
                                                key={level.id}
                                                value={String(level.id)}
                                            >
                                                {level.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        {errors.level_id && (
                            <p className="text-sm text-destructive">
                                {errors.level_id.message}
                            </p>
                        )}
                    </div>

                    {/* Harga */}
                    <div className="space-y-2">
                        <Label htmlFor="price">
                            Harga
                            <span className="text-destructive">*</span>
                        </Label>
                        <Controller
                            name="price"
                            control={control}
                            render={({ field }) => (
                                <CurrencyInput
                                    value={field.value}
                                    onChange={field.onChange}
                                    onBlur={field.onBlur}
                                    placeholder="0"
                                />
                            )}
                        />
                        {errors.price && (
                            <p className="text-sm text-destructive">
                                {errors.price.message}
                            </p>
                        )}
                    </div>

                    {/* Diskon */}
                    <div className="space-y-2">
                        <Label htmlFor="discount">Diskon</Label>
                        <Controller
                            name="discount"
                            control={control}
                            render={({ field }) => (
                                <CurrencyInput
                                    value={field.value || ''}
                                    onChange={field.onChange}
                                    onBlur={field.onBlur}
                                    placeholder="0"
                                />
                            )}
                        />
                    </div>

                    {/* Status */}
                    <div className="space-y-2">
                        <Label htmlFor="status">
                            Status
                            <span className="text-destructive">*</span>
                        </Label>
                        <Controller
                            name="status"
                            control={control}
                            render={({ field }) => (
                                <Select
                                    onValueChange={field.onChange}
                                    value={field.value}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="draft">
                                            Draft
                                        </SelectItem>
                                        <SelectItem value="published">
                                            Published
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            )}
                        />
                    </div>

                    {/* Gambar */}
                    <div className="col-span-2 space-y-2">
                        <Label htmlFor="image">Gambar Kelas</Label>
                        {imagePreview ? (
                            <div className="relative">
                                <img
                                    src={imagePreview}
                                    alt="Preview"
                                    className="w-full h-48 object-cover rounded-lg border"
                                />
                                <Button
                                    type="button"
                                    variant="destructive"
                                    size="icon"
                                    className="absolute top-2 right-2"
                                    onClick={onImageRemove}
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        ) : (
                            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center hover:border-muted-foreground/50 transition-colors">
                                <div className="flex flex-col items-center gap-2">
                                    <div className="p-4 bg-muted rounded-full">
                                        <ImageIcon className="h-8 w-8 text-muted-foreground" />
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <p className="text-sm font-medium">
                                            Upload gambar kelas
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            PNG, JPG, JPEG hingga 2MB
                                        </p>
                                    </div>
                                    <Input
                                        id="image"
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        {...register('image', {
                                            onChange: onImageChange,
                                        })}
                                    />
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() =>
                                            document
                                                .getElementById('image')
                                                ?.click()
                                        }
                                    >
                                        <Upload className="mr-2 h-4 w-4" />
                                        Pilih Gambar
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Benefit */}
                    <div className="col-span-2 space-y-2">
                        <Label htmlFor="benefit">Benefit</Label>
                        <Textarea
                            id="benefit"
                            {...register('benefit')}
                            placeholder="Masukkan benefit kelas"
                            rows={3}
                        />
                    </div>

                    {/* Deskripsi Singkat */}
                    <div className="col-span-2 space-y-2">
                        <Label htmlFor="desc">Deskripsi Singkat</Label>
                        <Textarea
                            id="desc"
                            {...register('desc')}
                            placeholder="Masukkan deskripsi singkat"
                            rows={3}
                        />
                    </div>

                    {/* Deskripsi Lengkap */}
                    <div className="col-span-2 space-y-2">
                        <Label htmlFor="body">Deskripsi Lengkap</Label>
                        <Textarea
                            id="body"
                            {...register('body')}
                            placeholder="Masukkan deskripsi lengkap"
                            rows={5}
                        />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
