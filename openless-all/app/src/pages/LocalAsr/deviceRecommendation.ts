import type { LocalAsrDeviceProfile, SherpaOnnxModelAlias } from '../../lib/localAsr';

export type LocalModelFit = 'recommended' | 'good' | 'demanding';

export interface LocalModelRecommendation {
  fit: LocalModelFit;
  rank: number;
  reasonKey: string;
}

export function formatDeviceMemory(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes <= 0) return '';
  const gib = bytes / 1024 ** 3;
  return `${gib >= 10 ? Math.round(gib) : gib.toFixed(1)} GB`;
}

export function recommendationForModel(
  model: SherpaOnnxModelAlias,
  profile: LocalAsrDeviceProfile | null,
): LocalModelRecommendation {
  if (!profile) {
    return { fit: 'good', rank: 2, reasonKey: 'localAsr.deviceReasonDetecting' };
  }

  const architecture = profile.architecture.toLowerCase();
  const appleSilicon = architecture === 'aarch64' || architecture === 'arm64';
  const intel = architecture.includes('x86_64') || architecture === 'amd64';
  const memoryGb = profile.memoryBytes > 0 ? profile.memoryBytes / 1024 ** 3 : 0;
  const lowMemory = memoryGb > 0 && memoryGb < 12;
  const roomyMemory = memoryGb === 0 || memoryGb >= 16;

  switch (model) {
    case 'sense-voice-small-zh':
      return {
        fit: 'recommended',
        rank: 0,
        reasonKey: intel
          ? 'localAsr.deviceReasonIntelChinese'
          : lowMemory
            ? 'localAsr.deviceReasonLowMemory'
            : 'localAsr.deviceReasonBalancedChinese',
      };
    case 'paraformer-zh':
      return {
        fit: 'good',
        rank: 1,
        reasonKey: lowMemory
          ? 'localAsr.deviceReasonLowMemory'
          : 'localAsr.deviceReasonChineseLight',
      };
    case 'whisper-small-multi':
      return {
        fit: 'good',
        rank: 2,
        reasonKey: 'localAsr.deviceReasonMultilingual',
      };
    case 'zipformer-bilingual-zh-en-streaming':
      return {
        fit: 'good',
        rank: 3,
        reasonKey: 'localAsr.deviceReasonStreaming',
      };
    case 'whisper-large-v3-multi':
      return {
        fit: intel || !roomyMemory ? 'demanding' : 'good',
        rank: intel || !roomyMemory ? 8 : 4,
        reasonKey:
          intel || !roomyMemory
            ? 'localAsr.deviceReasonHeavyForDevice'
            : 'localAsr.deviceReasonPowerful',
      };
    case 'qwen3-asr-0.6b-int8':
      return {
        fit: appleSilicon && roomyMemory ? 'good' : 'demanding',
        rank: appleSilicon && roomyMemory ? 4 : 9,
        reasonKey:
          appleSilicon && roomyMemory
            ? 'localAsr.deviceReasonAppSiliconLongContext'
            : 'localAsr.deviceReasonHeavyForDevice',
      };
  }
}
