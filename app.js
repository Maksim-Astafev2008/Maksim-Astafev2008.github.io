// Year
document.getElementById('year').textContent=new Date().getFullYear();

// Reveal on scroll
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');io.unobserve(e.target)}}),{threshold:.15});
document.querySelectorAll('.anim, .anim-star').forEach(e=>io.observe(e));

// Cursor glow
const cur=document.getElementById('cursor');
document.addEventListener('mousemove',e=>{cur.style.left=e.clientX+'px';cur.style.top=e.clientY+'px';});

// Parallax
const px=document.getElementById('parallax');
document.addEventListener('scroll',()=>{px.style.transform=`translateY(${window.scrollY*.07}px)`;});

// Theme switch (persist)
const THEME_KEY='mx_theme';
function applyTheme(t){document.documentElement.setAttribute('data-theme',t);try{localStorage.setItem(THEME_KEY,t)}catch(_){}} 
(function(){const saved=localStorage.getItem(THEME_KEY);if(saved)applyTheme(saved)})();
document.getElementById('themeBtn').onclick=()=>{
  const c=document.documentElement.getAttribute('data-theme')||'dark';
  applyTheme(c==='dark'?'light':'dark');
};

// Typewriter with language sets
(function(){
  const el=document.getElementById('typed');
  const RU=['Привет, меня зовут Максим','Web‑разработчик'];
  const KK=['Сәлем, мен Максиммін','Web-әзірлеуші'];
  const EN=["Hi, I'm Maxim",'Web Developer'];
  let set=RU; let i=0,j=0,del=false,stop=false;
  function tick(){
    if(stop) return;
    const t=set[i];
    el.innerHTML=t.slice(0,j)+'<span class="caret"></span>';
    if(!del){
      j++;
      if(j===t.length){del=true;setTimeout(tick,1100);return}
    }else{
      j--;
      if(j===0){del=false;i=(i+1)%set.length;setTimeout(tick,320);return}
    }
    setTimeout(tick,del?40:65);
  }
  window.__setTyped=(lang)=>{
    stop=true;
    setTimeout(()=>{
      set=lang==='kk'?KK:lang==='en'?EN:RU;
      i=0;j=0;del=false;stop=false;tick();
    },60);
  };
  tick();
})();

// KPI counters
(function(){const nums=[...document.querySelectorAll('[data-count]')];
  const obs=new IntersectionObserver(es=>{es.forEach(e=>{
    if(e.isIntersecting){
      const el=e.target; const target=+el.dataset.count; let cur=0;
      const step=Math.max(1,Math.round(target/60));
      const t=setInterval(()=>{cur=Math.min(target,cur+step);el.textContent=cur+'+';if(cur>=target)clearInterval(t)},22);
      obs.unobserve(el);
    }
  })},{threshold:.6});
  nums.forEach(n=>obs.observe(n));
})();

// Skills render (localized)
function renderSkills(lang){
  const wrap=document.getElementById('skillsList'); wrap.innerHTML='';
  const data={
    ru:[['HTML5','90%'],['CSS3','85%'],['JavaScript','70%'],['Python','60%'],['Git / GitHub','75%'],['Figma','65%']],
    kk:[['HTML5','90%'],['CSS3','85%'],['JavaScript','70%'],['Python','60%'],['Git / GitHub','75%'],['Figma','65%']],
    en:[['HTML5','90%'],['CSS3','85%'],['JavaScript','70%'],['Python','60%'],['Git / GitHub','75%'],['Figma','65%']]
  }[lang]||[];
  data.forEach(([name,val])=>{
    const div=document.createElement('div');div.className='bar';
    div.innerHTML=`<span>${name} — ${val}</span><div class="track"><div class="fill" style="--w:${val}"></div></div>`;
    wrap.appendChild(div);
  });
  const fills=wrap.querySelectorAll('.fill');
  const io2=new IntersectionObserver(es=>{es.forEach(e=>{if(e.isIntersecting){e.target.style.width=getComputedStyle(e.target).getPropertyValue('--w');io2.unobserve(e.target)}})},{threshold:.6});
  fills.forEach(f=>io2.observe(f));
}

