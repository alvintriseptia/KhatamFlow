import React from 'react';
import { MushafType } from '@/types/mushaf';
import { Card } from '../common/Card';
import './Onboarding.css';

interface MushafSelectorProps {
  selected: MushafType;
  onSelect: (type: MushafType) => void;
}

const MUSHAF_OPTIONS = [
  {
    type: 'madinah-604' as MushafType,
    name: 'Madinah Mushaf',
    pages: 604,
    description: 'Standard Saudi Arabian Mushaf'
  }
];

export const MushafSelector: React.FC<MushafSelectorProps> = ({ selected, onSelect }) => {
  return (
    <div className="mushaf-selector">
      <h2 className="mb-2">Choose Your Mushaf</h2>
      <p className="text-secondary mb-3">Select the Quran edition you'll be reading from</p>

      <div className="mushaf-options">
        {MUSHAF_OPTIONS.map((option) => (
          <Card
            key={option.type}
            className={`mushaf-option ${selected === option.type ? 'mushaf-option--selected' : ''}`}
            onClick={() => onSelect(option.type)}
          >
            <div className="mushaf-option__header">
              <input
                type="radio"
                checked={selected === option.type}
                onChange={() => onSelect(option.type)}
                className="mushaf-option__radio"
              />
              <div>
                <h3>{option.name}</h3>
                <p className="text-secondary">{option.pages} pages</p>
              </div>
            </div>
            <p className="text-secondary mt-1">{option.description}</p>
          </Card>
        ))}
      </div>
    </div>
  );
};
