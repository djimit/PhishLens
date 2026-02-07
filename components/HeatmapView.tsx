
import React from 'react';
import { CharacterWeight } from '../types';

interface HeatmapViewProps {
  heatmap: CharacterWeight[];
}

const HeatmapView: React.FC<HeatmapViewProps> = ({ heatmap }) => {
  /**
   * Generates a subtle background color overlay based on character weight.
   * Uses a non-linear scale to emphasize critical markers while keeping low weights subtle.
   */
  const getBackgroundColor = (weight: number) => {
    if (weight < 0.04) return 'transparent';
    
    // Non-linear intensity scaling (weight^0.9) to make moderate weights more visible
    const intensity = Math.pow(weight, 0.9);
    
    // Primary "Phish" color: Rose-500 (rgb 244, 63, 94)
    // We cap alpha at 0.75 to ensure the dark terminal background still provides depth
    return `rgba(244, 63, 94, ${intensity * 0.75})`; 
  };

  /**
   * Dynamically adjusts text color for readability.
   * Switches to bright white for high-intensity backgrounds and stays slate-300 for neutral ones.
   */
  const getTextColor = (weight: number) => {
    if (weight > 0.45) return '#ffffff';
    return '#cbd5e1';
  };

  /**
   * Adds a subtle text shadow to create a "lifted" effect and improve contrast.
   */
  const getTextShadow = (weight: number) => {
    if (weight < 0.2) return 'none';
    const opacity = Math.min(weight, 0.5);
    return `0 1px 2px rgba(0, 0, 0, ${opacity})`;
  };

  return (
    <div 
      className="w-full h-56 p-4 bg-[#1e293b] border border-slate-700 rounded-lg overflow-y-auto font-mono text-sm leading-relaxed break-all whitespace-pre-wrap shadow-inner ring-1 ring-slate-800 scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-transparent select-text"
    >
      <div className="relative z-10 antialiased">
        {heatmap.map((item, index) => {
          const backgroundColor = getBackgroundColor(item.weight);
          const textColor = getTextColor(item.weight);
          const textShadow = getTextShadow(item.weight);
          const hasLabel = !!item.label;
          
          return (
            <span
              key={index}
              style={{ 
                backgroundColor,
                color: textColor,
                textShadow,
                transition: 'all 0.2s ease-in-out'
              }}
              className={`inline px-[0.5px] rounded-[1px] relative group ${
                item.weight > 0.4 ? 'font-bold' : 'font-normal'
              } ${item.weight > 0.1 || hasLabel ? 'cursor-help' : ''} ${
                hasLabel ? 'border-b border-dotted border-white/40' : ''
              }`}
            >
              {item.char}
              
              {/* Custom Tooltip for Context */}
              {(hasLabel || item.weight > 0.2) && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-slate-900 text-white text-[10px] rounded shadow-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 border border-slate-700 font-sans tracking-wide">
                  <div className="flex flex-col gap-0.5">
                    {hasLabel && <span className="font-bold text-rose-400 uppercase tracking-tighter">{item.label}</span>}
                    <span className="text-slate-400">Impact: {Math.round(item.weight * 100)}%</span>
                  </div>
                  {/* Tooltip Arrow */}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900"></div>
                </div>
              )}
            </span>
          );
        })}
      </div>
    </div>
  );
};

export default HeatmapView;
