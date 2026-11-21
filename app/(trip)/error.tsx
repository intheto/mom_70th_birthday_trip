'use client';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

export default function TripError({ reset }: { reset: () => void }) {
  return <Alert><AlertTitle>가족 이야기를 불러오지 못했어요</AlertTitle><AlertDescription>잠시 후 다시 시도해 주세요.</AlertDescription><Button onClick={reset} variant="outline" className="mt-3">다시 불러오기</Button></Alert>;
}
