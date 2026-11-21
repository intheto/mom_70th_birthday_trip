'use client';

import { useEffect, useState } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  CloudFogIcon, CloudIcon, CloudLightningIcon, CloudRainIcon, CloudSnowIcon,
  HumidityIcon, Location01Icon, Moon02Icon, MoonCloudIcon, RainDropIcon,
  ReloadIcon, Sun03Icon, SunCloud01Icon, WindIcon,
} from '@hugeicons/core-free-icons';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { fetchOsakaWeather, WEATHER_REFRESH_INTERVAL, type OsakaWeatherData } from './weather';

function weatherAppearance(code: number, isDay: boolean) {
  switch (code) {
    case 0: return { label: '맑음', icon: isDay ? Sun03Icon : Moon02Icon };
    case 1: return { label: '대체로 맑음', icon: isDay ? Sun03Icon : Moon02Icon };
    case 2: return { label: '구름 조금', icon: isDay ? SunCloud01Icon : MoonCloudIcon };
    case 3: return { label: '흐림', icon: CloudIcon };
    case 45: case 48: return { label: '안개', icon: CloudFogIcon };
    case 51: case 53: case 55: return { label: '이슬비', icon: CloudRainIcon };
    case 56: case 57: case 66: case 67: return { label: '어는 비', icon: CloudRainIcon };
    case 61: case 63: return { label: '비', icon: CloudRainIcon };
    case 65: return { label: '강한 비', icon: CloudRainIcon };
    case 71: case 73: case 75: case 77: return { label: '눈', icon: CloudSnowIcon };
    case 80: case 81: case 82: return { label: '소나기', icon: CloudRainIcon };
    case 85: case 86: return { label: '눈 소나기', icon: CloudSnowIcon };
    case 95: case 96: case 97: case 99: return { label: '뇌우', icon: CloudLightningIcon };
    default: return { label: '날씨 정보 확인 중', icon: CloudIcon };
  }
}

const dateFormatter = new Intl.DateTimeFormat('ko-KR', {
  timeZone: 'Asia/Tokyo', month: 'long', day: 'numeric', weekday: 'short',
});
const timeFormatter = new Intl.DateTimeFormat('ko-KR', {
  timeZone: 'Asia/Tokyo', hour: '2-digit', minute: '2-digit', hour12: false,
});

