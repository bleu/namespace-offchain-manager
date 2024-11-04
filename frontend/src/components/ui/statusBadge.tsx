import { cva, type VariantProps } from "class-variance-authority";

const statusBadgeVariants = cva(
  "flex items-center text-sm px-3 py-1 rounded-full",
  {
    variants: {
      type: {
        warning: "text-warning bg-warning/10",
        success: "text-success bg-success/10",
      },
    },
    defaultVariants: {
      type: "warning",
    },
  }
)

interface StatusBadgeProps extends VariantProps<typeof statusBadgeVariants> {
  text: string;
  icon: React.ReactNode;
}

export const StatusBadge = ({ type, text, icon }: StatusBadgeProps) => {
  return (
    <div className={statusBadgeVariants({ type })}>
      {icon}
      <span className="ml-1">{text}</span>
    </div>
  );
};

export default StatusBadge;