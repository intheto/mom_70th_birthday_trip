'use client';
import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Alert } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import type { ReadReceipt } from './types';

export function NewsReadTracker({ save }: { save: (rows: ReadReceipt[]) => Promise<{ error: string }> }) {
  const pathname = usePathname();
  const saveRef = useRef(save);
  useEffect(() => { saveRef.current = save; }, [save]);
  const [error, setError] = useState('');
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    if (pathname !== '/guestbook' && pathname !== '/preparation' && pathname !== '/travel') return;
    let disposed = false;
    const recorded = new Set<string>();
    const inflight = new Set<string>();
    const root = document.getElementById('trip-content');
    const observer = new IntersectionObserver(entries => {
      const rows: ReadReceipt[] = [];
      for (const entry of entries) {
        const element = entry.target as HTMLElement;
        const id = element.dataset.newsId;
        const kind = element.dataset.newsKind;
        if (!id || (kind !== 'guestbook' && kind !== 'opinion' && kind !== 'travel') || !entry.isIntersecting || entry.intersectionRect.height < Math.min(80, entry.boundingClientRect.height * .5)) continue;
        const key = `${kind}:${id}`;
        if (recorded.has(key) || inflight.has(key)) continue;
        inflight.add(key); rows.push({ id, kind });
      }
      if (!rows.length) return;
      void saveRef.current(rows).then(result => {
        if (disposed) return;
        rows.forEach(row => { inflight.delete(`${row.kind}:${row.id}`); if (!result.error) recorded.add(`${row.kind}:${row.id}`); });
        if (result.error) setError(result.error);
      }).catch(() => { if (!disposed) setError('읽음 기록을 저장하지 못했어요. 다시 시도해 주세요.'); });
    }, { root, threshold: [0, .1, .25, .5, 1] });
    let scrolled = false;
    const observe = () => {
      document.querySelectorAll('[data-news-id]').forEach(el => observer.observe(el));
      const target = location.hash && document.getElementById(decodeURIComponent(location.hash.slice(1)));
      if (!scrolled && target && target.getBoundingClientRect().height) { scrolled = true; target.scrollIntoView({ block: 'center' }); }
    };
    const changes = new MutationObserver(observe);
    if (root) changes.observe(root, { childList: true, subtree: true, attributes: true, attributeFilter: ['hidden', 'data-open'] });
    observe();
    return () => { disposed = true; observer.disconnect(); changes.disconnect(); };
  }, [pathname, attempt]);
  return error ? <Alert role="alert" className="mb-4"><p>{error}</p><Button variant="outline" size="sm" onClick={() => { setError(''); setAttempt(value => value + 1); }}>읽음 저장 다시 시도</Button></Alert> : null;
}