// Slider
function scrollX(dir){const el=document.getElementById('slider'); el.scrollBy({left:dir*320,behavior:'smooth'});}

// GitHub repos
(async function(){try{
  const u='Maksim-Astafev2008';
  const r=await fetch(`https://api.github.com/users/${u}/repos?per_page=100`);
  const data=await r.json();
  if(!Array.isArray(data)) return;
  const top=data.filter(x=>!x.fork).sort((a,b)=>b.stargazers_count-a.stargazers_count).slice(0,6);
  const wrap=document.getElementById('repos');
  top.forEach(repo=>{
    const card=document.createElement('div');card.className='card slide projcard';
    card.innerHTML=`<h3>${repo.name}</h3>
      <p class='sub' data-i18n-dyn="repo_desc">${repo.description||''}</p>
      <p class='sub'><span data-i18n="stars">⭐ Stars</span>: ${repo.stargazers_count||0} · <span data-i18n="lang">Language</span>: ${repo.language||'—'}</p>
      <div>
        <a class='btn' target='_blank' href='${repo.html_url}' data-i18n-btn="repo">Repo</a>
        ${repo.homepage?`<a class="btn ghost" target="_blank" href="${repo.homepage}" data-i18n-btn="demo">Demo</a>`:''}
      </div>`;
    wrap.appendChild(card)
  })
}catch(e){console.warn('GitHub API error',e)}})();

// Drawer + desktop language dropdown
const drawer=document.getElementById('drawer');
document.getElementById('burger').onclick=()=>drawer.classList.toggle('open');
drawer.onclick=e=>{if(e.target===drawer)drawer.classList.remove('open')};
const langBtn=document.getElementById('langDesktop');const langDrop=document.getElementById('langDrop');
langBtn.onclick=()=>langDrop.classList.toggle('open');
document.addEventListener('click',e=>{if(!langDrop.contains(e.target)&&e.target!==langBtn){langDrop.classList.remove('open')}});

