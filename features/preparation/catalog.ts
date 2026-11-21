export const sharedItems = [
  { id: 'flight', title: '항공편 예약', emoji: '✈️', description: '출발·도착 시간과 가족 좌석을 확인해요', topics: [{ id: 'flight', title: '의견 남기기' }] },
  { id: 'hotel', title: '숙소 예약', emoji: '🏨', description: '위치와 객실 구성을 함께 살펴봐요', topics: [{ id: 'hotel', title: '의견 남기기' }] },
  { id: 'schedule', title: '일정 정하기', emoji: '🗓️', description: '가고 싶은 곳과 먹고 싶은 음식을 함께 골라요', topics: [{ id: 'places', title: '📍 가고 싶은 장소' }, { id: 'food', title: '🍽️ 먹고 싶은 음식' }] },
  { id: 'osaka-pass', title: '오사카 주유 패스 준비', emoji: '🎟️', topics: [{ id: 'osaka-pass', title: '의견 남기기' }] },
] as const;
export const familyItems = [
  { id: 'medicine', title: '상비약 챙기기', emoji: '💊' },
  { id: 'payment', title: '결제 수단 준비', emoji: '💳' },
] as const;
export const personalItems = [
  { id: 'passport', title: '여권 만들기', emoji: '🛂' },
  { id: 'phone', title: '핸드폰 통신 준비', emoji: '📱' },
] as const;
export type CheckScope = 'shared' | 'family' | 'personal';
export const itemCatalog = { shared: sharedItems, family: familyItems, personal: personalItems };
export function isCheckItem(scope: string, itemId: string): scope is CheckScope {
  return Object.hasOwn(itemCatalog, scope) && itemCatalog[scope as CheckScope].some(item => item.id === itemId);
}
export function isCommentTopic(topic: string) {
  return sharedItems.some(item => item.topics.some(candidate => candidate.id === topic));
}
