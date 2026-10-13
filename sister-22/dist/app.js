const $ = (id) => document.getElementById(id);
let stage = 0;
let complete = false;
let turns = [2, 0, 2];
const titles = ['Дом для больших мечтаний', 'Куда убежала Фрося?', 'Твоя личная выставка'];
const descriptions = ['У этого дома всё немного перевернулось. Поверни три части и поставь его на ноги.', 'Фрося спряталась среди вещей из твоего мира. Найди маленького бульдога с розовым бантиком.', 'Выбери работу, с которой начнётся твоя коллекция. Здесь можно довериться своему вкусу.'];
const screens = ['intro', 'adventure', 'final'];
function show(id) { screens.forEach((screen) => $(screen).hidden = screen !== id); window.scrollTo({top:0,behavior:'instant'}); }
function finished(message) { complete = true; $('feedback').textContent = message; $('next').hidden = false; }
function render() {
  complete = false;
  show('adventure');
  $('task-kicker').textContent = `МАЛЕНЬКОЕ ПРИКЛЮЧЕНИЕ · ${stage + 1} / 3`;
  $('task-title').textContent = titles[stage];
  $('task-copy').textContent = descriptions[stage];
  $('feedback').textContent = '';
  $('next').hidden = true;
  $('next').firstChild.textContent = stage === 2 ? 'Открыть поздравление ' : 'Продолжить ';
  document.querySelectorAll('[data-step]').forEach((el,i) => el.className = i === stage ? 'active' : i < stage ? 'done' : '');
  if (stage === 0) building();
  if (stage === 1) hunt();
  if (stage === 2) gallery();
  $('task-title').focus({preventScroll:true});
}
function building() {
  turns = [2,0,2];
  const pieces = [
    '<path d="M4 80L100 3L196 80Z" fill="#497d60"/><circle cx="100" cy="48" r="15" fill="#f4cf55"/>',
    '<path d="M15 0H185V82H15Z" fill="#e9a3b9"/><path d="M42 63V34a16 16 0 0 1 32 0v29ZM126 63V34a16 16 0 0 1 32 0v29Z" fill="#faf8f1"/>',
    '<path d="M15 0H185V78H15Z" fill="#f4cf55"/><path d="M78 78V32a22 22 0 0 1 44 0v46Z" fill="#497d60"/><circle cx="109" cy="48" r="3" fill="#f4cf55"/><path d="M5 79H195" stroke="#283b30" stroke-width="3"/>'
  ];
  $('task-content').innerHTML = `<div class="building-game"><div class="building-pieces">${pieces.map((p,i)=>`<button class="building-piece" data-turn="${turns[i]}" aria-label="Повернуть ${['крышу','этаж с окнами','вход'][i]}"><svg viewBox="0 0 200 82" aria-hidden="true">${p}</svg></button>`).join('')}</div><div class="ground"></div><button class="secondary" id="check">Проверить эскиз</button></div>`;
  document.querySelectorAll('.building-piece').forEach((el,i)=>el.addEventListener('click',()=>{ if(complete)return; turns[i]=(turns[i]+2)%4;el.dataset.turn=turns[i];$('feedback').textContent=''; }));
  $('check').onclick=()=>{if(turns.every(t=>t===0)){finished('Вот теперь у мечты есть адрес. И отличный архитектор.');document.querySelectorAll('.building-piece').forEach(b=>b.disabled=true);$('check').hidden=true;}else $('feedback').textContent='Почти! Крыша смотрит вверх, окна и дверь стоят прямо.';};
}
function hunt() {
  const symbols=['arch','bag','flower','chair','sun'];
  const dogIndex=Math.floor(Math.random()*40);
  $('task-content').innerHTML=`<div class="hunt">${Array.from({length:40},(_,i)=>`<button class="hunt-item" style="--angle:${(i*17%5-2)*12}deg" aria-label="Рассмотреть деталь ${i+1}" data-dog="${i===dogIndex}"><svg viewBox="0 0 100 100" aria-hidden="true"><use href="#${i===dogIndex?'dog':symbols[(i*7+Math.floor(i/5))%5]}"/></svg></button>`).join('')}</div>`;
  document.querySelectorAll('.hunt-item').forEach(el=>el.onclick=()=>{if(complete)return;if(el.dataset.dog==='true'){el.classList.add('found');finished('Нашлась! Фрося передаёт тебе праздничный хрюк и поцелуй.');document.querySelectorAll('.hunt-item').forEach(b=>b.disabled=true);}else $('feedback').textContent='Красиво, но Фрося где-то ещё. Ищем ушки и бантик.';});
}
function gallery() {
  const works=[
    {name:'Смелая форма',label:'Архитектура / пространство',svg:'<rect width="240" height="320" fill="#e3ebde"/><circle cx="168" cy="78" r="45" fill="#f4cf55"/><path d="M33 290V137a87 87 0 0 1 174 0v153H164V137a44 44 0 0 0-88 0v153Z" fill="#497d60"/><path d="M15 290H225" stroke="#283b30" stroke-width="2"/>'},
    {name:'Свой почерк',label:'Стиль / индивидуальность',svg:'<rect width="240" height="320" fill="#f3d5df"/><path d="M83 45L58 61L33 125L59 140L74 108L53 275H189L165 108L180 140L206 125L182 61L157 45Q120 86 83 45" fill="#283b30"/><path d="M120 76L97 49M120 76L145 49M120 76V256" fill="none" stroke="#f3d5df" stroke-width="2"/><path d="M67 185H96M145 185H174" stroke="#f3d5df" stroke-width="3"/><circle cx="129" cy="137" r="3" fill="#f4cf55"/><circle cx="129" cy="166" r="3" fill="#f4cf55"/><circle cx="129" cy="195" r="3" fill="#f4cf55"/>'},
    {name:'Больше цвета',label:'Искусство / вдохновение',svg:'<rect width="240" height="320" fill="#f4cf55"/><circle cx="81" cy="99" r="59" fill="#e9a3b9"/><path d="M104 260V100H214V260Z" fill="#497d60"/><path d="M20 283L130 140L168 283Z" fill="#faf8f1"/><circle cx="173" cy="78" r="28" fill="#283b30"/><path d="M25 305H213" stroke="#283b30" stroke-width="2"/>'}
  ];
  $('task-content').innerHTML=`<div class="gallery">${works.map((w,i)=>`<button class="art-choice" aria-pressed="false" data-art="${i}"><svg viewBox="0 0 240 320" role="img" aria-label="${w.label}">${w.svg}</svg><span>${w.name}</span><small>${w.label}</small></button>`).join('')}</div>`;
  document.querySelectorAll('.art-choice').forEach(el=>el.onclick=()=>{document.querySelectorAll('.art-choice').forEach(b=>b.setAttribute('aria-pressed',String(b===el)));finished(['Пусть самые смелые идеи обретают форму.','Пусть всё, что ты выбираешь, будет по-настоящему твоим.','Пусть вдохновение встречается даже в обычных днях.'][Number(el.dataset.art)]);});
}
function celebrate(){show('final');for(let i=0;i<45;i++){const el=document.createElement('i');el.className='confetti';el.style.cssText=`left:${Math.random()*100}%;background:${['#e9a3b9','#f4cf55','#497d60'][i%3]};--drift:${Math.random()*240-120}px;animation-delay:${Math.random()*.8}s`;document.body.append(el);setTimeout(()=>el.remove(),4500);}$('final').setAttribute('tabindex','-1');$('final').focus({preventScroll:true});}
function reset(){stage=0;complete=false;show('intro');document.querySelectorAll('.confetti').forEach(e=>e.remove());}
$('start').onclick=()=>{stage=0;render();};
$('next').onclick=()=>{if(!complete)return;if(stage<2){stage++;render();}else celebrate();};
$('restart').onclick=reset;
$('again').onclick=reset;
document.querySelector('.brand').onclick=e=>{e.preventDefault();reset();};
