const translations = JSON.parse(document.getElementById('translations-data').textContent);
const supportedLanguages = ['en', 'sq', 'de'];
const languagePageMap = { en: 'index.html', sq: 'sq.html', de: 'de.html' };
const languageButtons = document.querySelectorAll('.lang-btn');
const translatable = document.querySelectorAll('[data-i18n]');
const placeholderItems = document.querySelectorAll('[data-placeholder-i18n]');

function getInitialLanguage() {
  const queryLanguage = new URLSearchParams(window.location.search).get('lang');
  const currentFile = window.location.pathname.split('/').pop();
  const pathLanguage = currentFile === 'sq.html' ? 'sq' : currentFile === 'de.html' ? 'de' : 'en';
  const documentLanguage = document.documentElement.lang;
  return [queryLanguage, pathLanguage, documentLanguage].find((lang) => supportedLanguages.includes(lang)) || 'en';
}

let activeLanguage = getInitialLanguage();

function setLanguage(lang) {
  activeLanguage = lang;
  document.documentElement.lang = lang;
  translatable.forEach((element) => {
    const key = element.dataset.i18n;
    if (translations[lang] && translations[lang][key]) element.textContent = translations[lang][key];
  });
  placeholderItems.forEach((element) => {
    const key = element.dataset.placeholderI18n;
    if (translations[lang] && translations[lang][key]) element.setAttribute('placeholder', translations[lang][key]);
  });
  languageButtons.forEach((button) => {
    const isActive = button.dataset.lang === lang;
    button.classList.toggle('bg-gold', isActive);
    button.classList.toggle('text-black', isActive);
    button.classList.toggle('text-zinc-400', !isActive);
  });
}

languageButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const selectedLanguage = button.dataset.lang;
    const targetPage = languagePageMap[selectedLanguage];
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const currentHash = window.location.hash || '';
    if (targetPage && currentPage !== targetPage) {
      window.location.href = `${targetPage}${currentHash}`;
      return;
    }
    setLanguage(selectedLanguage);
  });
});
setLanguage(activeLanguage);

const loader = document.getElementById('loader');
window.addEventListener('load', () => {
  if (!loader) return;
  loader.classList.add('opacity-0', 'pointer-events-none');
  window.setTimeout(() => loader.remove(), 800);
});


const mobileMenu = document.getElementById('mobileMenu');
const menuToggle = document.getElementById('menuToggle');
if (menuToggle && mobileMenu) {
  menuToggle.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('hidden') === false;
    menuToggle.setAttribute('aria-expanded', String(isOpen));
  });
  mobileMenu.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
    mobileMenu.classList.add('hidden');
    menuToggle.setAttribute('aria-expanded', 'false');
  }));
}

const filterButtons = document.querySelectorAll('.filter-btn');
const galleryItems = document.querySelectorAll('.gallery-item');
function activateFilter(button) {
  filterButtons.forEach((item) => {
    item.classList.remove('bg-gold', 'border-gold', 'text-black');
    item.classList.add('border-white/10', 'bg-white/[0.03]', 'text-zinc-400');
  });
  button.classList.remove('border-white/10', 'bg-white/[0.03]', 'text-zinc-400');
  button.classList.add('bg-gold', 'border-gold', 'text-black');
}
filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const filter = button.dataset.filter;
    activateFilter(button);
    galleryItems.forEach((item) => {
      const show = filter === 'all' || item.dataset.category === filter;
      item.classList.toggle('hidden', !show);
    });
  });
});

const lightbox = document.getElementById('lightbox');
if (lightbox) {
  const lightboxImage = lightbox.querySelector('img');
  const lightboxClose = document.getElementById('lightboxClose');
  galleryItems.forEach((item) => {
    item.addEventListener('click', () => {
      lightboxImage.src = item.dataset.src;
      lightbox.classList.remove('hidden');
      lightbox.classList.add('flex');
    });
  });
  function closeLightbox() {
    lightbox.classList.add('hidden');
    lightbox.classList.remove('flex');
    lightboxImage.src = '';
  }
  lightboxClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (event) => { if (event.target === lightbox) closeLightbox(); });
  document.addEventListener('keydown', (event) => { if (event.key === 'Escape') closeLightbox(); });
}

const bookingForm = document.getElementById('bookingForm');
if (bookingForm) {
  bookingForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const values = {
      name: document.getElementById('name').value.trim(),
      phone: document.getElementById('phone').value.trim(),
      style: document.getElementById('style').value,
      placement: document.getElementById('placement').value.trim(),
      date: document.getElementById('date').value,
      idea: document.getElementById('idea').value.trim()
    };
    const message = [
      'Hello The Ink Lady, I would like to request an appointment.',
      `Name: ${values.name || '-'}`,
      `Phone: ${values.phone || '-'}`,
      `Style: ${values.style || '-'}`,
      `Placement: ${values.placement || '-'}`,
      `Preferred date: ${values.date || '-'}`,
      `Idea: ${values.idea || '-'}`
    ].join('\n');
    window.open(`https://wa.me/38348464645?text=${encodeURIComponent(message)}`, '_blank', 'noopener');
  });
}
