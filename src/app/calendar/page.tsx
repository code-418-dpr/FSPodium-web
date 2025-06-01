"use client";

import React from "react";

import dynamic from "next/dynamic";

// Импорт компонента с отложенной загрузкой
const Calendar = dynamic(() => import("./components/Calendar"), { ssr: false });

const CalendarPage: React.FC = () => {
    return (
        <div className="relative flex items-center justify-center">
            <h1 className="absolute top-0 py-4 text-6xl font-black">Календарь</h1>
            <div className="relative w-[70%] py-24">
                <Calendar />
            </div>
        </div>
    );
};

export default CalendarPage;
