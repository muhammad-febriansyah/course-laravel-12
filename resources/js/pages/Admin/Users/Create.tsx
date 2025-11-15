import { UserForm, type UserFormState } from '@/components/admin/users/user-form';
import AppLayout from '@/layouts/app-layout';
import { Head, useForm, usePage } from '@inertiajs/react';

interface CreateUserPageProps {
    roles: string[];
}

const breadcrumbs = [
    { title: 'Pengguna', href: '/users' },
    { title: 'Tambah Pengguna', href: '/users/create' },
];

export default function CreateUserPage({ roles }: CreateUserPageProps) {
    const { data, setData, post, processing, errors } = useForm<UserFormState>({
        name: '',
        email: '',
        phone: '',
        address: '',
        role: '',
        status: '1',
        password: '',
        password_confirmation: '',
        avatar: null,
    });

    const { flash } = usePage<{ flash?: { success?: string; error?: string } }>().props;

    const handleChange = <K extends keyof UserFormState>(field: K, value: UserFormState[K]) => {
        setData(field, value);
    };

    const handleSubmit = () => {
        post('/users', { forceFormData: true });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tambah Pengguna" />
            <div className="flex flex-1 flex-col gap-6 p-6">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">Tambah Pengguna</h1>
                    <p className="text-sm text-muted-foreground">
                        Isi data pengguna baru untuk memberikan akses ke platform.
                    </p>
                </div>

                <UserForm
                    roles={roles}
                    errors={errors}
                    processing={processing}
                    values={data}
                    onChange={handleChange}
                    onSubmit={handleSubmit}
                    submitLabel="Simpan Pengguna"
                    currentAvatar={null}
                    flash={flash}
                />
            </div>
        </AppLayout>
    );
}
