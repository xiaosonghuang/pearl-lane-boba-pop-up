(() => {
  'use strict';

  // Original example sentences put each word into a shop, outfit, or everyday setting.
  const vocabulary = [
    ['sweater','毛衣','máoyī','sweater','这件毛衣很舒服。','This sweater is comfortable.'],
    ['pants','裤子','kùzi','pants','我想买一条裤子。','I would like to buy a pair of pants.'],
    ['blue','蓝色','lánsè','blue','我喜欢蓝色的外套。','I like blue jackets.'],
    ['skirt','裙子','qúnzi','skirt','这条裙子是紫色的。','This skirt is purple.'],
    ['purple','紫色','zǐsè','purple','我想试试紫色的。','I would like to try the purple one.'],
    ['wear','穿','chuān','to wear / put on','今天我穿毛衣。','Today I am wearing a sweater.'],
    ['clothes','衣服','yīfu','clothes','你喜欢什么颜色的衣服？','What color clothes do you like?'],
    ['shirt','衬衫','chènshān','shirt','这件衬衫太长了。','This shirt is too long.'],
    ['coat','外套','wàitào','jacket / coat','外面冷，穿外套吧。','It is cold outside. Put on a jacket.'],
    ['dress','连衣裙','liányīqún','dress','她想买一件连衣裙。','She would like to buy a dress.'],
    ['jian','件','jiàn','measure word for tops and many garments','一件毛衣，两件衬衫。','One sweater, two shirts.'],
    ['tiao','条','tiáo','measure word for pants and many long things','这是一条裤子。','This is a pair of pants.'],
    ['buy','买','mǎi','to buy','我想买一件毛衣。','I would like to buy a sweater.'],
    ['cotton','棉袄','mián’ǎo','padded cotton jacket','天冷了，我穿棉袄。','The weather has turned cold. I wear a padded jacket.'],
    ['tee','T恤衫','tīxùshān','T-shirt','夏天我爱穿T恤衫。','I love wearing T-shirts in summer.'],
    ['red','红色','hóngsè','red','我穿红色的衬衫。','I wear a red shirt.'],
    ['green','绿色','lǜsè','green','这件外套是绿色的。','This jacket is green.'],
    ['white','白色','báisè','white','我喜欢白色的毛衣。','I like white sweaters.'],
    ['black','黑色','hēisè','black','这条裤子是黑色的。','These pants are black.'],
    ['yellow','黄色','huángsè','yellow (two-character color name)','这件衣服是黄色的。','This piece of clothing is yellow.'],
    ['grey','灰色','huīsè','gray','这件灰色的外套很好看。','This gray jacket looks nice.'],
    ['huang','黄','huáng','yellow (also a surname)','这朵花很黄。','This flower is a strong yellow.'],
    ['suit','西装','xīzhuāng','suit','他今天穿西装。','He is wearing a suit today.'],
    ['qipao','旗袍','qípáo','qipao / cheongsam','我喜欢这件旗袍的颜色。','I like the color of this qipao.'],
    ['store','百货商店','bǎihuò shāngdiàn','department store','百货商店里有很多衣服。','There are many clothes in the department store.'],
    ['sale','打折','dǎzhé','to be discounted','这件外套今天打折。','This jacket is on sale today.'],
    ['how','怎么样','zěnmeyàng','how is it? / what do you think?','你觉得这件怎么样？','What do you think of this one?'],
    ['comfortable','舒服','shūfu','comfortable','这条裤子很舒服。','These pants are comfortable.'],
    ['pretty','漂亮','piàoliang','pretty / beautiful','这条裙子真漂亮。','This skirt is really pretty.'],
    ['stylish','时髦','shímáo','fashionable','这件外套很时髦。','This jacket is fashionable.'],
    ['looks','好看','hǎokàn','good-looking / nice to look at','蓝色和白色放在一起很好看。','Blue and white look nice together.'],
    ['quite','挺','tǐng','quite / rather','这件毛衣挺舒服的。','This sweater is quite comfortable.'],
    ['too','太','tài','too / extremely','这条裤子太长了。','These pants are too long.'],
    ['long','长','cháng','long','这条裙子有点长。','This skirt is a little long.'],
    ['loose','肥','féi','loose / roomy (of clothing)','这条裤子有点肥。','These pants are a little loose.'],
    ['tight','瘦','shòu','narrow / tight (of clothing)','这件衬衫有点瘦。','This shirt is a little tight.'],
    ['much','多','duō','many / much','这里的颜色真多。','There are so many colors here.'],
    ['should','该','gāi','should / ought to','下雨了，该穿外套了。','It is raining. It is time to put on a jacket.'],
    ['mister','先生','xiānsheng','Mr. / sir','先生，您想试穿吗？','Sir, would you like to try it on?'],
    ['mrs','太太','tàitai','Mrs. / wife','林太太喜欢绿色。','Mrs. Lin likes green.'],
    ['miss','小姐','xiǎojiě','Miss (as a title)','林小姐穿了一件毛衣。','Miss Lin is wearing a sweater.']
  ].map(([id, zh, py, en, ex, gloss]) => ({id, zh, py, en, ex, gloss}));
  const word = Object.fromEntries(vocabulary.map(w => [w.id, w]));
  const garments = ['sweater','pants','skirt','shirt','coat','dress'];
  const colors = {
    blue: ['#c8e4f5','#83b7d8','#6494b8'], purple: ['#e8c4f1','#b18acb','#916da8'],
    green: ['#c3dfb4','#8fbd96','#548765'], red: ['#ffb1a4','#df726d','#ac494e'],
    black: ['#827984','#4d4656','#342e3c'], white: ['#fffdf3','#f6efe3','#b9b1ab'],
    yellow: ['#ffedb3','#e5c56b','#ac853b'], grey: ['#d3d2d7','#aba8b1','#73727b']
  };
  const lessons = [
    {id:'words', title:'Five words on the rack', description:'Browse five clothing words, hear them in context, then spot one on a label.'},
    {id:'phrases', title:'Build a clothing order', description:'Change one piece of an order and see what happens to the Mandarin.'},
    {id:'customers', title:'The two-customer fitting room', description:'Pick out the right color and garment for two customers, or design a challenge for a friend.'}
  ];
  const wardrobe = [
    [['purple','skirt'],['blue','sweater']], [['green','coat'],['red','pants']],
    [['blue','shirt'],['purple','dress']], [['white','sweater'],['black','pants']],
    [['yellow','skirt'],['grey','coat']], [['red','dress'],['green','shirt']]
  ];
  const counters = {
    jian:{zh:'一件',py:'yí jiàn'}, tiao:{zh:'一条',py:'yì tiáo'}
  };
  const counterFor = g => ['pants','skirt'].includes(g) ? 'tiao' : 'jian';
  const plainColor = id => id === 'grey' ? 'gray' : id;
  const garmentLabel = id => id === 'coat' ? 'jacket' : id;
  const enName = (c,g) => (g === 'pants' ? 'a pair of ' : 'a ') + plainColor(c) + ' ' + garmentLabel(g);
  function phrase(c,g) {
    const count = counters[counterFor(g)];
    return {zh:count.zh + word[c].zh + '的' + word[g].zh, py:count.py + ' ' + word[c].py + ' de ' + word[g].py, en:enName(c,g)};
  }
  function element(tag, text, cls) {
    const n = document.createElement(tag);
    if (text !== undefined) n.textContent = text;
    if (cls) n.className = cls;
    return n;
  }
  function han(text, cl) {
    const n = element('span',text,cl);
    n.lang='zh-Hans';
    return n;
  }
  function button(label, fn, cls, isSelected) {
    const b=element('button',label,cls || 'm-button');
    b.type='button';
    if (isSelected !== undefined) b.setAttribute('aria-pressed',String(isSelected));
    b.addEventListener('click',fn);
    return b;
  }
  function rotate(array, n) {
    const i=n%array.length;
    return array.slice(i).concat(array.slice(0,i));
  }
  function unique(items) { return [...new Set(items)]; }

  let activeAudio;
  function stopAudio() {
    if (activeAudio) {activeAudio.pause();activeAudio=null;}
  }
  function speakButton(id,label,ctx) {
    return button(label,() => {
      stopAudio();
      const audio = new Audio('media/voice/'+id+'.m4a');
      activeAudio=audio;
      audio.play().catch(() => ctx.feedback('Audio could not play. The same clue appears in print.'));
    },'m-listen');
  }
  function outfit(canvas,c,g) {
    if (!window.BobaArt) return;
    window.BobaArt.crew(canvas,c === 'purple' ? 'purple':'blue',g);
    if (c==='purple' || c==='blue') return;
    // Preserve the studio art, changing just its three garment pigment shades.
    const surface=canvas.getContext('2d');
    const pixels=surface.getImageData(0,0,canvas.width,canvas.height);
    const rgb=h => parseInt(h.slice(1),16);
    const inks=Object.fromEntries(colors.blue.map((h,i) => [rgb(h),rgb(colors[c][i])]));
    const data=pixels.data;
    for (let i=0;i<data.length;i+=4) {
      const key=(data[i]<<16)|(data[i+1]<<8)|data[i+2];
      if (inks[key] !== undefined) {
        const newColor=inks[key];
        data[i]=newColor>>16; data[i+1]=(newColor>>8)&255; data[i+2]=newColor&255;
      }
    }
    surface.putImageData(pixels,0,0);
  }
  function portrait(c,g) {
    const canvas=element('canvas',undefined,'m-portrait');
    canvas.setAttribute('role','img');
    canvas.setAttribute('aria-label','Fitting mirror showing '+enName(c,g));
    outfit(canvas,c,g);
    return canvas;
  }
  function mount(stage,ctx) {
    stopAudio();
    const saved=ctx.state.mandarin;
    const s=ctx.state.mandarin=saved && typeof saved==='object' && !Array.isArray(saved) ? saved : {};
    for (const [key,size] of [['card',5],['step',3],['customer',2],['offset',vocabulary.length]]) {
      s[key]=Number.isSafeInteger(s[key]) && s[key]>=0 ? s[key]%size : 0;
    }
    for (const key of ['garment','designGarment']) if (!garments.includes(s[key])) s[key]=null;
    for (const key of ['color','designColor']) if (!Object.hasOwn(colors,s[key])) s[key]=null;
    const round=Math.max(0,Number(ctx.round)||0);
    const local=element('div',undefined,'m-studio');
    stage.replaceChildren(local);
    const settings=ctx.settings;
    function choose(update, refocus) {Object.assign(s,update);ctx.save();render(refocus);}
    function feedback(message) {ctx.feedback(message);}
    function hint(message) {s.assisted=true;ctx.save();feedback(message);}
    function finish(id, message, guided=false) {
      stopAudio();
      ctx.finish({id:'mandarin-'+ctx.lessonId+'-'+id, assisted:guided||!!s.assisted, message});
    }
    function group(label) {
      const row=element('div',undefined,'m-choices');
      row.setAttribute('role','group');row.setAttribute('aria-label',label);
      return row;
    }
    function paragraph(text) {return element('p',text,'m-copy');}
    function prompt(text) {return element('h3',text,'m-prompt');}
    function note(text) {return element('p',text,'m-note');}
    function displayLabel(entry, showEnglish = settings.english) {
      const block=element('div',undefined,'m-word');
      block.append(han(entry.zh,'m-han'));
      if(settings.pinyin && entry.py)block.append(element('span',entry.py,'m-pinyin'));
      if(showEnglish && entry.en)block.append(element('span',entry.en,'m-gloss'));
      return block;
    }
    function paper(entry) {
      local.append(prompt('Write it from memory'),paragraph('On a scrap of paper, write the characters for “'+entry.en+'.”'));
      local.append(speakButton(entry.id,'Hear the word',ctx));
      if (s.revealPaper) local.append(displayLabel(entry,true),note('Compare the shapes. Point to one part you want to remember.'));
      else local.append(button('Reveal the characters',()=>choose({revealPaper:true}),'m-primary'));
      local.append(button('Back to the rack',()=>choose({paper:false,revealPaper:false}),'m-button'));
    }
    function wordDeck() {
      const offset=s.offset||0;
      return Array.from({length:5},(_,i)=>vocabulary[(round*5+offset+i)%vocabulary.length]);
    }
    function showWords() {
      const deck=wordDeck(), w=deck[s.card||0];
      if(s.paper) {paper(w);return;}
      local.append(prompt('Pick a label from the rack'));
      const tabs=group('Five word cards');
      deck.forEach((entry,i)=>{
        const b=button('',()=>choose({card:i},'tab-'+i),'m-chip',i===(s.card||0));
        b.dataset.key='tab-'+i;b.append(han(entry.zh)); tabs.append(b);
      });
      const card=element('section',undefined,'m-flash');
      const withEnglish=settings.english||s.gloss;
      card.append(displayLabel(w,withEnglish),speakButton(w.id,'Hear the word',ctx),han(w.ex,'m-example'));
      if(withEnglish) card.append(element('span',w.gloss,'m-gloss'));
      if(!settings.english) card.append(button(s.gloss?'Hide English':'Show the meaning',()=>choose({gloss:!s.gloss})));
      card.append(speakButton('ex-'+w.id,'Hear the sentence',ctx));
      const controls=group('Word rack options');
      controls.append(button('Write this one on paper',()=>choose({paper:true,revealPaper:false})),button('Different five words',()=>choose({offset:(s.offset||0)+5,card:0})));
      local.append(tabs,card,controls,button('Finish exploring this rack',()=>finish('word-rack','You explored five clothing and shop words in example sentences.',true),'m-primary'));
    }
    function wordOptions(index) {
      return rotate([0,2,7].map(delta=>vocabulary[(index+delta)%vocabulary.length]),(index+1)%3);
    }
    function tryWords() {
      const index=round%vocabulary.length,w=vocabulary[index];
      local.append(prompt('Which label means “'+w.en+'”?'),paragraph('Choose the Mandarin label you would put on the rack.'));
      const answers=group('Word labels');
      wordOptions(index).forEach(entry=>{
        const b=button('',()=>{
          if(entry.id===w.id)finish('label-'+w.id,'You matched '+w.zh+' to '+w.en+'.');
          else hint(entry.zh+' means “'+entry.en+'.” Try another label, or listen for the word you want.');
        },'m-option');
        b.append(displayLabel(entry,false));answers.append(b);
      });
      local.append(answers,speakButton(w.id,'Hear the word you want',ctx),button('Show a character clue',()=>{
        hint('Look for '+w.zh[0]+(w.zh.length>1?' at the beginning of the word.':' on its own.'));
      }));
    }
    function stretchWords() {
      const deck=wordDeck(),w=deck[s.card||0];
      if(!s.passed) {
        local.append(prompt('Make a mystery word for a friend'),paragraph('Secretly choose a label. Your partner will get its meaning and can listen to it.'));
        const picks=group('Secret label');
        deck.forEach((entry,i)=>{
          const b=button(entry.en,()=>choose({card:i},'secret-'+i),'m-option',i===(s.card||0));
          b.dataset.key='secret-'+i;picks.append(b);
        });
        const controls=group('Mystery word controls');
        controls.append(button('Different five words',()=>choose({offset:(s.offset||0)+5,card:0})),button('Hide my pick and pass the screen',()=>choose({passed:true}),'m-primary'));
        local.append(picks,controls);return;
      }
      local.append(prompt('Can you find the secret label?'),paragraph('Your clue is “'+w.en+'.”'),speakButton(w.id,'Hear the mystery word',ctx));
      const answers=group('Mystery word labels');
      rotate(deck,2).forEach(entry=> {
        const b=button('',()=>{
          if(entry.id===w.id)finish('mystery-word','You made and solved a Mandarin word clue.',true);
          else feedback(entry.zh+' means “'+entry.en+'.” Ask your partner to give you another clue.');
        });
        b.append(displayLabel(entry,false));answers.append(b);
      });
      local.append(answers);
    }

    function selector(caption,options,value,onChange,type) {
      const wrap=element('div',undefined,'m-field');
      wrap.append(element('span',caption,'m-field-name'));
      const row=group(caption);
      options.forEach(id=>{
        const b=button('',()=>onChange(id),'m-chip',id===value);
        b.dataset.key=caption+id;
        if(type==='color') {
          const sw=element('span',undefined,'m-swatch');sw.style.background=colors[id][1];sw.setAttribute('aria-hidden','true');
          b.append(sw,plainColor(id));
        } else b.append(garmentLabel(id));
        row.append(b);
      });
      wrap.append(row);return wrap;
    }
    const garmentPicker = (g, options = garments) => selector('Garment',options,g,id=>choose({garment:id},'Garment'+id),'garment');
    const colorPicker = (c, options = Object.keys(colors)) => selector('Color',options,c,id=>choose({color:id},'Color'+id),'color');
    function orderCard(c,g,translate) {
      const order=phrase(c,g);
      const box=element('div',undefined,'m-ticket');
      box.append(displayLabel(order,translate),speakButton(c+'-'+g,'Hear the whole order',ctx));
      return box;
    }
    function showPhrases() {
      const step=s.step||0, g=s.garment||(step===0?'sweater':'pants'),c=s.color||'blue';
      const intros=[
        ['Listen for three pieces','One sweater takes 一件. The color plus 的 comes in the middle, and 毛衣 names the garment at the end.'],
        ['Keep the color. Change the garment.','For one pair of pants, start with 一条. The color stays 蓝色的 and 裤子 goes at the end.'],
        ['Try your own swap','Change just the garment and watch the measure word. Then change just the color and listen to what stays the same.']
      ];
      const [title,text]=intros[step];local.append(prompt(title),paragraph(text));
      const layout=element('div',undefined,'m-layout');
      const rack=element('div',undefined,'m-rack');
      rack.append(orderCard(c,g,settings.english||s.gloss));
      if(!settings.english)rack.append(button(s.gloss?'Hide English':'Show the meaning',()=>choose({gloss:!s.gloss})));
      if(step===2)rack.append(garmentPicker(g,['sweater','pants','shirt','skirt']),colorPicker(c,['blue','purple','green','red']));
      layout.append(portrait(c,g),rack);
      local.append(layout);
      const next=step===2?button('Finish my walkthrough',()=>finish('phrase-walk','You explored how changing the garment can change its measure word.',true),'m-primary'):
        button(step===0?'Swap the sweater for pants':'Experiment with the order',()=>choose({step:step+1,garment:null,color:null}),'m-primary');
      local.append(next);
      if(step>0)local.append(button('Previous step',()=>choose({step:step-1,garment:null,color:null})));
    }
    function tryPhrases() {
      // Test the most idiomatic, unambiguous contrast in this clothing set.
      const items=['sweater','pants','shirt','pants','coat','pants'];
      const g=items[round%items.length], c=Object.keys(colors)[round%Object.keys(colors).length];
      const answer=counterFor(g), p=phrase(c,g);
      local.append(prompt('Which opening completes this order?'),paragraph('You want '+enName(c,g)+'. Choose the words for “one” plus the measure word.'));
      const box=element('div',undefined,'m-ticket');
      box.append(han('＿＿ '+word[c].zh+'的'+word[g].zh,'m-han'));
      if(settings.pinyin)box.append(element('span','＿＿ '+word[c].py+' de '+word[g].py,'m-pinyin'));
      local.append(box);
      const picks=group('Measure words');
      rotate(['jian','tiao'],round%2).forEach(id=>{
        const b=button('',()=>{
          if(id===answer)finish('measure-'+g+'-'+c,'You chose '+counters[answer].zh+' for '+word[g].zh+' in '+p.zh+'!');
          else hint(g==='pants'?'Clothing shops count pairs of pants with 条. Which opening pairs 一 with that character?':'For this top, use the clothing measure word 件. Which opening puts 一 before it?');
        },'m-option');
        b.append(han(counters[id].zh,'m-label'));
        if(settings.pinyin)b.append(element('span',counters[id].py,'m-pinyin'));
        picks.append(b);
      });
      local.append(picks,button('Hear the completed example',()=> {
        s.assisted=true;ctx.save();
        stopAudio();
        activeAudio=new Audio('media/voice/'+c+'-'+g+'.m4a');
        activeAudio.play().catch(()=>feedback('The completed opening is '+counters[answer].zh+'.'));
        feedback('Listen to the opening measure word, then choose it.');
      }));
    }
    function stretchPhrases() {
      const c=s.color||'blue', g=s.garment||'sweater';
      if (!s.passed) {
        local.append(prompt('Fix an order that could mean two things'),paragraph('“The blue one, please.” A sweater and pants are both blue. Pick your intended item and make a clue that only fits it.'));
        local.append(garmentPicker(g,['sweater','pants']),colorPicker(c,['blue','purple','red']),orderCard(c,g,true),button('Hide the translation and test my clue',()=>choose({passed:true}),'m-primary'));
        return;
      }
      local.append(prompt('Two items. One customer order.'),orderCard(c,g,false),paragraph('Both have the same color. Which one fits the entire clue?'));
      const picks=group('Items on the rail');
      ['pants','sweater'].forEach(id=>{
        const b=button('',()=> {
          if (id===g)finish('repair','You made a specific clue by naming the garment. Color alone left two possibilities.',true);
          else feedback('The color fits both. Listen to the last word, or look for '+word[g].zh+'.');
        },'m-look');
        const image=portrait(c,id);image.setAttribute('aria-hidden','true');
        b.append(image,element('span',plainColor(c)+' '+id));picks.append(b);
      });
      local.append(picks,button('Edit my clue',()=>choose({passed:false})));
    }
    function showCustomers() {
      const step=s.step||0, [c,g]=wardrobe[0][step===2?1:0];
      const titles=['Find the noun at the end','Listen again for the color','Try a second order'];
      const texts=[
        'The last word is 裙子, skirt. Set aside a skirt first. Its color is the next clue.',
        '紫色 means purple. Keep the skirt and make it purple. You have matched both pieces of the order.',
        'For the second order, 毛衣 tells you sweater and 蓝色 tells you blue. Breaking an order into parts works even when both clues change.'
      ];
      local.append(prompt(titles[step]),paragraph(texts[step]));
      const layout=element('div',undefined,'m-layout'),rack=element('div',undefined,'m-rack');
      rack.append(orderCard(c,g,settings.english),speakButton(g,'Hear only the garment',ctx),speakButton(c,'Hear only the color',ctx));
      layout.append(portrait(step===0?'grey':c,g),rack);local.append(layout);
      local.append(step===2 ? button('Finish both orders',()=>finish('customer-walk','You separated the garment clue from the color clue.',true),'m-primary') :
        button(step===0?'Add the color':'Meet the next customer',()=>choose({step:step+1}),'m-primary'));
      if (step>0)local.append(button('Previous step',()=>choose({step:step-1})));
    }
    function checkOutfit(c,g,color,garment,options) {
      if (!color || !garment) {feedback('Pick a garment and a color, then check the outfit.');return;}
      if (color===c && garment===g) {options.onCorrect();return;}
      s.assisted=true;
      if (g===garment) {
        s.keepGarment=true;ctx.save();render('replay-color');
        feedback('Keep your '+garmentLabel(g)+'. That part fits. Listen to the color near the middle of the order and change only the color.');
      } else if(color===c) {
        s.keepColor=true;ctx.save();render('replay-garment');
        feedback('Keep '+plainColor(c)+'. Listen to the final word and choose the garment it names.');
      } else {
        ctx.save();feedback('Try one part first. Listen to the last word to pick the garment, then match the color.');
      }
    }
    function tryCustomers() {
      const order=wardrobe[round%wardrobe.length], i=s.customer||0;
      const [c,g]=order[i], [otherColor,otherGarment]=order[1-i];
      local.append(prompt('Fill customer '+(i+1)+'’s order'),paragraph(i?'One customer served. Use the same listening trick for this order.':'Pick a garment and color for each of two customers. You can listen to the order in pieces.'));
      const layout=element('div',undefined,'m-layout'), rack=element('div',undefined,'m-rack');
      if(s.garment && s.color) layout.append(portrait(s.color,s.garment));
      rack.append(orderCard(c,g,!!s.translated));
      if(settings.english && !s.translated)rack.append(note('The customer is naming one item. The color comes before the garment.'));
      if (!s.translated)rack.append(button('Reveal the English translation',()=>choose({translated:true,assisted:true})));
      const replays=group('Replay the clue in pieces');
      const rg=speakButton(g,'Hear only the garment',ctx), rc=speakButton(c,'Hear only the color',ctx);
      rg.dataset.key='replay-garment';rc.dataset.key='replay-color';replays.append(rg,rc);rack.append(replays);
      layout.append(rack);local.append(layout);
      const gChoices=rotate(unique([g,otherGarment,'shirt','dress']).slice(0,3),1+i);
      const cChoices=rotate(unique([c,otherColor,'blue','grey']).slice(0,3),2-i);
      if(s.keepGarment)local.append(note('Matched garment · '+garmentLabel(g)));
      else local.append(garmentPicker(s.garment,gChoices));
      if(s.keepColor)local.append(note('Matched color · '+plainColor(c)));
      else local.append(colorPicker(s.color,cChoices));
      local.append(button('Check this outfit',()=>checkOutfit(c,g,s.color,s.garment,{onCorrect:()=>{
        if(i===1){finish('two-orders-'+(round%wardrobe.length),'Both customers got the requested color and garment.');return;}
        choose({customer:1,garment:null,color:null,translated:false,keepColor:false,keepGarment:false});
        feedback('First order filled! Read or hear the next customer’s clue.');
      }}),'m-primary'));
    }
    function stretchCustomers() {
      const c=s.designColor||'purple',g=s.designGarment||'sweater';
      if(!s.passed) {
        local.append(prompt('Be the stylist'),paragraph('Create an order. Your partner will hear and read the Mandarin and dress the customer.'));
        const layout=element('div',undefined,'m-layout'),rack=element('div',undefined,'m-rack');
        rack.append(selector('Design garment',garments,g,id=>choose({designGarment:id},'Design garment'+id),'garment'),
          selector('Design color',Object.keys(colors),c,id=>choose({designColor:id},'Design color'+id),'color'));
        layout.append(portrait(c,g),rack);local.append(layout,orderCard(c,g,true),button('Hide my outfit and pass the screen',()=>choose({passed:true,color:null,garment:null,keepColor:false,keepGarment:false}),'m-primary'));return;
      }
      local.append(prompt('Dress the mystery customer'),orderCard(c,g,false));
      const replays=group('Replay the clue in pieces');
      const rg=speakButton(g,'Hear only the garment',ctx),rc=speakButton(c,'Hear only the color',ctx);
      rg.dataset.key='replay-garment';rc.dataset.key='replay-color';replays.append(rg,rc);local.append(replays);
      if(s.keepGarment)local.append(note('Matched garment · '+garmentLabel(g)));
      else local.append(garmentPicker(s.garment));
      if(s.keepColor)local.append(note('Matched color · '+plainColor(c)));
      else local.append(colorPicker(s.color));
      if(s.garment&&s.color)local.append(portrait(s.color,s.garment));
      local.append(button('Check my styling',()=>checkOutfit(c,g,s.color,s.garment,{onCorrect:()=>finish('designer','You created an outfit clue and someone matched both details.',true)}),'m-primary'),
        button('Back to the stylist',()=>choose({passed:false})));
    }
    const views={
      words: {show:showWords,try:tryWords,stretch:stretchWords},
      phrases: {show:showPhrases,try:tryPhrases,stretch:stretchPhrases},
      customers: {show:showCustomers,try:tryCustomers,stretch:stretchCustomers}
    };
    function render(refocus) {
      stopAudio();
      const hadFocus=local.contains(document.activeElement);
      local.replaceChildren();
      views[ctx.lessonId][ctx.mode]();
      if(hadFocus || refocus) {
        const matching=refocus && Array.from(local.querySelectorAll('[data-key]')).find(x=>x.dataset.key===refocus);
        const destination=matching || local.querySelector('h3,button');
        if(destination) {
          if(destination.tagName==='H3')destination.tabIndex=-1;
          destination.focus({preventScroll:true});
        }
      }
    }
    render();
    return stopAudio;
  }
  window.PearlMandarin=Object.freeze({lessons,mount,stopAudio});
})();
