import React from 'react';
import { useProgressStore } from '@/store/progressStore';
import { calculateProjection } from '@/core/algorithm/projections';
import { format } from 'date-fns';
import { Card } from '../common/Card';
import './ProjectionCard.css';

const ProjectionCard: React.FC = () => {
  const { goal, currentProgress, logs } = useProgressStore();

  if (!goal || !currentProgress) {
    return null;
  }

  const projection = calculateProjection(
    currentProgress.currentPage,
    goal.mushaf.totalPages,
    goal.targetDate,
    logs,
    goal.startDate
  );

  const formattedEstimatedDate = format(projection.estimatedCompletionDate, 'MMM dd, yyyy');
  const formattedTargetDate = format(goal.targetDate, 'MMM dd, yyyy');

  return (
    <Card className="projection-card">
      <div className="projection-card__header">
        <h3>📈 Completion Projection</h3>
        <p className="projection-card__subtitle">Based on your current pace</p>
      </div>

      <div className="projection-card__content">
        <div className="projection-stat">
          <div className="projection-stat__label">Estimated Finish</div>
          <div className="projection-stat__value">{formattedEstimatedDate}</div>
        </div>

        <div className="projection-stat">
          <div className="projection-stat__label">Target Date</div>
          <div className="projection-stat__value">{formattedTargetDate}</div>
        </div>

        <div className="projection-stat">
          <div className="projection-stat__label">Average Pace</div>
          <div className="projection-stat__value">
            {projection.averagePagesPerDay} <span className="projection-stat__unit">pages/day</span>
          </div>
        </div>

        <div className={`projection-status ${projection.isOnTrack ? 'projection-status--on-track' : 'projection-status--behind'}`}>
          <div className="projection-status__icon">
            {projection.isOnTrack ? '✓' : '⚠️'}
          </div>
          <div className="projection-status__text">
            {projection.isOnTrack ? (
              <>
                You're <strong>{Math.abs(projection.daysAheadOrBehind)} days ahead</strong> of schedule!
              </>
            ) : (
              <>
                You're <strong>{Math.abs(projection.daysAheadOrBehind)} days behind</strong> schedule
              </>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ProjectionCard;
