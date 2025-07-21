import { CircleCheckIcon, CircleXIcon } from "lucide-react";

export interface CToastProps {
  title?: string;
  description?: string;
  isError?: boolean;
}

export function CToast({ title, description, isError = false }: CToastProps) {
  return (
    <div className="bg-background text-foreground w-fit rounded-full border px-4 py-3 shadow-lg">
      <div className="flex flex-col gap-2">
        <div className="flex grow gap-1 items-center">
          {isError ? (
            <CircleXIcon
              className="shrink-0 text-rose-500"
              size={16}
              strokeWidth={3}
              aria-hidden="true"
            />
          ) : (
            <CircleCheckIcon
              className="shrink-0 text-white fill-[#37b24d]"
              size={28}
              aria-hidden="true"
            />
          )}
          {title && (
            <div className="flex grow justify-between">
              <p className="text-base font-bold">{title}</p>
            </div>
          )}
        </div>
        {description && <div className="text-sm">{description}</div>}
      </div>
    </div>
  );
}
