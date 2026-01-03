import React, { useState, useCallback } from 'react';
import { TaskFormData, Event } from '../../types';
import { generateRobotPlan } from '../../services/geminiApi';
import { createEvent } from '../../utils/eventLogger';
import styles from './TaskComposer.module.css';

interface TaskComposerProps {
  formData: TaskFormData;
  onFormChange: (data: TaskFormData) => void;
  onPlanGenerated: (plan: any, text: string) => void;
  onClear: () => void;
  onEvent: (event: Event) => void;
  isGenerating: boolean;
  setIsGenerating: (value: boolean) => void;
}

const PRESET_OPTIONS = [
  'Weld a Part',
  'Pick and Place',
  'Quality Inspection',
  'Custom Task',
];

const TaskComposer: React.FC<TaskComposerProps> = ({
  formData,
  onFormChange,
  onPlanGenerated,
  onClear,
  onEvent,
  isGenerating,
  setIsGenerating,
}) => {
  const [errors, setErrors] = useState<Partial<Record<keyof TaskFormData, string>>>({});

  const handleInputChange = useCallback(
    (field: keyof TaskFormData, value: string) => {
      onFormChange({
        ...formData,
        [field]: value,
      });
      // Clear error for this field
      if (errors[field]) {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[field];
          return newErrors;
        });
      }
    },
    [formData, onFormChange, errors]
  );

  const validateForm = useCallback((): boolean => {
    const newErrors: Partial<Record<keyof TaskFormData, string>> = {};

    if (!formData.preset) {
      newErrors.preset = 'Please select a preset';
    }
    if (!formData.targetObject.trim()) {
      newErrors.targetObject = 'Please describe the target object';
    }
    if (!formData.taskDescription.trim()) {
      newErrors.taskDescription = 'Please describe what the robot should do';
    }
    if (!formData.expectedOutcome.trim()) {
      newErrors.expectedOutcome = 'Please describe the expected outcome';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleGeneratePlan = useCallback(async () => {
    if (!validateForm()) {
      onEvent(createEvent('error', 'Please fill in all required fields'));
      return;
    }

    setIsGenerating(true);
    onEvent(createEvent('system', 'Generating plan...'));

    try {
      const result = await generateRobotPlan({
        preset: formData.preset,
        targetObject: formData.targetObject,
        taskDescription: formData.taskDescription,
        expectedOutcome: formData.expectedOutcome,
        exceptionScenarios: formData.exceptionScenarios,
      });

      onPlanGenerated(result.plan, result.text);
      onEvent(createEvent('success', 'Plan generated successfully'));
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to generate plan';
      onEvent(createEvent('error', `Error: ${errorMessage}`));
      console.error('Error generating plan:', error);
    } finally {
      setIsGenerating(false);
    }
  }, [formData, validateForm, onPlanGenerated, onEvent, setIsGenerating]);

  const handleClear = useCallback(() => {
    onClear();
    setErrors({});
  }, [onClear]);

  return (
    <div className={styles.taskComposer}>
      <h2 className={styles.title}>Task Composer</h2>
      <div className={styles.form}>
        <div className={styles.field}>
          <label htmlFor="preset" className={styles.label}>
            Preset
          </label>
          <select
            id="preset"
            value={formData.preset}
            onChange={(e) => handleInputChange('preset', e.target.value)}
            className={`${styles.select} ${errors.preset ? styles.error : ''}`}
          >
            <option value="">Select a preset</option>
            {PRESET_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          {errors.preset && (
            <span className={styles.errorText}>{errors.preset}</span>
          )}
        </div>

        <div className={styles.field}>
          <label htmlFor="targetObject" className={styles.label}>
            Target Object
          </label>
          <input
            id="targetObject"
            type="text"
            value={formData.targetObject}
            onChange={(e) => handleInputChange('targetObject', e.target.value)}
            placeholder="describe or click in scene"
            className={`${styles.input} ${errors.targetObject ? styles.error : ''}`}
          />
          {errors.targetObject && (
            <span className={styles.errorText}>{errors.targetObject}</span>
          )}
        </div>

        <div className={styles.field}>
          <label htmlFor="taskDescription" className={styles.label}>
            What should the robot do?
          </label>
          <textarea
            id="taskDescription"
            value={formData.taskDescription}
            onChange={(e) => handleInputChange('taskDescription', e.target.value)}
            placeholder="Describe the task in detail"
            rows={4}
            className={`${styles.textarea} ${errors.taskDescription ? styles.error : ''}`}
          />
          {errors.taskDescription && (
            <span className={styles.errorText}>{errors.taskDescription}</span>
          )}
        </div>

        <div className={styles.field}>
          <label htmlFor="expectedOutcome" className={styles.label}>
            Expected outcome
          </label>
          <textarea
            id="expectedOutcome"
            value={formData.expectedOutcome}
            onChange={(e) => handleInputChange('expectedOutcome', e.target.value)}
            placeholder="Describe the expected result"
            rows={3}
            className={`${styles.textarea} ${errors.expectedOutcome ? styles.error : ''}`}
          />
          {errors.expectedOutcome && (
            <span className={styles.errorText}>{errors.expectedOutcome}</span>
          )}
        </div>

        <div className={styles.field}>
          <label htmlFor="exceptionScenarios" className={styles.label}>
            Exception scenarios
          </label>
          <textarea
            id="exceptionScenarios"
            value={formData.exceptionScenarios}
            onChange={(e) => handleInputChange('exceptionScenarios', e.target.value)}
            placeholder="one per line"
            rows={3}
            className={styles.textarea}
          />
        </div>

        <div className={styles.actions}>
          <button
            type="button"
            onClick={handleGeneratePlan}
            disabled={isGenerating}
            className={styles.generateButton}
          >
            {isGenerating ? 'Generating...' : 'Generate Plan'}
          </button>
          <button
            type="button"
            onClick={handleClear}
            className={styles.clearButton}
          >
            Clear
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskComposer;

