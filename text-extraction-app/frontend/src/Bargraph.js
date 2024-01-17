import React from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);



function Bargraph(props) {

    const options = {
        responsive: true,
        // maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: false,
                text: ' Bar-Chart',
            },
        },
        scales: {
            x: {
                grid: {
                    display: false
                }
            },
            y: {
                grid: {
                    display: false
                }
            }
        },
    };


    const labels = ["Theft","Burglary","Robbery","Assault","Homicide","Drug Possession","Shoplifting","Vandalism","Fraud","Identity","Cybercrime","Domestic Violence","Kidnapping","Arson","Carjacking","Embezzlement","Forgery","Disorderly Conduct","Stalking","Public Intoxication"];
    const Xdata = [1200,248,349,168,891,549,1602,1200,248,349,168,891,549,1602,1200,248,349,168,891,549];


    const data = {
        labels,
        datasets: [
            {
                label: "Crimes in Rajasthan",
                data: Xdata,
                backgroundColor: 'rgba(189, 195, 199, 1)',
                borderRadius: 5,
                borderSkipped: false,
                barThickness: 10
            },
        ],
    };
    return (
        <div className="Bargraph">
            <Bar options={options} data={data} />
        </div>
    );
}

export default Bargraph;



