'use client';

import { useState } from 'react';

import type { TLostarkManualMetrics } from '@/api/lostark/type';

import Button from '@/components/common/button/Button';
import TextInput from '@/components/common/form/TextInput';
import Modal from '@/components/common/modal/Modal';

import styles from './manualMetricsModal.module.scss';

type TManualMetricForm = Record<keyof TLostarkManualMetrics, string>;
type TManualMetricField = {
  key: keyof TLostarkManualMetrics;
  label: string;
};

const MANUAL_METRIC_FIELDS: readonly TManualMetricField[] = [
  { key: 'lopecScore', label: '로펙 점수' },
  { key: 'braceletScore', label: '팔찌 점수 (%)' },
  { key: 'gemConversionLevel', label: '젬 환산 (레벨)' },
];

export default function ManualMetricsModal(props: {
  manualMetrics: TLostarkManualMetrics;
  onClose: () => void;
  onApply: (manualMetrics: TLostarkManualMetrics) => void;
}) {
  const [form, setForm] = useState<TManualMetricForm>(() => toForm(props.manualMetrics));

  const parsedMetrics = parseManualMetrics(form);
  const isApplyDisabled = parsedMetrics === null;

  function handleChange(key: keyof TLostarkManualMetrics, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleApply() {
    if (!parsedMetrics) return;

    props.onApply(parsedMetrics);
    props.onClose();
  }

  return (
    <Modal isOpen onClose={props.onClose} title="직접입력" width={480}>
      <div className={styles['manual-metrics-modal']}>
        <div className={styles['form-list']}>
          {MANUAL_METRIC_FIELDS.map((field) => (
            <MetricField
              key={field.key}
              label={field.label}
              value={form[field.key]}
              onChange={(value) => handleChange(field.key, value)}
            />
          ))}
        </div>

        {isApplyDisabled && (
          <p className={styles['validation-message']}>0 이상의 숫자를 입력해주세요.</p>
        )}

        <div className={styles['action-buttons']}>
          <Button color="gray" fill="solid" size="large" onClick={props.onClose}>
            취소
          </Button>
          <Button
            color="mint"
            fill="solid"
            size="large"
            className={styles['apply-button']}
            isDisabled={isApplyDisabled}
            onClick={handleApply}
          >
            적용
          </Button>
        </div>
      </div>
    </Modal>
  );
}

function MetricField(props: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className={styles['form-row']}>
      <span className={styles['label']}>{props.label}</span>
      <TextInput
        value={props.value}
        inputMode="decimal"
        placeholder="미입력"
        onChange={props.onChange}
        className={styles['metric-input']}
      />
    </label>
  );
}

function toForm(manualMetrics: TLostarkManualMetrics): TManualMetricForm {
  return {
    lopecScore: toInputValue(manualMetrics.lopecScore),
    braceletScore: toInputValue(manualMetrics.braceletScore),
    gemConversionLevel: toInputValue(manualMetrics.gemConversionLevel),
  };
}

function toInputValue(value: number | null): string {
  return value === null ? '' : String(value);
}

function parseManualMetrics(form: TManualMetricForm): TLostarkManualMetrics | null {
  const lopecScore = parseNonNegativeDecimal(form.lopecScore);
  const braceletScore = parseNonNegativeDecimal(form.braceletScore);
  const gemConversionLevel = parseNonNegativeDecimal(form.gemConversionLevel);

  if (lopecScore === undefined || braceletScore === undefined || gemConversionLevel === undefined) {
    return null;
  }

  return { lopecScore, braceletScore, gemConversionLevel };
}

function parseNonNegativeDecimal(value: string): number | null | undefined {
  const trimmed = value.trim();

  if (trimmed === '') return null;
  if (!/^\d+(?:\.\d+)?$/.test(trimmed)) return undefined;

  const parsed = Number(trimmed);

  return Number.isFinite(parsed) && parsed >= 0 ? parsed : undefined;
}
