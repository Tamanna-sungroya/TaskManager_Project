import React from 'react';
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from "recharts";
import CustomTooltip from './CustomTooltip';
import CustomLegend from './CustomLegend';

const CustomPieChart = ({data = [], colors = ["#8D51FF", "#00B8DB", "#7BCE00"]}) => {
    // Validate and sanitize data
    const validData = Array.isArray(data) 
        ? data.filter(item => item && !isNaN(item.count) && isFinite(item.count))
        : [];
    
    const chartData = validData.length > 0 ? validData : [
        { status: "No Data", count: 0 }
    ];
    
    return (
        <ResponsiveContainer width="100%" height={325}>
            <PieChart>
                <Pie
                data={chartData}
                dataKey="count"
                nameKey="status"
                cx="50%"
                cy="50%"
                outerRadius={130}
                innerRadius={100}
                labelLine={false}
                >
                    {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                    ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend content={<CustomLegend />} />
            </PieChart>
        </ResponsiveContainer>
    )
}

export default CustomPieChart;