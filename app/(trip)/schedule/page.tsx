import { Empty, EmptyHeader, EmptyTitle } from '@/components/ui/empty';

export default function SchedulePage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-bold">여행 스케쥴</h1>
      <Empty>
        <EmptyHeader>
          <EmptyTitle>확정된 일정이 표시될 예정입니다</EmptyTitle>
        </EmptyHeader>
      </Empty>
    </div>
  );
}
