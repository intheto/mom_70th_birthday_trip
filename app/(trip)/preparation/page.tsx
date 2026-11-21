import { Empty, EmptyHeader, EmptyTitle, EmptyDescription } from '@/components/ui/empty';

export default function PreparationPage() {
  return <div className="flex flex-col gap-6"><h1 className="text-3xl font-bold">준비하기</h1><Empty><EmptyHeader><EmptyTitle>함께 준비할 내용을 정하고 있어요</EmptyTitle><EmptyDescription>준비 목록과 점검 방법은 가족과 상의한 뒤 열어둘게요.</EmptyDescription></EmptyHeader></Empty></div>;
}
