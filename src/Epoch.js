import { useState, useEffect } from 'react'

function Epoch() {
    const [epochInSec, setEpochInSec] = useState(0);
    const [browserTimeInSec, setBrowserTimeInSec] = useState(0);
    const [runAfter30Sec, setRunAfter30Sec] = useState(0);
    useEffect(() => {
        async function fetchEpocData() {
            const headers = new Headers({
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + 'mysecrettoken',
            });
            headers.append('Access-Control-Allow-Origin', 'http://localhost:3000');
            headers.append('Access-Control-Allow-Credentials', 'true');
            const response = await fetch('http://localhost:3001/time', { headers })
            const reader = response.body
                .getReader();
            while (true) {
                const { value, done } = await reader.read()
                if (done) break;
                let jsonString = new TextDecoder().decode(value)
                let epocObject = JSON.parse(jsonString)
                setEpochInSec(epocObject.epoch)
            }
        }
        fetchEpocData();
        let epochTimer = setTimeout(() => setRunAfter30Sec(runAfter30Sec + 1), 30000);
        return () => {
            clearTimeout(epochTimer);
        };
    }, [runAfter30Sec])

    useEffect(() => {
        let timer1 = setTimeout(() => setBrowserTimeInSec(Math.round(new Date().getTime() / 1000)), 1000);
        return () => {
            clearTimeout(timer1);
        };
    }, [browserTimeInSec])
    let diff = (browserTimeInSec - epochInSec)
    let timeFormat = new Date(diff * 1000).toISOString().substr(11, 8)
    return (
        <div className="grid-container">
            <div className="grid-item">
                <h1>Server Epoch:</h1>
                {new Date(epochInSec * 1000).toTimeString().split(' ')[0]}
            </div>
            <div className="grid-item">
                <h1>Difference with Server Epoch:</h1>
                {timeFormat}
            </div>
        </div>
    );
}

export default Epoch;
