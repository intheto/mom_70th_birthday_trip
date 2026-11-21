import 'server-only';

import { database } from '@/lib/supabase/server';
import { familyItems, isCheckItem, isCommentTopic, personalItems, sharedItems } from './catalog';
import type { PreparationSnapshot } from './types';

// memberId는 클라이언트 입력이 아니라 상위 앱에서 검증한 로그인 세션에서 받는다.
async function getActor(memberId: string) {
  const { data, error } = await database().from('family_members')
    .select('id, name, family_id, families!inner(label)').eq('id', memberId).single();
  if (error) throw error;
  return data;
}

export async function getPreparation(memberId: string): Promise<PreparationSnapshot> {
  const actor = await getActor(memberId);
  const db = database();
  const [shared, family, personal, comments] = await Promise.all([
    db.from('preparation_shared_checks').select('item_id, completed'),
    db.from('preparation_family_checks').select('item_id, completed').eq('family_id', actor.family_id),
    db.from('preparation_personal_checks').select('item_id, completed').eq('member_id', actor.id),
    db.from('preparation_comments').select('id, topic, body, created_at, family_members!inner(name)')
      .order('created_at').order('id'),
  ]);
  for (const result of [shared, family, personal, comments]) if (result.error) throw result.error;
  const states = (rows: { item_id: string; completed: boolean }[] | null) =>
    Object.fromEntries((rows ?? []).map(row => [row.item_id, row.completed]));
  return {
    canEditShared: actor.name === '김영욱', familyLabel: actor.families.label,
    shared: states(shared.data), family: states(family.data), personal: states(personal.data),
    comments: (comments.data ?? []).map(row => ({
      id: row.id, topic: row.topic, body: row.body, author: row.family_members.name, createdAt: row.created_at,
    })),
  };
}

export async function setPreparationCheck(memberId: string, scope: string, itemId: string, completed: boolean) {
  if (!isCheckItem(scope, itemId) || typeof completed !== 'boolean') throw new Error('올바른 준비 항목이 아닙니다.');
  const actor = await getActor(memberId);
  const db = database();
  const value = { item_id: itemId, completed, updated_at: new Date().toISOString() };
  if (scope === 'shared') {
    if (actor.name !== '김영욱') throw new Error('공동 준비는 김영욱 님만 변경할 수 있어요.');
    const { error } = await db.from('preparation_shared_checks').upsert(value, { onConflict: 'item_id' });
    if (error) throw error;
  } else if (scope === 'family') {
    const { error } = await db.from('preparation_family_checks')
      .upsert({ ...value, family_id: actor.family_id }, { onConflict: 'family_id,item_id' });
    if (error) throw error;
  } else {
    const { error } = await db.from('preparation_personal_checks')
      .upsert({ ...value, member_id: actor.id }, { onConflict: 'member_id,item_id' });
    if (error) throw error;
  }
}

export async function addPreparationComment(memberId: string, topic: string, body: string) {
  if (!isCommentTopic(topic) || !body.trim() || body.trim().length > 2000) throw new Error('의견을 1~2,000자 사이로 입력해 주세요.');
  await getActor(memberId);
  const { error } = await database().from('preparation_comments').insert({ member_id: memberId, topic, body: body.trim() });
  if (error) throw error;
}

// 홈에서도 같은 저장 상태를 사용한다. false 또는 아직 저장되지 않은 항목은 미완료다.
export async function getPreparationProgress() {
  const db = database();
  const [shared, family, personal, families, members] = await Promise.all([
    db.from('preparation_shared_checks').select('item_id', { count: 'exact', head: true }).eq('completed', true),
    db.from('preparation_family_checks').select('item_id', { count: 'exact', head: true }).eq('completed', true),
    db.from('preparation_personal_checks').select('item_id', { count: 'exact', head: true }).eq('completed', true),
    db.from('families').select('id', { count: 'exact', head: true }),
    db.from('family_members').select('id', { count: 'exact', head: true }),
  ]);
  for (const result of [shared, family, personal, families, members]) if (result.error) throw result.error;
  return {
    shared: { completed: shared.count ?? 0, total: sharedItems.length },
    family: { completed: family.count ?? 0, total: familyItems.length * (families.count ?? 0) },
    personal: { completed: personal.count ?? 0, total: personalItems.length * (members.count ?? 0) },
  };
}
