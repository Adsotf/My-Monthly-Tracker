import React, { useState, useEffect, useMemo } from 'react';

/**
 * --------------------------------------------------------
 * 1. CUSTOM LOGO SETTINGS
 * Paste your image link between the quotes below.
 * Example: "https://raw.githubusercontent.com/username/repo/main/logo.png"
 * --------------------------------------------------------
 */
const LOGO_URL = "https://github.com/Adsotf/My-Monthly-Tracker/blob/main/Gemini_Generated_Image_4nloj54nloj54nlo.png?raw=true"; 


/**
 * ICONS (Dark Mode Optimized)
 */
const IconWrapper = ({ children, color = "currentColor", size = 20, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    {children}
  </svg>
);

const Icons = {
  Plus: (props) => (<IconWrapper {...props}><path d="M5 12h14"/><path d="M12 5v14"/></IconWrapper>),
  Trash: (props) => (<IconWrapper {...props}><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></IconWrapper>),
  PieChart: (props) => (<IconWrapper {...props}><path d="M21.21 15.89A10 10 0 1 1 8 2.83"/><path d="M22 12A10 10 0 0 0 12 2v10z"/></IconWrapper>),
  TrendingUp: (props) => (<IconWrapper {...props}><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></IconWrapper>),
  Alert: (props) => (<IconWrapper {...props}><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></IconWrapper>),
  Save: (props) => (<IconWrapper {...props}><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></IconWrapper>),
  Wallet: (props) => (<IconWrapper {...props}><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/><path d="M18 12a2 2 0 0 0 0 4h4v-4Z"/></IconWrapper>)
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

const getGroupColor = (group) => {
  switch(group) {
    case 'Needs': return '#60a5fa'; // Light Blue
    case 'Savings': return '#34d399'; // Emerald Green
    case 'Wants': return '#a78bfa'; // Light Purple
    default: return '#9ca3af';
  }
};

/**
 * COMPONENT: PIE CHART (Smaller & Centered)
 */
const SimplePieChart = ({ data }) => {
  const total = data.reduce((acc, item) => acc + item.value, 0);
  let currentAngle = 0;

  if (total === 0) return (
    <div className="flex items-center justify-center h-32 w-full bg-slate-800 rounded-lg text-slate-500 text-xs border border-slate-700">
      Add data to see chart
    </div>
  );

  return (
    <div className="relative h-32 w-32 mx-auto">
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
          return <path key={slice.name} d={pathData} fill={slice.color} className="opacity-90 hover:opacity-100 transition-opacity" />;
        })}
        {/* Inner circle for Donut look - matches bg color */}
        <circle cx="0" cy="0" r="0.65" fill="#1e293b" /> 
      </svg>
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="text-center">
          <span className="block text-[10px] text-slate-400 font-medium">Total</span>
          <span className="block text-xs font-bold text-slate-200">{formatCurrency(total)}</span>
        </div>
      </div>
    </div>
  );
};

/**
 * COMPONENT: BAR CHART
 */
const SimpleBarChart = ({ planned, actual, color }) => {
  const max = Math.max(planned, actual, 100); 
  const plannedPercent = (planned / max) * 100;
  const actualPercent = (actual / max) * 100;

  return (
    <div className="flex flex-col gap-1 w-full mt-2">
      <div className="flex items-center gap-2">
        <div className="w-12 text-[10px] text-slate-400 text-right">Plan</div>
        <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden">
          <div className="h-full rounded-full opacity-40" style={{ width: `${plannedPercent}%`, backgroundColor: color }}></div>
        </div>
        <div className="w-10 text-[10px] font-medium text-slate-300 text-right">{Math.round(planned)}</div>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-12 text-[10px] text-slate-400 text-right">Actual</div>
        <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden">
          <div className="h-full rounded-full" style={{ width: `${actualPercent}%`, backgroundColor: color }}></div>
        </div>
        <div className="w-10 text-[10px] font-bold text-white text-right">{Math.round(actual)}</div>
      </div>
    </div>
  );
};

/**
 * COMPONENT: GROUP SECTION
 */
