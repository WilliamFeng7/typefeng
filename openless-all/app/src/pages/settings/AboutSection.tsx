// About → version info / check updates / font size / doc links.
// "Personalization" was once its own tab but was left with only font size, so it merged into "About".
// "Join the Beta channel" moved to the bottom of the Advanced page (see BetaChannelSection); here the
// icon area keeps only the stable-channel "check updates" button.

import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Row } from '../../components/ui/Row';
import { getPlatformCapabilities, openExternal } from '../../lib/ipc';
import type { PlatformCapabilities } from '../../lib/types';
import { APP_VERSION_LABEL } from '../../lib/appVersion';
import { Card } from '../_atoms';
import { useConservativeLayout, useLayoutStack } from '../../lib/useMobileLayout';
import { btnGhostStyle, SectionTitle } from './shared';
import { CheckUpdateButton } from './CheckUpdateButton';

const HELP_URL = 'https://github.com/WilliamFeng7/typefeng#readme';
const RELEASE_NOTES_URL = 'https://github.com/WilliamFeng7/typefeng/releases';

export function AboutSection() {
  const { t } = useTranslation();
  const baseLayoutStack = useLayoutStack();
  const conservativeLayout = useConservativeLayout();
  const compactLayout = baseLayoutStack || conservativeLayout;
  const appIconSize = compactLayout ? 36 : 56;
  const [platformCaps, setPlatformCaps] = useState<PlatformCapabilities | null>(null);

  useEffect(() => {
    void getPlatformCapabilities().then(setPlatformCaps);
  }, []);


  return (
    <>
      {/* ─── Version info + check updates (stable) ─────────────────────── */}
      <Card>
        <div
          className="ol-inline-composite"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: compactLayout ? 4 : 14,
            minWidth: 0,
            flexWrap: 'nowrap',
          }}
        >
          <img
            src="AppIcon.png"
            alt=""
            style={{
              width: appIconSize,
              height: appIconSize,
              flexShrink: 0,
              borderRadius: 13,
              boxShadow: '0 4px 10px rgba(0,0,0,.10), 0 0 0 0.5px rgba(0,0,0,.06)',
            }}
          />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontSize: 17,
                fontWeight: 'var(--ol-font-weight-semibold)',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              TypeFeng
            </div>
            <div
              style={{
                fontSize: 12,
                color: 'var(--ol-ink-3)',
                marginTop: 2,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {t('modal.about.tagline')} · {APP_VERSION_LABEL}
            </div>
          </div>
          {/* Top right of the icon: stable-channel check-updates button. Beta channel lives on the Advanced page. */}
          {platformCaps?.supportsAutoUpdate === true && (
            <CheckUpdateButton channel="stable" compact={compactLayout} />
          )}
        </div>
      </Card>

      <Card>
        <SectionTitle>关于 TypeFeng</SectionTitle>
        <div style={{ fontSize: 12.5, lineHeight: 1.7, color: 'var(--ol-ink-3)' }}>
          TypeFeng 是 OpenLess 的修改版（AGPL-3.0），基于上游提交 defd6924。本分支关闭了上游自动更新，
          移除了上游社区入口与默认更新端点，并重新制作了品牌与图标。核心听写能力来自上游。
          <div style={{ marginTop: 8 }}>
            <button
              style={btnGhostStyle}
              onClick={() => openExternal('https://github.com/WilliamFeng7/typefeng')}
            >
              查看源码与修改说明
            </button>
          </div>
        </div>
      </Card>

      {/* Personalization (font size) removed as requested (page slimming). */}

      {/* ─── Documentation links ─────────────────────────────────────── */}
      <Card>
        <SectionTitle>{t('settings.about.linksTitle')}</SectionTitle>
        <Row label={t('modal.about.source')}>
          <button
            style={btnGhostStyle}
            onClick={() => openExternal('https://github.com/WilliamFeng7/typefeng')}
          >
            GitHub
          </button>
        </Row>
        <Row label={t('modal.about.docs')}>
          <button style={btnGhostStyle} onClick={() => openExternal(HELP_URL)}>
            {t('modal.about.docsBtn')}
          </button>
        </Row>
        <Row label={t('modal.sections.helpCenter')}>
          <button style={btnGhostStyle} onClick={() => openExternal(HELP_URL)}>
            {t('modal.sections.helpCenter')}
          </button>
        </Row>
        <Row label={t('modal.sections.releaseNotes')}>
          <button style={btnGhostStyle} onClick={() => openExternal(RELEASE_NOTES_URL)}>
            {t('modal.sections.releaseNotes')}
          </button>
        </Row>
        <Row label={t('modal.about.feedback')}>
          <button
            style={btnGhostStyle}
            onClick={() => openExternal('https://github.com/WilliamFeng7/typefeng/issues')}
          >
            {t('modal.about.feedbackBtn')}
          </button>
        </Row>
        <Row label="上游项目">
          <button
            style={btnGhostStyle}
            onClick={() => openExternal('https://github.com/Open-Less/openless')}
          >
            OpenLess
          </button>
        </Row>
      </Card>
    </>
  );
}
