import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, ArcElement);

export default function Home() {
    const data = {
        labels: ['Weapon', 'Vehicle', 'Ammunition'],
        datasets: [
            {
                label: 'Assets by Type',
                data: [10, 5, 2],
                backgroundColor: [
                    'rgba(24, 90, 170, 1)',
                    'rgba(45, 122, 122, 1)',
                    'rgba(200, 160, 40, 1)'
                ],
                borderColor: [
                    'rgba(24, 90, 170, 1)',
                    'rgba(45, 122, 122, 1)',
                    'rgba(200, 160, 40, 1)'
                ],
                borderWidth: 1,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'bottom',
            },
            title: {
                display: true,
                text: 'Assets by Type',
                font: {
                    size: 18,
                },
            },
        },
    };
    return (
        <div style={{ width: 500, height: 400, margin: '0 auto', padding: 10 }}>
            <h1 style={{ fontSize: 20, marginBottom: 16 }}>Dashboard</h1>
            <Pie data={data} options={{ ...options, maintainAspectRatio: false }} />
        </div>
    )

}
