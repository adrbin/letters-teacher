import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

type Props = {
  icon: LucideIcon;
  children: ReactNode;
  className?: string;
  iconClassName?: string;
};

export function IconLabel({ icon: Icon, children, className = "", iconClassName = "h-6 w-6" }: Props) {
  return (
    <span className={`inline-flex items-center justify-center gap-2 ${className}`}>
      <Icon aria-hidden="true" focusable="false" className={iconClassName} />
      <span>{children}</span>
    </span>
  );
}
