const STORAGE_KEY = 'cos.lang';

function persistAndNavigate(link: HTMLAnchorElement) {
  const lang = link.dataset.lang;
  if (!lang) return;
  try { localStorage.setItem(STORAGE_KEY, lang); } catch {}
  const hash = window.location.hash;
  if (hash && link.dataset.preserveHash !== undefined) {
    link.setAttribute('href', link.getAttribute('href')! + hash);
  }
}

document.querySelectorAll<HTMLAnchorElement>('.lang-toggle a').forEach((a) => {
  a.addEventListener('click', () => persistAndNavigate(a));
});
