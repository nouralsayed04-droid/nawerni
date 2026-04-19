function getDaysLeft(expiry) {
  return Math.ceil((new Date(expiry) - new Date()) / (1000 * 60 * 60 * 24));
}
export default function Analytics({ items, allergies }) {
  const total = items.length || 1;
  const food = items.filter(i => i.cat === 'food').length;
  const med = items.filter(i => i.cat === 'medicine').length;
  const other = items.filter(i => i.cat === 'other').length;
  const expired = items.filter(i => getDaysLeft(i.expiry) < 0).length;
  const soon = items.filter(i => { const d = getDaysLeft(i.expiry); return d >= 0 && d <= 14; }).length;
  const good = items.filter(i => getDaysLeft(i.expiry) > 14).length;
  const score = items.length === 0 ? 0 : Math.round((good / total) * 100);
  const soonItems = items.filter(i => { const d = getDaysLeft(i.expiry); return d >= 0 && d <= 7; });

  const Bar = ({ label, value, total, cls }) => (
    <div className="chart-bar-wrap">
      <div className="chart-bar-label"><span>{label}</span><span>{value}</span></div>
      <div className="chart-bar-bg"><div className={`chart-bar-fill ${cls||''}`} style={{width: Math.round(value/total*100)+'%'}}/></div>
    </div>
  );

  return (
    <div>
      <div className="insight-card">
        <div style={{fontWeight:'500'}}>Waste Reduction Score</div>
        <div style={{fontSize:'28px',fontWeight:'500',color:'#2D5A3D',margin:'8px 0'}}>{score}%</div>
        <div style={{fontSize:'12px',color:'#888'}}>{items.length===0?'Add items to see your score':score>70?'Excellent! Keep it up!':score>40?'Good progress!':'Try to use items before they expire'}</div>
      </div>
      <div className="section-title">Items by Category</div>
      <Bar label="Food" value={food} total={total} />
      <Bar label="Medicine" value={med} total={total} cls="amber" />
      <Bar label="Other" value={other} total={total} cls="red" />
      <div className="section-title">Expiry Status</div>
      <Bar label="Expired" value={expired} total={total} cls="red" />
      <Bar label="Expiring soon" value={soon} total={total} cls="amber" />
      <Bar label="Good" value={good} total={total} />
      <div className="section-title">AI Suggestions</div>
      {soonItems.length === 0
        ? <div className="insight-card"><div style={{fontSize:'13px',color:'#888'}}>Add items to get personalized suggestions</div></div>
        : soonItems.map((item, i) => (
            <div key={i} className="insight-card">
              <div style={{fontWeight:'500'}}>Use {item.name} soon</div>
              <div style={{fontSize:'12px',color:'#888',marginTop:'4px'}}>
                {item.cat==='food'
                  ? `Try cooking with it${allergies.length>0?' (avoiding '+allergies.join(', ')+')':''} or donate`
                  : 'Check with a pharmacist about safe disposal'}
              </div>
            </div>
          ))
      }
    </div>
  )
}