(function(){
  'use strict';
  const lessons=[
    {id:'receipts',title:'Compare two boba deals',description:'Build two receipts and find out when the cheaper deal changes.'},
    {id:'graphs',title:'Read the crossing',description:'Turn drinks and dollars into a point you can explain.'},
    {id:'design',title:'Design a price crossover',description:'Give two boba cards a meeting point of your choice.'}
  ];
  const variants=[
    {a:9,b:1,r:2,s:4},{a:10,b:1,r:1,s:4},{a:12,b:2,r:2,s:4},
    {a:8,b:2,r:1,s:4},{a:14,b:2,r:1,s:3},{a:13,b:1,r:2,s:5}
  ];
  const example={a:8,b:2,r:2,s:4};
  function totals(plan,n){return [plan.a+plan.r*n,plan.b+plan.s*n];}
  function meeting(plan){return (plan.a-plan.b)/(plan.s-plan.r);}
  const money=n=>'$'+Number(n.toFixed(2));
  const lines=p=>`Card A is ${money(p.a)} to join plus ${money(p.r)} per drink. Card B is ${money(p.b)} to join plus ${money(p.s)} per drink.`;
  function plot(canvas,p,n,limit){
    const width=500,height=217,left=52,bottom=178,right=477,top=24;
    const scale=Math.min(3,Math.max(1,window.devicePixelRatio||1));
    canvas.width=width*scale;canvas.height=height*scale;
    const g=canvas.getContext('2d');g.scale(scale,scale);
    const cap=Math.ceil(Math.max(...totals(p,limit))/8)*8;
    const X=(x)=>left+(right-left)*x/limit, Y=y=>bottom-(bottom-top)*y/cap;
    g.font='15px sans-serif';g.fillStyle='#473541';g.textAlign='right';
    for(let y=0;y<=cap;y+=cap/4){
      g.strokeStyle='#ddd2ca';g.beginPath();g.moveTo(left,Y(y));g.lineTo(right,Y(y));g.stroke();g.fillText(y,left-8,Y(y)+4);
    }
    g.textAlign='center';
    for(let x=0;x<=limit;x++)g.fillText(x,X(x),bottom+17);
    g.fillText('Drinks',(left+right)/2,height-2);g.textAlign='left';g.fillText('Cost ($)',4,16);
    [0,1].forEach(i=>{
      g.strokeStyle=i?'#326b58':'#a13d62';g.lineWidth=3;g.setLineDash(i?[7,5]:[]);
      g.beginPath();g.moveTo(X(0),Y(totals(p,0)[i]));g.lineTo(X(limit),Y(totals(p,limit)[i]));g.stroke();g.setLineDash([]);
      g.fillStyle=g.strokeStyle;g.beginPath();g.arc(X(n),Y(totals(p,n)[i]),i?4:7,0,Math.PI*2);g.fill();
    });
  }
  function mount(stage,ctx){
    const {state,mode,lessonId:id,round}=ctx;
    const p=variants[(round+(id==='graphs'?1:id==='design'?2:0))%variants.length];
    const finish=(key,message,assisted=false)=>ctx.finish({id:key,assisted:assisted||Boolean(state.helped),message});
    function note(message,help=false){if(help)state.helped=true;state.note=message;ctx.save();ctx.feedback(message);}
    function redraw(){ctx.save();render();}
    function showFeedback(){ctx.feedback(state.note||'');}
    function controls(label,cb,cls=''){
      const b=document.createElement('button');b.type='button';b.textContent=label;b.className=cls;b.onclick=cb;return b;
    }
    function addButton(label,cb,cls=''){stage.querySelector('#math-actions').append(controls(label,cb,cls));}
    function addPass(label,message){
      addButton(label,()=>{state.step=(state.step||0)+1;state.note=message||'';redraw();focusPrompt();},'primary');
    }
    function focusPrompt(){const h=stage.querySelector('h2');if(h){h.tabIndex=-1;h.focus({preventScroll:true});}}
    function setup(heading,text=''){
      stage.innerHTML=`<div class="math-work"><h2 id="math-prompt">${heading}</h2>${text?`<p>${text}</p>`:''}<div id="math-visual"></div><div id="math-input"></div><div class="choices" id="math-actions"></div></div>`;
    }
    function drawCounter(plan,{interactive=true,table=true,graph=true,max=7,start=0}={}){
      const visual=stage.querySelector('#math-visual');
      const n=Math.min(max,Math.max(0,Number.isInteger(state.n)?state.n:start));
      visual.innerHTML=`<div class="labgrid"><div><div class="receipts">${['A','B'].map((card,i)=>`<div class="paper-slip ${i?'b':'a'}"><b>Card ${card}</b><small>${money(i?plan.b:plan.a)} + ${money(i?plan.s:plan.r)} per drink</small><strong id="price-${card}"></strong></div>`).join('')}</div>
        ${interactive?`<label for="count-drinks">Number of drinks · <output id="n-value" for="count-drinks">${n}</output></label><input id="count-drinks" type="range" min="0" max="${max}" step="1" value="${n}">`:`<p>${n} drinks</p>`}
        ${table?`<details id="price-table"><summary>Read the price table</summary><table class="price-table"><caption>Total cost by number of drinks</caption><thead><tr><th scope="col">Drinks</th><th scope="col">A</th><th scope="col">B</th></tr></thead><tbody>${Array.from({length:max+1},(_,i)=>`<tr data-row="${i}"><th scope="row">${i}</th>${totals(plan,i).map(v=>`<td>${money(v)}</td>`).join('')}</tr>`).join('')}</tbody></table></details>`:''}</div>
        ${graph?'<div><canvas id="price-plot" class="graph" role="img"></canvas><p class="note">A · solid berry line &nbsp; B · dashed green line</p></div>':''}</div>`;
      function update(q){
        const [a,b]=totals(plan,q);visual.querySelector('#price-A').textContent=money(a);visual.querySelector('#price-B').textContent=money(b);
        if(interactive)visual.querySelector('#n-value').textContent=q;
        visual.querySelectorAll('tr[data-row]').forEach(tr=>tr.classList.toggle('current',Number(tr.dataset.row)===q));
        const c=visual.querySelector('canvas');
        if(c){c.setAttribute('aria-label',`${lines(plan)} At ${q} drinks, A costs ${money(a)} and B costs ${money(b)}. The table gives each point.`);plot(c,plan,q,max);}
      }
      const input=visual.querySelector('#count-drinks');
      if(input)input.oninput=()=>{state.n=Number(input.value);update(state.n);ctx.save();};
      update(n);
    }
    function multi(question,answers,correct,why,onCorrect){
      const holder=stage.querySelector('#math-input');
      const fs=document.createElement('fieldset'),lg=document.createElement('legend');lg.textContent=question;fs.append(lg);
      const box=document.createElement('div');box.className='choices';fs.append(box);
      answers.forEach((v,i)=>box.append(controls(v,()=>{
        if(i===correct){onCorrect();return;}
        note(why[i]||'Check the fees and compare the amounts at the same number of drinks.',true);
      })));
      holder.append(fs);
    }
    function numberQuestion(label,expected,wrong,onCorrect){
      const holder=stage.querySelector('#math-input');
      holder.innerHTML=`<form><label for="math-number">${label}</label><div class="choices"><input type="number" step="any" min="0" inputmode="decimal" id="math-number" required><button class="primary" type="submit">Check my answer</button></div></form>`;
      const input=holder.querySelector('input');
      input.value=state.entry??'';input.oninput=()=>{state.entry=input.value;ctx.save();};
      holder.querySelector('form').onsubmit=e=>{
        e.preventDefault();const ans=input.valueAsNumber;
        if(!Number.isFinite(ans))return;
        if(Math.abs(ans-expected)<1e-8){onCorrect();return;}note(wrong(ans),true);
      };
    }
    function show(){
      const step=state.step||0;
      if(id==='receipts'){
        const stages=[
          ['What does a drink cost before you buy one?','The joining fee is the starting point. At zero drinks A has already cost $8, and B has cost $2. Move the counter by one and watch how much each total grows.'],
          ['See the gap close.','A starts $6 higher. Each drink adds $2 to A and $4 to B, so B catches up by $2 per drink. Look for the row where the two totals match.'],
          ['Predict the next receipt.','At three drinks, both totals are $14. If you bought one more, which deal would cost less? Make a prediction, then test it.']
        ];
        setup(...stages[Math.min(step,2)]);drawCounter(example,{start:[0,2,3][step]||0,graph:step>0});
        if(step<2){addPass(step===0?'Compare the two rates':'Find the meeting point');}
        else multi('At four drinks, which costs less?',['Card A','Card B','They still tie'],0,[null,'B adds $4 to the tie price. A adds only $2. Move the counter to four.','A tie happens at one quantity here. The next drink costs a different amount on each card.'],()=>finish('receipt-demo','You explained why Card A costs less after the two prices meet.',true));
      } else if(id==='graphs'){
        const stages=[
          ['Put a receipt on the graph.','A point records two facts. Move across for the drink count, then up for the total cost. At zero drinks the two joining fees give different starting heights.'],
          ['Find a point on both lines.','At three drinks each receipt is $14. The graph records this as (3, 14). The first number counts drinks. The second counts dollars.'],
          ['Read the coordinates in order.','A new employee says the plans tie at fourteen drinks. Which part of the graph should they read to find how many drinks?']
        ];
        setup(...stages[Math.min(step,2)]);drawCounter(example,{start:step===0?0:3});
        if(step<2)addPass(step===0?'Find the crossing':'Explain the point');
        else multi('Choose an axis.',['The vertical cost axis','The horizontal drinks axis'],1,['The vertical axis tells you the shared price in dollars. Read across for the quantity.'],()=>finish('graph-demo','You read both parts of a crossing: the drink count and the common price.',true));
      } else {
        const stages=[
          ['Build backward from five drinks.','Card B costs $2 to join and $4 per drink. Five drinks add $20, so its total at five is $22. That is the target for Card A.'],
          ['Work out the missing fee.','Card A charges $2 per drink. At five drinks, its drinks cost $10. What joining fee fills the gap from $10 to $22?'],
          ['Test the design.','A needs a $12 fee, since $12 + 5 × $2 = $22. B makes the same $22 another way. Slide to four or six to see who pays less on either side.']
        ];
        setup(...stages[Math.min(step,2)]);
        if(step===1)numberQuestion('Card A joining fee in dollars',12,a=>a===22?'$22 is the whole receipt. Subtract the $10 spent on drinks.':'Five drinks already cover $10. Count the gap from $10 up to $22.',()=>{state.step=2;state.entry='';state.n=5;state.note='';redraw();focusPrompt();});
        else if(step===0)addPass('Build Card A');
        else {drawCounter({a:12,b:2,r:2,s:4},{start:5});addButton('Finish my design',()=>finish('design-demo','You built two different ways to reach $22 at five drinks.',true),'primary');}
      }
    }
    function attempt(){
      const n=meeting(p), [cost]=totals(p,n), key=`${id}-${p.a}-${p.b}-${p.r}-${p.s}`;
      const success=(msg)=>finish(key,msg);
      if(id==='receipts'){
        const offset=[1,-1,0][round%3], quantity=n+offset;
        const correct=offset===0?2:offset>0?0:1;
        const [a,b]=totals(p,quantity);
        setup('Which deal wins this order?',`A customer wants ${quantity} drinks. ${lines(p)}`);
        if(!state.step){
          const response = [`A’s fee is ${money(p.a)}. Add ${quantity} drinks at ${money(p.r)}, then check B.`,`B’s fee is ${money(p.b)}. Add ${quantity} drinks at ${money(p.s)}, then check A.`,`A tie needs matching totals. Compare ${p.a} + ${quantity} × ${p.r} with ${p.b} + ${quantity} × ${p.s}.`];
          multi('Which card costs less?',['Card A','Card B','They cost the same'],correct,response,()=>{state.step=1;state.note=`At ${quantity} drinks A costs ${money(a)} and B costs ${money(b)}. Now explain the difference.`;redraw();focusPrompt();});
        }else{
          const explanations=['A adds less for each new drink.','The lower joining fee still keeps B ahead.','B’s larger drink charges have exactly made up the starting gap.'];
          multi('Which explanation fits this order?',explanations,correct,[
            offset<0?'A does add less per drink. At this quantity it still has the higher total.':'A’s smaller rate matters. What has happened to the gap at this exact order?',
            'B starts lower. Check whether that leaves B ahead at this quantity.',
            'The fees balance the drink charges exactly only when the receipts have the same total.'
          ],()=>success(`You explained why ${['Card A costs less','Card B costs less','the two cards tie'][correct]} at ${quantity} drinks.`));
        }
      } else if(id==='graphs'){
        setup('Read the meeting point.',lines(p));drawCounter(p,{start:1});
        if(!state.step)numberQuestion('How many drinks when both lines meet?',n,a=>a===cost?`${money(cost)} is the height of the crossing. Follow it down to the drinks axis.`:'Find the row with equal totals, then read its drink count.',()=>{state.step=1;state.entry='';state.note='That is the horizontal coordinate. Now read the height.';redraw();focusPrompt();});
        else numberQuestion('What is the shared price in dollars?',cost,a=>a===n?'That number counts drinks. Read the vertical cost axis or one of the two receipts.':`Try the joining fee plus ${n} times the per-drink price.`,()=>success(`You read the crossing at ${n} drinks and ${money(cost)}.`));
      } else {
        setup('Invent the missing joining fee.',`Card B costs ${money(p.b)} up front plus ${money(p.s)} per drink. Card A charges ${money(p.r)} per drink. Make them tie at ${n} drinks.`);
        numberQuestion('What joining fee should Card A charge?',p.a,a=>a===cost?`That is the shared total. Take out the ${money(n*p.r)} spent on Card A drinks first.`:`With a ${money(a)} fee, Card A would cost ${money(a+n*p.r)} at ${n} drinks. Card B costs ${money(cost)}. Adjust the fee by the difference.`,()=>success(`You designed a ${money(p.a)} joining fee that makes the prices meet at ${n} drinks.`));
      }
      addButton('Show a hint',()=>{note(id==='receipts'?`Build the receipts separately. Multiply the number of drinks by each rate, then add its fee.`:id==='graphs'?'The crossing is on both lines. Read across for drinks and up for dollars.':`Find B’s total first, then subtract what A’s drinks alone would cost.`,true);},'secondary');
    }
    function stretch(){
      const task=state.target||({receipts:'tie',graphs:'parallel',design:'whole'})[id];
      const custom=state.plan ||= {a:8,b:2,r:2,s:4};
      const target=5+(round%3);
      setup('Design a pair of boba deals.','Set both joining fees and both per-drink prices. Your graph changes with the menu.');
      const holder=stage.querySelector('#math-input');
      holder.innerHTML=`<fieldset><legend>Choose a design brief</legend><div class="choices"><button data-target="tie" aria-pressed="${task==='tie'}">Tie at ${target} drinks</button><button data-target="parallel" aria-pressed="${task==='parallel'}">Parallel lines</button><button data-target="whole" aria-pressed="${task==='whole'}">No whole-drink tie</button></div></fieldset><fieldset><legend>Set your prices</legend><div class="choices">${[['a','A fee',0,20],['r','A per drink',1,6],['b','B fee',0,20],['s','B per drink',1,6]].map(([key,label,min,max])=>`<label>${label} <select data-price="${key}">${Array.from({length:max-min+1},(_,i)=>`<option value="${i+min}" ${i+min===custom[key]?'selected':''}>$${i+min}</option>`).join('')}</select></label>`).join('')}</div></fieldset>`;
      const live=()=>drawCounter(custom,{start:target,max:8});
      live();
      holder.querySelectorAll('[data-price]').forEach(el=>el.onchange=()=>{custom[el.dataset.price]=Number(el.value);state.note='';ctx.feedback('');live();ctx.save();});
      holder.querySelectorAll('[data-target]').forEach(b=>b.onclick=()=>{state.target=b.dataset.target;state.note='';redraw();stage.querySelector(`[data-target="${state.target}"]`).focus();});
      addButton('Test my design',()=>{
        const [a,b]=totals(custom,target);
        if(task==='parallel'){
          if(custom.r===custom.s && custom.a!==custom.b)finish(`parallel-${custom.a}-${custom.r}-${custom.b}-${custom.s}`,`Your lines have the same rate and different starting fees, so the gap stays ${money(Math.abs(custom.a-custom.b))}.`);
          else if(custom.r===custom.s)note('Both the fees and rates match, so these lines coincide everywhere. Give the cards different starting fees.',true);
          else note('For two parallel lines, each new drink must add the same amount to both cards. Keep their starting prices different.',true);
        }else if(task==='whole'){
          const x=meeting(custom);
          if(custom.r===custom.s && custom.a===custom.b)note('These prices match for every whole drink. Change a rate or a fee and try again.',true);
          else if(custom.r===custom.s)finish(`whole-parallel-${custom.a}-${custom.b}-${custom.r}`,'Your different starting fees stay the same distance apart, so a whole-drink order never ties.');
          else if(x<0)finish(`whole-negative-${custom.a}-${custom.b}-${custom.r}-${custom.s}`,'Your lines meet only at a negative drink count. Every order the shop can sell has two different prices.');
          else if(!Number.isInteger(x))finish(`whole-between-${custom.a}-${custom.b}-${custom.r}-${custom.s}`,`Your graph crosses between ${Math.floor(x)} and ${Math.ceil(x)} drinks. No whole-drink order can hit the tie.`);
          else note(`The two cards currently tie at ${x} drinks. Try a different fee to move the crossing between whole numbers, or try parallel lines.`,true);
        }else if(a===b && custom.r!==custom.s)finish(`target-${target}-${custom.a}-${custom.r}-${custom.b}-${custom.s}`,`Your different deals meet at ${target} drinks and ${money(a)}. You made the graph do what you wanted.`);
        else if(a===b)note('These cards tie at every quantity. Change a rate and adjust its fee to make exactly one meeting point.',true);
        else note(`At ${target} drinks A is ${money(a)} and B is ${money(b)}. Shrink the ${money(Math.abs(a-b))} gap by changing a fee or a rate.`,true);
      },'primary');
    }
    function render(){
      if(mode==='show')show();else if(mode==='try')attempt();else stretch();showFeedback();
    }
    render();
  }
  window.PearlAlgebra={lessons,mount};
})();