// I18N dictionary
const dict={
  ru:{
    brand:'Астафьев Максим',
    nav_about:'Обо мне', nav_skills:'Навыки', nav_projects:'Проекты', nav_ach:'Достижения', nav_test:'Отзывы', nav_certs:'Сертификаты', nav_contacts:'Контакты',
    about_h:'Обо мне', about_p:'Я начинающий веб-разработчик из Казахстана. Создаю современные сайты с неон-анимацией и чистой вёрсткой.',
    stats_h:'Про меня в цифрах', stats_projects:'Проектов', stats_tech:'Технологий', stats_hacks:'Хакатона', stats_certs:'Сертификата',
    skills_h:'Навыки', proj_h:'Проекты',
    proj1_h:'Bloom &amp; Grace — Магазин цветов', proj1_desc:'Адаптивный сайт магазина цветов с неоновой анимацией и быстрыми страницами.',
    proj2_h:'JS-игра — Башни и Лучники', proj2_desc:'Игрок всегда побеждает бота. Canvas-анимация, HUD, уровни.',
    repos_title:'Ниже — последние репозитории с GitHub (со звёздами):',
    ach_h:'Достижения', ach_1:'Участия в хакатонах', ach_2:'Адаптивные макеты', ach_3:'Командная работа', ach_4:'Интерактив и анимации',
    test_h:'Отзывы',
    q1:'«Максим — человек, на которого всегда можно положиться.»',
    q2:'«Очень коммуникабельный, предлагает лучшие идеи.»',
    q3:'«Отличный тиммейт, всегда доводит задачи до конца.»',
    q4:'«Хороший прогресс. Видно — будет сильным специалистом.»',
    q5:'«Всегда поможет, даже когда сам загружен — уважение.»',
    q6:'«Учится быстро. Адаптация — на высоком уровне.»',
    add_review:'✍ Оставить отзыв', send:'Отправить', cancel:'Отмена', review_ph:'Ваш отзыв...',
    certs_h:'Сертификаты', cert1_h:'MORRISON — Web-разработчик', cert2_h:'Персональный сертификат — Астафьев Максим Петрович',
    contacts_h:'Контакты', email_lbl:'Email:', tg_lbl:'Telegram:',
    projectsBtn:'Посмотреть проекты', contactBtn:'Связаться со мной', open_pdf:'📄 Открыть', download_pdf:'⬇ Скачать', demo:'Демо', repo:'Репозиторий',
    github_lbl:'GitHub:', stars:'⭐ Звёзды', lang:'Язык', footer_name:'Максим Астафьев', footer_langs:'RU · KK · EN'
  },
  kk:{
    brand:'Астафьев Максим',
    nav_about:'Туралы', nav_skills:'Дағдылар', nav_projects:'Жобалар', nav_ach:'Жетістіктер', nav_test:'Пікірлер', nav_certs:'Сертификаттар', nav_contacts:'Байланыс',
    about_h:'Туралы', about_p:'Мен Қазақстаннан веб-әзірлеушімін. Неон анимациясымен заманауи сайттар жасаймын.',
    stats_h:'Мен туралы сандар', stats_projects:'Жоба', stats_tech:'Технология', stats_hacks:'Хакатон', stats_certs:'Сертификат',
    skills_h:'Дағдылар', proj_h:'Жобалар',
    proj1_h:'Bloom &amp; Grace — Гүл дүкені', proj1_desc:'Неон анимациясы бар адаптивті сайт.',
    proj2_h:'JS-ойын — Мұнаралар мен Жебешілер', proj2_desc:'Canvas анимациясы бар жеңіс ойыны.',
    repos_title:'Соңғы GitHub реполары (жұлдыздармен):',
    ach_h:'Жетістіктер', ach_1:'Хакатондарға қатысу', ach_2:'Адаптивті макеттер', ach_3:'Тимжұмыс', ach_4:'Интерактив',
    test_h:'Пікірлер',
    q1:'«Максим — әрқашан сенуге болатын адам.»',
    q2:'«Коммуникабельді, жақсы идеялар.»',
    q3:'«Міндеттерді соңына дейін жеткізеді.»',
    q4:'«Болашақта мықты маман.»',
    q5:'«Өзі бос болмаса да көмектеседі.»',
    q6:'«Жылдам үйренеді. Адаптациясы жоғары.»',
    add_review:'✍ Пікір қалдыру', send:'Жіберу', cancel:'Болдырмау', review_ph:'Пікір...',
    certs_h:'Сертификаттар', cert1_h:'MORRISON — Web-әзірлеуші', cert2_h:'Жеке сертификат — Астафьев Максим Петрович',
    contacts_h:'Байланыс', email_lbl:'Email:', tg_lbl:'Telegram:',
    projectsBtn:'Жобаларды көру', contactBtn:'Хабарласу', open_pdf:'📄 Ашу', download_pdf:'⬇ Жүктеу', demo:'Демо', repo:'Repo',
    github_lbl:'GitHub:', stars:'⭐ Жұлдыз', lang:'Тіл', footer_name:'Максим Астафьев', footer_langs:'RU · KK · EN'
  },
  en:{
    brand:'Maksim Astafyev',
    nav_about:'About', nav_skills:'Skills', nav_projects:'Projects', nav_ach:'Achievements', nav_test:'Testimonials', nav_certs:'Certificates', nav_contacts:'Contacts',
    about_h:'About me', about_p:'I am a junior web developer from Kazakhstan. I build modern neon-styled, clean websites.',
    stats_h:'My stats', stats_projects:'Projects', stats_tech:'Technologies', stats_hacks:'Hackathons', stats_certs:'Certificates',
    skills_h:'Skills', proj_h:'Projects',
    proj1_h:'Bloom &amp; Grace — Flower Shop', proj1_desc:'Responsive flower shop with neon animations and fast pages.',
    proj2_h:'JS Game — Towers & Archers', proj2_desc:'Player always wins. Canvas animation, HUD, levels.',
    repos_title:'Latest GitHub repositories (with stars):',
    ach_h:'Achievements', ach_1:'Hackathons', ach_2:'Adaptive layouts', ach_3:'Teamwork', ach_4:'Interactive & animations',
    test_h:'Testimonials',
    q1:'“Maksim is someone you can always rely on.”',
    q2:'“Very communicative and brings the best ideas.”',
    q3:'“Great teammate, always finishes the tasks.”',
    q4:'“Strong progress. Will be a solid specialist.”',
    q5:'“Always helps, even when busy — respect.”',
    q6:'“Learns fast. Adapts at a high level.”',
    add_review:'✍ Leave a review', send:'Send', cancel:'Cancel', review_ph:'Your review...',
    certs_h:'Certificates', cert1_h:'MORRISON — Web Developer', cert2_h:'Personal Certificate — Maksim Astafyev',
    contacts_h:'Contacts', email_lbl:'Email:', tg_lbl:'Telegram:',
    projectsBtn:'View Projects', contactBtn:'Contact me', open_pdf:'📄 Open', download_pdf:'⬇ Download', demo:'Demo', repo:'Repo',
    github_lbl:'GitHub:', stars:'⭐ Stars', lang:'Language', footer_name:'Maksim Astafyev', footer_langs:'RU · KK · EN'
  }
};

