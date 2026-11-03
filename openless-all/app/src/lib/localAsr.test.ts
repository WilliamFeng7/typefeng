import { de } from '../i18n/de';
import { en } from '../i18n/en';
import { es } from '../i18n/es';
import { fr } from '../i18n/fr';
import { ja } from '../i18n/ja';
import { ko } from '../i18n/ko';
import { zhCN } from '../i18n/zh-CN';
import { zhTW } from '../i18n/zh-TW';
import {
  LOCAL_ASR_KEEP_LOADED_OPTIONS,
  SHERPA_ONNX_ASR_MODELS,
  isLocalAsrModelSupportedOnOs,
} from './localAsr';

function assertEqual(actual: boolean, expected: boolean, name: string) {
  if (actual !== expected) {
    throw new Error(`${name}: expected ${expected}, got ${actual}`);
  }
}

const qwen = { runtime: 'generic', family: 'qwen3' } as const;
const whisper = { runtime: 'generic', family: 'whisper' } as const;
const foundry = { runtime: 'foundry', family: 'whisper' } as const;
const sherpa = { runtime: 'sherpa_onnx', family: 'qwen3_asr' } as const;
for (const os of ['mac', 'win', 'android'] as const) {
  assertEqual(isLocalAsrModelSupportedOnOs(qwen, os), os === 'mac', `generic Qwen on ${os}`);
  assertEqual(isLocalAsrModelSupportedOnOs(whisper, os), os === 'mac', `whisper.cpp on ${os}`);
  assertEqual(isLocalAsrModelSupportedOnOs(foundry, os), os === 'win', `Foundry Whisper on ${os}`);
  assertEqual(
    isLocalAsrModelSupportedOnOs(sherpa, os),
    os === 'win' || os === 'mac',
    `Sherpa Qwen on ${os}`,
  );
}
// Model names/families overlap across runtimes. A Windows Qwen must never be
// treated as a generic macOS model merely because it has a qwen3-asr prefix.
assertEqual(isLocalAsrModelSupportedOnOs(sherpa, 'mac'), true, 'Sherpa runs on Intel and ARM Macs');
assertEqual(
  isLocalAsrModelSupportedOnOs({ runtime: 'generic', family: 'unknown' }, 'mac'),
  false,
  'unknown models do not default to available',
);

const keepLoadedSeconds = LOCAL_ASR_KEEP_LOADED_OPTIONS.map((option) => option.seconds);
if (JSON.stringify(keepLoadedSeconds) !== JSON.stringify([0, 60, 300, 1800, 86400])) {
  throw new Error(`unexpected keep-loaded options: ${keepLoadedSeconds.join(', ')}`);
}

const locales = { zhCN, zhTW, en, ja, ko, de, fr, es };
const recognitionCatalogKeys = [
  'settings.providers.recognitionModeLabel',
  'settings.providers.recognitionModeHint',
  'settings.providers.recognitionChannelsTab',
  'settings.providers.recognitionLocalModelsTab',
  'settings.providers.recognitionLocalModelsTitle',
  'settings.providers.recognitionLocalModelsDesc',
  'settings.providers.localModelsBadge',
  'localAsr.sherpaLanguageTitle',
  'localAsr.sherpaLanguageDesc',
  'localAsr.modelGuideUseCase',
  'localAsr.modelGuideDescription',
  'localAsr.useModel',
  'localAsr.deviceRecommendedTitle',
  'localAsr.deviceDetected',
  'localAsr.deviceDownloadRecommended',
  'localAsr.deviceFit.label',
  'localAsr.deviceFit.recommended',
  'localAsr.deviceFit.good',
  'localAsr.deviceFit.demanding',
  'localAsr.deviceReasonDetecting',
  'localAsr.deviceReasonIntelChinese',
  'localAsr.deviceReasonLowMemory',
  'localAsr.deviceReasonBalancedChinese',
  'localAsr.deviceReasonChineseLight',
  'localAsr.deviceReasonMultilingual',
  'localAsr.deviceReasonStreaming',
  'localAsr.deviceReasonHeavyForDevice',
  'localAsr.deviceReasonPowerful',
  'localAsr.deviceReasonAppSiliconLongContext',
  ...SHERPA_ONNX_ASR_MODELS.flatMap((model) => [model.labelKey, model.descKey, model.useCaseKey]),
];

function lookup(messages: unknown, key: string): unknown {
  return key.split('.').reduce<unknown>((value, part) => {
    if (!value || typeof value !== 'object') return undefined;
    return (value as Record<string, unknown>)[part];
  }, messages);
}

for (const [locale, messages] of Object.entries(locales)) {
  for (const key of recognitionCatalogKeys) {
    const value = lookup(messages, key);
    if (typeof value !== 'string' || !value.trim()) {
      throw new Error(`${locale}: missing recognition catalog translation ${key}`);
    }
  }
}
