const cards = document.querySelectorAll('[data-platform]');
const filters = document.querySelector('.filters');
const releaseNote = document.querySelector('[data-release-note]');
const releases = window.nasfilemReleases ?? {};
let hasPublicRelease = false;

for (const card of cards) {
  const release = releases[card.dataset.platform];
  if (!release?.url || !release.label) continue;

  const link = document.createElement('a');
  link.className = 'button small primary';
  link.href = release.url;
  link.textContent = release.label;

  if (release.badge) {
    const badge = document.createElement('img');
    badge.src = release.badge;
    badge.alt = release.label;
    badge.height = 40;
    link.className = 'store-badge';
    link.replaceChildren(badge);
  }

  const downloads = card.querySelector('[data-download]');
  downloads.append(link);

  if (release.details) {
    const metadata = document.createElement('span');
    metadata.textContent = release.details;
    downloads.append(metadata);
  }

  const status = card.querySelector('[data-status]');
  status.textContent = '已发布';
  status.classList.add('released');
  hasPublicRelease = true;
}

if (hasPublicRelease) {
  releaseNote.textContent = '各发行渠道的版本和可用地区可能不同。';
}

if (filters) {
  filters.hidden = false;

  filters.addEventListener('click', (event) => {
    const selected = event.target.closest('button[data-filter]');
    if (!selected) return;

    for (const option of filters.querySelectorAll('button')) {
      option.setAttribute('aria-pressed', String(option === selected));
    }

    for (const card of cards) {
      card.hidden = selected.dataset.filter !== 'all' && card.dataset.kind !== selected.dataset.filter;
    }
  });
}
