let lang=0;
const pick=a=>a[lang];
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const external=(label,url)=>`<a href="${esc(url)}" target="_blank" rel="noopener noreferrer">${esc(label)} ↗</a>`;
function videoCard(v){return `<figure class="video-card"><div class="video-frame"><button class="play-video" data-video="${v.id}" data-title="${esc(pick(v.title))}" aria-label="${lang?'Play':'播放'} ${esc(pick(v.title))}"><img src="${v.poster}" alt="" loading="lazy"><span class="play-symbol" aria-hidden="true">▶</span><span class="video-label">${lang?'PLAY DEMO':'播放演示'}</span></button></div><figcaption>${esc(pick(v.title))} ${external(lang?'Open video':'原视频',`https://drive.google.com/file/d/${v.id}/view`)}</figcaption></figure>`;}
function imageCard(im){return `<figure class="image-card${im.wide?' figure-wide':''}"><button class="zoom-image" data-src="${im.src}" data-caption="${esc(pick(im.caption))}" aria-label="${lang?'Enlarge':'放大'} ${esc(pick(im.caption))}"><img src="${im.src}" alt="${esc(pick(im.caption))}" loading="lazy"><span aria-hidden="true">↗</span></button><figcaption>${esc(pick(im.caption))}</figcaption></figure>`;}
function paperGallery(p){
 if(!p.paperFigures)return '';
 return `<section class="paper-gallery" aria-label="${lang?'Paper figures':'论文图集'}"><div class="paper-gallery-heading"><h4>${lang?'Simulation results · Paper figures':'仿真效果 · 论文图集'}</h4><span>${lang?'Click any image to enlarge':'点击图片可放大查看'} ↗</span></div><p class="paper-gallery-note">${lang?'Figures extracted from the paper. Each scene combines key frames from one simulation rollout; the arrow runs from blue (start) to orange (end). Frame spacing is arranged for readability, and the backgrounds are visual only.':'图片提取自论文。每幅场景图合成同一次仿真中的多个关键帧，箭头由蓝色起点指向橙色终点；帧间距为便于阅读而调整，场景背景仅作视觉展示。'}</p><div class="image-grid paper-results">${p.paperFigures.results.map(imageCard).join('')}</div><details class="paper-analysis"><summary>${lang?'Training curves & analysis · 3 figures':'训练曲线与分析 · 3 张图'}<span aria-hidden="true">⌄</span></summary><div class="image-grid paper-analysis-grid">${p.paperFigures.analysis.map(imageCard).join('')}</div></details></section>`;
}
function projectPublication(p){
 if(!p.publication)return '';
 const citation=document.querySelector(`${p.publication} .citation`);
 if(!citation)return '';
 return `<aside class="project-publication" aria-label="${lang?'Project output: publication':'项目产出：论文'}"><div class="publication-heading"><h4>${lang?'Project output · Publication':'项目产出 · 论文'}</h4><span class="publication-status">${lang?'To appear':'待发表 · To appear'}</span></div><p class="citation">${citation.innerHTML}</p><a class="research-project-link" href="#research">${lang?'View publication details ↗':'查看论文栏目 ↗'}</a></aside>`;
}
function stackDetail(){
 return `<section id="fullstack" class="stack-detail"><h4>${lang?'Full-stack implementation':'全栈实现'}</h4>${stackLayers.map(l=>`<article><h5>${esc(pick(l.label))} · ${esc(pick(l.title))}</h5><p>${esc(pick(l.text))}</p>${external(pick(l.evidence),codeBase+l.file)}</article>`).join('')}</section>`;
}
function projectThumb(p){return p.paperFigures?.results[0]?.src||p.videos?.[0]?.poster||p.images?.[0]?.src;}
function renderProjects(){
 const opened=new Set([...document.querySelectorAll('.project[open]')].map(el=>el.dataset.index));
 document.querySelector('#project-list').innerHTML=projects.map((p,i)=>`<details class="project" id="project-${i}" data-index="${i}" ${opened.has(String(i))?'open':''}><summary><div class="project-summary"><div class="project-meta"><span>${esc(pick({robotics:['机器人','Robotics'],ai:['AI 与感知','AI & perception'],engineering:['工程与仿真','Engineering']}[p.cat]))}</span><span>${esc(p.date)}</span></div><h3>${esc(pick(p.title))}</h3><p class="description">${esc(pick(p.desc))}</p><span class="detail-label"><span class="closed-label">${lang?'View project':'查看项目'}</span><span class="open-label">${lang?'Close details':'收起详情'}</span> <span class="expand" aria-hidden="true">↓</span></span></div>${projectThumb(p)?`<img class="project-thumb" src="${projectThumb(p)}" alt="" loading="lazy">`:''}</summary><div class="project-body"><div class="tags">${p.tags.map(t=>`<span class="tag">${esc(t)}</span>`).join('')}</div>${p.pipeline?`<p class="pipeline" aria-label="${lang?'System pipeline':'系统流程'}">${p.pipeline.map(t=>esc(t)).join(' → ')}</p>`:''}<ul>${p.bullets.map(b=>`<li>${esc(pick(b))}</li>`).join('')}</ul>${p.videos?`<div class="video-grid">${p.videos.map(videoCard).join('')}</div>`:''}${p.images?`<div class="image-grid">${p.images.map(imageCard).join('')}</div>`:''}${paperGallery(p)}${i===7?stackDetail():''}${p.links?`<div class="project-links">${p.links.map(l=>external(l[0],l[1])).join('')}</div>`:''}${p.note?`<p class="project-note">${esc(pick(p.note))}</p>`:''}${projectPublication(p)}</div></details>`).join('');
}
function render(){
 document.documentElement.lang=lang?'en':'zh-CN';
 document.querySelectorAll('[data-zh]').forEach(el=>el.textContent=el.dataset[lang?'en':'zh']);
 document.querySelector('#language').innerHTML=lang?'中文 <span>↗</span>':'EN <span>↗</span>';
 document.querySelector('#language').setAttribute('aria-label',lang?'切换到中文':'Switch to English');
 renderProjects();
 document.querySelector('#experience-list').innerHTML=experience.map(e=>`<article class="timeline-item"><div class="meta">${esc(Array.isArray(e.date)?pick(e.date):e.date)}</div><h3>${esc(pick(e.role))}</h3><div class="org">${esc(e.org)}</div><p>${esc(pick(e.text))}</p></article>`).join('');
 document.querySelector('#education-list').innerHTML=education.map(e=>`<article class="education-item"><div class="meta">${e.date}</div><div><h3>${esc(pick(e.school))}</h3><p class="degree">${esc(pick(e.degree))}</p><p>${esc(pick(e.detail))}</p></div></article>`).join('');
}
document.querySelector('#language').addEventListener('click',()=>{lang=1-lang;render();});
document.addEventListener('click',e=>{
 const project=e.target.closest('[data-project]');if(project){e.preventDefault();history.pushState(null,'',`#project-${project.dataset.project}`);openHash();return;}
 const image=e.target.closest('.zoom-image');if(image){const im=document.querySelector('#media-image');im.src=image.dataset.src;im.alt=image.dataset.caption;document.querySelector('#media-caption').textContent=image.dataset.caption;document.querySelector('#media-dialog').showModal();return;}
 const video=e.target.closest('[data-video]');if(video){const frame=document.createElement('iframe');frame.src=`https://drive.google.com/file/d/${video.dataset.video}/preview`;frame.title=video.dataset.title;frame.allow='autoplay; fullscreen; picture-in-picture';frame.allowFullscreen=true;video.parentElement.replaceChildren(frame);}
});
const dialog=document.querySelector('#media-dialog');
document.querySelector('#close-media').addEventListener('click',()=>dialog.close());
dialog.addEventListener('click',e=>{if(e.target===dialog)dialog.close();});
render();
function openHash(){
 const hash=location.hash;
 if(!/^#project-\d+$/.test(hash)&&hash!=='#fullstack')return;
 const target=document.querySelector(hash==='#fullstack'?'#project-7':hash);
 if(target){target.open=true;requestAnimationFrame(()=>document.querySelector(hash).scrollIntoView({block:'start'}));}
}
window.addEventListener('hashchange',openHash);
openHash();
