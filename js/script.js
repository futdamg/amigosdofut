/* =========================================================
   FUT DOS AMIGOS — script.js
   =========================================================
   COMO ADICIONAR SUAS FOTOS
   -------------------------
   1) Coloque os arquivos de imagem em uma pasta (ex: "fotos/")
      na mesma pasta deste site.
   2) Edite os dois arrays abaixo (aboutPhotos e galleryPhotos),
      trocando "src" pelo caminho da sua imagem e "alt"/"caption"
      pela descrição da foto.
   3) Pode adicionar quantos itens quiser em galleryPhotos — a
      grade se ajusta sozinha. Se um array ficar vazio, o site
      mostra uma "vaga" tracejada no lugar, pra você saber onde
      as fotos vão entrar.
   ========================================================= */

// Fotos da seção "Quem somos" (o colapso de 4 fotos, estilo do site antigo)
const aboutPhotos = [
  // Exemplo de como preencher:
  // { src: "fotos/quem-somos-1.jpg", alt: "Grupo reunido depois do jogo" },
  // { src: "fotos/quem-somos-2.jpg", alt: "Gol comemorado no gramado" },
  // { src: "fotos/quem-somos-3.jpg", alt: "Resenha depois da partida" },
  // { src: "fotos/quem-somos-4.jpg", alt: "Time completo antes do jogo" },
];

// Fotos da seção "Galeria"
const galleryPhotos = [
  // Exemplo de como preencher:
  // { src: "fotos/jogo-01.jpg", alt: "Lance da partida de quinta", caption: "Quinta de bola" },
  // { src: "fotos/jogo-02.jpg", alt: "Comemoração de gol", caption: "Gol e abraço" },
  // { src: "fotos/jogo-03.jpg", alt: "Grupo completo", caption: "Time fechado" },
];

/* ---------------------------------------------------------
   Render: fotos do "Quem somos"
--------------------------------------------------------- */
function renderAboutPhotos(){
  const wrap = document.getElementById('aboutPhotos');
  if (!wrap) return;

  if (aboutPhotos.length === 0){
    wrap.innerHTML = `
      <div class="photo-slot photo-slot--empty">FOTO 1<br>(vertical)</div>
      <div class="photo-slot photo-slot--empty">FOTO 2</div>
      <div class="photo-slot photo-slot--empty">FOTO 3</div>
    `;
    return;
  }

  wrap.innerHTML = aboutPhotos.slice(0, 3).map(photo => `
    <div class="photo-slot">
      <img src="${photo.src}" alt="${photo.alt || 'Foto do grupo Fut dos Amigos'}" loading="lazy">
    </div>
  `).join('');
}

/* ---------------------------------------------------------
   Render: grade da Galeria
--------------------------------------------------------- */
function renderGallery(){
  const grid = document.getElementById('galleryGrid');
  if (!grid) return;

  if (galleryPhotos.length === 0){
    grid.innerHTML = Array.from({ length: 6 }).map((_, i) => `
      <div class="gallery-item gallery-item--empty">
        VAGA DE FOTO ${i + 1}<br>edite "galleryPhotos" em script.js
      </div>
    `).join('');
    return;
  }

  grid.innerHTML = galleryPhotos.map((photo, i) => `
    <div class="gallery-item reveal" data-index="${i}">
      <img src="${photo.src}" alt="${photo.alt || 'Foto da galeria'}" loading="lazy">
      ${photo.caption ? `<span class="gallery-item__caption">${photo.caption}</span>` : ''}
    </div>
  `).join('');

  // Lightbox ao clicar
  grid.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      if (!img) return;
      openLightbox(img.src, img.alt);
    });
  });

  observeReveal(); // re-observa os novos itens
}

/* ---------------------------------------------------------
   Lightbox
--------------------------------------------------------- */
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxClose = document.getElementById('lightboxClose');

