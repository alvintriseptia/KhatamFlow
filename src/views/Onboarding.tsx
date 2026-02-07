import React, { useState } from 'react';
import { addDays } from 'date-fns';
import { MushafType } from '@/types/mushaf';
import { Goal } from '@/types/goal';
import { MushafSelector } from '@/components/onboarding/MushafSelector';
import { GoalSetter } from '@/components/onboarding/GoalSetter';
import { StartPagePicker } from '@/components/onboarding/StartPagePicker';
import { Button } from '@/components/common/Button';
import { useProgressStore } from '@/store/progressStore';
import './Views.css';

export const Onboarding: React.FC = () => {
  const [step, setStep] = useState(1);
  const [mushafType, setMushafType] = useState<MushafType>('madinah-604');
  const [targetDate, setTargetDate] = useState(addDays(new Date(), 30));
  const [startPage, setStartPage] = useState(1);

  const setGoal = useProgressStore((state) => state.setGoal);

  const totalPages = 604; // Default for Madinah Mushaf

  const handleComplete = async () => {
    const goal: Goal = {
      targetDate: targetDate.getTime(),
      startDate: Date.now(),
      startPage,
      mushaf: {
        type: mushafType,
        totalPages
      }
    };

    await setGoal(goal);
  };

  return (
    <div className="view-container">
      <div className="onboarding-container">
        <div className="onboarding-header">
          <h1>Welcome to KhatamFlow</h1>
          <p className="text-secondary">
            Let's set up your adaptive Quran reading tracker
          </p>
        </div>

        <div className="onboarding-progress">
          <div className="progress-steps">
            <div className={`progress-step ${step >= 1 ? 'progress-step--active' : ''}`}>
              1
            </div>
            <div className="progress-line"></div>
            <div className={`progress-step ${step >= 2 ? 'progress-step--active' : ''}`}>
              2
            </div>
            <div className="progress-line"></div>
            <div className={`progress-step ${step >= 3 ? 'progress-step--active' : ''}`}>
              3
            </div>
          </div>
        </div>

        <div className="onboarding-content">
          {step === 1 && (
            <MushafSelector selected={mushafType} onSelect={setMushafType} />
          )}

          {step === 2 && (
            <GoalSetter targetDate={targetDate} onDateChange={setTargetDate} />
          )}

          {step === 3 && (
            <StartPagePicker
              startPage={startPage}
              totalPages={totalPages}
              onPageChange={setStartPage}
            />
          )}
        </div>

        <div className="onboarding-actions">
          {step > 1 && (
            <Button variant="secondary" onClick={() => setStep(step - 1)}>
              Back
            </Button>
          )}

          {step < 3 ? (
            <Button variant="primary" onClick={() => setStep(step + 1)} fullWidth={step === 1}>
              Continue
            </Button>
          ) : (
            <Button variant="primary" onClick={handleComplete} fullWidth>
              Start Reading
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
