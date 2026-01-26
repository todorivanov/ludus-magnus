import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '@hooks/useAppSelector';

const TitleScreen: React.FC = () => {
  const navigate = useNavigate();
  const playerName = useAppSelector((state) => state.player.name);
  const playerClass = useAppSelector((state) => state.player.class);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <div className="card w-full max-w-2xl p-8 text-center">
        <h1 className="mb-4 font-gaming text-5xl font-bold text-primary-400 text-shadow-lg">
          Ludus Magnus: Reborn
        </h1>
        <p className="mb-8 text-lg text-gray-400 italic">Build Your Gladiator Empire</p>

        <div className="mb-8 text-xl text-gray-300">
          <p>Welcome, <span className="font-bold text-primary-400">{playerName}</span></p>
          <p className="text-sm text-gray-400">Class: {playerClass}</p>
        </div>

        <div className="space-y-4">
          <button
            onClick={() => navigate('/game')}
            className="btn-primary w-full py-4 text-xl"
          >
            ⚔️ Enter Arena
          </button>
          
          <button
            onClick={() => navigate('/ludus')}
            className="btn-primary w-full py-4 text-xl"
          >
            🏛️ Manage Ludus
          </button>
          
          <button
            onClick={() => navigate('/tournament')}
            className="btn-primary w-full py-4 text-xl"
          >
            🏆 Enter Tournament
          </button>
          
          <button
            onClick={() => navigate('/profile')}
            className="btn-secondary w-full py-4 text-xl"
          >
            📊 View Profile
          </button>
          
          <button
            className="btn-secondary w-full py-4 text-xl"
            disabled
          >
            🗺️ Explore World (Coming Soon)
          </button>
        </div>
      </div>
    </div>
  );
};

export default TitleScreen;
