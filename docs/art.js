// Small original sprites are rasterized on an integer grid so their edges stay sharp at any display size.
(() => {
  'use strict';
  const outline = '#56384a';
  const cream = '#fff3d6';
  const cherry = '#e67c80';
  const flavors = {
    strawberry: { light: '#ffd9d3', milk: '#f7a8ab', shade: '#e78191', syrup: '#cb617c', dark: '#9b4266' },
    matcha: { light: '#ebf0bf', milk: '#bdd78a', shade: '#91b877', syrup: '#77995c', dark: '#4b7458' },
    taro: { light: '#ebddf7', milk: '#c6a9d8', shade: '#ab8cc3', syrup: '#9775ad', dark: '#775784' }
  };
  const outfitColors = {
    purple: { light: '#e8c4f1', main: '#b18acb', shadow: '#916da8' },
    blue: { light: '#c8e4f5', main: '#83b7d8', shadow: '#6494b8' }
  };

  function surface(canvas, width, height) {
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;
    const rect = (x, y, w, h, color) => {
      ctx.fillStyle = color;
      ctx.fillRect(x, y, w, h);
    };
    // Draw each row separately. Canvas paths would leave half-transparent pixels around slanted edges.
    function poly(points, color) {
      const ys = points.map((p) => p[1]);
      const top = Math.min(...ys);
      const bottom = Math.max(...ys);
      ctx.fillStyle = color;
      for (let y = top; y < bottom; y++) {
        const middle = y + 0.5;
        const xs = [];
        for (let i = 0; i < points.length; i++) {
          const a = points[i], b = points[(i + 1) % points.length];
          if ((a[1] <= middle && b[1] > middle) || (b[1] <= middle && a[1] > middle)) {
            xs.push(a[0] + (middle - a[1]) * (b[0] - a[0]) / (b[1] - a[1]));
          }
        }
        xs.sort((a, b) => a - b);
        for (let i = 0; i < xs.length; i += 2) {
          const x = Math.ceil(xs[i] - 0.5);
          ctx.fillRect(x, y, Math.ceil(xs[i + 1] - 0.5) - x, 1);
        }
      }
    }
    const bevel = (x,y,w,h,color,corner=2) => poly([
      [x+corner,y],[x+w-corner,y],[x+w,y+corner],[x+w,y+h-corner],
      [x+w-corner,y+h],[x+corner,y+h],[x,y+h-corner],[x,y+corner]
    ],color);
    function at(x,y,scale,draw) {
      ctx.save();
      ctx.translate(x,y);
      ctx.scale(scale,scale);
      draw();
      ctx.restore();
    }
    return { rect, poly, bevel, at };
  }

  function sparkle(g,x,y,color,size=1) {
    g.rect(x-size,y,size*3,size,color);
    g.rect(x,y-size,size,size*3,color);
  }

  function drink(g,flavor,topping) {
    const f=flavors[flavor] || flavors.strawberry;
    const {rect:r,poly:p,bevel:b}=g;
    // Slant the striped straw slightly away from the cup's center.
    p([[37,27],[44,2],[46,0],[51,1],[53,3],[46,29]],outline);
    p([[39,26],[46,3],[50,3],[44,28]],'#f397a2');
    for(const [x,y] of [[44,6],[42,13],[40,20]]) {
      p([[x,y],[x+5,y+2],[x+4,y+5],[x-1,y+3]],'#fff5dc');
    }
    p([[11,29],[57,29],[54,62],[53,74],[51,79],[47,81],[21,81],[17,79],[15,75]],outline);
    p([[13,31],[55,31],[52,63],[51,74],[49,77],[46,79],[22,79],[18,76],[17,71]],'#fff0dc');
    p([[14,34],[54,34],[51,66],[50,75],[47,77],[21,77],[18,73]],f.shade);
    p([[14,34],[51,34],[49,58],[45,66],[20,69],[17,59]],f.milk);
    p([[14,34],[51,34],[50,37],[37,37],[36,39],[23,39],[22,38],[15,38]],f.light);
    p([[18,67],[22,66],[25,68],[30,68],[33,70],[39,70],[43,68],[49,68],[48,74],[45,76],[22,76],[20,74]],f.syrup);
    r(17,40,2,13,'#fff2df'); r(18,54,2,5,'#fff2df');
    r(50,42,1,8,f.light);r(49,51,1,7,f.light);
    // Frosted ice, visible behind the face.
    p([[22,39],[28,40],[27,44],[21,43]],f.light);
    p([[36,38],[41,37],[43,40],[39,42],[36,41]],f.light);
    p([[44,42],[49,41],[49,45],[45,46]],f.light);
    for(const [i,[x,y]] of [[22,70],[28,73],[33,67],[39,72],[45,67],[23,63],[46,74]].entries()) {
      if(topping==='jelly') {
        p([[x-2,y-1],[x+2,y-2],[x+3,y+1],[x-1,y+2]],i%2?'#f5bc72':'#f8d988');
        r(x-1,y-1,2,1,'#fff0bc');
      } else if(topping==='stars') {
        sparkle(g,x,y,'#ffdf73');r(x,y,1,1,'#fff7ae');
      } else {
        b(x-2,y-2,5,5,outline,1);r(x-1,y-1,2,1,'#94656b');
      }
    }
    // Two tiny eyes, cheeks, and a smile belong to the cup itself.
    b(23,49,4,5,outline,1);b(40,49,4,5,outline,1);r(24,49,1,1,'#fffefa');r(41,49,1,1,'#fffefa');
    r(21,55,5,2,'#dc7c8b');r(42,55,4,2,'#dc7c8b');
    r(30,54,2,2,outline);r(32,56,4,1,outline);r(36,54,2,2,outline);
    // Raised cream seal and glossy rim.
    b(6,24,56,10,outline,3);b(7,25,54,7,'#e6afad',2);
    b(9,22,50,7,outline,2);b(10,23,48,5,'#ffefda',2);
    r(12,24,20,1,'#fffdf3');r(13,29,43,1,'#fff2dc');r(55,30,3,1,'#d98d93');
    r(38,24,9,1,'#b9868b');
  }

  function cup(canvas,flavor='strawberry',topping='pearls') {
    const g=surface(canvas,68,84);
    drink(g,flavor,topping);
  }

  function cloud(g,x,y,w) {
    const {rect:r}=g;
    r(x,y+5,w,4,'#fff4de');r(x+4,y+2,w-10,6,'#fff4de');r(x+9,y,w-21,8,'#fff4de');
  }

  function plant(g,x,y,s=1) {
    const {rect:r,poly:p,bevel:b}=g;
    g.at(x,y,s,()=>{
      r(11,7,2,24,'#537a62');r(7,14,2,9,'#537a62');r(16,12,2,12,'#537a62');
      for(const [lx,ly,dx] of [[12,2,1],[9,8,-1],[14,13,1],[7,16,-1],[16,21,1],[8,22,-1]]) {
        p([[lx,ly+7],[lx+dx*7,ly+5],[lx+dx*9,ly],[lx+dx*4,ly-1],[lx,ly+2]],'#668d6b');
        r(lx+(dx<0?-4:2),ly+2,3,1,'#99b57e');
      }
      b(2,29,22,5,'#936c69',1);r(3,30,19,2,'#e9a18c');
      p([[4,34],[22,34],[20,44],[7,44]],'#a87571');
      p([[5,34],[20,34],[18,42],[8,42]],'#e8a992');
      r(8,35,2,6,'#f6c6a4');
    });
  }

  function awning(g) {
    const {rect:r,poly:p}=g;
    r(0,0,320,9,'#ea9c9e');
    r(0,4,320,2,'#f9b5b5');
    r(0,9,320,2,'#a76774');
    const stripes=['#e98790','#ffedcf'];
    const shade=['#d77785','#edc9af'];
    for(let i=-1;i<13;i++){
      const x=i*28;
      p([[x+9,11],[x+37,11],[x+28,34],[x,34]],stripes[(i+2)%2]);
      p([[x+9,12],[x+12,12],[x+3,32],[x,33]],shade[(i+2)%2]);
      p([[x,33],[x+28,33],[x+28,40],[x+25,44],[x+21,46],[x+7,46],[x+3,44],[x,40]],'#ad7580');
      p([[x+1,33],[x+27,33],[x+27,39],[x+24,42],[x+20,44],[x+7,44],[x+4,42],[x+1,39]],stripes[(i+2)%2]);
      r(x+2,34,24,2,shade[(i+2)%2]);
    }
  }

  function shop(canvas,flavor='strawberry',topping='pearls') {
    const g=surface(canvas,320,216);
    const {rect:r,poly:p,bevel:b}=g;
    r(0,0,320,216,'#ffe8c9');
    for(let y=53;y<=157;y+=17){
      r(0,y,320,1,'#edd5b9');
      for(let x=y%2?13:0;x<320;x+=33)r(x,y-16,1,16,'#efd7bf');
    }
    // Street window, with hazy distant rooftops and pale morning light.
    b(6,38,97,100,'#bb8d83',2);r(10,39,89,92,'#f8d8b1');r(13,41,83,86,'#c9ded7');
    r(13,42,83,30,'#f8d7cd');r(13,72,83,11,'#f0dccb');r(13,83,83,11,'#e0dfca');
    cloud(g,18,56,32);cloud(g,58,67,30);
    r(13,98,15,28,'#acbcb5');r(16,92,9,34,'#abbcb5');r(33,105,22,21,'#b0c4b9');r(46,97,8,28,'#b0c4b9');
    r(61,101,15,26,'#acc6b9');r(75,109,21,18,'#a0b8af');
    for(let x=18;x<90;x+=8)r(x,116,3,4,'#d4ddd1');
    p([[15,77],[27,46],[35,46],[16,89]],'#f7e4d3');p([[56,103],[78,55],[82,55],[61,103]],'#e9e7cf');
    r(53,42,4,86,'#b69485');r(13,89,83,3,'#aa9488');
    r(7,128,95,5,'#b8877b');r(5,133,99,4,'#daa58b');
    // Menu board with small drawn drinks instead of decorative copy.
    r(240,45,2,10,'#a87c73');r(283,45,2,10,'#a87c73');
    b(229,53,69,57,'#996c69',3);b(231,55,65,52,'#dba77e',2);r(235,58,57,45,'#557169');
    r(238,61,51,1,'#82988a');r(238,99,51,1,'#82988a');
    for(const [i,col] of [flavors.strawberry.milk,flavors.matcha.milk,flavors.taro.milk].entries()){
      const y=66+i*11;
      r(242,y,7,1,cream);r(243,y+2,5,5,col);r(245,y-2,1,2,cream);
      r(255,y+2,18-i*3,1,'#deceb4');r(255,y+4,11+i*2,1,'#b6c5ad');r(282,y+3,4,1,'#e6c0a3');
    }
    // Jars, paper cups and pots ground the counter.
    r(222,136,93,5,'#b57d73');r(220,132,95,4,'#e8b394');
    for(const [i,col] of ['#e1a5a1','#b5bf99','#cfb1c8'].entries()){
      const x=232+i*12;
      b(x,119,10,13,'#af8d85',1);r(x+1,121,8,9,col);r(x,117,10,3,'#997a73');r(x+2,122,1,5,'#f9e6d3');
    }
    plant(g,277,90);
    r(0,141,107,3,'#bb8579');r(0,138,107,3,'#ecc39e');
    plant(g,20,94);plant(g,56,111,.6);
    r(0,158,320,4,'#af7881');r(0,162,320,30,'#f7d7cd');
    // Checkerboard in shallow perspective.
    for(let row=0;row<3;row++) {
      const y=162+row*9;
      for(let col=-1;col<15;col++) {
        if((row+col)%2===0){
          const x=col*24-row*3;
          p([[x,y],[x+24,y],[x+21,y+9],[x-3,y+9]],'#eaacac');
        }
      }
    }
    r(0,189,320,3,'#a96f7b');r(0,192,320,4,'#e59391');r(0,196,320,20,'#eeb79e');
    for(let x=5;x<320;x+=30){r(x,197,2,19,'#d59f8c');r(x+2,198,1,18,'#f8cdb0');}
    r(0,196,320,1,'#fbd1b3');
    // Small light chimes and floor shadow flank the player's giant custom cup.
    awning(g);
    sparkle(g,111,94,'#fff9df',2);sparkle(g,216,75,'#efb2ad',2);
    sparkle(g,222,99,'#fffef0');sparkle(g,95,147,'#fff9df',2);
    sparkle(g,222,151,'#d7aa9f');sparkle(g,86,63,'#fff9e2');
    b(108,173,106,9,'#c79497',4);b(119,174,83,6,'#a77f87',2);
    g.at(92,16,2,()=>drink(g,flavor,topping));
  }

  function crew(canvas,color='purple',garment='sweater') {
    const g=surface(canvas,320,216);
    const {rect:r,poly:p,bevel:b}=g;
    const tone=outfitColors[color]||outfitColors.purple;
    r(0,0,320,216,'#f8dfd3');
    for(let x=0;x<320;x+=24){r(x,0,12,150,'#fbe6d8');}
    r(0,148,320,4,'#c79486');r(0,152,320,64,'#edccb2');
    for(let y=155;y<216;y+=16){
      r(0,y,320,1,'#d7af9c');
      for(let x=(y%3)*21;x<320;x+=66)r(x,y,1,16,'#ddb7a2');
    }
    // Tailor's rail and a neatly folded stock shelf.
    b(12,42,78,4,'#a57e77');r(15,46,3,108,'#aa857b');r(84,46,3,108,'#aa857b');
    for(const [x,col] of [[25,'#d5aaa9'],[43,'#d8bb91'],[61,'#aebca8']]){
      p([[x+7,46],[x+9,46],[x+9,53],[x+17,59],[x+14,61],[x,61],[x-1,58],[x+7,53]],'#af8e80');
      p([[x+3,58],[x+12,58],[x+17,61],[x+20,75],[x+16,77],[x+15,94],[x+1,94],[x+1,77],[x-4,75],[x-2,62]],col);
    }
    b(238,43,62,65,'#c39787',3);b(241,46,56,59,'#ffedcc',2);r(248,55,43,1,'#e3bc9f');
    for(const [i,col] of ['#c9b7d9','#a5c8d7','#eeaeaf'].entries()){
      b(248,63+i*10,10,6,col,2);r(263,65+i*10,18-i*3,2,'#b99587');
    }
    r(244,144,60,4,'#bd8c7e');r(247,148,4,18,'#bf9585');r(297,148,4,18,'#bf9585');
    b(254,135,33,8,'#bb99b2',2);b(255,130,29,6,'#dfb8c8',2);b(257,124,27,6,'#ded0a8',2);
    b(90,177,135,13,'#d1ae9e',6);
    g.at(96,14,2,()=>{
      const skin='#e7ad8c',skinShadow='#ce917a',hair='#694b4e';
      const o=outline;
      // Undershirt and pants are neutral until the selected garment goes on.
      p([[22,59],[44,59],[44,78],[41,84],[33,84],[32,69],[31,84],[22,84]],o);
      p([[24,61],[42,61],[41,81],[35,81],[33,67],[30,67],[29,81],[24,81]],'#9b938e');
      b(20,81,12,6,o,2);b(33,81,13,6,o,2);r(21,84,10,1,cream);r(34,84,11,1,cream);
      const top=['sweater','shirt','coat','dress'].includes(garment)?tone:{light:cream,main:'#f2d2b9',shadow:'#dfa994'};
      // Arms and the basic tunic.
      p([[22,37],[42,37],[48,40],[51,50],[50,58],[46,59],[42,53],[43,64],[21,64],[22,53],[18,59],[14,58],[13,53],[17,42]],o);
      p([[18,47],[23,49],[19,57],[16,57],[15,54]],skin);
      p([[42,49],[47,46],[49,54],[48,57],[45,56]],skin);
      p([[22,39],[42,39],[47,42],[49,48],[44,51],[41,48],[41,61],[23,61],[24,48],[20,51],[15,48],[18,43]],top.main);
      r(23,59,18,2,top.shadow);r(24,44,1,11,top.light);
      if(garment==='sweater'||garment==='coat'){
        p([[18,42],[24,44],[21,53],[18,56],[14,54],[15,48]],top.main);
        p([[42,43],[46,42],[49,48],[50,54],[46,56],[43,52]],top.main);
        r(15,52,4,2,top.shadow);r(46,52,4,2,top.shadow);
        if(garment==='sweater'){
          for(let x=25;x<40;x+=3){r(x,57,1,3,top.shadow);}
          for(const x of [27,33,39]){r(x,45,1,2,top.light);r(x+1,44,1,1,top.light);}
        }else{
          p([[23,55],[41,55],[44,69],[34,69],[31,66],[30,69],[20,69]],o);
          p([[24,54],[40,54],[42,67],[34,67],[32,63],[30,67],[22,67]],top.main);
          r(32,43,1,21,top.shadow);r(26,56,4,1,top.shadow);r(36,56,4,1,top.shadow);
          for(const y of [47,52,57,62])r(34,y,1,1,o);
          p([[26,39],[31,41],[31,47],[25,42]],top.light);p([[37,39],[34,46],[33,41]],top.light);
        }
      }else if(garment==='shirt'){
        p([[24,38],[31,41],[28,46],[24,42]],top.light);p([[39,38],[34,45],[32,41]],top.light);
        r(32,43,1,16,top.shadow);for(const y of [45,50,55])r(33,y,1,1,o);
      }else if(garment==='dress'||garment==='skirt'){
        p([[22,54],[42,54],[49,72],[45,74],[19,74],[16,72]],o);
        p([[23,55],[41,55],[47,71],[44,72],[20,72],[18,71]],tone.main);
        r(23,55,18,2,tone.shadow);
        p([[27,59],[28,59],[25,70],[23,70]],tone.light);p([[35,60],[36,60],[39,70],[37,70]],tone.shadow);
        if(garment==='dress'){r(26,44,12,1,top.light);r(24,53,16,2,top.shadow);}
      }else if(garment==='pants'){
        p([[23,59],[42,59],[42,71],[41,81],[34,81],[32,67],[30,81],[23,81]],tone.main);
        r(23,59,19,2,tone.shadow);r(25,63,2,14,tone.light);r(38,65,2,14,tone.shadow);
      }
      // Face, curls and a café cap.
      b(20,15,26,23,o,5);b(18,23,6,8,o,2);b(42,23,6,8,o,2);
      b(19,24,5,6,skin,2);b(42,24,5,6,skin,2);
      b(22,16,22,21,skin,5);r(28,35,9,4,skinShadow);r(29,37,7,2,skin);
      r(24,29,3,2,'#e09a90');r(38,29,4,2,'#e09a90');
      r(27,24,2,3,o);r(37,24,2,3,o);r(31,30,5,1,o);r(32,31,3,1,o);
      for(const [x,y,w,h] of [[20,17,6,7],[23,16,6,5],[28,16,5,3],[33,16,7,5],[39,16,6,8],[20,29,3,5]])b(x,y,w,h,hair,1);
      b(19,6,26,13,o,4);b(21,7,22,10,'#eab08d',4);r(28,7,9,2,'#f7cda5');
      b(17,14,31,5,o,2);b(18,14,29,3,'#e49386',1);r(20,14,13,1,'#f6bb9d');
      r(31,9,4,4,cream);r(32,8,2,1,cream);r(32,10,2,2,'#a87478');
    });
    sparkle(g,111,58,'#fff9de',2);sparkle(g,206,84,'#fff9de',2);sparkle(g,217,64,'#ddb1ac');
  }
  window.BobaArt=Object.freeze({shop,crew,cup});
})();
