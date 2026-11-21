import { createClient } from '@supabase/supabase-js';
import { hashFamilyPin } from '../features/family-login/credentials';

const groups = [
  { slug: 'mother', label: '사랑하는 우리 어머니', env: 'FAMILY_MOTHER_PIN', members: ['이정희'] },
  { slug: 'son', label: '아들래미 가족', env: 'FAMILY_SON_PIN', members: ['김영욱', '류낭', '김재이', '김태이', '김채이'] },
  { slug: 'daughter', label: '딸래미 가족', env: 'FAMILY_DAUGHTER_PIN', members: ['김고은', '강병용', '강한성', '강한결'] },
];

async function main() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY;
  if (!url || !key) throw new Error('비공개 서버 연결 설정이 필요합니다.');
  for (const group of groups) {
    if (!/^[0-9]{4}$/.test(process.env[group.env] ?? '')) throw new Error(`${group.env}: 네 자리 문자열이 필요합니다.`);
  }
  const db = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
  for (const [index, group] of groups.entries()) {
    const { data: family, error } = await db.from('families').upsert({
      slug: group.slug, label: group.label, sort_order: index,
      pin_hash: await hashFamilyPin(process.env[group.env]!),
    }, { onConflict: 'slug' }).select('id').single();
    if (error) throw error;
    const { error: memberError } = await db.from('family_members').upsert(
      group.members.map((name, sort_order) => ({ family_id: family.id, name, sort_order })),
      { onConflict: 'name' },
    );
    if (memberError) throw memberError;
    console.log(`${group.label}: 구성원 ${group.members.length}명과 암호 해시 저장 완료`);
  }
}

main().catch(() => { console.error('가족 정보 저장에 실패했습니다. 연결 설정과 DB 마이그레이션을 확인해 주세요.'); process.exitCode = 1; });
