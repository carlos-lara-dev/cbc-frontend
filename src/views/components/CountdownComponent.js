import React, { useState, useEffect, useRef } from 'react';

const CountdownComponent = ({ onTimeout, completeTime, restart = false, totalTime = 900, quizCompleted, finalTime, timerRef }) => {
    const [time, setTime] = useState(0);
    // const [running, setRunning] = useState(false);
    const intervalRef = useRef(null);

    useEffect(() => {
        if (onTimeout) {
            intervalRef.current = setInterval(() => {
                setTime((prevTime) => {
                    if (prevTime === 0) {
                        // setRunning(false);
                        finalTime(prevTime)
                        clearInterval(intervalRef.current);
                        completeTime(); // Llamamos a la función cuando el tiempo llega a cero
                        return 0;
                    }
                    let newTime = prevTime - 1
                    timerRef.current = newTime;
                    return newTime;
                });
            }, 1000);
        } else {
            console.log("TIME ==>", time);
            finalTime(time)
            clearInterval(intervalRef.current);
        }

        return () => clearInterval(intervalRef.current);
    }, [onTimeout]);

    useEffect(() => {
        setTime(totalTime)
    }, [totalTime])

    useEffect(() => {
        if (restart) {
            if (time < totalTime) {
                setTime(totalTime)
                clearInterval(intervalRef.current);
            }
        }
    }, [restart])

    return (
        <div><h4>{Math.floor(time / 60)}:{(time % 60).toString().padStart(2, '0')}</h4></div>
    );
};

export default CountdownComponent;
