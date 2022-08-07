import logo from './logo.svg';
import './App.css';
import { useState, useEffect } from 'react'

function Metrics() {
    const [defaultMetricsDataList, setDefaultMetricsDataList] = useState([]);
    const defaultMetricNamesList = [
        'process_cpu_user_seconds_total',
        'process_cpu_system_seconds_total',
        'process_cpu_seconds_total',
        'process_start_time_seconds',
        'process_resident_memory_bytes',
        'nodejs_eventloop_lag_seconds',
        'nodejs_eventloop_lag_min_seconds',
        'nodejs_eventloop_lag_max_seconds',
        'nodejs_eventloop_lag_mean_seconds',
        'nodejs_eventloop_lag_stddev_seconds',
        'nodejs_eventloop_lag_p50_seconds',
        'nodejs_eventloop_lag_p90_seconds',
        'nodejs_eventloop_lag_p99_seconds',
    ]
    useEffect(() => {
        async function fetchEpocData() {
            const headers = new Headers({
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + 'mysecrettoken',
            });
            headers.append('Access-Control-Allow-Origin', 'http://localhost:3000');
            headers.append('Access-Control-Allow-Credentials', 'true');
            const response = await fetch('http://localhost:3001/metrics', { headers })
            const reader = response.body
                .getReader();
            while (true) {
                const { value, done } = await reader.read()
                if (done) break;
                let metricsList = new TextDecoder().decode(value).split('\n')
                let metricMap = metricsList.filter((ele) => {
                    if (ele[0] !== '#' && defaultMetricNamesList.includes(ele.split(' ')[0])) {
                        return true;
                    } else {
                        return false;
                    }
                })
                setDefaultMetricsDataList(metricMap)
            }
        }
        fetchEpocData()
    }, [])

    return (
        <table>
            <thead>
                <tr>
                    <th>Metric Name</th>
                    <th>Value</th>
                </tr>
            </thead>
            <tbody>
                {
                    defaultMetricsDataList.map((ele, idx) => {
                        let list = ele.split(' ')
                        return (
                            <tr key={idx}>
                                <td>{list[0]}</td>
                                <td>{list[1]}</td>
                            </tr>
                        )
                    })
                }
            </tbody>
        </table>
    );
}

export default Metrics;
