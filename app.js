
const DATA_URL = 'data/site-data.json';
const $ = s => document.querySelector(s);
let db = null;
async function init(){
  try{const r=await fetch(DATA_URL);if(!r.ok)throw new Error('تعذر تحميل البيانات');db=await r.json();render();}
  catch(e){$('#articleGrid').innerHTML='<p>تعذر تحميل محتوى الموسوعة. تأكد من تشغيل الموقع عبر خادم محلي أو GitHub Pages.</p>';}
}
function render(){
  $('#stats').innerHTML=[[''+db.articles.length,'مقالات منشورة في هذه النسخة'],[''+db.people.length,'شخصية موثقة مبدئيًا'],[''+db.events.length,'حدثًا في الخط الزمني الأولي']].map(x=>`<div class="stat"><strong>${x[0]}</strong><span>${x[1]}</span></div>`).join('');
  $('#articleGrid').innerHTML=db.articles.map(a=>card(a)).join('');
  $('#eraFilter').innerHTML='<option value="">كل العصور</option>'+[...new Set(db.articles.map(a=>a.era))].map(e=>`<option>${esc(e)}</option>`).join('');
  $('#timelineList').innerHTML=db.events.map(e=>`<div class="time-item"><strong>${esc(e.name)}</strong><span>${esc(e.date)}</span></div>`).join('');
  $('#peopleGrid').innerHTML=db.people.map(p=>`<div class="person">${esc(p.name)}<small>${esc(p.type)} · ${esc(p.period)}</small></div>`).join('');
  $('#eraFilter').addEventListener('change',filter);
  $('#searchBtn').addEventListener('click',search);
  $('#searchInput').addEventListener('keydown',e=>{if(e.key==='Enter')search();});
}
function card(a){return `<article class="article-card" data-era="${esc(a.era)}"><span class="tag">${esc(a.category)} · ${esc(a.date)}</span><h3>${esc(a.title)}</h3><p>${esc(a.summary)}</p><a class="read" href="articles/${encodeURIComponent(a.id)}.html">اقرأ المقال ←</a></article>`;}
function filter(){const v=$('#eraFilter').value;document.querySelectorAll('.article-card').forEach(c=>c.hidden=!!v&&c.dataset.era!==v);}
function search(){const q=$('#searchInput').value.trim().toLowerCase();let matches=db.articles.filter(a=>(a.title+' '+a.summary+' '+a.era+' '+a.category).toLowerCase().includes(q));$('#articleGrid').innerHTML=matches.map(card).join('')||'<p>لا توجد نتائج مطابقة. جرّب كلمة أخرى.</p>';$('#searchStatus').textContent=q?`نتائج البحث: ${matches.length}`:'';$('#articles').scrollIntoView({behavior:'smooth'});}
function esc(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
init();
