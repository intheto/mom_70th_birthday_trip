export const WEATHER_REFRESH_INTERVAL = 15 * 60 * 1000;

export type OsakaWeatherData = {
  time: string;
  temperature: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  code: number;
  isDay: boolean;
  high: number;
  low: number;
  rainChance: number;
};

// Open-Meteo의 current는 15분 간격의 기상 모델 데이터다.
// https://open-meteo.com/en/docs
export async function fetchOsakaWeather(signal: AbortSignal): Promise<OsakaWeatherData> {
  const params = new URLSearchParams({
    latitude: '34.6937',
    longitude: '135.5023',
    current: 'temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,weather_code,is_day',
    daily: 'temperature_2m_max,temperature_2m_min,precipitation_probability_max',
    timezone: 'Asia/Tokyo',
    wind_speed_unit: 'ms',
    forecast_days: '1',
  });
  const response = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`, {
    signal: AbortSignal.any([signal, AbortSignal.timeout(15_000)]),
    cache: 'no-store',
  });
  if (!response.ok) throw new Error('날씨 정보를 불러오지 못했어요.');

  const { current, daily } = await response.json();
  const values = [
    current?.temperature_2m, current?.apparent_temperature,
    current?.relative_humidity_2m, current?.wind_speed_10m,
    current?.weather_code, current?.is_day,
    daily?.temperature_2m_max?.[0], daily?.temperature_2m_min?.[0],
    daily?.precipitation_probability_max?.[0],
  ];
  if (!values.every(value => typeof value === 'number' && Number.isFinite(value)) ||
      typeof current?.time !== 'string' ||
      !Number.isFinite(Date.parse(`${current.time}+09:00`))) {
    throw new Error('날씨 정보가 아직 준비되지 않았어요.');
  }

  return {
    time: current.time,
    temperature: current.temperature_2m,
    feelsLike: current.apparent_temperature,
    humidity: current.relative_humidity_2m,
    windSpeed: current.wind_speed_10m,
    code: current.weather_code,
    isDay: current.is_day === 1,
    high: daily.temperature_2m_max[0],
    low: daily.temperature_2m_min[0],
    rainChance: daily.precipitation_probability_max[0],
  };
}
