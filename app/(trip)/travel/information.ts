import { OsakaWeather } from '@/features/travel-weather';
import { OsakaNameStory } from '@/features/travel-stories';
import { OsakaLandmarks, landmarkInformation } from '@/features/travel-landmarks';
import { FlightResearchCard, flightResearchInformation } from '@/features/flight-research';
import type { News } from '@/features/news';

// 새 카드는 끝에 추가한다. 발행 ID·시각은 재렌더링이나 날씨 갱신 때 바꾸지 않는다.
export const informationCards = [
  { id: 'weather', Component: OsakaWeather, information: [{ id: 'bccfe4db-9307-59b7-bac1-37fad5bc2476', title: '오사카 현재 날씨', body: '오사카의 현재 기온과 날씨를 확인해 보세요.', createdAt: '2026-11-21T22:07:14+09:00' }] },
  { id: 'osaka-name', Component: OsakaNameStory, information: [{ id: 'b871b746-c706-5cac-a2f7-7f4a1d4986b8', title: '오사카 이름 이야기', body: '오사카 이름에 숨어 있는 언덕과 옛 한자 표기를 알아보세요.', createdAt: '2026-11-21T22:19:21+09:00' }] },
  { id: 'osaka-landmarks', Component: OsakaLandmarks, information: landmarkInformation },
  { id: 'flight-research-2026-11-22', Component: FlightResearchCard, information: [flightResearchInformation] },
];
export const travelNews: News[] = informationCards.flatMap(card => card.information.map(item => ({ ...item, kind: 'travel' as const, author: '여행 정보' })));
