import React from "react";

interface EventTeam {
    id: number;
    name: string;
    logo: string;
}

interface EventPlayer {
    id: number;
    name: string;
}

interface FixtureEvent {
    time: {
        elapsed: number;
        extra?: number;
    };
    team: EventTeam;
    player: EventPlayer;
    assist: EventPlayer;
    type: string; // "Goal", "Card", "subst", "Var"
    detail: string; // "Yellow Card", "Normal Goal", etc.
    comments?: string;
}

interface EventsProps {
    events: FixtureEvent[];
    homeTeamId: number;
    awayTeamId: number;
}

const Events: React.FC<EventsProps> = ({ events, homeTeamId }) => {
    if (!events || events.length === 0) {
        return (
            <div className="text-center p-8 text-gray-500 bg-[#1F1F1F] rounded-xl border border-white/5">
                <p className="text-sm">No match events available</p>
            </div>
        );
    }

    return (
        <div className="bg-[#1F1F1F] rounded-xl border border-white/5 py-6 relative">
            {/* Center Line */}
            <div className="absolute left-1/2 top-4 bottom-4 w-px bg-white/5 transform -translate-x-1/2"></div>

            <div className="space-y-4">
                {events.map((event, idx) => {
                    const isHome = event.team.id === homeTeamId;
                    const eventIcon = getEventEmoji(event.type, event.detail);

                    return (
                        <div key={idx} className="flex items-center w-full">
                            {/* Home Side */}
                            <div className="flex-1 flex justify-end pr-5 items-center space-x-2">
                                {isHome && (
                                    <>
                                        <div className="text-right">
                                            <div className="text-sm text-gray-200 font-medium leading-tight">{event.player.name}</div>
                                            <div className="text-[11px] text-gray-500">{event.detail}</div>
                                        </div>
                                        <div className="w-5 flex justify-center">{eventIcon}</div>
                                    </>
                                )}
                            </div>

                            {/* Time */}
                            <div className="relative z-10 w-9 h-9 flex-shrink-0 rounded-full bg-[#111] border border-zinc-700 flex items-center justify-center text-xs font-bold text-gray-400">
                                {event.time.elapsed}'
                                {event.time.extra ? `+${event.time.extra}` : ''}
                            </div>

                            {/* Away Side */}
                            <div className="flex-1 flex justify-start pl-5 items-center space-x-2">
                                {!isHome && (
                                    <>
                                        <div className="w-5 flex justify-center">{eventIcon}</div>
                                        <div className="text-left">
                                            <div className="text-sm text-gray-200 font-medium leading-tight">{event.player.name}</div>
                                            <div className="text-[11px] text-gray-500">{event.detail}</div>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

function getEventEmoji(type: string, detail: string) {
    if (!type) return <div className="text-sm">🔹</div>;

    switch (type.toLowerCase()) {
        case 'goal':
            return <div className="text-sm">⚽</div>;
        case 'subst':
            return <div className="text-sm">🔄</div>;
        case 'card':
            if (detail && detail.toLowerCase().includes('yellow')) return <div className="w-3 h-4 bg-yellow-500 rounded-sm"></div>;
            if (detail && detail.toLowerCase().includes('red')) return <div className="w-3 h-4 bg-red-600 rounded-sm"></div>;
            return <div className="w-3 h-4 bg-gray-400 rounded-sm"></div>;
        case 'var':
            return <div className="text-[10px] bg-zinc-700 px-1 border border-zinc-600 rounded text-gray-300">VAR</div>;
        default:
            return <div className="text-sm">🔹</div>;
    }
}

export default Events;
