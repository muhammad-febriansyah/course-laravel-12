import { GraduationCap, Users, UserCheck } from 'lucide-react';

interface ProgressSummaryCardProps {
  totalCourses: number;
  totalStudents: number;
  totalInstructors: number;
}

export function ProgressSummaryCard({
  totalCourses,
  totalStudents,
  totalInstructors,
}: ProgressSummaryCardProps) {
  const formatNumber = (value: number) =>
    new Intl.NumberFormat('id-ID').format(value);

  return (
    <div className="rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 p-4 text-white shadow">
      <p className="text-xs/4 opacity-90">Statistik Platform</p>
      <div className="mt-3 grid grid-cols-3 gap-2 text-center">
        <div className="rounded-xl bg-white/10 p-3">
          <GraduationCap className="mx-auto h-4 w-4" />
          <p className="mt-1 text-lg font-semibold">{formatNumber(totalCourses)}</p>
          <p className="text-[10px] opacity-80">Kelas Aktif</p>
        </div>
        <div className="rounded-xl bg-white/10 p-3">
          <Users className="mx-auto h-4 w-4" />
          <p className="mt-1 text-lg font-semibold">{`${formatNumber(totalStudents)}+`}</p>
          <p className="text-[10px] opacity-80">Peserta Belajar</p>
        </div>
        <div className="rounded-xl bg-white/10 p-3">
          <UserCheck className="mx-auto h-4 w-4" />
          <p className="mt-1 text-lg font-semibold">
            {totalInstructors > 0 ? formatNumber(totalInstructors) : 'Tim'}
          </p>
          <p className="text-[10px] opacity-80">Mentor Aktif</p>
        </div>
      </div>
    </div>
  );
}
