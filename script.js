document.documentElement.classList.add('js');

var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// En-tête : fond blanc et ombre dès qu'on fait défiler la page
var header = document.getElementById('header');
function updateHeader() {
  header.classList.toggle('has-white-bg', window.scrollY > 10);
}
updateHeader();
window.addEventListener('scroll', updateHeader, { passive: true });

// Menu mobile
var hamburger = document.getElementById('hamburger');
var nav = document.getElementById('nav');
hamburger.addEventListener('click', function () {
  var open = nav.classList.toggle('is-open');
  hamburger.setAttribute('aria-expanded', open);
  hamburger.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
});
nav.addEventListener('click', function (e) {
  if (e.target.closest('a')) {
    nav.classList.remove('is-open');
    hamburger.setAttribute('aria-expanded', 'false');
    hamburger.setAttribute('aria-label', 'Ouvrir le menu');
  }
});

// Titre principal écrit lettre par lettre
var typed = document.getElementById('typed');
var cursor = document.querySelector('.typed-cursor');
var fullText = typed.textContent;
if (reduceMotion) {
  cursor.classList.add('is-done');
} else {
  typed.textContent = '';
  var i = 0;
  setTimeout(function type() {
    typed.textContent = fullText.slice(0, ++i);
    if (i < fullText.length) {
      setTimeout(type, 55);
    } else {
      setTimeout(function () { cursor.classList.add('is-done'); }, 2500);
    }
  }, 200);
}

// Apparition des blocs au défilement
var revealItems = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window && !reduceMotion) {
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

  // Léger décalage entre les éléments d'une même grille
  document.querySelectorAll('.feature-grid, .service-list, .numbers-grid, .process-list, .pricing').forEach(function (group) {
    group.querySelectorAll('.reveal').forEach(function (el, index) {
      el.style.transitionDelay = (index % 5) * 80 + 'ms';
    });
  });

  revealItems.forEach(function (el) { observer.observe(el); });
} else {
  revealItems.forEach(function (el) { el.classList.add('is-visible'); });
}

// Année du pied de page
document.getElementById('year').textContent = new Date().getFullYear();

// Pas de serveur : le formulaire ouvre la messagerie avec la demande pré-remplie
document.getElementById('contact-form').addEventListener('submit', function (e) {
  e.preventDefault();
  var f = new FormData(this);
  var body =
    'Nom : ' + f.get('nom') + '\n' +
    'Entreprise : ' + f.get('entreprise') + '\n' +
    'E-mail : ' + f.get('email') + '\n' +
    'Téléphone : ' + f.get('telephone') + '\n' +
    'Nombre de postes : ' + f.get('postes') + '\n\n' +
    f.get('message');
  window.location.href = 'mailto:contact@atelier-it.fr'
    + '?subject=' + encodeURIComponent('Demande de devis — ' + (f.get('entreprise') || f.get('nom')))
    + '&body=' + encodeURIComponent(body);
});
