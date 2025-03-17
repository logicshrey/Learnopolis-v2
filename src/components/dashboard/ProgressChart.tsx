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
    completed: number;
    total: number;
  };
}

const ProgressChart: React.FC<ProgressChartProps> = ({ progress }) => {
  // Convert the progress object into the array format that RadarChart expects
  const chartData = [
    {
      subject: 'Completed',
      value: progress.completed,
      fullMark: progress.total
    },
    {
      subject: 'In Progress',
      value: progress.total - progress.completed,
      fullMark: progress.total
    }
    // Add more metrics as needed
  ];

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={chartData}>
          <PolarGrid />
          <PolarAngleAxis dataKey="subject" />
          <Radar
            name="Progress"
            dataKey="value"
            stroke="#8884d8"
            fill="#8884d8"
            fillOpacity={0.6}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ProgressChart; 