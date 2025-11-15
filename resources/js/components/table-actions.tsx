import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';
import { Eye, Pencil, Trash2, Check, X as XIcon } from 'lucide-react';

type CommonProps = {
  className?: string;
};

export function CrudActions({
  detailHref,
  onDetail,
  editHref,
  onEdit,
  onDelete,
  deleteDisabled,
  className,
}: {
  detailHref?: string;
  onDetail?: () => void;
  editHref?: string;
  onEdit?: () => void;
  onDelete?: () => void;
  deleteDisabled?: boolean;
} & CommonProps) {
  return (
    <div className={`flex flex-wrap gap-2 ${className ?? ''}`}>
      {detailHref ? (
        <Button size="sm" asChild className="bg-blue-600 text-white hover:bg-blue-700">
          <Link href={detailHref}>
            <Eye className="h-4 w-4" /> Detail
          </Link>
        </Button>
      ) : onDetail ? (
        <Button size="sm" className="bg-blue-600 text-white hover:bg-blue-700" onClick={onDetail}>
          <Eye className="h-4 w-4" /> Detail
        </Button>
      ) : null}
      {editHref ? (
        <Button size="sm" asChild className="bg-amber-500 text-white hover:bg-amber-600">
          <Link href={editHref}>
            <Pencil className="h-4 w-4" /> Edit
          </Link>
        </Button>
      ) : onEdit ? (
        <Button size="sm" className="bg-amber-500 text-white hover:bg-amber-600" onClick={onEdit}>
          <Pencil className="h-4 w-4" /> Edit
        </Button>
      ) : null}
      {onDelete && (
        <Button variant="destructive" size="sm" onClick={onDelete} disabled={deleteDisabled}>
          <Trash2 className="h-4 w-4" /> Hapus
        </Button>
      )}
    </div>
  );
}

export function ReviewActions({
  onApprove,
  onReject,
  approveDisabled,
  rejectDisabled,
  detailHref,
  className,
}: {
  onApprove?: () => void;
  onReject?: () => void;
  approveDisabled?: boolean;
  rejectDisabled?: boolean;
  detailHref?: string;
} & CommonProps) {
  return (
    <div className={`flex flex-wrap gap-2 ${className ?? ''}`}>
      {onApprove && (
        <Button
          size="sm"
          className="bg-green-600 text-white hover:bg-green-700"
          onClick={onApprove}
          disabled={approveDisabled}
        >
          <Check className="mr-2 h-4 w-4" /> Terima
        </Button>
      )}
      {onReject && (
        <Button variant="destructive" size="sm" onClick={onReject} disabled={rejectDisabled}>
          <XIcon className="mr-2 h-4 w-4" /> Tolak
        </Button>
      )}
      {detailHref && (
        <Button size="sm" asChild className="bg-blue-600 text-white hover:bg-blue-700">
          <Link href={detailHref}>
            <Eye className="h-4 w-4" /> Detail
          </Link>
        </Button>
      )}
    </div>
  );
}
