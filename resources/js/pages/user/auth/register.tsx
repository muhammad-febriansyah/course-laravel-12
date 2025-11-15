import { Link, useForm } from '@inertiajs/react';
import { FormEventHandler, useRef, useState } from 'react';
import { Head } from '@inertiajs/react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import AuthLayout from '@/layouts/auth-layout';
import { Eye, EyeOff } from 'lucide-react';
import ReCAPTCHA from 'react-google-recaptcha';

export default function UserRegister() {
  const { data, setData, post, processing, errors, reset } = useForm({
    name: '',
    email: '',
    phone: '',
    address: '',
    password: '',
    password_confirmation: '',
    role: 'student',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const recaptchaRef = useRef<ReCAPTCHA>(null);
  const recaptchaSiteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY || '';

  const submit: FormEventHandler = (e) => {
    e.preventDefault();

    post(route('user.register.store'), {
      onFinish: () => reset('password', 'password_confirmation'),
    });
  };

  return (
    <AuthLayout title="Daftar Pengguna" description="Buat akun student untuk mulai belajar">
      <Head title="User Register" />
      <form onSubmit={submit} className="flex flex-col gap-6">
        <div className="grid gap-6">
          <div className="grid gap-2">
            <Label htmlFor="name">Nama</Label>
            <Input
              id="name"
              type="text"
              required
              autoFocus
              autoComplete="name"
              name="name"
              value={data.name}
              onChange={(e) => setData('name', e.target.value)}
              placeholder="Nama lengkap"
            />
            <InputError message={errors.name} className="mt-2" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              required
              autoComplete="email"
              name="email"
              value={data.email}
              onChange={(e) => setData('email', e.target.value)}
              placeholder="email@contoh.com"
            />
            <InputError message={errors.email} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="phone">Nomor Telepon</Label>
            <Input
              id="phone"
              type="tel"
              required
              autoComplete="tel"
              name="phone"
              value={data.phone}
              onChange={(e) => setData('phone', e.target.value)}
              placeholder="08123456789"
            />
            <InputError message={errors.phone} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="address">Alamat</Label>
            <Input
              id="address"
              type="text"
              required
              autoComplete="street-address"
              name="address"
              value={data.address}
              onChange={(e) => setData('address', e.target.value)}
              placeholder="Jl. Contoh No. 123"
            />
            <InputError message={errors.address} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                required
                autoComplete="new-password"
                name="password"
                value={data.password}
                onChange={(e) => setData('password', e.target.value)}
                placeholder="Minimal 8 karakter"
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            <InputError message={errors.password} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password_confirmation">Konfirmasi Password</Label>
            <div className="relative">
              <Input
                id="password_confirmation"
                type={showConfirmPassword ? 'text' : 'password'}
                required
                autoComplete="new-password"
                name="password_confirmation"
                value={data.password_confirmation}
                onChange={(e) => setData('password_confirmation', e.target.value)}
                placeholder="Ulangi password"
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                tabIndex={-1}
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            <InputError message={errors.password_confirmation} />
          </div>

          {recaptchaSiteKey && (
            <div className="flex justify-center">
              <ReCAPTCHA
                ref={recaptchaRef}
                sitekey={recaptchaSiteKey}
                onChange={(token: string | null) => {
                  const input = document.createElement('input');
                  input.type = 'hidden';
                  input.name = 'g-recaptcha-response';
                  input.value = token || '';
                  const existingInput = document.querySelector(
                    'input[name="g-recaptcha-response"]',
                  );
                  if (existingInput) {
                    existingInput.remove();
                  }
                  document.querySelector('form')?.appendChild(input);
                }}
              />
            </div>
          )}
          <InputError
            message={
              (errors as Record<string, string>)['g-recaptcha-response']
            }
          />

          <Button
            type="submit"
            className="mt-2 w-full text-white"
            disabled={processing}
            style={{
              backgroundColor: '#2547F9',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#1e3fd4';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#2547F9';
            }}
          >
            {processing && <Spinner />}
            Buat Akun
          </Button>
        </div>
        <div className="text-center text-sm text-muted-foreground">
          Sudah punya akun?{' '}
          <Link
            href="/masuk"
            style={{ color: '#2547F9' }}
            className="underline-offset-4 hover:underline"
          >
            Masuk
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
}
