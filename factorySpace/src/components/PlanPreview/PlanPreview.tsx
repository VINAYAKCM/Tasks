import React, { useMemo } from 'react';
import { RobotPlan, PlanViewMode, ExecutionStatus } from '../../types';
import styles from './PlanPreview.module.css';

interface PlanPreviewProps {
  plan: RobotPlan | null;
  planText: string;
  viewMode: PlanViewMode;
  onViewModeChange: (mode: PlanViewMode) => void;
  planConfirmed: boolean;
  onPlanConfirmedChange: (confirmed: boolean) => void;
  executionStatus: ExecutionStatus;
  progress: number;
  onStart: () => void;
  onPause: () => void;
  onStop: () => void;
}

const PlanPreview: React.FC<PlanPreviewProps> = ({
  plan,
  planText,
  viewMode,
  onViewModeChange,
  planConfirmed,
  onPlanConfirmedChange,
  executionStatus,
  progress,
  onStart,
  onPause,
  onStop,
}) => {
  const formattedPlan = useMemo(() => {
    if (!plan) return null;

    if (viewMode === 'json') {
      return JSON.stringify(plan, null, 2);
    }

    // Text view - format the plan in a human-readable way
    let text = '';

    if (plan.preExecutionChecks && plan.preExecutionChecks.length > 0) {
      text += 'PRE-EXECUTION CHECKS:\n';
      plan.preExecutionChecks.forEach((check, index) => {
        text += `${index + 1}. ${check}\n`;
      });
      text += '\n';
    }

    if (plan.steps && plan.steps.length > 0) {
      text += 'EXECUTION STEPS:\n';
      plan.steps.forEach((step) => {
        text += `Step ${step.step}: ${step.action}\n`;
        text += `  ${step.description}\n\n`;
      });
    }

    if (plan.safetyConsiderations && plan.safetyConsiderations.length > 0) {
      text += 'SAFETY CONSIDERATIONS:\n';
      plan.safetyConsiderations.forEach((consideration, index) => {
        text += `${index + 1}. ${consideration}\n`;
      });
      text += '\n';
    }

    if (plan.errorHandling && plan.errorHandling.length > 0) {
      text += 'ERROR HANDLING:\n';
      plan.errorHandling.forEach((procedure, index) => {
        text += `${index + 1}. ${procedure}\n`;
      });
      text += '\n';
    }

    if (plan.successCriteria && plan.successCriteria.length > 0) {
      text += 'SUCCESS CRITERIA:\n';
      plan.successCriteria.forEach((criterion, index) => {
        text += `${index + 1}. ${criterion}\n`;
      });
    }

    // If no structured data, use raw text
    if (plan.rawText) {
      text = plan.rawText;
    }

    // If still empty, use the original planText
    if (!text && planText) {
      text = planText;
    }

    return text || 'No plan details available';
  }, [plan, planText, viewMode]);

  const canStart = plan !== null && planConfirmed && (executionStatus === 'idle' || executionStatus === 'paused');
  const canPause = executionStatus === 'running';
  const canStop = executionStatus === 'running' || executionStatus === 'paused';

  return (
    <div className={styles.planPreview}>
      <h2 className={styles.title}>Plan Preview & Approval</h2>

      {plan && (
        <div className={styles.viewModeToggle}>
          <button
            type="button"
            onClick={() => onViewModeChange('text')}
            className={`${styles.toggleButton} ${
              viewMode === 'text' ? styles.active : ''
            }`}
          >
            Text
          </button>
          <button
            type="button"
            onClick={() => onViewModeChange('json')}
            className={`${styles.toggleButton} ${
              viewMode === 'json' ? styles.active : ''
            }`}
          >
            JSON
          </button>
        </div>
      )}

      <div className={styles.planDisplay}>
        {plan ? (
          <pre className={styles.planContent}>{formattedPlan}</pre>
        ) : (
          <div className={styles.noPlan}>No plan yet</div>
        )}
      </div>

      {plan && (
        <div className={styles.confirmation}>
          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={planConfirmed}
              onChange={(e) => onPlanConfirmedChange(e.target.checked)}
              className={styles.checkbox}
            />
            <span>I confirm the plan, tools, and safety checks</span>
          </label>
        </div>
      )}

      <div className={styles.controls}>
        <button
          type="button"
          onClick={onStart}
          disabled={!canStart}
          className={`${styles.controlButton} ${styles.startButton}`}
        >
          {executionStatus === 'paused' ? 'Resume' : 'Start'}
        </button>
        <button
          type="button"
          onClick={onPause}
          disabled={!canPause}
          className={`${styles.controlButton} ${styles.pauseButton}`}
        >
          Pause
        </button>
        <button
          type="button"
          onClick={onStop}
          disabled={!canStop}
          className={`${styles.controlButton} ${styles.stopButton}`}
        >
          STOP
        </button>
      </div>

      {(executionStatus === 'running' || executionStatus === 'paused') && (
        <div className={styles.progressSection}>
          <div className={styles.progressBarContainer}>
            <div
              className={styles.progressBar}
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className={styles.progressText}>{progress}%</div>
        </div>
      )}

      <div className={styles.statusIndicators}>
        <div className={styles.statusItem}>
          <span className={styles.statusLabel}>Safety Supervisor:</span>
          <span className={`${styles.statusValue} ${styles.statusOk}`}>OK</span>
        </div>
        <div className={styles.statusItem}>
          <span className={styles.statusLabel}>Tool:</span>
          <span className={styles.statusValue}>Welder (MIG)</span>
        </div>
        <div className={styles.statusItem}>
          <span className={styles.statusLabel}>Vision:</span>
          <span className={styles.statusValue}>Idle</span>
        </div>
      </div>
    </div>
  );
};

export default PlanPreview;

