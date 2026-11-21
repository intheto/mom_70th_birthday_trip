export const WEATHER_REFRESH_INTERVAL = 15 * 60 * 1000;

export type OsakaWeatherData = {
  time: string;
  temperature: number;
  code: number;
  isDay: boolean;
};

// Open-Meteo의 current는 15분 간격의 기상 모델 데이터다.
// https://open-meteo.com/en/docs
export async function fetchOsakaWeather(signal: AbortSignal): Promise<OsakaWeatherData> {
  const params = new URLSearchParams({
    latitude: '34.6937',
    longitude: '135.5023',
    current: 'temperature_2m,weather_code,is_day',
    timezone: 'Asia/Tokyo',
    forecast_days: '1',
  });
  const response = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`, {
    signal: AbortSignal.any([signal, AbortSignal.timeout(15_000)]),
    cache: 'no-store',
  });
  if (!response.ok) throw new Error('날씨 정보를 불러오지 못했어요.');

  const { current } = await response.json();
  const values = [
    current?.temperature_2m,
    current?.weather_code, current?.is_day,
  ];
  if (!values.every(value => typeof value === 'number' && Number.isFinite(value)) ||
      typeof current?.time !== 'string' ||
      !Number.isFinite(Date.parse(`${current.time}+09:00`))) {
    throw new Error('날씨 정보가 아직 준비되지 않았어요.');
  }

  return {
    time: current.time,
    temperature: current.temperature_2m,
    code: current.weather_code,
    isDay: current.is_day === 1,
  };
}
