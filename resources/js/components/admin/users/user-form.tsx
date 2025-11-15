import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';

export interface UserFormState {
    name: string;
    email: string;
    phone?: string;
    address?: string;
    role?: string;
    status: string;
    password?: string;
    password_confirmation?: string;
    avatar: File | null;
}

interface UserFormProps {
    roles: string[];
    errors: Record<string, string | undefined>;
    processing: boolean;
    values: UserFormState;
    onChange: <K extends keyof UserFormState>(field: K, value: UserFormState[K]) => void;
    onSubmit: () => void;
    submitLabel: string;
    isEdit?: boolean;
    currentAvatar?: string | null;
    flash?: {
        success?: string;
        error?: string;
    };
}

export function UserForm({
    roles,
    errors,
    processing,
    values,
    onChange,
    onSubmit,
    submitLabel,
    isEdit = false,
    currentAvatar,
    flash,
}: UserFormProps) {
    const [preview, setPreview] = useState<string | null>(currentAvatar ?? null);

    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success);
        }

        if (flash?.error) {
            toast.error(flash.error);
        }
    }, [flash]);

    useEffect(() => {
        return () => {
            if (preview && preview !== currentAvatar) {
                URL.revokeObjectURL(preview);
            }
        };
    }, [preview, currentAvatar]);

    const initials = useMemo(() => {
        if (!values.name) {
            return 'USR';
        }

        const parts = values.name.trim().split(' ');
        const letters = parts.slice(0, 2).map((part) => part.charAt(0).toUpperCase());

        return letters.join('') || 'USR';
    }, [values.name]);

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        onSubmit();
    };

    return (
        <Card className="border-muted-foreground/20">
            <CardHeader>
                <CardTitle>{isEdit ? 'Perbarui Data Pengguna' : 'Data Pengguna'}</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center">
                        <Avatar className="h-20 w-20">
                            <AvatarImage src={preview ?? undefined} alt={values.name} />
                            <AvatarFallback>{initials}</AvatarFallback>
                        </Avatar>
                        <div className="w-full space-y-2 md:w-72">
                            <Label htmlFor="avatar">Avatar</Label>
                            <Input
                                id="avatar"
                                type="file"
                                accept="image/*"
                                onChange={(event) => {
                                    const file = event.target.files?.[0] ?? null;
                                    onChange('avatar', file);

                                    if (file) {
                                        const url = URL.createObjectURL(file);
                                        setPreview((previous) => {
                                            if (previous && previous !== currentAvatar) {
                                                URL.revokeObjectURL(previous);
                                            }

                                            return url;
                                        });
                                    } else {
                                        setPreview(currentAvatar ?? null);
                                    }

                                    event.target.value = '';
                                }}
                            />
                            <p className="text-xs text-muted-foreground">
                                Format JPG, PNG, maksimal 2 MB.
                            </p>
                            {errors.avatar ? (
                                <p className="text-sm text-destructive">{errors.avatar}</p>
                            ) : null}
                        </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="name">Nama Lengkap</Label>
                            <Input
                                id="name"
                                value={values.name}
                                onChange={(event) => onChange('name', event.target.value)}
                                placeholder="Nama pengguna"
                            />
                            {errors.name ? (
                                <p className="text-sm text-destructive">{errors.name}</p>
                            ) : null}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                value={values.email}
                                onChange={(event) => onChange('email', event.target.value)}
                                placeholder="email@contoh.com"
                            />
                            {errors.email ? (
                                <p className="text-sm text-destructive">{errors.email}</p>
                            ) : null}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="phone">Nomor Telepon</Label>
                            <Input
                                id="phone"
                                value={values.phone ?? ''}
                                onChange={(event) => onChange('phone', event.target.value)}
                                placeholder="08xxxxxxxxxx"
                            />
                            {errors.phone ? (
                                <p className="text-sm text-destructive">{errors.phone}</p>
                            ) : null}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="role">Peran</Label>
                            <Select
                                value={values.role && values.role.length > 0 ? values.role : 'none'}
                                onValueChange={(value) => onChange('role', value === 'none' ? '' : value)}
                            >
                                <SelectTrigger id="role">
                                    <SelectValue placeholder="Pilih peran" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="none">Tidak ada</SelectItem>
                                    {roles.map((role) => (
                                        <SelectItem key={role} value={role}>
                                            {role.charAt(0).toUpperCase() + role.slice(1)}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.role ? (
                                <p className="text-sm text-destructive">{errors.role}</p>
                            ) : null}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="address">Alamat</Label>
                        <Input
                            id="address"
                            value={values.address ?? ''}
                            onChange={(event) => onChange('address', event.target.value)}
                            placeholder="Alamat lengkap (opsional)"
                        />
                        {errors.address ? (
                            <p className="text-sm text-destructive">{errors.address}</p>
                        ) : null}
                    </div>

                    <div className="space-y-2">
                        <Label>Status</Label>
                        <div className="flex items-center gap-4">
                            {[{ value: '1', label: 'Aktif' }, { value: '0', label: 'Nonaktif' }].map((item) => (
                                <label
                                    key={item.value}
                                    className={cn(
                                        'flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm',
                                        values.status === item.value
                                            ? 'border-primary bg-primary/10'
                                            : 'border-muted-foreground/20 bg-muted/20',
                                    )}
                                >
                                    <input
                                        type="radio"
                                        name="status"
                                        value={item.value}
                                        checked={values.status === item.value}
                                        onChange={(event) => onChange('status', event.target.value)}
                                        className="h-4 w-4"
                                    />
                                    {item.label}
                                </label>
                            ))}
                        </div>
                        {errors.status ? (
                            <p className="text-sm text-destructive">{errors.status}</p>
                        ) : null}
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="password">
                                Kata Sandi {isEdit ? '(opsional)' : ''}
                            </Label>
                            <Input
                                id="password"
                                type="password"
                                value={values.password ?? ''}
                                onChange={(event) => onChange('password', event.target.value)}
                                placeholder={isEdit ? 'Biarkan kosong jika tidak diganti' : 'Minimal 8 karakter'}
                            />
                            {errors.password ? (
                                <p className="text-sm text-destructive">{errors.password}</p>
                            ) : null}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password_confirmation">Konfirmasi Kata Sandi</Label>
                            <Input
                                id="password_confirmation"
                                type="password"
                                value={values.password_confirmation ?? ''}
                                onChange={(event) =>
                                    onChange('password_confirmation', event.target.value)
                                }
                                placeholder="Ulangi kata sandi"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-2">
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Menyimpan...' : submitLabel}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
