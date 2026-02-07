import React from 'react';
import { DailyGoal } from '@/types/goal';
import { Card } from '../common/Card';
import './Dashboard.css';

interface TodayViewProps {
  dailyGoal: DailyGoal;
}

export const TodayView: React.FC<TodayViewProps> = ({ dailyGoal }) => {
  const { pagesNeeded, pagesRemaining, daysRemaining, isImpossible } = dailyGoal;

  return (
    <Card className="today-view">
      <div className="today-view__header">
        <h2>Today's Goal</h2>
      </div>

      <div className="today-view__content">
        {isImpossible ? (
          <div className="goal-impossible">
            <div className="goal-number goal-number--urgent">{pagesRemaining}</div>
            <p className="goal-label">pages to finish today!</p>
            <p className="goal-warning">Your deadline is today. Complete as much as you can.</p>
          </div>
        ) : pagesRemaining === 0 ? (
          <div className="goal-complete">
            <div className="goal-celebration">🎉</div>
            <h3>Alhamdulillah!</h3>
            <p>You've completed your Khatam</p>
          </div>
        ) : (
          <>
            <div className="goal-main">
              <div className="goal-number">{pagesNeeded}</div>
              <p className="goal-label">pages today</p>
            </div>

            <div className="goal-stats">
              <div className="goal-stat">
                <span className="goal-stat__value">{pagesRemaining}</span>
                <span className="goal-stat__label">pages left</span>
              </div>
              <div className="goal-divider"></div>
              <div className="goal-stat">
                <span className="goal-stat__value">{daysRemaining}</span>
                <span className="goal-stat__label">days left</span>
              </div>
            </div>
          </>
        )}
      </div>
    </Card>
  );
};
