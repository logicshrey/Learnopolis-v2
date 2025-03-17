import React from 'react';
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
} from 'recharts';

interface ProgressChartProps {
  progress: {
    // Define the shape of your progress data here
    // For example:
    completed: number;
    total: number;
    // ... other progress properties
  };
}

const ProgressChart: React.FC<ProgressChartProps> = ({ progress }) => {
  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={progress}>
          <PolarGrid />
          <PolarAngleAxis dataKey="subject" />
          <Radar
            name="Progress"
            dataKey="score"
            stroke="#4f46e5"
            fill="#4f46e5"
            fillOpacity={0.6}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ProgressChart; 