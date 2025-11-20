import { UserForm, type UserFormState } from '@/components/admin/users/user-form';
import AppLayout from '@/layouts/app-layout';
import type { ManagedUser } from '@/types/user';
import { Head, useForm, usePage } from '@inertiajs/react';

interface EditUserPageProps {
    user: ManagedUser;
    roles: string[];
}

export default function EditUserPage({ user, roles }: EditUserPageProps) {
    const { data, setData, put, processing, errors } = useForm<UserFormState>({
        name: user.name,
        email: user.email,
        phone: user.phone ?? '',
        address: user.address ?? '',
        role: user.role ?? '',
        status: String(user.status ?? 0),
        password: '',
        password_confirmation: '',
        avatar: null,
    });

    const { flash } = usePage<{ flash?: { success?: string; error?: string } }>().props;

    const handleChange = <K extends keyof UserFormState>(field: K, value: UserFormState[K]) => {
        setData(field, value);
    };

    const handleSubmit = () => {
        put(`/admin/users/${user.id}`, { forceFormData: true });
    };

    const breadcrumbs = [
        { title: 'Pengguna', href: '/admin/users' },
        { title: user.name, href: `/admin/users/${user.id}` },
        { title: 'Edit', href: `/admin/users/${user.id}/edit` },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit ${user.name}`} />
            <div className="flex flex-1 flex-col gap-6 p-6">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">Edit Pengguna</h1>
                    <p className="text-sm text-muted-foreground">
                        Perbarui informasi pengguna dan pengaturan akses.
                    </p>
                </div>

                <UserForm
                    roles={roles}
                    errors={errors}
                    processing={processing}
                    values={data}
                    onChange={handleChange}
                    onSubmit={handleSubmit}
                    submitLabel="Perbarui Pengguna"
                    isEdit
                    currentAvatar={user.avatar ?? null}
                    flash={flash}
                />
            </div>
        </AppLayout>
    );
}