function setLang(l){
  const d=dict[l]||dict.ru;
  // texts
  document.querySelectorAll("[data-i18n]").forEach(e=>{const k=e.dataset.i18n; if(d[k]) e.innerHTML=d[k];});
  // buttons
  document.querySelectorAll("[data-i18n-btn]").forEach(e=>{const k=e.dataset.i18nBtn; if(d[k]) e.textContent=d[k];});
  // some dynamic labels inside repos cards
  document.querySelectorAll('[data-i18n="stars"]').forEach(e=>e.textContent=d.stars);
  document.querySelectorAll('[data-i18n="lang"]').forEach(e=>e.textContent=d.lang);
  document.querySelectorAll('[data-i18n="github_lbl"]').forEach(e=>e.textContent=d.github_lbl);
  // title + meta
  document.title = (l==='en') ? 'Maksim Astafyev — Portfolio' : (l==='kk' ? 'Астафьев Максим — Портфолио' : 'Астафьев Максим — Портфолио');
  const metaDesc=document.querySelector('meta[name="description"]');
  if(metaDesc) metaDesc.setAttribute('content',(l==='en')?'Neon portfolio: projects, testimonials, certificates (PDF). RU · KZ · EN. Light/Dark theme.'
    :(l==='kk')?'Неон портфолио: жобалар, пікірлер, сертификаттар (PDF). RU · KZ · EN. Ашық/қою тақырып.'
    :'Неоновое портфолио: проекты, отзывы, сертификаты (PDF). RU · KZ · EN. Светлая/тёмная тема.');
  // skills list localize
  renderSkills(l);
  // typed headline set
  if(window.__setTyped) window.__setTyped(l);
  try{ localStorage.setItem('mx_lang', l); }catch(_){}
}

// init lang
(function(){ const saved=localStorage.getItem('mx_lang')||'ru'; setLang(saved); })();

// lang controls
document.querySelectorAll('.lang-btn').forEach(b=>b.onclick=()=>setLang(b.dataset.lang));
document.querySelectorAll('.langdrop .opt').forEach(o=>o.onclick=()=>setLang(o.dataset.lang));

// Modal Review Form + star reveal
const modal=document.getElementById("reviewModal");
document.getElementById("addReviewBtn").onclick=()=>modal.classList.remove("hidden");
document.getElementById("closeModal").onclick=()=>modal.classList.add("hidden");
document.getElementById("submitReview").onclick=()=>{
  const text=document.getElementById("reviewInput").value.trim();
  if(!text) return;
  const div=document.createElement("div");
  div.className="quote anim-star";
  div.innerHTML=`<div>${text}</div><div class="stars">★★★★★ — ???</div>`;
  document.getElementById("reviews").prepend(div);
  document.getElementById("reviewInput").value="";
  modal.classList.add("hidden");
  io.observe(div); // animate in
};
