import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '@hooks/useAppDispatch';
import { createCharacter } from '@store/slices/playerSlice';
import { CharacterClass } from '@/types/game.types';

const CHARACTER_CLASSES: Array<{
  id: CharacterClass;
  name: string;
  description: string;
}> = [
  { id: 'WARRIOR', name: 'Warrior', description: 'Balanced fighter with strong offense' },
  { id: 'TANK', name: 'Tank', description: 'High defense, protects allies' },
  { id: 'BALANCED', name: 'Balanced', description: 'Jack of all trades' },
  { id: 'MAGE', name: 'Mage', description: 'Powerful magic attacks' },
  { id: 'ASSASSIN', name: 'Assassin', description: 'Fast and deadly' },
];

const CharacterCreation: React.FC = () => {
  const [name, setName] = useState('');
  const [selectedClass, setSelectedClass] = useState<CharacterClass | ''>('');
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !selectedClass) {
      alert('Please enter a name and select a class');
      return;
    }

    dispatch(createCharacter({ name: name.trim(), class: selectedClass as CharacterClass }));
    navigate('/title');
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="card w-full max-w-2xl p-8">
        <h1 className="mb-2 text-center font-gaming text-4xl font-bold text-primary-400">
          Ludus Magnus: Reborn
        </h1>
        <h2 className="mb-8 text-center text-2xl font-semibold text-gray-300">
          Create Your Gladiator
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name Input */}
          <div>
            <label htmlFor="name" className="mb-2 block text-lg font-semibold text-gray-300">
              Gladiator Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className="input-field"
              maxLength={20}
              autoFocus
            />
          </div>

          {/* Class Selection */}
          <div>
            <label className="mb-2 block text-lg font-semibold text-gray-300">
              Select Your Class
            </label>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {CHARACTER_CLASSES.map((charClass) => (
                <button
                  key={charClass.id}
                  type="button"
                  onClick={() => setSelectedClass(charClass.id)}
                  className={`rounded-lg border-2 p-4 text-left transition-all ${
                    selectedClass === charClass.id
                      ? 'border-primary-500 bg-primary-500/20'
                      : 'border-gray-600 hover:border-primary-500/50'
                  }`}
                >
                  <h3 className="mb-1 text-xl font-bold text-white">{charClass.name}</h3>
                  <p className="text-sm text-gray-400">{charClass.description}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="btn-primary w-full py-3 text-lg font-bold"
            disabled={!name.trim() || !selectedClass}
          >
            Begin Your Journey
          </button>
        </form>
      </div>
    </div>
  );
};

export default CharacterCreation;
