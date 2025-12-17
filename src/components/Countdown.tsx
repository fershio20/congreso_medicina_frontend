'use client';

import React, { useEffect, useState } from "react";
import CountdownCard from "./CountdownCard";

interface Props {
    targetDate: string;
    color_from?: string;
    color_to?: string;
}

const Countdown: React.FC<Props> = ({ color_to, color_from,targetDate }) => {
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

    useEffect(() => {
        const calculateTimeLeft = () => {
            const now = new Date().getTime();
            const target = new Date(targetDate).getTime();
            const diff = Math.max(target - now, 0);

            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
            const minutes = Math.floor((diff / (1000 * 60)) % 60);
            const seconds = Math.floor((diff / 1000) % 60);

            setTimeLeft({ days, hours, minutes, seconds });
        };

        calculateTimeLeft(); // calcular inicialmente

        const interval = setInterval(calculateTimeLeft, 1000);

        return () => clearInterval(interval);
    }, [targetDate]);

    return (
        <div 
            id="countDownContainer"
            className="max-w-[1280px] rounded-xl md:rounded-4xl w-full
            
            mx-auto px-2 mt-8 grid grid-cols-4 md:grid-cols-4"
            style={{
                background: `linear-gradient(135deg, ${color_from ? color_from :'#137EC7'} 0%, ${color_to ? color_to : '#093D61'} 100%)`,
            }}
        >
            <CountdownCard value={timeLeft.days} label="Días" />
            <CountdownCard value={timeLeft.hours} label="Horas" />
            <CountdownCard value={timeLeft.minutes} label="Minutos" />
            <CountdownCard value={timeLeft.seconds} label="Segundos" />
        </div>
    );
};

export default Countdown;
