import React from 'react';
import { useProgressStore } from '@/store/progressStore';
import { useMushaf } from '@/hooks/useMushaf';
import { TodayView } from '@/components/dashboard/TodayView';
import { ResumeCard } from '@/components/dashboard/ResumeCard';
import { FastLogButton } from '@/components/dashboard/FastLogButton';
import { PrayerSplitter } from '@/components/dashboard/PrayerSplitter';
import ProjectionCard from '@/components/dashboard/ProjectionCard';
import ProgressCharts from '@/components/charts/ProgressCharts';
import './Views.css';

export const Dashboard: React.FC = () => {
  const { goal, currentProgress, dailyGoal, logProgress } = useProgressStore();
  const { getPageInfo } = useMushaf();

  if (!goal || !currentProgress || !dailyGoal) {
    return (
      <div className="view-container">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  const nextPage = currentProgress.currentPage + 1;
  const isComplete = currentProgress.currentPage >= goal.mushaf.totalPages;

  // Get metadata for the next page
  const pageInfo = getPageInfo(nextPage);

  return (
    <div className="view-container">
      <div className="dashboard-container">
        <header className="dashboard-header">
          <h1>KhatamFlow</h1>
        </header>

        <main className="dashboard-content">
          {!isComplete && (
            <ResumeCard
              nextPage={nextPage}
              totalPages={goal.mushaf.totalPages}
              surah={pageInfo?.surah}
              juz={pageInfo?.juz}
            />
          )}

          <TodayView dailyGoal={dailyGoal} />

          {!isComplete && <ProjectionCard />}

          {!isComplete && dailyGoal.pagesNeeded > 0 && (
            <>
              <FastLogButton
                currentPage={currentProgress.currentPage}
                onLogProgress={logProgress}
              />

              <PrayerSplitter dailyPages={dailyGoal.pagesNeeded} />
            </>
          )}

          {/* Progress Charts */}
          <ProgressCharts />
        </main>
      </div>
    </div>
  );
};
