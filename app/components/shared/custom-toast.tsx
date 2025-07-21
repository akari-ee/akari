import { CircleCheckIcon, CircleXIcon } from "lucide-react";

interface CToastProps {
  title?: string;
  description?: string;
}

export function CToastSuccess({ title, description }: CToastProps) {
  return (
    <div className="bg-background text-foreground w-fit rounded-full border px-3 py-3 shadow-lg">
      <div className="flex flex-col gap-2">
        <div className="flex grow gap-1 items-center">
          <CircleCheckIcon
            className="shrink-0 text-white fill-[#37b24d]"
            size={28}
            aria-hidden="true"
          />
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
export function CToastError({ title, description }: CToastProps) {
  return (
    <div className="bg-background text-foreground w-fit rounded-full border px-4 py-3 shadow-lg">
      <div className="flex flex-col gap-2">
        <div className="flex grow gap-3 items-center">
          <CircleXIcon
            className="shrink-0 text-rose-500"
            size={16}
            strokeWidth={3}
            aria-hidden="true"
          />
          {title && (
            <div className="flex grow justify-between gap-12">
              <p className="text-sm font-bold">{title}</p>
            </div>
          )}
        </div>
        {description && <div className="text-sm">{description}</div>}
      </div>
    </div>
  );
}
