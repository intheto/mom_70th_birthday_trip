import { OsakaWeather } from '@/features/travel-weather';
import { OsakaNameStory } from '@/features/travel-stories';

// 새 정보는 끝에 추가한다. 화면에는 추가 순서의 역순으로 표시한다.
const informationCards = [
  { id: 'weather', Component: OsakaWeather },
  { id: 'osaka-name', Component: OsakaNameStory },
];

export default function TravelPage() {
  return (
    <div className="flex flex-col gap-6">
      {informationCards.toReversed().map(({ id, Component }) => <Component key={id} />)}
    </div>
  );
}
