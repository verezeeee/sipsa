import React from 'react';

type RiskLevel = 'high' | 'medium' | 'low' | 'none';

interface DayRisk {
  day: number;
  risk: RiskLevel;
}

const mockSeasonalityData: { [month: string]: DayRisk[] } = {
  Jan: Array.from({ length: 30 }, (_, i) => ({ day: i + 1, risk: ['low', 'medium', 'none'][Math.floor(Math.random() * 3)] as RiskLevel })),
  Fev: Array.from({ length: 30 }, (_, i) => ({ day: i + 1, risk: ['high', 'medium', 'low'][Math.floor(Math.random() * 3)] as RiskLevel })),
  Mar: Array.from({ length: 30 }, (_, i) => ({ day: i + 1, risk: ['high', 'medium', 'none'][Math.floor(Math.random() * 3)] as RiskLevel })),
  Abr: Array.from({ length: 30 }, (_, i) => ({ day: i + 1, risk: ['low', 'medium', 'none'][Math.floor(Math.random() * 3)] as RiskLevel })),
  Mai: Array.from({ length: 30 }, (_, i) => ({ day: i + 1, risk: ['high', 'low', 'none'][Math.floor(Math.random() * 3)] as RiskLevel })),
  Jun: Array.from({ length: 30 }, (_, i) => ({ day: i + 1, risk: ['high', 'medium', 'low'][Math.floor(Math.random() * 3)] as RiskLevel })),
  Jul: Array.from({ length: 30 }, (_, i) => ({ day: i + 1, risk: ['high', 'medium', 'none'][Math.floor(Math.random() * 3)] as RiskLevel })),
  Ago: Array.from({ length: 30 }, (_, i) => ({ day: i + 1, risk: ['high', 'medium', 'low'][Math.floor(Math.random() * 3)] as RiskLevel })),
  Set: Array.from({ length: 30 }, (_, i) => ({ day: i + 1, risk: ['low', 'medium', 'none'][Math.floor(Math.random() * 3)] as RiskLevel })),
  Out: Array.from({ length: 30 }, (_, i) => ({ day: i + 1, risk: ['high', 'medium', 'none'][Math.floor(Math.random() * 3)] as RiskLevel })),
  Nov: Array.from({ length: 30 }, (_, i) => ({ day: i + 1, risk: ['high', 'medium', 'low'][Math.floor(Math.random() * 3)] as RiskLevel })),
  Dez: Array.from({ length: 30 }, (_, i) => ({ day: i + 1, risk: ['low', 'medium', 'none'][Math.floor(Math.random() * 3)] as RiskLevel })),
};

const riskColorMap: Record<RiskLevel, string> = {
  high: 'bg-[#D9534F]',
  medium: 'bg-[#F0AD4E]',
  low: 'bg-[#5CB85C]',
  none: 'bg-[#EEF2FE]',
};

const SeasonalityRisk2026 = () => {
  const months = Object.keys(mockSeasonalityData);

  return (
    <div className="bg-white rounded-2xl px-8 py-6 shadow-md">
      <h2 className="text-gray-700 text-base mb-6">Sazonalidade de Risco (2026)</h2>

      <div className="grid grid-cols-12 gap-x-2">
        {/* Month Headers */}
        {months.map(month => (
          <div key={month} className="text-center text-gray-500 text-sm mb-2">{month}</div>
        ))}

        {/* Heatmap Cells */}
        {months.map(month => (
          <div key={`${month}-cells`} className="grid grid-cols-5 gap-1">
            {mockSeasonalityData[month].map(day => (
              <div key={day.day} className={`w-3 h-3 rounded-sm ${riskColorMap[day.risk]}`}></div>
            ))}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex justify-end items-center gap-4 text-xs text-gray-500 mt-6">
        <span><span className="inline-block w-3 h-3 bg-[#D9534F] rounded-sm mr-1"></span>70% a 100%</span>
        <span><span className="inline-block w-3 h-3 bg-[#F0AD4E] rounded-sm mr-1"></span>30% a 69%</span>
        <span><span className="inline-block w-3 h-3 bg-[#5CB85C] rounded-sm mr-1"></span>0% a 29%</span>
      </div>
    </div>
  );
};

export default SeasonalityRisk2026;
