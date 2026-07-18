const header = document.querySelector('[data-header]');
const menuButton = document.querySelector('[data-menu-toggle]');
const menu = document.querySelector('[data-menu]');
const mobileCall = document.querySelector('.mobile-call');

const setHeaderState = () => {
  header?.classList.toggle('is-scrolled', window.scrollY > 24);
  mobileCall?.classList.toggle('is-visible', window.scrollY > 420);
};

const closeMenu = () => {
  if (!menuButton || !menu) return;
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Deschide meniul');
  menu.classList.remove('is-open');
  header?.classList.remove('menu-active');
  document.body.classList.remove('menu-open');
};

menuButton?.addEventListener('click', () => {
  const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!isOpen));
  menuButton.setAttribute('aria-label', isOpen ? 'Deschide meniul' : 'Închide meniul');
  menu?.classList.toggle('is-open', !isOpen);
  header?.classList.toggle('menu-active', !isOpen);
  document.body.classList.toggle('menu-open', !isOpen);
});

menu?.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));

window.addEventListener('scroll', setHeaderState, { passive: true });
window.addEventListener('resize', () => {
  if (window.innerWidth > 800) closeMenu();
});
setHeaderState();

const schedule = {
  Mon: { label: '10:30 — 20:00', opens: 10 * 60 + 30, closes: 20 * 60 },
  Tue: { label: '10:30 — 20:00', opens: 10 * 60 + 30, closes: 20 * 60 },
  Wed: { label: '10:30 — 20:00', opens: 10 * 60 + 30, closes: 20 * 60 },
  Thu: { label: '10:30 — 20:00', opens: 10 * 60 + 30, closes: 20 * 60 },
  Fri: { label: '10:30 — 20:00', opens: 10 * 60 + 30, closes: 20 * 60 },
  Sat: { label: '10:00 — 14:00', opens: 10 * 60, closes: 14 * 60 },
  Sun: { label: '12:00 — 14:00', opens: 12 * 60, closes: 14 * 60 },
};

const getBucharestTime = () => {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Europe/Bucharest',
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).formatToParts(new Date());

  const getPart = (type) => parts.find((part) => part.type === type)?.value;
  return {
    day: getPart('weekday'),
    minutes: Number(getPart('hour')) * 60 + Number(getPart('minute')),
  };
};

const updateOpenState = () => {
  const { day, minutes } = getBucharestTime();
  const today = schedule[day] || schedule.Mon;
  const isOpen = minutes >= today.opens && minutes < today.closes;
  const stateText = isOpen ? 'Deschis acum' : 'Închis acum';

  document.querySelectorAll('[data-today-hours]').forEach((element) => {
    element.textContent = today.label;
  });
  document.querySelectorAll('[data-open-state]').forEach((element) => {
    element.textContent = isOpen ? 'Deschis' : 'Închis';
  });
  document.querySelectorAll('[data-open-badge]').forEach((element) => {
    element.textContent = stateText;
    element.classList.toggle('is-closed', !isOpen);
  });
  document.querySelectorAll('.today-card').forEach((element) => {
    element.classList.toggle('is-closed', !isOpen);
  });
};

updateOpenState();
window.setInterval(updateOpenState, 60_000);

document.querySelectorAll('[data-year]').forEach((element) => {
  element.textContent = String(new Date().getFullYear());
});

const revealItems = document.querySelectorAll('[data-reveal]');

if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px' },
  );

  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add('is-visible'));
}

const galleryDialog = document.querySelector('[data-lightbox]');
const galleryDialogImage = document.querySelector('[data-lightbox-image]');
const galleryDialogCaption = document.querySelector('[data-lightbox-caption]');
const galleryCloseButton = document.querySelector('[data-lightbox-close]');

document.querySelectorAll('[data-gallery-open]').forEach((button) => {
  button.addEventListener('click', () => {
    const source = button.dataset.galleryOpen;
    const caption = button.dataset.galleryCaption || '';
    const thumbnail = button.querySelector('img');

    if (!galleryDialog?.showModal || !galleryDialogImage) {
      window.open(source, '_blank', 'noopener,noreferrer');
      return;
    }

    galleryDialogImage.src = source;
    galleryDialogImage.alt = thumbnail?.alt || caption;
    if (galleryDialogCaption) galleryDialogCaption.textContent = caption;
    galleryDialog.showModal();
  });
});

galleryCloseButton?.addEventListener('click', () => galleryDialog?.close());

galleryDialog?.addEventListener('click', (event) => {
  if (event.target === galleryDialog) galleryDialog.close();
});

galleryDialog?.addEventListener('close', () => {
  if (galleryDialogImage) galleryDialogImage.src = '';
});
