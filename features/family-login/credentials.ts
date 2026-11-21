import { randomBytes, scrypt, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';

const deriveKey = promisify(scrypt);

export async function hashFamilyPin(pin: string) {
  if (!/^[0-9]{4}$/.test(pin)) throw new Error('가족 암호는 숫자 네 자리여야 합니다.');
  const salt = randomBytes(16).toString('hex');
  const key = await deriveKey(pin, salt, 64) as Buffer;
  return `scrypt:${salt}:${key.toString('hex')}`;
}

export async function verifyFamilyPin(pin: string, stored: string) {
  if (!/^[0-9]{4}$/.test(pin)) return false;
  const [algorithm, salt, hash] = stored.split(':');
  if (algorithm !== 'scrypt' || !salt || !/^[a-f0-9]{128}$/.test(hash ?? '')) return false;
  const key = await deriveKey(pin, salt, 64) as Buffer;
  return timingSafeEqual(key, Buffer.from(hash, 'hex'));
}
