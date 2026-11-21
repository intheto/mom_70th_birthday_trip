import { Empty, EmptyHeader, EmptyTitle, EmptyDescription } from '@/components/ui/empty';

export default function TravelPage() {
  return <div className="flex flex-col gap-6"><Empty><EmptyHeader><EmptyTitle>오사카 여행 정보를 준비하고 있어요</EmptyTitle><EmptyDescription>가족과 정한 일정과 이동 정보를 이곳에 모을 예정이에요.</EmptyDescription></EmptyHeader></Empty></div>;
}
