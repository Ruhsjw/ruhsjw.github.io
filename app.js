let lang=0,filter='all',activeLayer=0;
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
function renderProjects(){
 const opened=new Set([...document.querySelectorAll('.project[open]')].map(el=>el.dataset.index));
 const firstRender=!document.querySelector('.project');
 document.querySelector('#project-list').innerHTML=projects.map((p,i)=>`<details class="project" id="project-${i}" data-index="${i}" ${p.cat!==filter&&filter!=='all'?'hidden':''} ${opened.has(String(i))||(firstRender&&i===0)?'open':''}><summary><span class="project-num">${String(i+1).padStart(2,'0')}</span><div><h3>${esc(pick(p.title))}</h3><p class="description">${esc(pick(p.desc))}</p><div class="tags">${p.tags.map(t=>`<span class="tag">${esc(t)}</span>`).join('')}${p.paperFigures?`<span class="tag media-tag">▧ 7 ${lang?'paper figures':'张论文图'}</span>`:''}${p.videos?`<span class="tag media-tag">▶ ${p.videos.length} ${lang?'videos':'段视频'}</span>`:''}${p.images?`<span class="tag media-tag">▧ ${p.images.length} ${lang?'images':'张图片'}</span>`:''}</div></div><span class="project-date">${p.date}</span><span class="expand" aria-hidden="true">+</span></summary><div class="project-body">${p.pipeline?`<div class="pipeline" aria-label="${lang?'System pipeline':'系统流程'}">${p.pipeline.map(t=>`<span>${esc(t)}</span>`).join('<b aria-hidden="true">→</b>')}</div>`:''}<ul>${p.bullets.map(b=>`<li>${esc(pick(b))}</li>`).join('')}</ul>${p.videos?`<div class="video-grid">${p.videos.map(videoCard).join('')}</div>`:''}${p.images?`<div class="image-grid">${p.images.map(imageCard).join('')}</div>`:''}${paperGallery(p)}${p.links?`<div class="project-links">${p.links.map(l=>external(l[0],l[1])).join('')}</div>`:''}${p.note?`<p class="project-note">${esc(pick(p.note))}</p>`:''}${projectPublication(p)}</div></details>`).join('');
 const n=projects.filter(p=>filter==='all'||p.cat===filter).length;
 document.querySelector('#project-count').textContent=lang?`${n} projects`:`${n} 个项目`;
}
function renderStack(){
 document.querySelector('#stack-tabs').innerHTML=stackLayers.map((l,i)=>`<button role="tab" id="stack-tab-${i}" aria-selected="${i===activeLayer}" aria-controls="stack-panel" tabindex="${i===activeLayer?0:-1}" data-layer="${i}">${esc(pick(l.label))}<span aria-hidden="true">↗</span></button>`).join('');
 const layer=stackLayers[activeLayer];
 const panel=document.querySelector('#stack-panel');
 panel.setAttribute('aria-labelledby',`stack-tab-${activeLayer}`);
 panel.innerHTML=`<div class="eyebrow">LAYER ${String(activeLayer+1).padStart(2,'0')} / 04</div><h3>${esc(pick(layer.title))}</h3><p>${esc(pick(layer.text))}</p><div class="tags">${layer.tags.map(t=>`<span class="tag">${esc(t)}</span>`).join('')}</div><div class="code-evidence">${external(pick(layer.evidence),codeBase+layer.file)}<code>${layer.file}</code></div>`;
}
function renderShowcase(){
 const cards=[{project:0,image:'media/paper-fig1-dual-box.webp',label:['WHOLE-BODY TRACKING / 仿真与论文','WHOLE-BODY TRACKING / SIMULATION & PAPER'],title:['全身运动跟踪与协作搬运','Whole-body tracking & collaborative carrying'],text:['从单机物体交互到双机共享策略搬运，查看论文图集与训练分析。','From single-humanoid object interaction to shared-policy dual-humanoid carrying. Explore paper figures and training analysis.']},{project:7,image:'media/mecanum-robot.jpg',label:['FULL STACK / 实机系统','FULL STACK / HARDWARE'],title:['Web 控制台 × 自主机器人','Web console × autonomous robot'],text:['从浏览器命令到电机反馈，贯穿完整软硬件链路。','From browser commands to motor feedback across the software–hardware stack.']},{project:1,image:'media/g1-navigation.webp',label:['HUMANOID / 视频演示','HUMANOID / VIDEO DEMOS'],title:['G1 自主导航与交互','G1 autonomy & interaction'],text:['查看自主避障、强化学习步态和视觉任务。','Explore autonomous avoidance, RL locomotion, and vision-based tasks.']},{project:8,image:'media/arm-hardware.jpg',label:['MANIPULATION / 实机验证','MANIPULATION / HARDWARE'],title:['视觉引导动态抓取','Vision-guided dynamic grasping'],text:['RGB-D、目标检测、轨迹更新与 KUKA 机械臂集成。','RGB-D, detection, trajectory updates, and KUKA integration.']}];
 document.querySelector('#showcase').innerHTML=cards.map(c=>`<a class="showcase-card" href="#project-${c.project}" data-project="${c.project}"><img src="${c.image}" alt="${esc(pick(c.title))}" loading="lazy"><div><span class="eyebrow">${esc(pick(c.label))}</span><h3>${esc(pick(c.title))} <span>↗</span></h3><p>${esc(pick(c.text))}</p></div></a>`).join('');
}
function render(){
 document.documentElement.lang=lang?'en':'zh-CN';
 document.querySelectorAll('[data-zh]').forEach(el=>el.textContent=el.dataset[lang?'en':'zh']);
 document.querySelector('#language').innerHTML=lang?'中文 <span>↗</span>':'EN <span>↗</span>';
 document.querySelector('#language').setAttribute('aria-label',lang?'切换到中文':'Switch to English');
 renderProjects();renderStack();renderShowcase();
 document.querySelector('#experience-list').innerHTML=experience.map(e=>`<article class="timeline-item"><div class="meta">${esc(Array.isArray(e.date)?pick(e.date):e.date)}</div><h3>${esc(pick(e.role))}</h3><div class="org">${esc(e.org)}</div><p>${esc(pick(e.text))}</p></article>`).join('');
 document.querySelector('#education-list').innerHTML=education.map(e=>`<article class="education-item"><div class="meta">${e.date}</div><div><h3>${esc(pick(e.school))}</h3><p class="degree">${esc(pick(e.degree))}</p><p>${esc(pick(e.detail))}</p></div></article>`).join('');
}
document.querySelector('#language').addEventListener('click',()=>{lang=1-lang;render();});
function setFilter(value){filter=value;document.querySelectorAll('[data-filter]').forEach(x=>x.setAttribute('aria-pressed',String(x.dataset.filter===filter)));renderProjects();}
document.querySelectorAll('[data-filter]').forEach(b=>b.addEventListener('click',()=>setFilter(b.dataset.filter)));
document.addEventListener('click',e=>{
 const layer=e.target.closest('[data-layer]');if(layer){activeLayer=Number(layer.dataset.layer);renderStack();document.querySelector(`#stack-tab-${activeLayer}`).focus();return;}
 const project=e.target.closest('[data-project]');if(project){e.preventDefault();setFilter('all');const el=document.querySelector(`#project-${project.dataset.project}`);el.open=true;el.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'instant':'smooth',block:'start'});history.replaceState(null,'',`#project-${project.dataset.project}`);return;}
 const image=e.target.closest('.zoom-image');if(image){const im=document.querySelector('#media-image');im.src=image.dataset.src;im.alt=image.dataset.caption;document.querySelector('#media-caption').textContent=image.dataset.caption;document.querySelector('#media-dialog').showModal();return;}
 const video=e.target.closest('[data-video]');if(video){const frame=document.createElement('iframe');frame.src=`https://drive.google.com/file/d/${video.dataset.video}/preview`;frame.title=video.dataset.title;frame.allow='autoplay; fullscreen; picture-in-picture';frame.allowFullscreen=true;video.parentElement.replaceChildren(frame);}
});
document.querySelector('#stack-tabs').addEventListener('keydown',e=>{if(!['ArrowDown','ArrowUp','ArrowRight','ArrowLeft','Home','End'].includes(e.key))return;e.preventDefault();activeLayer=e.key==='Home'?0:e.key==='End'?3:(activeLayer+(['ArrowDown','ArrowRight'].includes(e.key)?1:3))%4;renderStack();document.querySelector(`#stack-tab-${activeLayer}`).focus();});
const dialog=document.querySelector('#media-dialog');
document.querySelector('#close-media').addEventListener('click',()=>dialog.close());
dialog.addEventListener('click',e=>{if(e.target===dialog)dialog.close();});
render();
if(/^#project-\d+$/.test(location.hash)){const target=document.querySelector(location.hash);if(target){target.open=true;requestAnimationFrame(()=>target.scrollIntoView());}}
