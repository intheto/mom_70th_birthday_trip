export { OsakaLandmarks } from './osaka-landmarks';

import { landmarks } from './catalog';
export const landmarkInformation = landmarks.map(item => ({
  id: item.newsId, title: item.name, body: item.intro,
  createdAt: '2026-11-22T10:09:50+09:00',
}));
