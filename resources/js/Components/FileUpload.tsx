import { useForm } from '@inertiajs/react';
import type React from 'react';

// Declare global route helper
declare const route: (name: string, params?: any) => string;

type FileableType = 'App\\Models\\Project' | 'App\\Models\\Task';

interface FileUploadProps {
  fileableType: FileableType;
  fileableId: number;
  onUploaded?: () => void; // optional callback after success
}

export default function FileUpload({ fileableType, fileableId, onUploaded }: FileUploadProps) {
  const { data, setData, post, processing, errors, reset } = useForm<{ file: File | null; fileable_type: FileableType; fileable_id: number }>({
    file: null,
    fileable_type: fileableType,
    fileable_id: fileableId,
  });

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    post(route('files.store'), {
      forceFormData: true,
      onSuccess: () => {
        reset('file');
        if (onUploaded) onUploaded();
      },
    });
  };

  return (
    <form onSubmit={submit} className="flex items-center gap-3">
      <input
        type="file"
        accept=".pdf,.doc,.docx,.jpg,.jpeg"
        onChange={(e) => setData('file', e.target.files?.[0] ?? null)}
        className="block w-full text-sm"
      />
      <input type="hidden" name="fileable_type" value={data.fileable_type} />
      <input type="hidden" name="fileable_id" value={data.fileable_id} />
      <button
        type="submit"
        disabled={processing || !data.file}
        className="px-3 py-2 bg-green-600 text-white rounded disabled:opacity-50"
      >
        Subir
      </button>
      {errors.file && <p className="text-sm text-red-600">{errors.file}</p>}
    </form>
  );
}
