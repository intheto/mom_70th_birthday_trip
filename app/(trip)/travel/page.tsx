import { informationCards } from './information';

export default function TravelPage() {
  return (
    <div className="flex flex-col gap-6">
      {informationCards.toReversed().map(({ id, Component, information }) => information.length === 1
        ? <div key={id} id={`news-${information[0].id}`} data-news-id={information[0].id} data-news-kind="travel"><Component /></div>
        : <Component key={id} />)}
    </div>
  );
}
