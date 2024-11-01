interface StatusBadgeProps {
  type: "warning" | "success";
  text: string;
  icon: React.ReactNode;
}

export const StatusBadge = ({ type, text, icon }: StatusBadgeProps) => {
  const styles = {
    warning: "text-warning bg-warning/10",
    success: "text-success bg-success/10",
  };

  return (
    <div
      className={`flex items-center text-sm px-3 py-1 rounded-full ${styles[type]}`}
    >
      {icon}
      <span className="ml-1">{text}</span>
    </div>
  );
};