function openLightbox(src, alt){
  lightboxImg.src = src;
  lightboxImg.alt = alt || '';
  lightbox.classList.add('is-open');
  lightbox.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}
function closeLightbox(){
  lightbox.classList.remove('is-open');
  lightbox.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}
lightboxClose?.addEventListener('click', closeLightbox);
lightbox?.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeLightbox(); });

/* ---------------------------------------------------------
   Menu mobile
--------------------------------------------------------- */
const burgerBtn = document.getElementById('burgerBtn');
const mainNav = document.getElementById('mainNav');

burgerBtn?.addEventListener('click', () => {
  const isOpen = mainNav.classList.toggle('is-open');
  burgerBtn.classList.toggle('is-open', isOpen);
  burgerBtn.setAttribute('aria-expanded', String(isOpen));
});
mainNav?.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    mainNav.classList.remove('is-open');
    burgerBtn.classList.remove('is-open');
    burgerBtn.setAttribute('aria-expanded', 'false');
  });
});

/* ---------------------------------------------------------
   Header muda de fundo ao rolar
--------------------------------------------------------- */
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
  header.style.background = window.scrollY > 40
    ? 'rgba(7,16,25,.96)'
    : 'linear-gradient(180deg, rgba(7,16,25,.92), rgba(7,16,25,.55) 80%, transparent)';
}, { passive: true });

/* ---------------------------------------------------------
   Botão "rola a bola" leva até Quem Somos
--------------------------------------------------------- */
document.getElementById('scrollHint')?.addEventListener('click', () => {
  document.getElementById('quem-somos')?.scrollIntoView({ behavior: 'smooth' });
});

/* ---------------------------------------------------------
   Reveal on scroll (IntersectionObserver)
--------------------------------------------------------- */
let revealObserver;
function observeReveal(){
  if (!revealObserver){
    revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting){
          entry.target.classList.add('in-view');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
  }
  document.querySelectorAll('.reveal:not(.in-view)').forEach(el => revealObserver.observe(el));
}

// Marca os elementos que devem receber a animação de reveal
function tagRevealTargets(){
  document.querySelectorAll(
    '.about__text, .about__photos, .value-card, .gallery__lead, .footer__brand, .footer__cta'
  ).forEach(el => el.classList.add('reveal'));
}

/* ---------------------------------------------------------
   Placar animado (efeito "flip")
--------------------------------------------------------- */
function animateScoreFlip(el){
  const target = parseInt(el.dataset.target, 10);
  const digitEls = [...el.querySelectorAll('.score-item__digit')];
  const digitCount = digitEls.length;
  const duration = 1400;
  const start = performance.now();

  function tick(now){
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
    const current = Math.round(eased * target);
    const str = String(current).padStart(digitCount, '0');

    str.split('').forEach((digit, i) => {
      if (digitEls[i].textContent !== digit){
        digitEls[i].textContent = digit;
        digitEls[i].style.transform = 'translateY(-4px)';
        requestAnimationFrame(() => { digitEls[i].style.transform = ''; });
      }
    });

    if (progress < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

function initScoreboard(){
  const flips = document.querySelectorAll('.score-item__flip');
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting){
        animateScoreFlip(entry.target);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });
  flips.forEach(el => observer.observe(el));
}

/* ---------------------------------------------------------
   Rodapé: ano atual + link do WhatsApp
--------------------------------------------------------- */
document.getElementById('year').textContent = new Date().getFullYear();

// Troque o número abaixo (com DDI+DDD) pelo número real do grupo
const whatsappNumber = '5567900000000';
const whatsappMessage = 'Oi! Quero saber como entrar no Fut dos Amigos 🙌⚽';
document.getElementById('whatsappBtn')?.setAttribute(
  'href',
  `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`
);

/* ---------------------------------------------------------
   Init
--------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', () => {
  renderAboutPhotos();
  renderGallery();
  tagRevealTargets();
  observeReveal();
  initScoreboard();
});
