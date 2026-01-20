import React from 'react';
import { MousePointer2 } from 'lucide-react';
import { useDiagramStore } from '../store/useDiagramStore';

const RemoteCursors: React.FC = () => {
    const { remoteUsers } = useDiagramStore();

    return (
        <>
            {remoteUsers.map((user) => (
                <div
                    key={user.id}
                    className="absolute z-[9999] pointer-events-none transition-all duration-100 ease-out"
                    style={{
                        left: user.position.x,
                        top: user.position.y,
                    }}
                >
                    <MousePointer2
                        size={20}
                        style={{ color: user.color, fill: user.color }}
                        className="drop-shadow-lg"
                    />
                    <div
                        className="ml-4 px-2 py-1 rounded text-[10px] font-bold text-white whitespace-nowrap shadow-xl"
                        style={{ backgroundColor: user.color }}
                    >
                        {user.name}
                    </div>
                </div>
            ))}
        </>
    );
};

export default RemoteCursors;
