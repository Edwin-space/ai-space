const $=s=>document.querySelector(s);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function sameTopic(a,b){if(a.id===b.id)return false;const ac=new Set(a.categories||[]),ae=new Set(a.entities||[]);return (b.categories||[]).some(x=>ac.has(x))||(b.entities||[]).some(x=>ae.has(x))}
function card(story){const a=document.createElement('a');a.className='story-card compact';a.href=`./article.html?id=${encodeURIComponent(story.id)}`;a.innerHTML=`<div class="story-meta"><span class="badge">${esc((story.categories||[])[0]||story.type||'AI')}</span><span>${esc(story.publishedAt||'')}</span></div><h3>${esc(story.title)}</h3><p class="story-summary">${esc(story.summary||'')}</p><div class="story-footer">${(story.tags||[]).slice(0,4).map(t=>`<span class="badge">#${esc(t)}</span>`).join('')}</div>`;return a}
async function init(){
  const id=new URLSearchParams(location.search).get('id');
  const [data,details]=await Promise.all([
    fetch('./data/index.json').then(r=>r.json()),
    fetch('./data/details.json').then(r=>r.json()).catch(()=>({}))
  ]);
  const story=(data.items||[]).find(x=>x.id===id);
  if(!story){$('#article').innerHTML='<div class="empty">콘텐츠를 찾을 수 없습니다.</div>';return}
  document.title=`${story.title} · AI Space`;
  const body={...(story.body||{}),...(details[story.id]||{})};
  const sections=[];
  if(body.lede||story.summary)sections.push(`<p class="article-lede">${esc(body.lede||story.summary)}</p>`);
  if(body.keyPoints?.length)sections.push(`<section><h2>핵심 내용</h2><ul>${body.keyPoints.map(x=>`<li>${esc(x)}</li>`).join('')}</ul></section>`);
  if(body.whyItMatters)sections.push(`<section><h2>왜 중요한가</h2><p>${esc(body.whyItMatters)}</p></section>`);
  if(body.analysis)sections.push(`<section><h2>AI SPACE 분석</h2><p>${esc(body.analysis)}</p></section>`);
  if(body.howTo?.length)sections.push(`<section><h2>활용 방법</h2><ol>${body.howTo.map(x=>`<li>${esc(x)}</li>`).join('')}</ol></section>`);
  if(body.promptTemplate||story.promptTemplate)sections.push(`<section><h2>추천 프롬프트 / 실행 템플릿</h2><pre class="prompt-box">${esc(body.promptTemplate||story.promptTemplate)}</pre></section>`);
  if(body.strengths?.length||story.strengths?.length)sections.push(`<section><h2>강점</h2><ul>${(body.strengths||story.strengths||[]).map(x=>`<li>${esc(x)}</li>`).join('')}</ul></section>`);
  if(body.weaknesses?.length||story.weaknesses?.length)sections.push(`<section><h2>주의점</h2><ul>${(body.weaknesses||story.weaknesses||[]).map(x=>`<li>${esc(x)}</li>`).join('')}</ul></section>`);
  const sources=body.sources||story.sources||(story.url?[{label:'원문 출처',url:story.url}]:[]);
  if(sources.length)sections.push(`<section class="sources"><h2>Sources</h2><p class="muted">AI SPACE 본문 작성에 참고한 원문입니다. 본문은 AI SPACE에서 독립적으로 재구성했습니다.</p>${sources.map(s=>`<a href="${esc(s.url)}" target="_blank" rel="noreferrer">${esc(s.label||s.url)}</a>`).join('')}</section>`);
  $('#article').innerHTML=`<header class="article-header"><div class="story-meta"><span class="badge">${esc(story.type||'article')}</span><span>${esc(story.publishedAt||'')}</span>${(story.entities||[]).map(x=>`<span>${esc(x)}</span>`).join('')}</div><h1>${esc(story.title)}</h1><div class="article-tags">${(story.tags||[]).map(t=>`<span class="badge">#${esc(t)}</span>`).join('')}</div></header>${sections.join('')}`;
  const related=(data.items||[]).filter(x=>sameTopic(story,x)).slice(0,4);const root=$('#relatedGrid');root.innerHTML='';related.forEach(x=>root.append(card(x)));if(!related.length)root.innerHTML='<div class="empty">관련 콘텐츠가 아직 없습니다.</div>';
}
init().catch(err=>{console.error(err);$('#article').innerHTML='<div class="empty">콘텐츠를 불러오지 못했습니다.</div>'});