const GroupSection = ({ title, groupKey, icon: Icon, categories, updateCategory, deleteCategory, addCategory, currency, summary }) => {
  const groupData = categories.filter(c => c.group === groupKey);
  const groupSummary = summary.groups[groupKey];
  const color = getGroupColor(groupKey);

  return (
    <div className="mb-6 bg-slate-800 rounded-xl shadow-lg border border-slate-700 overflow-hidden">
      <div className="bg-slate-800/50 px-4 py-3 border-b border-slate-700 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className={`p-1.5 rounded-md text-slate-900`} style={{ backgroundColor: color }}>
            <Icon size={16} />
          </div>
          <h2 className="font-bold text-slate-100">{title}</h2>
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
            <tr className="border-b border-slate-700 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
              <th className="px-4 py-2 w-1/2">Category</th>
              <th className="px-2 py-2 text-right">Plan</th>
              <th className="px-2 py-2 text-right">Actual</th>
              <th className="px-2 py-2 w-8"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {groupData.map(cat => (
                <tr key={cat.id} className="hover:bg-slate-700/50 transition-colors">
                  <td className="px-4 py-3">
                    <input 
                      type="text" 
                      value={cat.name}
                      onChange={(e) => updateCategory(cat.id, 'name', e.target.value)}
                      className="w-full bg-transparent border-b border-transparent focus:border-slate-500 text-slate-200 placeholder-slate-600 p-0 text-sm focus:ring-0 transition-colors"
                      placeholder="Name..."
                    />
                  </td>
                  <td className="px-2 py-3 text-right">
                    <input 
                      type="number" 
                      value={cat.planned}
                      onChange={(e) => updateCategory(cat.id, 'planned', parseFloat(e.target.value) || 0)}
                      className="w-full text-right bg-transparent border-b border-transparent focus:border-slate-500 text-slate-400 p-0 text-sm focus:ring-0 transition-colors"
                    />
                  </td>
                  <td className="px-2 py-3 text-right">
                    <input 
                      type="number" 
                      value={cat.actual}
                      onChange={(e) => updateCategory(cat.id, 'actual', parseFloat(e.target.value) || 0)}
                      className="w-full text-right bg-transparent border-b border-transparent focus:border-slate-500 text-slate-100 font-bold p-0 text-sm focus:ring-0 transition-colors"
                    />
                  </td>
                  <td className="px-2 py-3 text-center">
                    <button onClick={() => deleteCategory(cat.id)} className="text-slate-600 hover:text-red-400 transition-colors">
                      <Icons.Trash size={14} />
                    </button>
                  </td>
                </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan="4" className="px-4 py-3 bg-slate-800/30">
                <button onClick={() => addCategory(groupKey)} className="flex items-center gap-2 text-xs text-slate-400 hover:text-slate-200 font-medium transition-colors">
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

/**
 * MAIN APP COMPONENT
 */
const App = () => {
  // DEFAULT DATA
  const defaultCategories = [
    { id: 1, group: 'Needs', name: 'Rent / Mortgage', planned: 1000, actual: 1000 },
    { id: 2, group: 'Needs', name: 'Utilities', planned: 150, actual: 150 },
    { id: 3, group: 'Needs', name: 'Groceries', planned: 300, actual: 280 },
    { id: 8, group: 'Savings', name: 'Stocks & Shares ISA', planned: 400, actual: 400 },
    { id: 9, group: 'Savings', name: 'Emergency Fund', planned: 200, actual: 200 },
    { id: 12, group: 'Wants', name: 'Dining Out', planned: 100, actual: 120 },
  ];

  // STATE
  const [income, setIncome] = useState(() => {
    try { return JSON.parse(localStorage.getItem('budget_income')) || 3000; } catch (e) { return 3000; }
  });
  const [currency, setCurrency] = useState(() => localStorage.getItem('budget_currency') || '£');
  const [categories, setCategories] = useState(() => {
    try { return JSON.parse(localStorage.getItem('budget_categories')) || defaultCategories; } catch (e) { return defaultCategories; }
  });
  const [lastSaved, setLastSaved] = useState(null);

  // AUTO SAVE
  useEffect(() => {
    localStorage.setItem('budget_categories', JSON.stringify(categories));
    localStorage.setItem('budget_income', JSON.stringify(income));
    localStorage.setItem('budget_currency', currency);
    setLastSaved(new Date());
  }, [categories, income, currency]);

  // CALCULATIONS
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

  // HANDLERS
  const updateCategory = (id, field, value) => {
    setCategories(prev => prev.map(cat => cat.id === id ? { ...cat, [field]: value } : cat));
  };
  const addCategory = (group) => {
    setCategories(prev => [...prev, { id: Date.now(), group, name: 'New Item', planned: 0, actual: 0 }]);
  };
  const deleteCategory = (id) => {
    if (confirm('Delete this item?')) setCategories(prev => prev.filter(c => c.id !== id));
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans pb-20">
      
      {/* HEADER */}
      <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-10">
        <div className="max-w-xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
             {LOGO_URL ? (
              <img src={LOGO_URL} alt="Logo" className="w-8 h-8 rounded object-cover ring-2 ring-slate-700" />
            ) : (
              <div className="bg-blue-500 p-1.5 rounded text-slate-900">
                <Icons.Wallet size={18} />
              </div>
            )}
            <h1 className="font-bold text-lg text-slate-100 tracking-tight">Budget</h1>
          </div>
          <div className="flex flex-col items-end">
             <div className="flex items-center bg-slate-800 rounded-lg p-1 border border-slate-700">
                <select value={currency} onChange={(e) => setCurrency(e.target.value)} className="bg-transparent border-none font-bold text-slate-400 text-sm w-8 pl-2 focus:ring-0 cursor-pointer">
                  <option value="£">£</option><option value="$">$</option><option value="€">€</option>
                </select>
                <input 
                  type="number" value={income} onChange={(e) => setIncome(parseFloat(e.target.value) || 0)}
                  className="w-20 text-right font-bold text-base bg-transparent text-white border-l border-slate-600 px-2 focus:ring-0"
                />
             </div>
          </div>
        </div>
      </header>

      <main className="max-w-xl mx-auto px-4 py-6">
        
        {/* DASHBOARD */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {/* Pie Chart Card */}
          <div className="bg-slate-800 p-4 rounded-xl shadow-lg border border-slate-700 flex flex-col items-center justify-center">
            <SimplePieChart data={[
              { name: 'Needs', value: summary.groups.Needs.actual, color: getGroupColor('Needs') },
              { name: 'Wants', value: summary.groups.Wants.actual, color: getGroupColor('Wants') },
              { name: 'Savings', value: summary.groups.Savings.actual, color: getGroupColor('Savings') }
            ]} />
          </div>

          {/* Stats Cards */}
          <div className="flex flex-col gap-4">
             <div className="bg-slate-800 p-4 rounded-xl shadow-lg border border-slate-700 text-center flex-1 flex flex-col justify-center">
                <div className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold">Remaining</div>
                <div className={`text-2xl font-bold mt-1 ${summary.remaining < 0 ? 'text-red-400' : 'text-slate-100'}`}>
                  {formatCurrency(summary.remaining, currency)}
                </div>
             </div>
             <div className="bg-slate-800 p-4 rounded-xl shadow-lg border border-slate-700 text-center flex-1 flex flex-col justify-center">
                <div className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold">Invested</div>
                <div className="text-2xl font-bold mt-1 text-emerald-400">
                  {Math.round((summary.groups.Savings.actual / income) * 100)}%
                </div>
             </div>
          </div>
        </div>

        {/* COMPARISON BARS */}
        <div className="bg-slate-800 p-5 rounded-xl shadow-lg border border-slate-700 mb-8">
           <SimpleBarChart planned={summary.groups.Needs.planned} actual={summary.groups.Needs.actual} color={getGroupColor('Needs')} />
           <SimpleBarChart planned={summary.groups.Wants.planned} actual={summary.groups.Wants.actual} color={getGroupColor('Wants')} />
           <SimpleBarChart planned={summary.groups.Savings.planned} actual={summary.groups.Savings.actual} color={getGroupColor('Savings')} />
        </div>

        {/* LISTS - Now passing all necessary props to external component */}
        <GroupSection 
          title="Needs" 
          groupKey="Needs" 
          icon={Icons.Alert}
          categories={categories}
          updateCategory={updateCategory}
          deleteCategory={deleteCategory}
          addCategory={addCategory}
          currency={currency}
          summary={summary}
        />
        <GroupSection 
          title="Investments" 
          groupKey="Savings" 
          icon={Icons.TrendingUp}
          categories={categories}
          updateCategory={updateCategory}
          deleteCategory={deleteCategory}
          addCategory={addCategory}
          currency={currency}
          summary={summary}
        />
        <GroupSection 
          title="Wants" 
          groupKey="Wants" 
          icon={Icons.PieChart}
          categories={categories}
          updateCategory={updateCategory}
          deleteCategory={deleteCategory}
          addCategory={addCategory}
          currency={currency}
          summary={summary}
        />
        
        <div className="text-center text-[10px] text-slate-600 mt-8 pb-8 flex justify-center items-center gap-2">
           {lastSaved && <><Icons.Save size={12}/> Auto-saved locally</>}
        </div>

      </main>
    </div>
  );
};

export default App;