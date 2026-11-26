(() => {
  'use strict';
  const assets = 'media/explore/';
  const make = (tag, text, cls) => {
    const node = document.createElement(tag);
    if (text !== undefined) node.textContent = text;
    if (cls) node.className = cls;
    return node;
  };

  function button(label, action, cls = 'ex-button') {
    const el = make('button', label, cls);
    el.type = 'button';
    el.addEventListener('click', action);
    return el;
  }

  function figure(file, alt, caption) {
    const frame = make('figure', undefined, 'ex-figure');
    const art = make('img', undefined, 'ex-art');
    art.src = assets + file + '.png';
    art.alt = alt;
    frame.append(art, make('figcaption', caption));
    return frame;
  }

  function options(items, choose, selected) {
    const box = make('div', undefined, 'ex-options');
    items.forEach((text, i) => {
      const btn = button(text, () => choose(i));
      if (selected !== undefined) btn.setAttribute('aria-pressed', String(i === selected));
      box.append(btn);
    });
    return box;
  }

  function lines(...text) {
    const box = make('div', undefined, 'ex-lines');
    text.forEach(t => box.append(make('p', t)));
    return box;
  }

  function mount(stage, ctx) {
    const s = ctx.state;
    let focusOnRender = false;
    const update = patch => {
      Object.assign(s, patch);
      ctx.save();
      ctx.feedback('');
      focusOnRender = true;
      render();
    };
    const solved = (id, message, practice = true) => {
      ctx.finish({ id, message, assisted: !practice || Boolean(s.support) || ctx.mode === 'show' });
    };
    const help = message => {
      s.support = true;
      ctx.save();
      ctx.feedback(message);
    };

    function render() {
      const page = make('section', undefined, 'pearl-explore');
      const add = (...items) => page.append(...items);
      const question = text => add(make('h3', text, 'ex-question'));
      const model = text => add(make('p', text, 'ex-model'));
      const hint = text => add(button('Give me a clue', () => help(text), 'ex-button ex-hint'));
      const choose = (answers, right, correct, wrong) => {
        add(options(answers, i => {
          if (i === right) correct();
          else help(wrong[i]);
        }));
      };
      const next = (label, patch) => add(button(label, () => update(patch)));
      const done = (label, id, text, practice = true) => add(button(label, () => solved(id, text, practice)));
      const ui = { s, ctx, add, question, model, hint, choose, next, done, update, help, solved };

      if (ctx.lessonId === 'scene') station(ui);
      else if (ctx.lessonId === 'fossil') field(ui);
      else if (ctx.lessonId === 'tour') atlas(ui);
      stage.replaceChildren(page);
      if (focusOnRender) {
        const heading = page.querySelector('.ex-question');
        if (heading) {
          heading.tabIndex = -1;
          heading.focus({ preventScroll:true });
        }
        focusOnRender = false;
      }
    }
    render();
  }

  const endings = [
    {
      line: 'A paper star sailed through the doorway and landed in her tea.',
      mood: 'Playful',
      why: 'A star landing in a cup makes the interruption small, surprising, and a little funny.',
      clue: 'paper star'
    },
    {
      line: 'From the empty corridor came three slow knocks.',
      mood: 'Ominous',
      why: 'An empty corridor should be silent. The measured knocks suggest that someone, or something, is there.',
      clue: 'three slow knocks'
    }
  ];
  const readings = [
    {
      scene: ['The station cook unlatched the lid.', 'Inside the lunch tin, a tiny brass moon played a waltz.'],
      effect: 'Which detail makes this discovery feel whimsical?',
      choices: ['“unlatched the lid”', '“a tiny brass moon played a waltz”', '“the station cook”'],
      right: 1,
      why: 'The moon behaves like a wind-up performer. That unexpected image gives the discovery a playful mood.',
      misses: ['Unlatching the lid tells us how the tin opens. Look for the event that could only happen in this imagined world.', '', 'The job title identifies the character. Which object does something surprising?']
    },
    {
      scene: ['At midnight, Sola checked the landing log.', 'Below her name, tomorrow’s arrival was already signed in her handwriting.'],
      effect: 'Which detail most clearly foreshadows trouble?',
      choices: ['“checked the landing log”', '“At midnight”', '“tomorrow’s arrival was already signed in her handwriting”'],
      right: 2,
      why: 'Someone appears to know her future. The impossible signature gives the reader a specific reason to anticipate trouble.',
      misses: ['Checking a log is ordinary here. Find the detail that breaks the rules of time.', 'Midnight helps set the mood. Which strange event hints that something may happen later?', '']
    },
    {
      scene: ['Rin powered down the ship for its long sleep.', 'On the dark bridge, one stubborn green dot kept blinking like a firefly.'],
      effect: 'Which image leaves the reader with a sense of hope?',
      choices: ['“powered down”', '“the dark bridge”', '“blinking like a firefly”'],
      right: 2, why: 'The firefly comparison makes the remaining light feel alive. One small signal survives in the darkness.',
      misses: ['The power-down sets up the quiet beginning. Find the detail that offers a sign of life.', 'The darkness sets up a contrast. Look for the small light that changes the ending.', '']
    },
    {
      scene: ['The last visitor waved at the station mirror.', 'The visitor lowered her hand. The reflection kept waving.'],
      effect: 'Which detail turns an ordinary goodbye unsettling?',
      choices: ['“The reflection kept waving”', '“station mirror”', '“last visitor”'],
      right: 0, why: 'The reflection moves on its own. Breaking a familiar rule makes a simple goodbye unsettling.',
      misses: ['', 'A mirror belongs in an ordinary setting. Which detail breaks a mirror’s usual rule?', 'Being the last visitor sets the scene. Look for the movement she cannot explain.']
    }
  ];

  function station({ s, ctx, add, question, model, hint, choose, next, done, update, solved }) {
    add(figure('station', 'The dark sky and a ringed planet seen through a space station window.', 'Night shift at a station above the clouds'));
    if (ctx.mode === 'try') {
      const n = ctx.round % readings.length;
      const task = readings[n];
      add(lines(...task.scene));
      question(task.effect);
      choose(task.choices, task.right, () => solved('scene-reading-' + n, task.why), task.misses);
      hint('Read the last sentence aloud. Which words change what you expect to happen?');
      return;
    }
    if (ctx.mode === 'stretch') {
      add(lines('The last shuttle docked after midnight.', s.line || 'A light came on inside.'));
      if (s.step !== 1) {
        question('Can you make the arrival feel ominous?');
        add(make('p', 'Keep the shuttle and change the last line. Try a sound that stops too early or an object behaving strangely. You can say your line aloud.'));
        const wrap = make('label', undefined, 'ex-line-input');
        wrap.append(make('span', 'My replacement line (optional)'));
        const field = make('textarea');
        field.maxLength = 280;
        field.rows = 2;
        field.value = s.line || '';
        field.placeholder = 'Inside the shuttle…';
        field.addEventListener('input', () => { s.line = field.value; ctx.save(); });
        wrap.append(field);
        add(wrap);
        next('Read my scene back', { step:1 });
      } else {
        question('Which word in your version does the most work?');
        model('Try leaving that word out when you read the scene aloud. Listen for what the reader loses. When you return to your essay outline, ask which phrase best supports the idea you want to defend.');
        if (s.line?.trim()) {
          const label = make('label', undefined, 'ex-keep');
          const check = make('input');
          check.type = 'checkbox';
          check.checked = Boolean(s.keepLine);
          check.addEventListener('change', () => { s.keepLine = check.checked; ctx.save(); });
          label.append(check, make('span', 'Save this line in my notebook on this device'));
          add(label);
        }
        done('Finish my edit', 'scene-studio', 'You tested how a detail can change a reader’s expectations.', false);
        next('Change my line', { step:0 });
      }
      return;
    }
    const start = 'The last shuttle docked after midnight. Nia opened the hatch.';
    const ending = endings[s.ending === 1 ? 1 : 0];
    if (!s.step) {
      add(lines(start));
      question('Which mood do you want behind the hatch?');
      add(options(endings.map(e => e.mood), i => update({ ending:i, step:1 })));
    } else {
      add(lines(start, ending.line));
      question(s.step === 1 ? 'What changed when the last line appeared?' : 'Want to compare the other ending?');
      model(ending.why);
      if (s.step === 1) {
        next('Read the other ending', { step:2, ending:s.ending === 1 ? 0 : 1 });
      } else {
        model('The opening stayed the same. Mood is the feeling a scene builds for its reader. Each ending changes it through a small detail.');
        done('Finish this example', 'scene-demonstration', 'You compared two endings and the details that shaped the mood.', false);
      }
    }
  }

  const trackTasks = [
    {
      ask: 'Which new find would strengthen the two-footed walking explanation?',
      choices: ['A longer trail with the same alternating left and right heel-to-toe prints.', 'A beautifully preserved leaf beside the trail.', 'A darker ash layer above the trail.'],
      right:0, why:'Repeating the same pattern across more steps strengthens the interpretation of how the maker moved.',
      wrong:['', 'A leaf could tell you about the surroundings. Look for evidence of repeated movement.', 'Ash color alone tells little about the walker. Which discovery adds more steps?']
    },
    {
      ask: 'Which claim fits the evidence without guessing the maker’s identity?',
      choices: ['We can name the maker from the depth of one print.', 'The alternating impressions fit a walker moving on two feet.', 'The walker was heading home.'],
      right:1, why:'A sequence of alternating foot impressions supports an inference about movement. It tells us much less about identity or purpose.',
      wrong:['Depth can change with the ground’s softness. Look at the pattern across the whole trail.', '', 'The direction of travel is visible. The walker’s destination would require other evidence.']
    },
    {
      ask: 'The deepest print is in softer ash. What should you compare before inferring the walker was heavier?',
      choices: ['How bright the ash looks in a photo.', 'Whether a similar load makes deeper marks in softer ground.', 'The distance from a modern town.'],
      right:1, why:'Soft ground can change a print’s depth. Comparing the effects of the surface helps separate that explanation from the walker’s weight.',
      wrong:['Lighting changes an image. Which comparison tests the softness of the ground?', '', 'A modern town cannot explain the depth of ancient prints. Look for a comparison of surfaces.']
    },
    {
      ask:'Two explanations fit one smudged mark. Which next step would give a stronger basis for choosing?',
      choices:['Pick the explanation with the most exciting story.', 'Ignore all the other marks.', 'Compare repeated, clearer impressions farther down the same trail.'],
      right:2, why:'Clear marks elsewhere on the same trail can show whether the pattern repeats. A single smudge has several possible explanations.',
      wrong:['A story can suggest a question. To choose between explanations, look for a checkable pattern.', 'The other marks can reveal whether the pattern repeats.', '']
    }
  ];
  function field({ s, ctx, add, question, model, hint, choose, next, done, update, solved }) {
    if (ctx.mode === 'stretch') {
      add(figure('tank', 'A planted aquarium with algae, snails, and small snail-eating fish.', 'One simplified tank model. Each animal can depend on several food sources in a real ecosystem.'));
      if (!s.step) {
        question('If algae declined, which animal would lose food first?');
        add(make('p', 'In this tank the snails graze on algae. The fish eat snails and also eat provided fish food. Make a prediction, then open the food web.'));
        add(options(['Snails', 'Fish', 'Both at the same time'], i => update({ prediction:i, step:1 })));
      } else {
        const web = make('div', undefined, 'ex-web');
        web.setAttribute('aria-label', 'Algae feed snails. Snails feed fish.');
        ['Algae', 'feed', 'snails', 'which feed', 'fish'].forEach((word, i) => web.append(make('span', word, i % 2 === 0 ? 'web-node' : '')));
        add(web);
        if (s.step === 1) {
          const response = ['Your prediction follows the first feeding link.', 'Fish may feel the change later, through snails.', 'You spotted two affected animals. They connect to the algae at different points.'];
          model(response[s.prediction] + ' With less algae, snails lose a direct food source. Extra fish food could soften the effect on the fish.');
          question('Which observation would make you revise the prediction about snails?');
          choose(['The snails also graze heavily on a different plant.', 'The tank has a blue background.', 'The fish have shiny scales.'], 0,
            () => update({ step:2 }),
            ['', 'The background gives no evidence about what snails eat. Look for a second food source.', 'Scales describe appearance. Which observation changes the feeding links?']);
        } else {
          question('How would a second food source change the story?');
          model('A second plant gives the snails another source of energy. Their numbers might stay steadier, which could also cushion the effect on the fish. Evidence can change your first prediction.');
          done('Finish my investigation', 'fossil-food-web', 'You revised an ecological prediction after adding a new feeding link.', false);
        }
      }
      return;
    }
    add(figure('tracks', 'An original diagram of five alternating left and right foot impressions in a trail, with heel and forefoot marks.', 'Illustrated trackway inspired by the Laetoli footprints in Tanzania. The heel meets the ground and the toes push off.'));
    if (ctx.mode === 'try') {
      const n = ctx.round % trackTasks.length, task = trackTasks[n];
      add(make('p', 'The impressions alternate across several steps. Each has a heel mark followed by a forefoot mark.'));
      question(task.ask);
      choose(task.choices, task.right, () => solved('fossil-evidence-' + n, task.why), task.wrong);
      hint('Separate the observation you can see from the explanation you propose. What relates directly to the steps?');
      return;
    }
    if (!s.step) {
      question('What can a footprint tell you after the walker is gone?');
      add(make('p', 'Look along the trail. The heel and toes appear in each impression. The left and right feet land on alternating sides.'));
      next('Compare two explanations', { step:1 });
    } else {
      question('Which explanation fits both observations?');
      choose(['A walker made a sequence of steps on two feet.', 'The maker stood still on one spot.'], 0,
        () => solved('fossil-demonstration', 'A series of alternating heel-to-toe steps fits walking on two feet. Other evidence would help identify the maker.', false),
        ['', 'Standing still might form one pair of prints. Follow the pattern from the first pair to the next.']);
    }
    add(make('small', 'Science reference: Smithsonian Human Origins Program, Laetoli Footprint Trails.', 'ex-source'));
  }

  const cities = {
    auckland: { name:'Auckland', place:'New Zealand', lat:-36.85, lon:174.76 },
    wellington: { name:'Wellington', place:'New Zealand', lat:-41.29, lon:174.78 },
    lisbon: { name:'Lisbon', place:'Portugal', lat:38.72, lon:-9.14 },
    beijing: { name:'Beijing', place:'China', lat:39.90, lon:116.41 },
    buenos: { name:'Buenos Aires', place:'Argentina', lat:-34.60, lon:-58.38 },
    barcelona: { name:'Barcelona', place:'Spain', lat:41.39, lon:2.17 },
    amman: { name:'Amman', place:'Jordan', lat:31.95, lon:35.93 }
  };
  const nzStops = ['auckland','wellington'];
  const worldStops = ['lisbon','barcelona','amman','beijing','buenos','wellington'];
  const routeGoals = [
    { name:'Cross the equator', rules:[
      'Choose a first stop north of the equator.',
      'Stay in the Northern Hemisphere and pick a different city within 9,500 km of your first stop.',
      'Cross the equator and finish in the Southern Hemisphere.'
    ] },
    { name:'Distance detective', rules:[
      'Start anywhere in the Southern Hemisphere.',
      'Cross the equator and visit a northern city.',
      'Choose a new city closer to stop two than stop one was.'
    ] }
  ];

  function hemispheres(city) {
    return Math.abs(city.lat).toFixed(0) + '°' + (city.lat >= 0 ? 'N' : 'S') + ', ' +
      Math.abs(city.lon).toFixed(0) + '°' + (city.lon >= 0 ? 'E' : 'W');
  }

  function distance(from, to) {
    const rad = Math.PI / 180;
    const a = cities[from], b = cities[to];
    const dLat = (b.lat - a.lat) * rad, dLon = (b.lon - a.lon) * rad;
    const h = Math.sin(dLat / 2) ** 2 + Math.cos(a.lat * rad) * Math.cos(b.lat * rad) * Math.sin(dLon / 2) ** 2;
    return 2 * 6371 * Math.asin(Math.sqrt(Math.min(1,h)));
  }
  const km = d => (Math.round(d / 10) * 10).toLocaleString('en-US') + ' km';

  // Sample each shortest great-circle leg before projecting it onto the flat map.
  function routeOverlay(route) {
    const canvas = make('canvas', undefined, 'ex-map-route');
    canvas.width = 1000;
    canvas.height = 420;
    canvas.setAttribute('aria-hidden','true');
    const pen = canvas.getContext('2d');
    if (!pen) return canvas;
    const rad = Math.PI / 180;
    const vector = ({lat,lon}) => [
      Math.cos(lat*rad) * Math.cos(lon*rad), Math.cos(lat*rad) * Math.sin(lon*rad), Math.sin(lat*rad)
    ];
    pen.lineWidth = 3.5;
    pen.strokeStyle = '#983a57';
    pen.setLineDash([7,5]);
    for (let i = 1; i < route.length; i++) {
      const from = vector(cities[route[i-1]]), to = vector(cities[route[i]]);
      const angle = distance(route[i-1],route[i]) / 6371;
      const denominator = Math.sin(angle);
      let previousX;
      pen.beginPath();
      for (let step = 0; step <= 64; step++) {
        const fraction = step / 64;
        const a = Math.sin((1-fraction)*angle) / denominator, b = Math.sin(fraction*angle) / denominator;
        const [vx,vy,vz] = from.map((v,j) => a*v + b*to[j]);
        const x = (Math.atan2(vy,vx)/rad + 180) / 360 * canvas.width;
        const y = (80 - Math.atan2(vz,Math.hypot(vx,vy))/rad) / 140 * canvas.height;
        if (previousX === undefined || Math.abs(x - previousX) > canvas.width / 2) pen.moveTo(x,y);
        else pen.lineTo(x,y);
        previousX = x;
      }
      pen.stroke();
    }
    return canvas;
  }

  function cityMap(region, ids, onPick, current = [], hidden = false) {
    const regional = region === 'nz';
    const frame = make('figure', undefined, 'ex-figure ex-map-base');
    const map = make('div', undefined, 'ex-map-wrap ' + region);
    const img = make('img');
    img.src = assets + (regional ? 'new-zealand.png' : 'world.png');
    img.alt = regional
      ? 'New Zealand coastline, north up. Pin A lies on the narrow upper part of the North Island. Pin B lies at the southern tip of that island, just above Cook Strait.'
      : !onPick ? 'Your tour visits ' + ids.map(id => cities[id].name).join(', then ') + '.' : 'World coastline map with the equator and prime meridian. Each numbered city also has a button with coordinates below.';
    map.append(img);
    if (!regional && current.length > 1) map.append(routeOverlay(current));
    const bounds = regional ? [161,186,-48,-33] : [-180,180,-60,80];
    ids.forEach((id,i) => {
      const city = cities[id];
      const label = regional ? String.fromCharCode(65 + i) : String(i + 1);
      const pin = onPick ? button('', () => onPick(id), 'ex-map-pin') : make('span', undefined, 'ex-map-pin');
      if (!onPick) pin.setAttribute('aria-hidden','true');
      pin.append(make('span', label));
      const name = hidden ? (i === 0 ? 'upper North Island' : 'beside Cook Strait') : city.name;
      pin.setAttribute('aria-label','Map pin ' + label + ', ' + name);
      if (onPick) pin.setAttribute('aria-pressed',String(current.includes(id)));
      pin.style.left = ((city.lon-bounds[0])/(bounds[1]-bounds[0])*100) + '%';
      pin.style.top = ((bounds[3]-city.lat)/(bounds[3]-bounds[2])*100) + '%';
      map.append(pin);
    });
    frame.append(map);
    frame.append(make('figcaption',regional ? 'North is up. Cook Strait separates the North Island from the South Island.' : !onPick ? 'Your finished route. The pins follow your stop order. The dotted route follows the shortest path over the globe.' : 'Numbered pins match the city buttons. Latitude gives north or south of the equator, longitude gives east or west of the prime meridian.'));
    return frame;
  }

  function atlas({ s, ctx, add, question, model, hint, choose, next, done, update, help, solved }) {
    if (ctx.mode === 'stretch') {
      const route = Array.isArray(s.route) ? s.route.filter(id => worldStops.includes(id)).slice(0,3) : [];
      if (!(s.brief === 0 || s.brief === 1)) {
        question('Which rules will shape your three-stop tour?');
        add(make('p', 'Design the route yourself. Each stop has a clue and the map checks your idea. The distances follow the shortest path over the globe.'));
        add(options(routeGoals.map(g => g.name), i => update({ brief:i, route:[] })));
        return;
      }
      const legs = route.length;
      const goal = routeGoals[s.brief];
      const pick = id => {
        if (legs === 3) return;
        if (route.includes(id)) { help('This city is already on your route. Choose another stop.'); return; }
        const north = cities[id].lat > 0;
        const point = cities[id].name + ' sits at ' + hemispheres(cities[id]) + '. ';
        const from = route[legs - 1];
        const length = from ? distance(from,id) : 0;
        const legSummary = from ? cities[from].name + ' to ' + cities[id].name + ' is about ' + km(length) + '. ' : '';
        if (s.brief === 0) {
          if (!north && legs < 2) { help(point + 'The N after latitude marks cities north of the equator.'); return; }
          if (north && legs === 2) { help(point + 'Your last stop needs an S after its latitude.'); return; }
          if (legs === 1 && length > 9500) { help(legSummary + 'Find a northern stop within 9,500 km.'); return; }
        } else {
          if (north && legs === 0) { help(point + 'Start with an S after latitude.'); return; }
          if (!north && legs === 1) { help(point + 'Cross from south to north. Look for an N after latitude.'); return; }
          if (legs === 2 && length >= distance(route[0],from)) {
            help(legSummary + 'Your first leg was ' + km(distance(route[0],from)) + '. Pick a city closer to ' + cities[from].name + '.');
            return;
          }
        }
        update({ route:[...route,id] });
      };
      if (legs < 3) {
        question('Stop ' + (legs + 1) + ' · ' + goal.rules[legs]);
        add(cityMap('world',worldStops,pick,route));
        const choices = worldStops.map((id,i) => (i+1) + ' · ' + cities[id].name + ' · ' + hemispheres(cities[id]));
        add(options(choices,i => pick(worldStops[i])));
      } else {
        question('Your tour is booked. What helped you choose each stop?');
        add(cityMap('world',route,null,route));
      }
      if (legs) {
        const ticket = make('div', undefined, 'ex-route');
        const routeList = make('ol');
        route.forEach((id,i) => {
          const city = cities[id];
          let detail = city.lat > 0 ? 'north of the equator' : 'south of the equator';
          if (i) detail += ', about ' + km(distance(route[i-1],id)) + ' from ' + cities[route[i-1]].name;
          routeList.append(make('li', city.name + ' · ' + detail));
        });
        ticket.append(make('strong',goal.name),routeList);
        add(ticket);
      }
      if (legs === 3) {
        model(s.brief === 0 ? 'You compared coastlines, latitudes, and the distance between cities to meet the brief.' :
          'Your first leg was about ' + km(distance(route[0],route[1])) + ' and your second was about ' + km(distance(route[1],route[2])) + '.');
        done('Finish my tour', 'tour-studio-' + s.brief, 'You designed a three-stop tour and tested its geography clues.', false);
      }
      if (legs) next('Change my last stop', { route:route.slice(0,-1) });
      add(make('small', 'Map outlines from Natural Earth. Distances use a spherical Earth and rounded city centers.', 'ex-source'));
      return;
    }
    const guided = ctx.mode === 'show';
    const n = ctx.round % 4;
    if (!guided && n > 1) {
      const north = n === 2;
      const ids = north ? ['beijing','buenos','wellington'] : ['buenos','amman','wellington'];
      const target = north ? 'beijing' : 'buenos';
      const select = id => {
        const city = cities[id];
        if (id === target) {
          solved('tour-world-' + n,city.name + ' is at about ' + hemispheres(city) + '. Both coordinates match your clue.');
        } else {
          help(city.name + ' is at ' + hemispheres(city) + '. ' + (north ? 'Look for N latitude and E longitude.' : 'Look for S latitude and W longitude.'));
        }
      };
      question(north ? 'Which city is both north of the equator and east of the prime meridian?' : 'Which city is both south of the equator and west of the prime meridian?');
      add(cityMap('world',ids,select));
      add(options(ids.map((id,i) => (i + 1) + ' · ' + cities[id].name + ' · ' + hemispheres(cities[id])),i => select(ids[i])));
      return;
    }
    const target = guided ? (s.step ? 'wellington' : 'auckland') : (n === 0 ? 'wellington' : 'auckland');
    const identifyAuckland = target === 'auckland';
    const clue = identifyAuckland
      ? 'Place Auckland on the narrow stretch of land in the upper North Island.'
      : 'Place Wellington beside Cook Strait at the southern tip of the North Island.';
    question(clue);
    if (guided) model(!s.step ? 'First find both big islands. Follow the North Island up toward the narrow neck of land between its coasts.' :
      'Auckland is at pin A. To find the second city, move down the same island until the channel separates it from the South Island.');
    const select = id => {
      if (id !== target) {
        help(id === 'auckland' ? 'That pin is farther north. Follow the North Island down to the channel between the islands.' :
          'That pin touches Cook Strait. Trace the North Island up toward the narrower neck of land.');
        return;
      }
      if (guided && !s.step) update({ step:1 });
      else solved(guided ? 'tour-demonstration' : 'tour-coast-' + n,
        identifyAuckland ? 'Auckland is farther north, on a narrow stretch of land between two harbors.' :
        'Wellington is at the southern tip of the North Island beside Cook Strait. Auckland is farther north.',
        !guided);
    };
    add(cityMap('nz',nzStops,select,guided && s.step ? ['auckland'] : [],true));
    add(options(['Pin A · upper North Island','Pin B · beside Cook Strait'],i => select(nzStops[i])));
    if (!guided) hint(identifyAuckland ? 'Between the two pins, choose the one closer to the top of the map.' : 'Find the water separating the two main islands. Pick the pin nearest that channel.');
    add(make('small', 'Map outlines from Natural Earth.', 'ex-source'));
  }

  window.PearlExplore = { mount };
})();
