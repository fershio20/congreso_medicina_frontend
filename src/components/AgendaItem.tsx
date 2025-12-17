import React from "react";

interface AgendaItemProps {
    time: string;
    title: string;
    speaker: string;
    tags?: string[];
}

const AgendaItem: React.FC<AgendaItemProps> = ({
                                                   time,
                                                   title,
                                                   speaker,
                                                   tags = [],
                                               }) => {
    return (
        <li className="flex gap-6 group">
            {/* Hora */}
            <div className="w-22 text-right text-sm font-bold text-gray-700 flex-shrink-0">
                {time}
            </div>

            {/* Bloque Datos */}
            <div className="flex-1 border-l border-gray-300 pl-6 bg-gray-50  py-4 px-6 space-y-2 text-left transition-colors duration-300 ease-in-out group-hover:bg-gray-100">
                <h5 className="text-[24px] font-bold leading-tight">{title}</h5>
                <p className="text-sm text-gray-600 leading-none">{speaker}</p>
                {tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                        {tags.map((tag, index) => (
                            <span
                                key={index}
                                className="bg-red-100 text-red-700 text-xs font-semibold px-2 py-1 rounded-full"
                            >
                {tag}
              </span>
                        ))}
                    </div>
                )}
            </div>
        </li>
    );
};

export default AgendaItem;
