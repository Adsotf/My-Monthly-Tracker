import React, { useState, useEffect, useMemo } from 'react';

/**
 * BUILT-IN ICONS (No installation required)
 */
const IconWrapper = ({ children, color = "currentColor", size = 24, className = "" }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke={color} 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
    className={className}
  >
    {children}
  </svg>
);

const Icons = {
  Plus: (props) => (
    <IconWrapper {...props}><path d="M5 12h14"/><path d="M12 5v14"/></IconWrapper>
  ),
  Trash: (props) => (
    <IconWrapper {...props}><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></IconWrapper>
  ),
  PieChart: (props) => (
    <IconWrapper {...props}><path d="M21.21 15.89A10 10 0 1 1 8 2.83"/><path d="M22 12A10 10 0 0 0 12 2v10z"/></IconWrapper>
  ),
  TrendingUp: (props) => (
    <IconWrapper {...props}><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></IconWrapper>
  ),
  Alert: (props) => (
    <IconWrapper {...props}><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></IconWrapper>
  ),
  Save: (props) => (
    <IconWrapper {...props}><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></IconWrapper>
  ),
  Wallet: (props) => (
    <IconWrapper {...props}><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/><path d="M18 12a2 2 0 0 0 0 4h4v-4Z"/></IconWrapper>
  )
};

/**
 * UTILITY FUNCTIONS
 */
