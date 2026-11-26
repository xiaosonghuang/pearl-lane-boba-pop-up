(function () {
  'use strict';
  const $ = id => document.getElementById(id);
  const app = $('app');
  const prefsKey = 'pearl-lane.shop.v2';
  const oldKey = 'boba-pop-up.design.v1';
  const flavors = { strawberry: 'Strawberry milk', matcha: 'Matcha latte', taro: 'Taro milk' };
  const toppings = { pearls: 'Tapioca pearls', jelly: 'Peach jelly', stars: 'Star sprinkles' };
  const subjects = {
    math: { title: 'Algebra', name: 'The price counter', text: 'Try a deal, watch the prices change, then design a pair of your own.', lessons: window.PearlAlgebra.lessons },
    word: { title: 'Mandarin', name: 'The style shop', text: 'Read an order, hear the clues, and style the crew.', lessons: window.PearlMandarin.lessons },
    story: { title: 'English', name: 'The story studio', text: 'Find the detail that changes the mood.', lessons: [{id:'scene', title:'Edit a sci-fi scene', description:'Change one line and see how the mood shifts.'}] },
    science: { title: 'Biology', name: 'The field lab', text: 'Make a claim, then see what the evidence can tell you.', lessons: [{id:'fossil', title:'The fossil mystery', description:'Read clues from fossil footprints, then explore a living food web.'}] },
    world: { title: 'Geography', name: 'The tour desk', text: 'Follow a map clue and build a three-city tour.', lessons: [{id:'tour', title:'Plan a pop-up tour', description:'Pin two cities in New Zealand, then take the shop around the world.'}] }
  };
  const lessons = Object.fromEntries(Object.entries(subjects).flatMap(([subject, path]) => path.lessons.map(l => [l.id, {...l, subject}])));
  const films = {
    receipts:{id:'receipts', title:'From receipts to a graph'}, graphs:{id:'receipts', title:'From receipts to a graph'}, design:{id:'crossover', title:'Make the lines meet at five'},
    words:{id:'clothing', title:'Hear the pieces of an outfit order'}, phrases:{id:'clothing', title:'Hear the pieces of an outfit order'}, customers:{id:'clues', title:'Solve a two-clue order'}
  };
  const modes = {show:'Show me', try:'Let me try', stretch:'Challenge me'};
  const object = val => val !== null && typeof val === 'object' && !Array.isArray(val);
  const validLesson = id => typeof id === 'string' && Object.hasOwn(lessons, id);
  const clean = val => String(val ?? '').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
  const initial = () => ({
    cup:{flavor:'strawberry',topping:'pearls'}, settings:{sound:false,pinyin:false,english:false,reducedMotion:matchMedia('(prefers-reduced-motion: reduce)').matches},
    drafts:{}, counts:{}, skills:{}, recent:null, lastWin:null, storyLine:''
  });
  function read(key) {
    try { return JSON.parse(localStorage.getItem(key) || 'null'); } catch { return null; }
  }
  function loadShop() {
    const start = initial();
    const saved = read(prefsKey);
    const legacy = read(oldKey);
    const cup = object(saved?.cup) ? saved.cup : legacy;
    if (cup && Object.hasOwn(flavors,cup.flavor)) start.cup.flavor = cup.flavor;
    if (cup && Object.hasOwn(toppings,cup.topping)) start.cup.topping = cup.topping;
    if (!object(saved)) {
      const id = legacy?.last === 'crew' ? 'words' : legacy?.last === 'deals' ? 'receipts' : '';
      if (id) start.recent = {id, mode:'show'};
      return start;
    }
    for (const key of Object.keys(start.settings)) {
      if (typeof saved.settings?.[key] === 'boolean') start.settings[key] = saved.settings[key];
    }
    for (const id of Object.keys(lessons)) {
      const s = saved.skills?.[id];
      if (object(s)) start.skills[id] = {
        guided:s.guided === true, explored:s.explored === true,
        helped:Array.isArray(s.helped) ? s.helped.filter(x => typeof x === 'string') : [],
        solved:Array.isArray(s.solved) ? s.solved.filter(x => typeof x === 'string') : []
      };
      for (const mode of Object.keys(modes)) {
        const key = `${id}.${mode}`;
        const count = saved.counts?.[key];
        const draft = saved.drafts?.[key];
        if (Number.isSafeInteger(count) && count >= 0) start.counts[key] = count;
        if (object(draft) && object(draft.state) && draft.round === (start.counts[key] || 0)) start.drafts[key] = draft;
      }
    }
    if (typeof saved.storyLine === 'string') start.storyLine=saved.storyLine.slice(0,280);
    if (validLesson(saved.recent?.id) && Object.hasOwn(modes,saved.recent.mode)) start.recent = saved.recent;
    const win=saved.lastWin;
    if (validLesson(win?.id) && typeof win.message === 'string' && Object.hasOwn(modes,win.mode)) {
      start.lastWin={id:win.id,mode:win.mode,message:win.message.slice(0,600),
        suggestId:validLesson(win.suggestId) ? win.suggestId : win.id,
        suggestMode:Object.hasOwn(modes,win.suggestMode) ? win.suggestMode : 'try',
        suggestLabel:typeof win.suggestLabel==='string' ? win.suggestLabel.slice(0,120) : 'Try another round'};
    }
    return start;
  }
  let shop = loadShop();
  let durable = true;
  let activeFilm = null;
  let currentRender = 0;
  function save() {
    try { localStorage.setItem(prefsKey,JSON.stringify(shop)); durable = true; } catch { durable = false; }
    $('storage-note').textContent = durable ? 'Progress saves in this browser.' : 'Progress lasts for this visit. Browser storage is unavailable.';
  }
  const learnLink = (id,mode='show') => `#/learn/${id}/${mode}`;
  const action = (label,href,cls='btn primary') => `<a class="${cls}" href="${href}">${clean(label)}</a>`;
  const recentLink = () => shop.recent && learnLink(shop.recent.id,shop.recent.mode);
  function status(id) {
    const s = shop.skills[id];
    if (s?.solved.length) return `Solved independently · ${s.solved.length} different ${s.solved.length === 1 ? 'problem' : 'problems'}`;
    if (s?.helped.length) return 'Practiced with help';
    if (s?.explored) return 'Explored a challenge';
    if (s?.guided) return 'Walked through an example';
    return '';
  }
  const pixels = {
    math:['      aaa       ','    aawwwaa     ','   awwwwwwa     ','   awggggwa     ','   awwwwwwa     ','   awgggwwa     ','   awwwwwwa     ','   awggggwa     ','   awwwwwwa     ','   awgwgwwa     ','   awawawwa     ','    a  a aa     '],
    word:['    ll  ll      ','   lpp llpl     ','  lphpppphpl    ',' lphpppppphpl   ',' lpphpppphpp l  ','  llpphpppll    ','    pppppp      ','    phpphp      ','    pppppp      ','    llllll      '],
    story:['  aa      aa    ','  awaaaaaawa    ','  awwwwawwwa    ','  awggwawgwa    ','  awwwwawwwa    ','  awggwawgwa    ','  awwwwawwwa    ','  aaaawaaaaa    ','     aaa        '],
    science:['      aaaa      ','    aattwtaa    ','   atwwtwwtta   ','  atwtattttata  ','  attatwwtatwa  ','  atwatttatwta  ','  attwaaatwtta  ','   attwwwttta   ','    aattwtaa    ','      aaaa      '],
    world:['     aaaaa      ','   aabbbggaa    ','  abbbgggwwba   ','  abgggggbbba   ',' abgggbbbgwbba  ',' abbbgbbbggbba  ',' abbbggbbbggba  ','  abbbgggbbba   ','   aabbbbbaa    ','     aaaaa      ','       aa       ','     aaaaaa     ']
  };
  function stamp(c) {
    const lines = pixels[c.dataset.art];
    if (!lines) return;
    c.width=16; c.height=16;
    const ctx=c.getContext('2d');
    const palette={a:'#584154',w:'#fff9e6',g:'#79a98a',p:'#bb83bb',h:'#e6b9df',l:'#7c567f',b:'#8dbdcf',t:'#cea77e'};
    lines.forEach((line,y)=>[...line].forEach((ch,x)=>{ if(palette[ch]) {ctx.fillStyle=palette[ch];ctx.fillRect(x,y+2,1,1);} }));
  }
  const icon = (subject,cls='') => `<canvas aria-hidden="true" class="${cls}" data-art="${subject}"></canvas>`;
  function paint() {
    BobaArt.cup($('logo'),shop.cup.flavor,shop.cup.topping);
    app.querySelectorAll('canvas[data-art]').forEach(stamp);
    const counter=$('counter');
    if(counter) BobaArt.shop(counter,shop.cup.flavor,shop.cup.topping);
    document.documentElement.dataset.quiet=String(shop.settings.reducedMotion);
  }
  function breadcrumb(subject) {
    return `<div class="crumb"><a href="#/">My shop</a>${subject ? `<span aria-hidden="true">/</span><a href="#/path/${subject}">${subjects[subject].title}</a>` : ''}</div>`;
  }
  const title = (heading,copy) => `<div class="titleblock"><h1>${clean(heading)}</h1><p>${clean(copy)}</p></div>`;
  function nextMode(id) {
    const s=shop.skills[id];
    if (!s) return 'show';
    if (s.solved.length >= 2) return 'stretch';
    if (s.helped.length && !s.solved.length) return 'show';
    return 'try';
  }
  function feature(id,question) {
    const lesson=lessons[id], path=subjects[lesson.subject];
    return `<a class="card ${lesson.subject}" href="${learnLink(id,nextMode(id))}"><div><span class="subject">${path.title}</span><strong>${clean(question)}</strong><span class="go">Play a round</span></div>${icon(lesson.subject,'art-tile')}</a>`;
  }
  function home() {
    const finished=shop.lastWin, recent=shop.recent;
    const isDraft=recent && shop.drafts[`${recent.id}.${recent.mode}`];
    const resume=isDraft ? ['Continue '+lessons[recent.id].title, recentLink()] :
      finished ? [finished.suggestLabel || 'Try another round',learnLink(finished.suggestId && validLesson(finished.suggestId) ? finished.suggestId : finished.id, Object.hasOwn(modes,finished.suggestMode) ? finished.suggestMode : nextMode(finished.id))] :
      recent ? ['Revisit '+lessons[recent.id].title,recentLink()] : null;
    const summary=finished ? finished.message : 'Try a little math, style an outfit, or take your shop on tour.';
    const notes=Object.keys(lessons).filter(id=>status(id));
    app.innerHTML=`<section class="hero"><div class="hero-copy"><h1>${finished ? 'Welcome back to the shop.' : 'Your boba shop is open.'}</h1><p>${clean(summary)}</p>${resume ? action(resume[0],resume[1]) : ''}</div><div class="hero-art"><canvas id="counter" role="img" aria-label="A ${clean(flavors[shop.cup.flavor])} boba cup at the striped tea counter"></canvas></div></section>
      <div class="section-head"><h2>Pick a round</h2></div><div class="featured">${feature('receipts','Can you make two boba deals tie?')}${feature('customers','Can you dress a customer from a Mandarin clue?')}</div>
      <div class="section-head"><h2>Explore the shop</h2></div><div class="library">${Object.entries(subjects).map(([id,s])=>`<a class="shelf" href="#/path/${id}">${icon(id)}${s.title}</a>`).join('')}</div>
      ${notes.length ? `<details class="notebook"><summary>My practice notebook</summary><ul>${notes.map(id=>`<li>${action(lessons[id].title,learnLink(id,nextMode(id)),'')} · ${clean(status(id))}</li>`).join('')}</ul>${shop.storyLine?`<div class="saved-line"><h3>My last saved scene line</h3><p>${clean(shop.storyLine)}</p></div>`:''}</details>` : ''}`;
  }
  function pathView(id) {
    const path=subjects[id];
    app.innerHTML=breadcrumb()+title(path.name,path.text)+`<div class="path-grid">${path.lessons.map(l=>`<a href="${learnLink(l.id,nextMode(l.id))}" class="path-card"><div><h2>${clean(l.title)}</h2><p>${clean(l.description)}</p>${status(l.id)?`<small>${clean(status(l.id))}</small>`:''}</div>${icon(id,'art-tile')}</a>`).join('')}</div>`;
  }
  function finish(id,mode,outcome) {
    const s=shop.skills[id] ||= {guided:false,explored:false,helped:[],solved:[]};
    const item=String(outcome.id);
    if (mode==='show') s.guided=true;
    else if (mode==='stretch' && outcome.assisted) s.explored=true;
    else if (outcome.assisted) {if (!s.helped.includes(item)) s.helped.push(item);}
    else if (!s.solved.includes(item)) s.solved.push(item);
    const followOn={receipts:['graphs','Read a new crossing'],graphs:['design','Design my own deal'],design:['receipts','Test another menu'],words:['phrases','Build an outfit order'],phrases:['customers','Style two customers'],customers:['words','Explore five more words']};
    const next=mode==='stretch' ? followOn[id] : null;
    const destination=next ? next[0] : id;
    const suggested=next ? nextMode(destination) : mode==='show' || mode==='stretch' ? 'try' : outcome.assisted ? 'show' : s.solved.length>=2 ? 'stretch' : 'try';
    const suggestLabel=next ? next[1] : {try: mode==='show'?'Try one on my own':'Try a fresh problem',stretch:'Try a harder challenge',show:'See it step by step'}[suggested];
    const key=`${id}.${mode}`;
    shop.counts[key]=(shop.counts[key] || 0)+1;
    const draft=shop.drafts[key].state;
    if (id==='scene' && mode==='stretch' && draft.keepLine && typeof draft.line==='string') shop.storyLine=draft.line.trim().slice(0,280);
    delete shop.drafts[key];
    shop.lastWin={id,mode,message:String(outcome.message),suggestId:destination,suggestLabel,suggestMode:suggested};
    shop.recent={id:destination,mode:suggested};
    save();
    location.hash='#/round-complete';
  }
  function lessonView(id,mode) {
    const l=lessons[id], key=`${id}.${mode}`;
    const draft=shop.drafts[key] ||= {round:shop.counts[key] || 0,state:{}};
    shop.recent={id,mode};save();
    const film=mode==='show' ? films[id] : null;
    app.innerHTML=`<div class="lesson-wrap">${breadcrumb(l.subject)}${title(l.title,l.description)}
      <nav class="modebar" aria-label="Choose how to play">${Object.entries(modes).map(([m,name])=>`<a class="mode" ${mode===m?'aria-current="page"':''} href="${learnLink(id,m)}">${name}</a>`).join('')}</nav>
      ${film?`<details class="film" id="film"><summary>Watch a short film · ${film.title}</summary><div id="player"></div></details>`:''}
      <section class="lesson-stage" id="lesson-stage" aria-label="Activity"></section><p class="feedback" id="feedback" role="status"></p>
      <div class="restline">${action('Explore '+subjects[l.subject].title,'#/path/'+l.subject,'textlink')}${action('Stop here','#/rest','textlink')}</div></div>`;
    if (film) {
      $('film').ontoggle=()=>{
        if (!$('film')) return;
        if (!$('film').open) {activeFilm?.pause();return;}
        if (activeFilm) return;
        $('player').innerHTML=`<video controls playsinline preload="metadata" ${shop.settings.sound?'':'muted'} aria-label="${clean(film.title)}"><source src="./media/films/${film.id}.mp4" type="video/mp4"><track default kind="captions" srclang="en" label="English captions" src="./media/films/${film.id}.vtt"></video><p>Pause to make a prediction. The activity below lets you try each step yourself.</p>`;
        activeFilm=$('player').querySelector('video');
        activeFilm.textTracks[0].mode='showing';
        activeFilm.onplay=()=>window.PearlMandarin.stopAudio?.();
      };
    }
    const ticket=currentRender;
    const ctx={lessonId:id,mode,round:draft.round,state:draft.state,settings:{...shop.settings, reducedMotion:shop.settings.reducedMotion || matchMedia('(prefers-reduced-motion: reduce)').matches},
      save(){ if(ticket===currentRender) save(); },
      feedback(message){ if(ticket===currentRender) $('feedback').textContent=message; },
      finish(out){ if(ticket===currentRender && shop.drafts[key]===draft) finish(id,mode,out); }
    };
    const renderer=l.subject==='math'?window.PearlAlgebra:l.subject==='word'?window.PearlMandarin:window.PearlExplore;
    $('lesson-stage').addEventListener('click',event=>{if(event.target.closest('.m-listen')) activeFilm?.pause();},true);
    const resuming=Object.keys(draft.state).length>0;
    try { renderer.mount($('lesson-stage'),ctx); }
    catch(error) {
      if(!resuming) throw error;
      draft.state={};
      ctx.state=draft.state;
      ctx.save();
      renderer.mount($('lesson-stage'),ctx);
      ctx.feedback('Your saved step could not be opened. This round has restarted.');
    }
  }
  function ready() {
    const win=shop.lastWin;
    if (!win) {home();return;}
    app.innerHTML=`<section class="result">${icon(lessons[win.id].subject,'done-icon')}<h1>Round complete.</h1><p>${clean(win.message)}</p><div class="actionrow">${action(win.suggestLabel,learnLink(validLesson(win.suggestId) ? win.suggestId : win.id,win.suggestMode))}${action('Back to my shop','#/','btn')}${action('Done for today','#/rest','textlink')}</div></section>`;
  }
  function cup() {
    function picks(kind,options) {
      return Object.entries(options).map(([id,val])=>`<button data-kind="${kind}" data-id="${id}" aria-pressed="${shop.cup[kind]===id}">${val}</button>`).join('');
    }
    app.innerHTML=breadcrumb()+title('Mix your signature sip.','Pick a base and a topping for the drink on your counter.')+`<div class="cupgrid"><canvas class="cup-preview" id="counter" role="img" aria-label="Your custom drink"></canvas><div class="panel"><fieldset><legend>Milk tea</legend><div class="choices">${picks('flavor',flavors)}</div></fieldset><fieldset><legend>Topping</legend><div class="choices">${picks('topping',toppings)}</div></fieldset><p id="drink-name" role="status"></p>${action('Back to my shop','#/')}</div></div>`;
    function update() {
      const msg=`${flavors[shop.cup.flavor]} with ${toppings[shop.cup.topping].toLowerCase()}`;
      $('drink-name').textContent=msg;$('counter').setAttribute('aria-label',msg);
    }
    update();
    app.querySelectorAll('[data-kind]').forEach(b=>b.onclick=()=>{
      shop.cup[b.dataset.kind]=b.dataset.id;save();paint();update();
      app.querySelectorAll('[data-kind]').forEach(x=>x.setAttribute('aria-pressed',String(shop.cup[x.dataset.kind]===x.dataset.id)));
    });
  }
  function rest() {
    app.innerHTML=`<section class="result">${icon('world','done-icon')}<h1>See you next shift.</h1><p>${durable?'Your spot is saved in this browser. You can close this tab.':'You can take a break and return to this open tab.'}</p><div class="actionrow">${recentLink()?action('Back to my round',recentLink()):''}${action('My shop','#/','btn')}</div></section>`;
  }
  function render(focus=true) {
    currentRender++;
    activeFilm?.pause();activeFilm=null;
    window.PearlMandarin.stopAudio?.();
    const [,page,id,mode]=location.hash.split('/');
    if (page==='path' && Object.hasOwn(subjects,id)) pathView(id);
    else if (page==='learn' && validLesson(id) && Object.hasOwn(modes,mode)) lessonView(id,mode);
    else if (page==='round-complete') ready();
    else if (page==='cup') cup();
    else if (page==='rest') rest();
    else home();
    paint();
    if (focus) {const h=app.querySelector('h1');h.tabIndex=-1;h.focus({preventScroll:true});window.scrollTo(0,0);}
    document.title=`${app.querySelector('h1').textContent} · Pearl Lane`;
  }
  const dlg=$('dialog');
  function openDialog(kind) {
    const body=$('dialog-content');
    if(kind==='settings') {
      const labels={sound:'Start films with sound',pinyin:'Show Mandarin pinyin',english:'Show English word support',reducedMotion:'Reduce motion'};
      body.innerHTML=`<h2 id="dialog-title">Your settings</h2><p>Choose what helps you play.</p>${Object.entries(labels).map(([id,label])=>`<label><input type="checkbox" data-pref="${id}" ${shop.settings[id]?'checked':''}>${label}</label>`).join('')}<div class="actionrow"><button class="primary" id="close">Done</button><button class="textlink" id="reset">Start fresh</button></div>`;
      body.querySelectorAll('[data-pref]').forEach(b=>b.onchange=()=>{shop.settings[b.dataset.pref]=b.checked;save();document.documentElement.dataset.quiet=String(shop.settings.reducedMotion);});
      $('reset').onclick=()=>openDialog('reset');
    } else if(kind==='reset'){
      body.innerHTML='<h2 id="dialog-title">Start a new shop?</h2><p>This clears the drink, settings, and practice saved in this browser.</p><div class="actionrow"><button id="close">Keep my shop</button><button id="confirm" class="primary">Reset my shop</button></div>';
      $('confirm').onclick=()=>{shop=initial();try{localStorage.removeItem(oldKey);}catch{}save();dlg.close();if(location.hash==='#/')render();else location.hash='#/';};
    } else {
      body.innerHTML='<h2 id="dialog-title">How to play</h2><p>Pick a round or browse a subject. Choose <b>Show me</b> for a worked example, <b>Let me try</b> for a fresh problem, or <b>Challenge me</b> to experiment.</p><p>Stop after one step if you like. This browser remembers where you paused.</p><button class="primary" id="close">Got it</button>';
    }
    if(!dlg.open) dlg.showModal();
    $('close').onclick=()=>{dlg.close();if(kind==='settings' && location.hash.startsWith('#/learn/')) render(false);};
    $('close').focus();
  }
  $('settings').onclick=()=>openDialog('settings');$('help').onclick=()=>openDialog('help');
  dlg.addEventListener('cancel',()=>{ if(location.hash.startsWith('#/learn/')) setTimeout(()=>render(false),0); });
  document.querySelector('.skip').onclick=e=>{e.preventDefault();app.focus();};
  window.addEventListener('hashchange',()=>render());
  window.addEventListener('pagehide',()=>{activeFilm?.pause();window.PearlMandarin.stopAudio?.();});
  save();render(false);
})();
