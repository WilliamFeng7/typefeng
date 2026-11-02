import type { LocalAsrDeviceProfile } from '../../lib/localAsr';
import { recommendationForModel } from './deviceRecommendation';

function assertEqual<T>(actual: T, expected: T, message: string) {
  if (actual !== expected) throw new Error(`${message}: expected ${expected}, got ${actual}`);
}

const intelMac: LocalAsrDeviceProfile = {
  architecture: 'x86_64',
  physicalCpuCores: 6,
  logicalCpuCores: 12,
  memoryBytes: 16 * 1024 ** 3,
  hardwareModel: 'MacBookPro16,1',
};

assertEqual(
  recommendationForModel('sense-voice-small-zh', intelMac).fit,
  'recommended',
  'Intel Mac should recommend SenseVoice',
);
assertEqual(
  recommendationForModel('whisper-small-multi', intelMac).fit,
  'good',
  'Intel Mac can use balanced Whisper Small',
);
assertEqual(
  recommendationForModel('whisper-large-v3-multi', intelMac).fit,
  'demanding',
  'Intel Mac should flag Whisper Large as demanding',
);
assertEqual(
  recommendationForModel('qwen3-asr-0.6b-int8', intelMac).fit,
  'demanding',
  'Intel Mac should not lead with Sherpa Qwen3',
);

const appleSilicon: LocalAsrDeviceProfile = {
  architecture: 'aarch64',
  physicalCpuCores: 8,
  logicalCpuCores: 8,
  memoryBytes: 16 * 1024 ** 3,
  hardwareModel: 'MacBookPro18,3',
};

assertEqual(
  recommendationForModel('qwen3-asr-0.6b-int8', appleSilicon).fit,
  'good',
  'Apple Silicon with 16 GB can use Qwen3',
);
