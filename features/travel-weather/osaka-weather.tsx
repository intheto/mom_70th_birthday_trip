'use client';

import { useEffect, useState } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  CloudFogIcon, CloudIcon, CloudLightningIcon, CloudRainIcon, CloudSnowIcon,
  Moon02Icon, MoonCloudIcon,
  ReloadIcon, Sun03Icon, SunCloud01Icon,
} from '@hugeicons/core-free-icons';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  Card, CardAction, CardContent, CardFooter, CardHeader, CardTitle,
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
    <section aria-labelledby="osaka-weather-title">
      <Card size="sm" className="gap-2">
        <CardHeader>
          <CardTitle><h2 id="osaka-weather-title" className="text-xs text-muted-foreground">오사카 현재 날씨</h2></CardTitle>
          <CardAction>
            <Button variant="ghost" size="icon-xs" aria-label="날씨 새로고침" disabled={loading} onClick={() => {
              setLoading(true);
              setRefresh(value => value + 1);
            }}>
              <HugeiconsIcon icon={ReloadIcon} className={cn(loading && 'animate-spin motion-reduce:animate-none')} aria-hidden="true" />
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          {weather && appearance ? (
            <div className="flex flex-wrap items-center gap-2">
              <HugeiconsIcon icon={appearance.icon} size={24} className="text-primary" aria-hidden="true" />
              <strong className="text-2xl font-semibold tracking-tight tabular-nums">{Math.round(weather.temperature)}°C</strong>
              <span className="text-sm">{appearance.label}</span>
            </div>
          ) : loading ? (
            <div role="status">
              <span className="sr-only">오사카 날씨를 불러오는 중이에요.</span>
              <Skeleton className="h-8 w-40" />
            </div>
          ) : null}
          {error && (
            <Alert className={cn(weather && 'mt-2')}>
              <AlertTitle>{weather ? '이전 날씨 정보예요' : '날씨를 불러올 수 없어요'}</AlertTitle>
              <AlertDescription>{weather ? '기준 시각을 확인하고 새로고침해 주세요.' : '연결을 확인하고 새로고침해 주세요.'}</AlertDescription>
            </Alert>
          )}
        </CardContent>
        <CardFooter className="flex-wrap justify-between gap-2 border-0 pt-0">
          <p role="status" className="text-muted-foreground">{loading ? '불러오는 중…' : date && weather ? <time dateTime={`${weather.time}+09:00`} title="일본 현지 시각 · 15분마다 자동 갱신">{timeFormatter.format(date)} 기준</time> : '연결을 기다리고 있어요'}</p>
          <a href="https://open-meteo.com/" target="_blank" rel="noreferrer" aria-label="날씨 제공 Open-Meteo" className="text-muted-foreground underline underline-offset-4 hover:text-foreground">Open-Meteo ↗</a>
        </CardFooter>
      </Card>
    </section>
  );
}
