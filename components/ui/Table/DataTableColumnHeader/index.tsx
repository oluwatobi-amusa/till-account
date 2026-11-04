import { Column } from '@tanstack/react-table';
import { cn } from '@/lib/utils';
import { Button } from '../../button';

interface DataTableColumnHeaderProps<TData, TValue> extends React.HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>;
  title: string;
}

export function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  className
}: DataTableColumnHeaderProps<TData, TValue>) {
  if (!column.getCanSort()) {
    return <div className={cn(className)}>{title}</div>;
  }

  return (
    <div className={cn('flex items-start justify-start text-left', className)}>
      <Button
        variant="transparent"
        size="sm"
        className="-ml-3 h-8 data-[state=open]:bg-accent w-auto px-3 whitespace-nowrap"
      >
        <span className="whitespace-nowrap text-[#303030]">{title}</span>
      </Button>
    </div>
  );
}