const formatCurrency = (amount, currencySymbol = '£') => {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: currencySymbol === '£' ? 'GBP' : currencySymbol === '$' ? 'USD' : 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

// Simple Pie Chart Component
const SimplePieChart = ({ data }) => {
  const total = data.reduce((acc, item) => acc + item.value, 0);
  let currentAngle = 0;

  if (total === 0) return (
    <div className="flex items-center justify-center h-48 w-full bg-gray-50 rounded-lg text-gray-400 text-sm">
      Add data to see chart
    </div>
  );

  return (
    <div className="relative h-48 w-48 mx-auto">
      <svg viewBox="-1 -1 2 2" className="transform -rotate-90 w-full h-full">
        {data.map((slice, index) => {
          const sliceAngle = (slice.value / total) * 2 * Math.PI;
          const x1 = Math.cos(currentAngle);
          const y1 = Math.sin(currentAngle);
          const x2 = Math.cos(currentAngle + sliceAngle);
          const y2 = Math.sin(currentAngle + sliceAngle);
          const largeArcFlag = sliceAngle > Math.PI ? 1 : 0;
          
          const pathData = `M 0 0 L ${x1} ${y1} A 1 1 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
          currentAngle += sliceAngle;

          return (
            <path
              key={slice.name}
              d={pathData}
              fill={slice.color}
            />
          );
        })}
        <circle cx="0" cy="0" r="0.6" fill="white" />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="text-center">
          <span className="block text-xs text-gray-500 font-medium">Total</span>
          <span className="block text-sm font-bold text-gray-800">{formatCurrency(total)}</span>
        </div>
      </div>
    </div>
  );
};

const SimpleBarChart = ({ planned, actual, color }) => {
  const max = Math.max(planned, actual, 100); 
  const plannedPercent = (planned / max) * 100;
  const actualPercent = (actual / max) * 100;

  return (
    <div className="flex flex-col gap-1 w-full mt-2">
      <div className="flex items-center gap-2">
        <div className="w-16 text-xs text-gray-500 text-right">Planned</div>
        <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
          <div className="h-full rounded-full opacity-40" style={{ width: `${plannedPercent}%`, backgroundColor: color }}></div>
        </div>
        <div className="w-12 text-xs font-medium text-right">{Math.round(planned)}</div>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-16 text-xs text-gray-500 text-right">Actual</div>
        <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
          <div className="h-full rounded-full" style={{ width: `${actualPercent}%`, backgroundColor: color }}></div>
        </div>
        <div className="w-12 text-xs font-bold text-right">{Math.round(actual)}</div>
      </div>
    </div>
  );
};

/**
 * MAIN APP
 */
const App = () => {
  // DEFAULT DATA
  const defaultCategories = [
    { id: 1, group: 'Needs', name: 'Rent / Mortgage', planned: 1000, actual: 1000 },
    { id: 2, group: 'Needs', name: 'Utilities', planned: 150, actual: 150 },
    { id: 3, group: 'Needs', name: 'Groceries', planned: 300, actual: 280 },
    { id: 4, group: 'Needs', name: 'Transport', planned: 150, actual: 160 },
    { id: 8, group: 'Savings', name: 'Stocks & Shares ISA', planned: 400, actual: 400 },
    { id: 9, group: 'Savings', name: 'Emergency Fund', planned: 200, actual: 200 },
    { id: 10, group: 'Savings', name: 'ETFs', planned: 150, actual: 150 },
    { id: 12, group: 'Wants', name: 'Dining Out', planned: 100, actual: 120 },
    { id: 13, group: 'Wants', name: 'Entertainment', planned: 50, actual: 45 },
  ];

  // --- STATE WITH LOCAL STORAGE ---
  const [income, setIncome] = useState(() => {
    try {
      const saved = localStorage.getItem('budget_income');
      return saved ? JSON.parse(saved) : 3000;
    } catch (e) { return 3000; }
  });

  const [currency, setCurrency] = useState(() => {
    return localStorage.getItem('budget_currency') || '£';
  });
  
  const [categories, setCategories] = useState(() => {
    try {
      const saved = localStorage.getItem('budget_categories');
      return saved ? JSON.parse(saved) : defaultCategories;
    } catch (e) { return defaultCategories; }
  });

  const [lastSaved, setLastSaved] = useState(null);

  // --- AUTO SAVE EFFECT ---
  useEffect(() => {
    localStorage.setItem('budget_categories', JSON.stringify(categories));
    localStorage.setItem('budget_income', JSON.stringify(income));
    localStorage.setItem('budget_currency', currency);
    setLastSaved(new Date());
  }, [categories, income, currency]);

  // --- CALCULATIONS ---
  const summary = useMemo(() => {
    const groups = { Needs: { planned: 0, actual: 0 }, Wants: { planned: 0, actual: 0 }, Savings: { planned: 0, actual: 0 } };
    
    categories.forEach(cat => {
      if (groups[cat.group]) {
        groups[cat.group].planned += (Number(cat.planned) || 0);
        groups[cat.group].actual += (Number(cat.actual) || 0);
      }
    });

    const totalActual = Object.values(groups).reduce((acc, g) => acc + g.actual, 0);
    const remaining = income - totalActual;
    return { groups, totalActual, remaining };
  }, [categories, income]);

  // --- HANDLERS ---
  const updateCategory = (id, field, value) => {
    setCategories(prev => prev.map(cat => 
      cat.id === id ? { ...cat, [field]: value } : cat
    ));
  };

  const addCategory = (group) => {
    const newId = Date.now(); 
    setCategories([...categories, { id: newId, group, name: 'New Category', planned: 0, actual: 0 }]);
  };

  const deleteCategory = (id) => {
    if (confirm('Delete this category?')) {
      setCategories(prev => prev.filter(c => c.id !== id));
    }
  };

  const getGroupColor = (group) => {
    switch(group) {
      case 'Needs': return '#3b82f6';
      case 'Savings': return '#10b981';
      case 'Wants': return '#8b5cf6';
      default: return '#9ca3af';
    }
  };

  const GroupSection = ({ title, groupKey, icon: Icon }) => {
    const groupData = categories.filter(c => c.group === groupKey);
    const groupSummary = summary.groups[groupKey];
    const color = getGroupColor(groupKey);

    return (
      <div className="mb-8 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="bg-gray-50 px-4 py-3 border-b border-gray-100 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className={`p-1.5 rounded-md text-white`} style={{ backgroundColor: color }}>
              <Icon size={16} color="white" />
            </div>
            <h2 className="font-bold text-gray-800">{title}</h2>
          </div>
          <div className="text-right">
             <div className={`font-bold`} style={{ color: color }}>
               {formatCurrency(groupSummary.actual, currency)}
             </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 text-xs font-semibold text-gray-500 uppercase">
                <th className="px-4 py-2 w-1/3">Category</th>
                <th className="px-4 py-2 text-right">Plan</th>
                <th className="px-4 py-2 text-right">Actual</th>
                <th className="px-2 py-2 w-8"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {groupData.map(cat => (
                  <tr key={cat.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2">
                      <input 
                        type="text" 
                        value={cat.name}
                        onChange={(e) => updateCategory(cat.id, 'name', e.target.value)}
                        className="w-full bg-transparent border-none text-gray-700 p-0 text-sm font-medium focus:ring-0"
                      />
                    </td>
                    <td className="px-4 py-2 text-right">
                      <input 
                        type="number" 
                        value={cat.planned}
                        onChange={(e) => updateCategory(cat.id, 'planned', parseFloat(e.target.value) || 0)}
                        className="w-full text-right bg-transparent border-none text-gray-500 p-0 text-sm focus:ring-0"
                      />
                    </td>
                    <td className="px-4 py-2 text-right">
                      <input 
                        type="number" 
                        value={cat.actual}
                        onChange={(e) => updateCategory(cat.id, 'actual', parseFloat(e.target.value) || 0)}
                        className="w-full text-right bg-transparent border-none text-gray-900 font-bold p-0 text-sm focus:ring-0"
                      />
                    </td>
                    <td className="px-2 py-2 text-center">
                      <button onClick={() => deleteCategory(cat.id)} className="text-gray-300 hover:text-red-500">
                        <Icons.Trash size={14} />
                      </button>
                    </td>
                  </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan="4" className="px-4 py-2 bg-gray-50">
                  <button onClick={() => addCategory(groupKey)} className="flex items-center gap-2 text-xs text-gray-500 hover:text-gray-800 font-medium">
                    <Icons.Plus size={14} /> Add Category
                  </button>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 font-sans pb-20">
      {/* HEADER */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-1.5 rounded-lg">
              <Icons.Wallet size={20} color="white" />
            </div>
            <h1 className="font-bold text-gray-900">Budget</h1>
          </div>
          <div className="flex flex-col items-end">
             <div className="flex items-center">
                <select value={currency} onChange={(e) => setCurrency(e.target.value)} className="bg-transparent border-none font-bold text-gray-500 text-sm w-6 p-0 mr-1 cursor-pointer">
                  <option value="£">£</option><option value="$">$</option><option value="€">€</option>
                </select>
                <input 
                  type="number" value={income} onChange={(e) => setIncome(parseFloat(e.target.value) || 0)}
                  className="w-20 text-right font-bold text-lg bg-gray-100 rounded px-1 focus:ring-2 focus:ring-blue-500"
                />
             </div>
             <span className="text-[10px] text-gray-400 flex items-center gap-1">
               {lastSaved && <><Icons.Save size={8}/> Saved</>}
             </span>
          </div>
        </div>
      </header>

      <main className="max-w-xl mx-auto px-4 py-6">
        
        {/* SUMMARY CARDS */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center">
            <SimplePieChart data={[
              { name: 'Needs', value: summary.groups.Needs.actual, color: getGroupColor('Needs') },
              { name: 'Wants', value: summary.groups.Wants.actual, color: getGroupColor('Wants') },
              { name: 'Savings', value: summary.groups.Savings.actual, color: getGroupColor('Savings') }
            ]} />
          </div>
          <div className="flex flex-col gap-4">
             <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 text-center flex-1 flex flex-col justify-center">
                <div className="text-xs text-gray-500 uppercase tracking-wide">Remaining</div>
                <div className={`text-2xl font-bold ${summary.remaining < 0 ? 'text-red-500' : 'text-gray-800'}`}>
                  {formatCurrency(summary.remaining, currency)}
                </div>
             </div>
             <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 text-center flex-1 flex flex-col justify-center">
                <div className="text-xs text-gray-500 uppercase tracking-wide">Invested</div>
                <div className="text-2xl font-bold text-green-600">
                  {Math.round((summary.groups.Savings.actual / income) * 100)}%
                </div>
             </div>
          </div>
        </div>

        {/* BARS */}
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 mb-6">
           <SimpleBarChart planned={summary.groups.Needs.planned} actual={summary.groups.Needs.actual} color={getGroupColor('Needs')} />
           <SimpleBarChart planned={summary.groups.Wants.planned} actual={summary.groups.Wants.actual} color={getGroupColor('Wants')} />
           <SimpleBarChart planned={summary.groups.Savings.planned} actual={summary.groups.Savings.actual} color={getGroupColor('Savings')} />
        </div>

        {/* LISTS */}
        <GroupSection title="Needs (50%)" groupKey="Needs" icon={Icons.Alert} />
        <GroupSection title="Investments (20%)" groupKey="Savings" icon={Icons.TrendingUp} />
        <GroupSection title="Wants (30%)" groupKey="Wants" icon={Icons.PieChart} />
        
        <div className="text-center text-xs text-gray-400 mt-8 pb-8">
           Data saves automatically to your device.
        </div>

      </main>
    </div>
  );
};

export default App;