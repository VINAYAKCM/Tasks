import { useState, useCallback, useRef, useEffect } from 'react';
import Scene from './components/Scene/Scene';
import Events from './components/Events/Events';
import TaskComposer from './components/TaskComposer/TaskComposer';
import PlanPreview from './components/PlanPreview/PlanPreview';
import { Event, TaskFormData, ExecutionStatus, PlanViewMode, RobotPlan } from './types';
import { createEvent } from './utils/eventLogger';
import styles from './App.module.css';

function App() {
  const [events, setEvents] = useState<Event[]>([
    createEvent('system', 'Ready. Describe a task or pick a preset.'),
  ]);
  const [formData, setFormData] = useState<TaskFormData>({
    preset: '',
    targetObject: '',
    taskDescription: '',
    expectedOutcome: '',
    exceptionScenarios: '',
  });
  const [plan, setPlan] = useState<RobotPlan | null>(null);
  const [planText, setPlanText] = useState<string>('');
  const [executionStatus, setExecutionStatus] = useState<ExecutionStatus>('idle');
  const [progress, setProgress] = useState<number>(0);
  const [planViewMode, setPlanViewMode] = useState<PlanViewMode>('text');
  const [isGeneratingPlan, setIsGeneratingPlan] = useState<boolean>(false);
  const [planConfirmed, setPlanConfirmed] = useState<boolean>(false);
  const progressIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const addEvent = useCallback((event: Event) => {
    setEvents((prev) => [...prev, event]);
  }, []);

  const handleFormChange = useCallback((data: TaskFormData) => {
    setFormData(data);
  }, []);

  const handlePlanGenerated = useCallback((generatedPlan: RobotPlan, text: string) => {
    setPlan(generatedPlan);
    setPlanText(text);
    setPlanConfirmed(false);
  }, []);

  const handleClear = useCallback(() => {
    setFormData({
      preset: '',
      targetObject: '',
      taskDescription: '',
      expectedOutcome: '',
      exceptionScenarios: '',
    });
    setPlan(null);
    setPlanText('');
    setPlanConfirmed(false);
    setProgress(0);
    setExecutionStatus('idle');
    addEvent(createEvent('user', 'Form cleared'));
  }, [addEvent]);

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, []);

  const handleStart = useCallback(() => {
    if (plan && planConfirmed) {
      // Clear any existing interval
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }

      setExecutionStatus('running');
      if (progress === 0) {
        addEvent(createEvent('success', 'Execution started'));
      } else {
        addEvent(createEvent('success', 'Execution resumed'));
      }

      // Simulate progress
      progressIntervalRef.current = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            if (progressIntervalRef.current) {
              clearInterval(progressIntervalRef.current);
              progressIntervalRef.current = null;
            }
            setExecutionStatus('idle');
            addEvent(createEvent('success', 'Execution completed'));
            return 100;
          }
          return prev + 2;
        });
      }, 200);
    }
  }, [plan, planConfirmed, addEvent, progress]);

  const handlePause = useCallback(() => {
    if (executionStatus === 'running') {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }
      setExecutionStatus('paused');
      addEvent(createEvent('system', 'Execution paused'));
    }
  }, [executionStatus, addEvent]);

  const handleStop = useCallback(() => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
    setExecutionStatus('stopped');
    setProgress(0);
    addEvent(createEvent('error', 'Execution stopped'));
    setTimeout(() => {
      setExecutionStatus('idle');
    }, 1000);
  }, [addEvent]);

  return (
    <>
      <h1 className={styles.title}>Bot Console</h1>
      <div className={styles.app}>
        <div className={styles.leftColumn}>
          <Scene />
          <Events events={events} />
        </div>
        <div className={styles.rightColumn}>
          <TaskComposer
            formData={formData}
            onFormChange={handleFormChange}
            onPlanGenerated={handlePlanGenerated}
            onClear={handleClear}
            onEvent={addEvent}
            isGenerating={isGeneratingPlan}
            setIsGenerating={setIsGeneratingPlan}
          />
          <PlanPreview
            plan={plan}
            planText={planText}
            viewMode={planViewMode}
            onViewModeChange={setPlanViewMode}
            planConfirmed={planConfirmed}
            onPlanConfirmedChange={setPlanConfirmed}
            executionStatus={executionStatus}
            progress={progress}
            onStart={handleStart}
            onPause={handlePause}
            onStop={handleStop}
          />
        </div>
      </div>
    </>
  );
}

export default App;

