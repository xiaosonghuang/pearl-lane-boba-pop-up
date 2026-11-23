(() => {
'use strict';
const $ = id => document.getElementById(id);
const key = 'boba-pop-up.design.v1';
const flavors = {strawberry:['Strawberry milk','#ffe1e2'],matcha:['Matcha latte','#e1edcc'],taro:['Taro milk','#eee2f7']};
const toppings = {pearls:['Tapioca pearls','#eadbdd'],jelly:['Peach jelly','#ffe6d2'],stars:['Star sprinkles','#fff0c4']};
const colors = {purple:['紫色','zǐsè','purple','#b18acb'],blue:['蓝色','lánsè','blue','#83b7d8']};
const garments = {sweater:['毛衣','máoyī','sweater'],shirt:['衬衫','chènshān','shirt'],skirt:['裙子','qúnzi','skirt'],coat:['外套','wàitào','coat'],pants:['裤子','kùzi','pants'],dress:['连衣裙','liányīqún','dress']};
const orders = [['purple','sweater'],['blue','shirt'],['purple','skirt'],['blue','coat'],['purple','pants'],['blue','dress'],['blue','sweater'],['purple','shirt'],['blue','skirt'],['purple','coat'],['blue','pants'],['purple','dress']];
const defaults = () => ({flavor:'strawberry',topping:'pearls',last:''});
let design=defaults(), durable=true;
try {
  const saved=JSON.parse(localStorage.getItem(key)||'null');
  if(saved){if(Object.hasOwn(flavors,saved.flavor)) design.flavor=saved.flavor;if(Object.hasOwn(toppings,saved.topping))design.topping=saved.topping;if(['crew','deals'].includes(saved.last))design.last=saved.last;}
} catch {durable=false;}
function save(){try{localStorage.setItem(key,JSON.stringify(design));}catch{durable=false;} showStorage();}
function showStorage(){const f=document.querySelector('footer span');if(f?.firstChild) f.firstChild.nodeValue=durable?'Saved on this device ':'This visit only ';}
let screen='base', sound=false, context=null, round=null, number=0, dialogOpener=null;
const esc=s=>String(s).replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;').replaceAll('>','&gt;');
function act(label,a,value='',cls='primary',extra=''){return '<button type="button" class="'+cls+'" data-act="'+a+'" data-value="'+esc(value)+'" '+extra+'>'+label+'</button>';}
function meter(label,n){return '<div class="step-row"><span class="step-label">'+label+'</span><span class="meter" aria-hidden="true"><i class="on"></i><i class="'+(n===2?'on':'')+'"></i></span></div>';}
function intro(title,desc,area){return '<div class="intro">'+(area?'<div class="crumb">'+act('My shop','lobby','','inline')+'<span aria-hidden="true">/</span><small>'+area+'</small></div>':'')+'<h1>'+title+'</h1><p>'+desc+'</p></div>';}
function canvas(id,cls,alt){return '<canvas id="'+id+'" class="'+cls+'" role="img" aria-label="'+esc(alt)+'"></canvas>';}
function frame(label,visual,title,sub,chip=''){return '<section class="frame" aria-label="'+label+'"><div class="framebar"><span>'+label+'</span><span class="dots" aria-hidden="true">◆ ▪ ▪</span></div>'+visual+'<div class="details"><div><h3>'+title+'</h3><small>'+sub+'</small></div>'+(chip?'<span class="chip">'+chip+'</span>':'')+'</div></section>';}
function storefront(){return frame('Drink counter',canvas('shop','stage',flavors[design.flavor][0]+' with '+toppings[design.topping][0]+' on your boba counter'),flavors[design.flavor][0],toppings[design.topping][0]);}
function panel(html){return '<section class="panel">'+html+'</section>';}
function layout(left,right){return '<div class="layout">'+left+panel(right)+'</div>';}
function stamp(id,tint){return '<span class="stamp" style="--tile:'+tint+'" aria-hidden="true"><canvas data-stamp="'+id+'" width="20" height="20"></canvas></span>';}
function options(set,kind){return '<div class="choices">'+Object.entries(set).map(([id,[name,tint]])=>{const active=design[kind]===id;return act(stamp(id,tint)+'<strong>'+name+'</strong><span class="tail" aria-hidden="true">'+(active?'✓':'')+'</span>','select',id,'choice','aria-pressed="'+active+'"');}).join('')+'</div>';}
function mixer(){
 const base=screen==='base';
 return intro('Make your signature sip.','Mix a drink for your counter, then open your own little boba shop.')+layout(storefront(),meter('Drink builder  /  '+(base?'1 of 2':'2 of 2'),base?1:2)+'<h2>'+(base?'Choose your base.':'Pick a topping.')+'</h2><p class="sub">'+(base?'Tap a flavor to see it in your cup.':'Try each topping on your drink.')+'</p>'+options(base?flavors:toppings,base?'flavor':'topping')+act(base?'Pick a topping':'Open my shop',base?'topping':'lobby')+(base?'':'<div class="inline-row">'+act('Back to flavors','base','','inline')+'</div>'));
}
function activity(name,desc,a,icon,tint){return act(stamp(icon,tint)+'<strong>'+name+'</strong><small>'+desc+'</small>',a,'','choice activity-choice');}
function lobby(){return intro('Your shop is open.','Pick a short round. You can switch or stop whenever you like.')+layout(storefront(),'<h2>What feels fun?</h2><div class="choices">'+activity('Style the crew','Put together a Mandarin outfit order.','crew','outfit','#eadcf5')+activity('Boba deals','Choose a card and play with prices.','deals','receipt','#d9eee1')+'</div>'+(design.last?'<p class="no-spoiler">Last played here: '+(design.last==='crew'?'Style the crew':'Boba deals')+'</p>':'')+'<div class="inline-row">'+act('Remix my drink','base','','inline')+act('Done for today','done','','inline')+'</div>');}
function newCrew(free=false){const [wantColor,wantItem]=orders[number%orders.length];round={free,wantColor,wantItem,color:'blue',garment:'shirt',phase:'color',hint:false,feedback:'',chosen:false};screen='crew';design.last='crew';save();}
function cn(c,g){return '<span lang="zh-Hans">'+colors[c][0]+garments[g][0]+'</span>';}
function english(c,g){return c+' '+g;}
function labelPick(a,id,name,on=false){return act(name,a,id,'pick','aria-pressed="'+on+'"');}
function crewScreen(){
 const r=round,guess=r.phase==='guess',pass=r.phase==='pass',color=r.phase==='color',end=r.phase==='success';
 const visual=frame('Crew fitting room',canvas('crew-art','stage','Crew member wearing a '+english(r.color,r.garment)),r.free?'Your custom outfit':'The fitting mirror',r.free?'Design an outfit, then invite someone to guess.':'Try on a color and a garment.');
 let body='';
 if(pass){body='<h2>Pass it over.</h2><p class="sub">Give the next player the screen. Can they name the outfit in Mandarin?</p><div class="actions">'+act('Ready to guess','guess')+'</div>';}
 else if(guess){const answers=answersFor(r);body='<h2>Name that outfit.</h2><p class="sub">Look at the mirror. Which Mandarin label fits?</p><div class="choices">'+answers.map(([c,g])=>act(cn(c,g),'guessAnswer',c+'|'+g,'guess')).join('')+'</div>';}
 else if(end){body='<h2>'+(r.free?'You guessed it!':'Order ready!')+'</h2><div class="order"><b>'+cn(r.color,r.garment)+'</b><span>'+colors[r.color][1]+' '+garments[r.garment][1]+' · '+english(r.color,r.garment)+'</span></div>'+finishControls('crew');}
 else {
 body=meter(r.free?'Design an outfit':'Customer order',color?1:2)+'<h2>'+(r.free?'Dress the crew.':'Style the crew.')+'</h2>';
 if(!r.free){body+='<div class="order"><b>'+cn(r.wantColor,r.wantItem)+'</b>'+(r.hint?'<span>'+colors[r.wantColor][1]+' '+garments[r.wantItem][1]+' · '+english(r.wantColor,r.wantItem)+'</span>':'')+'</div>'+act(r.hint?'Hide word hint':'Show word hint','hint','','inline');}
 body+='<p class="sub">'+(color?'Choose a color.':'Choose a garment.')+'</p><div class="compact">'+(color?Object.entries(colors).map(([k,v])=>labelPick('color',k,'<span class="swatch" style="background:'+v[3]+'"></span>'+titleCase(k),r.chosen&&r.color===k)):Object.keys(garments).map(k=>labelPick('garment',k,titleCase(k),r.chosen&&r.garment===k))).join('')+'</div>';
 body+=act(color?'Choose a garment':r.free?'Hand it to a friend':'Check the outfit',color?'nextGarment':'checkOutfit','','primary',r.chosen?'':'disabled');
 if(!color)body+='<div class="inline-row">'+act('Change color','recolor','','inline')+'</div>';
 }
 if(r.feedback&&!end){body+='<div class="notice" role="status">'+r.feedback+'</div>';}
 if(!r.free&&!end)body+='<div class="inline-row">'+act('Design one for a friend','free','','inline')+'</div>';
 return intro('Crew wardrobe','Read an outfit order, try a look, and check the mirror.','Style the crew')+layout(visual,body);
}
function titleCase(s){return s.charAt(0).toUpperCase()+s.slice(1);}
function answersFor(r){const other=r.color==='blue'?'purple':'blue';const gs=Object.keys(garments),i=gs.indexOf(r.garment);const options=[[other,r.garment],[r.color,gs[(i+1)%gs.length]],[r.color,r.garment]];const split=(i+(r.color==='blue'?1:0))%3;return options.slice(split).concat(options.slice(0,split));}
function finishControls(type){return '<div class="actions">'+act('Play again','replay',type)+act('Try the other activity',type==='crew'?'deals':'crew','','secondary')+act('Done for today','done','','inline')+'</div>';}
function newDeals(){round={phase:'predict',n:1,prediction:''};screen='deals';design.last='deals';save();}
function costs(n){return [8+2*n,2+4*n];}
function priceText(n){const [a,b]=costs(n);return a===b?'The lines meet here. Both cards cost $'+a+' for '+n+' drinks.':(a<b?'Card A':'Card B')+' costs $'+Math.abs(a-b)+' less for '+n+(n===1?' drink.':' drinks.');}
function receipts(n){const [a,b]=costs(n);return '<div class="receipts">'+[['A','$8 to join + $2 per drink',a],['B','$2 to join + $4 per drink',b]].map(([k,s,v])=>'<div class="receipt"><b>Card '+k+'</b><span>'+s+'</span><strong>$'+v+'</strong></div>').join('')+'</div>';}
function dealsScreen(){const r=round,predict=r.phase==='predict',end=r.phase==='success';
 const visual=predict?frame('Boba card menu',canvas('shop','stage','Your boba drink served at the shop counter'),'Two ways to pay','Both prices include the one-time cost to join.'):frame('Price counter','<div class="price-stage">'+receipts(r.n)+canvas('graph','plot','Graph of total cost by number of drinks. Card A begins at 8 dollars and rises by 2 per drink. Card B begins at 2 dollars and rises by 4 per drink. '+priceText(r.n))+'<div class="linekey"><span class="legendline"></span>Card A <span class="legendline b"></span>Card B</div></div>',r.n+(r.n===1?' drink':' drinks'),priceText(r.n));
 let body='';
 if(predict){body='<h2>Just one drink.</h2><p class="sub">Which card do you think will cost less for your first drink?</p><div class="choices">'+act('<strong>Card A</strong><small>$8 to join + $2 per drink</small>','predict','A','choice deal-choice')+act('<strong>Card B</strong><small>$2 to join + $4 per drink</small>','predict','B','choice deal-choice')+'</div>';}
 else if(end){body='<h2>Your price check</h2><p class="sub">'+priceText(r.n)+'</p><div class="notice">Card B starts cheaper. Each extra drink on Card A adds just $2. The two lines cross at three drinks.</div>'+finishControls('deals');}
 else {body='<h2>Try another drink.</h2><p class="sub">'+(r.n===1&&r.prediction?'You picked Card '+r.prediction+'. A costs $10 and B costs $6 for one drink.':'Change the quantity. When do the receipts match?')+'</p><div class="stepper">'+act('−','count','-1','adjust','aria-label="One fewer drink" '+(r.n===0?'disabled':''))+'<output>'+r.n+(r.n===1?' drink':' drinks')+'</output>'+act('+','count','1','adjust','aria-label="One more drink" '+(r.n===6?'disabled':''))+'</div><div class="notice" role="status">'+priceText(r.n)+'</div><div class="actions">'+act('Finish round','finishDeal')+'</div>';}
 return intro('Pick the better deal.','Predict a price, then watch the two receipts change.','Boba deals')+layout(visual,body);
}
function done(){return intro('Shop closed for now.','Your drink will be here when you feel like coming back.')+layout(storefront(),'<h2>All yours.</h2><p class="sub">Your '+flavors[design.flavor][0].toLowerCase()+' with '+toppings[design.topping][0].toLowerCase()+' is on the counter. You can close this tab.</p><div class="actions">'+act('Back to my shop','lobby','','secondary')+'</div>');}
function render(focus=''){
 const view={base:mixer,topping:mixer,lobby,crew:crewScreen,deals:dealsScreen,done};$('app').innerHTML=view[screen]();
 if($('shop'))BobaArt.shop($('shop'),design.flavor,design.topping);
 if($('crew-art'))BobaArt.crew($('crew-art'),round.color,round.garment);
 if($('graph'))drawGraph();
 document.querySelectorAll('canvas[data-stamp]').forEach(c=>drawStamp(c,c.dataset.stamp));
 if(focus==='heading'){const h=$('app').querySelector('h1');h.tabIndex=-1;h.focus({preventScroll:true});window.scrollTo(0,0);}
 else if(focus){const b=$('app').querySelector(focus);if(b&&!b.disabled)b.focus({preventScroll:true});}
}
function drawGraph(){
 const c=$('graph'), scale=2,w=480,h=235; c.width=w*scale;c.height=h*scale;const g=c.getContext('2d');g.scale(scale,scale);
 const left=54,right=454,top=30,bottom=193;const X=n=>left+(right-left)*n/6,Y=p=>bottom-(bottom-top)*p/28;
 g.font='15px sans-serif';g.lineWidth=1;g.fillStyle='#493245';g.textAlign='right';
 for(let p=0;p<=28;p+=4){g.strokeStyle='#dacdd3';g.beginPath();g.moveTo(left,Y(p));g.lineTo(right,Y(p));g.stroke();g.fillText(String(p),left-9,Y(p)+5);}
 g.textAlign='center';for(let i=0;i<=6;i++){g.fillText(String(i),X(i),bottom+18);}
 g.textAlign='left';g.fillText('Cost ($)',left,20);g.textAlign='center';g.fillText('Drinks',(left+right)/2,230);
 const n=round.n;
 g.setLineDash([2,4]);g.strokeStyle='#786370';g.beginPath();g.moveTo(X(n),top);g.lineTo(X(n),bottom);g.stroke();
 ['#a93258','#30675c'].forEach((color,i)=>{g.strokeStyle=color;g.lineWidth=3;g.setLineDash(i?[7,5]:[]);g.beginPath();g.moveTo(X(0),Y(costs(0)[i]));g.lineTo(X(6),Y(costs(6)[i]));g.stroke();g.setLineDash([]);g.fillStyle=color;g.beginPath();g.arc(X(n),Y(costs(n)[i]),i?4:7,0,Math.PI*2);g.fill();});
}
function drawStamp(c,id){
 const g=c.getContext('2d');g.imageSmoothingEnabled=false;
 const pix=(x,y,w,h,color)=>{g.fillStyle=color;g.fillRect(x,y,w,h);};
 const patterns={
  strawberry:['....ggg...','..gggggg..','...grgg...','..rrrrrr..','.rrrrrrrr.','.ryrryrrr.','..rryrry..','..rrrrrr..','...rrrr...','....rr....'],
  matcha:['........g.','......ggg.','....ggggg.','...gggGgg.','..gggGgg..','.gggGgg...','.ggGgg....','..Ggg.....','.G........','..........'],
  taro:['....gg....','.....gg...','....ppp...','..ppPPpp..','.ppPPpppp.','.pPPppppp.','.ppppPpp..','..ppppp...','...ppp....','....p.....'],
  pearls:['..........','..ooo.....','.oOooo....','..oooo.oo.','...oo.oOoo','..ooo..ooo','.oOooo..o.','..ooo.....','..........','..........'],
  jelly:['..........','...jjj....','..jjjjj...','..JjjJJ...','..JJJJJ...','......jjj.','.....jjjjj','.....JjjJJ','.....JJJJJ','..........'],
  stars:['..........','....yy....','....yy....','.yyyyyyyy.','..yyyyyy..','...yyyy...','..yyyyyy..','..yy..yy..','..........','..........'],
  outfit:['...p..p...','..pppppp..','.pppppppp.','.ppPPPPpp.','...pppp...','...pppp...','...pppp...','...PPPP...','..........','..........'],
  receipt:['..oooooo..','..owwwwo..','..owGGwo..','..owwwwo..','..owGGwo..','..owwwwo..','..owGGwo..','..owwwwo..','..oo..oo..','..........']
 };
 const paint={g:'#57935a',G:'#376349',r:'#d94c68',y:'#eeb54b',p:'#a66fb6',P:'#754f8b',o:'#543747',O:'#926d79',j:'#efa76c',J:'#ca7952',w:'#fffbea'};const sprite=patterns[id]||patterns.pearls;
 sprite.forEach((row,y)=>[...row].forEach((v,x)=>{if(paint[v])pix(x*2,y*2,2,2,paint[v]);}));
}
function beep(){if(!sound)return;try{const Audio=window.AudioContext||window.webkitAudioContext;if(!Audio)return;context=context||new Audio();context.resume().catch(()=>{});const o=context.createOscillator(),gain=context.createGain();o.type='sine';o.frequency.value=494;gain.gain.setValueAtTime(.035,context.currentTime);gain.gain.exponentialRampToValueAtTime(.001,context.currentTime+.10);o.connect(gain);gain.connect(context.destination);o.start();o.stop(context.currentTime+.11);}catch{}}
function navigate(type){screen=type;render('heading');}
function enter(type){if(type==='crew')newCrew();else newDeals();render('heading');}
function same(a,v){return '[data-act="'+a+'"][data-value="'+v+'"]';}
$('app').addEventListener('click',e=>{
 const b=e.target.closest('button[data-act]');if(!b||b.disabled)return;const a=b.dataset.act,v=b.dataset.value;beep();
 if(['base','topping','lobby','done'].includes(a)){navigate(a);return;}
 if(a==='crew'||a==='deals'){enter(a);return;}
 if(a==='select'){design[screen==='base'?'flavor':'topping']=v;save();render(same(a,v));return;}
 if(a==='free'){newCrew(true);render('heading');return;}
 if(a==='replay'){if(v==='crew')number++;enter(v);return;}
 if(a==='hint'){round.hint=!round.hint;render(same(a,''));return;}
 if(a==='color'||a==='garment'){round[a]=v;round.chosen=true;round.feedback='';render(same(a,v));return;}
 if(a==='nextGarment'||a==='recolor'){round.phase=a==='nextGarment'?'garment':'color';round.chosen=false;round.feedback='';render('.compact button');return;}
 if(a==='checkOutfit'){
  if(round.free){round.phase='pass';round.feedback='';}
  else if(round.color===round.wantColor&&round.garment===round.wantItem){round.phase='success';round.feedback='';}
  else{const wrongColor=round.color!==round.wantColor;const garmentOK=round.garment===round.wantItem;
   round.feedback=(garmentOK?'You found the '+round.garment+'. ':!wrongColor?'You found the color. ':'')+(wrongColor?colors[round.color][0]+' is '+round.color+'. Try '+colors[round.wantColor][0]+' ('+round.wantColor+').':'That’s a '+round.garment+'. Try '+garments[round.wantItem][0]+' ('+round.wantItem+').');
   round.phase=wrongColor?'color':'garment';round.chosen=false;
  }render(round.phase==='success'||round.phase==='pass'?'.actions button':'.compact button');return;
 }
 if(a==='guess'){round.phase='guess';render('.guess');return;}
 if(a==='guessAnswer'){if(v===round.color+'|'+round.garment){round.phase='success';round.feedback='';}else{const [col,item]=v.split('|');round.feedback='That label means '+english(col,item)+'. Look at the color and shape again.';}render(round.phase==='success'?'.actions button':same(a,v));return;}
 if(a==='predict'){round.prediction=v;round.n=1;round.phase='explore';render('[data-value="1"]');return;}
 if(a==='count'){round.n=Math.max(0,Math.min(6,round.n+Number(v)));render(same(a,(round.n===0?'1':round.n===6?'-1':v)));return;}
 if(a==='finishDeal'){round.phase='success';render('.actions button');}
});
$('sound').onclick=()=>{sound=!sound;$('sound').setAttribute('aria-pressed',String(sound));$('sound-label').textContent=sound?'Sound on':'Sound off';beep();};
$('home').onclick=()=>navigate('base');
function openDialog(kind){dialogOpener=document.activeElement;const help=kind==='help';$('dialog-content').innerHTML=help?'<h2 id="dialog-title">How to play</h2><p>Pick a base and a topping, then open the shop. Style the crew to try Mandarin clothing words, or compare two boba deals on a graph.</p><p>Take one round or stay and explore. Choose <b>My shop</b> to switch activities.</p><button id="dismiss" class="primary">Got it</button>':'<h2 id="dialog-title">Start fresh?</h2><p>Reset the drink and last activity saved in this browser.</p><div class="actions"><button class="secondary" id="dismiss">Keep my drink</button><button id="confirm-reset" class="primary">Reset my shop</button></div>';
 const dlg=$('dialog');dlg.setAttribute('aria-labelledby','dialog-title');dlg.showModal();$('dismiss').onclick=()=>dlg.close();if(!help)$('confirm-reset').onclick=()=>{design=defaults();number=0;save();dlg.close();navigate('base');};
}
$('dialog').addEventListener('close',()=>{dialogOpener?.focus({preventScroll:true});});
$('help').onclick=()=>openDialog('help');$('reset').onclick=()=>openDialog('reset');
BobaArt.cup($('logo'),'strawberry','pearls');showStorage();render();
})();
