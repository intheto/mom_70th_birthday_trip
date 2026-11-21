'use client';

import Image from 'next/image';
import { useActionState, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { Field, FieldGroup, FieldSet, FieldLegend, FieldLabel, FieldDescription } from '@/components/ui/field';
import { InputGroup, InputGroupInput, InputGroupAddon, InputGroupButton } from '@/components/ui/input-group';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { cn } from '@/lib/utils';
import styles from './family-login.module.css';
import type { FamilyGroup, LoginState } from './types';

const loginLabels: Record<string, string> = {
  "이정희": "내가 쏜다! 💸",
  "김영욱": "효도는 현지에서! ✈️",
  "류낭": "어머님 충성! 🫡",
  "김재이": "할머니 최고!! ❤️",
  "김태이": "할머니 최고!! ❤️",
  "강한성": "할머니 최고!! ❤️",
  "강한결": "할머니 최고!! ❤️",
  "김고은": "효도는 현지에서! ✈️",
  "강병용": "사위는 공짜죠? 😎",
  "김채이": "할미 쪼아앙! 🥰"
};

function countdown() {
  const parts = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Seoul', year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(new Date());
  const value = (type: string) => Number(parts.find(part => part.type === type)?.value);
  const days = Math.round((Date.UTC(2027, 4, 13) - Date.UTC(value('year'), value('month') - 1, value('day'))) / 86400000);
  return days > 0 ? `D-${days}` : days === 0 ? 'D-Day' : `D+${Math.abs(days)}`;
}

export function FamilyLogin({ families, loginAction, initialError = '' }: {
  families: FamilyGroup[];
  loginAction: (state: LoginState, form: FormData) => Promise<LoginState>;
  initialError?: string;
}) {
  const [name, setName] = useState('');
  const [pin, setPin] = useState('');
  const [visible, setVisible] = useState(false);
  const [day, setDay] = useState('');
  const [state, action, pending] = useActionState(loginAction, { error: '' });

  useEffect(() => {
    const update = () => setDay(countdown());
    update();
    const timer = setInterval(update, 60000);
    window.addEventListener('pageshow', update);
    return () => { clearInterval(timer); window.removeEventListener('pageshow', update); };
  }, []);

  return (
    <main className={styles.page}>
      <div className={styles.layout}>
        <section className={styles.hero} aria-labelledby="trip-title">
          <p className={styles.brand}>♧ 이정희 여사님 칠순 기념 오사카 가족 여행</p>
          <h1 id="trip-title">70년산<br />명품엄마</h1>
          <p className={styles.tagline}>항공권 값은 냈다! 나머진 알지?</p>
          <Image className={styles.mother} src="/images/family-login/premium-mom.png" width={500} height={500} alt="밝게 웃으며 손을 흔드는 파스텔풍 어머니 캐릭터" priority />
          <div className={styles.dates}>
            <Badge className={styles.countdown} variant="secondary"><strong>{day || '출발일'}</strong><span>출발까지</span></Badge>
            <Badge className={styles.schedule} variant="outline">2027. 5. 13 – 5. 16 · 3박 4일</Badge>
          </div>
        </section>
        <div>
          <Card className={styles.card}>
            <CardHeader>
              <CardTitle><h2 className={styles.formTitle}>효도하러 왔니? 🥰</h2></CardTitle>
              <CardDescription className={styles.instruction}>아래의 사용자 정보 선택 후 로그인 하세요</CardDescription>
            </CardHeader>
            <CardContent>
              <form action={action}>
                <input type="hidden" name="name" value={name} />
                <FieldGroup>
                  <FieldSet disabled={pending}>
                    <FieldLegend className={styles.legend}>이름 선택</FieldLegend>
                    <RadioGroup aria-label="본인 이름" value={name} onValueChange={value => { setName(String(value)); setPin(''); }}>
                      {families.map((family, index) => (
                        <div key={family.label} className={styles.family}>
                          <p className={cn(styles.familyLabel, index === 0 && styles.motherLabel)}>{family.label}</p>
                          <div className={cn(styles.members, family.members.length === 1 && styles.single)}>
                            {family.members.map(member => (
                              <FieldLabel key={member} htmlFor={`member-${member}`} className={cn(styles.member, name === member && styles.selected)}>
                                <span>{member}</span><RadioGroupItem id={`member-${member}`} value={member} />
                              </FieldLabel>
                            ))}
                          </div>
                        </div>
                      ))}
                    </RadioGroup>
                  </FieldSet>
                  <Field data-invalid={Boolean(state.error)}>
                    <FieldLabel htmlFor="family-pin" className={styles.legend}>가족 암호</FieldLabel>
                    <InputGroup className={styles.pinGroup}>
                      <InputGroupInput id="family-pin" name="pin" type={visible ? 'text' : 'password'} inputMode="numeric" maxLength={4} pattern="[0-9]{4}" autoComplete="current-password" value={pin} disabled={pending} aria-invalid={Boolean(state.error)} onChange={event => { setPin(event.target.value.replace(/[^0-9]/g, '').slice(0, 4)); }} placeholder="숫자 4자리를 입력해 주세요" aria-describedby="pin-help" required />
                      <InputGroupAddon align="inline-end"><InputGroupButton onClick={() => setVisible(!visible)} aria-label={visible ? '암호 숨기기' : '암호 보기'} aria-pressed={visible}>{visible ? '숨기기' : '보기'}</InputGroupButton></InputGroupAddon>
                    </InputGroup>
                    <FieldDescription id="pin-help">가족에게 전달받은 암호를 입력해 주세요.</FieldDescription>
                    <p className="text-sm font-bold text-foreground">아래 버튼을 눌러주세요.</p>
                  </Field>
                  {!pending && (state.error || initialError) && <Alert variant="destructive"><AlertDescription>{state.error || initialError}</AlertDescription></Alert>}
                  <Button className={styles.submit} type="submit" disabled={pending || !name || pin.length !== 4}>{pending ? '가족 암호 확인 중…' : (loginLabels[name] ?? '엄마! 잘탈게! ✈️')}</Button>
                </FieldGroup>
              </form>
            </CardContent>
          </Card>
          <p className={styles.footer}>우리 가족이 함께 만드는 특별한 여행</p>
        </div>
      </div>
    </main>
  );
}