export function OsakaWeather() {
  const [weather, setWeather] = useState<OsakaWeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    let inFlight = false;

    async function load() {
      if (inFlight) return;
      inFlight = true;
      try {
        const data = await fetchOsakaWeather(controller.signal);
        if (!controller.signal.aborted) {
          setWeather(data);
          setError(false);
        }
      } catch {
        if (!controller.signal.aborted) setError(true);
      } finally {
        inFlight = false;
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    void load();
    const timer = window.setInterval(() => {
      if (document.visibilityState === 'visible') void load();
    }, WEATHER_REFRESH_INTERVAL);
    const onVisible = () => {
      if (document.visibilityState === 'visible') void load();
    };
    document.addEventListener('visibilitychange', onVisible);
    return () => {
      controller.abort();
      window.clearInterval(timer);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, [refresh]);

  const appearance = weather ? weatherAppearance(weather.code, weather.isDay) : null;
  const date = weather ? new Date(`${weather.time}+09:00`) : null;

  return (
    <section aria-labelledby="osaka-weather-title" className="flex flex-col gap-4">
      <Card>
        <CardHeader>
          <CardTitle><h2 id="osaka-weather-title" className="flex items-center gap-2"><HugeiconsIcon icon={Location01Icon} size={18} aria-hidden="true" />오사카 현재 날씨</h2></CardTitle>
          <CardDescription>{date ? `${dateFormatter.format(date)} · 일본 현지 기준` : '여행지의 지금 날씨를 확인해 보세요.'}</CardDescription>
          <CardAction>
            <Button variant="ghost" size="icon" aria-label="날씨 새로고침" disabled={loading} onClick={() => {
              setLoading(true);
              setRefresh(value => value + 1);
            }}>
              <HugeiconsIcon icon={ReloadIcon} className={cn(loading && 'animate-spin motion-reduce:animate-none')} aria-hidden="true" />
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          {weather && appearance ? (
            <div className="flex flex-col gap-6">
              <div className="relative isolate flex items-center justify-between gap-3 overflow-hidden bg-linear-to-br from-primary/10 via-primary/5 to-background p-5 sm:p-7">
                <div className="flex flex-col gap-2">
                  <Badge variant="outline">{error ? '이전 날씨 정보' : '지금 오사카는'}</Badge>
                  <p className="text-6xl font-semibold tracking-tighter tabular-nums sm:text-7xl">{Math.round(weather.temperature)}<span className="ml-1 align-top text-2xl font-normal tracking-normal">°C</span></p>
                  <p className="text-lg font-medium">{appearance.label}</p>
                  <p className="text-sm text-muted-foreground">체감 {Math.round(weather.feelsLike)}°C</p>
                </div>
                <div aria-hidden="true" className="flex size-24 shrink-0 items-center justify-center rounded-full bg-background/70 text-primary sm:size-32">
                  <HugeiconsIcon icon={appearance.icon} className="size-16 sm:size-20" strokeWidth={1.3} />
                </div>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
                <span className="text-muted-foreground">오늘의 기온</span>
                <p className="flex gap-4"><span>최고 <strong className="font-semibold">{Math.round(weather.high)}°</strong></span><span>최저 <strong className="font-semibold">{Math.round(weather.low)}°</strong></span></p>
              </div>
              <dl className="grid grid-cols-3 gap-2">
                {[
                  { label: '오늘 강수확률', value: `${weather.rainChance}%`, icon: RainDropIcon },
                  { label: '습도', value: `${weather.humidity}%`, icon: HumidityIcon },
                  { label: '바람', value: `${weather.windSpeed.toFixed(1)} m/s`, icon: WindIcon },
                ].map(item => (
                  <div key={item.label} className="flex flex-col items-center gap-2 bg-muted/50 px-1 py-4">
                    <HugeiconsIcon icon={item.icon} size={20} className="text-primary" aria-hidden="true" />
                    <dt className="text-xs text-muted-foreground">{item.label}</dt>
                    <dd className="text-base font-semibold tabular-nums sm:text-lg">{item.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          ) : loading ? (
            <div role="status" className="flex flex-col gap-5">
              <span className="sr-only">오사카 날씨를 불러오는 중이에요.</span>
              <Skeleton className="h-56 w-full" />
              <div className="grid grid-cols-3 gap-2">{[0, 1, 2].map(item => <Skeleton key={item} className="h-28" />)}</div>
            </div>
          ) : null}
          {error && (
            <Alert className={cn(weather && 'mt-4')}>
              <AlertTitle>{weather ? '최신 날씨를 가져오지 못했어요' : '날씨를 잠시 불러올 수 없어요'}</AlertTitle>
              <AlertDescription>{weather ? '마지막으로 받은 정보예요. 기준 시각을 확인하고 새로고침해 주세요.' : '인터넷 연결을 확인한 뒤 위의 새로고침 버튼을 눌러 주세요.'}</AlertDescription>
            </Alert>
          )}
        </CardContent>
        <CardFooter className="flex-wrap justify-between gap-x-4 gap-y-2">
          <p role="status" className="text-muted-foreground">{loading ? '날씨를 불러오는 중…' : date ? `${timeFormatter.format(date)} 기준 · 15분마다 자동 갱신` : '연결을 기다리고 있어요'}</p>
          <a href="https://open-meteo.com/" target="_blank" rel="noreferrer" className="text-muted-foreground underline underline-offset-4 hover:text-foreground">날씨 제공: Open-Meteo</a>
        </CardFooter>
      </Card>
      <p className="px-1 text-xs leading-relaxed text-muted-foreground">현재 날씨는 기상 모델 기반 정보예요. 여행일의 예보와는 다르며, 한국과 일본은 시차가 없어요.</p>
    </section>
  );
}
