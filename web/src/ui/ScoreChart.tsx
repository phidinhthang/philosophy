import React from 'react';
import { Line } from 'react-chartjs-2';

interface ScoreChartProps extends React.ComponentPropsWithRef<'div'> {
  labels: string[];
  data: number[];
}

export const ScoreChart = ({ labels, data }: ScoreChartProps) => {
  return (
    <div style={{ marginTop: 100 }}>
      <Line
        data={{
          labels,
          datasets: [
            {
              label: 'Score',
              data,
              fill: false,
              borderColor: 'rgba(255, 99, 132, 0.8)',
            },
          ],
        }}
        // options={{ maintainAspectRatio: false }}
      />
    </div>
  );
};
