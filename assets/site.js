function releaseEntry(release) {
  const entry = document.createElement('div');
  entry.className = 'release-entry';
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

  entry.append(link);

  if (release.details) {
    const metadata = document.createElement('span');
    metadata.className = 'release-details';
    metadata.textContent = release.details;
    entry.append(metadata);
  }

  if (release.sha256) {
    const verification = document.createElement('details');
    const summary = document.createElement('summary');
    summary.textContent = '查看 SHA-256';
    const hash = document.createElement('code');
    hash.textContent = release.sha256;
    verification.append(summary, hash);
    entry.append(verification);
  }

  return entry;
}

const releases = window.beaverNasReleases ?? {};

for (const row of document.querySelectorAll('[data-platform]')) {
  const entries = releases[row.dataset.platform]?.filter(({ url, label }) => url && label);
  if (!entries?.length) continue;

  const channel = row.querySelector('[data-download]');
  channel.replaceChildren(...entries.map(releaseEntry));

  const status = row.querySelector('[data-status]');
  status.textContent = '已发布';
  status.classList.add('released');
}

const pairing = document.querySelector('[data-pairing]');

if (pairing) {
  const steps = [
    ['存储端选好「家庭资料」。共享目录默认只读。', '已选择目录', '尚未配对', '等待连接'],
    ['访问端扫码或粘贴配对码。存储端核对设备并批准。', '已批准设备', '已配对', '等待打开目录'],
    ['访问端打开「家庭资料」，只看得到已授权的内容。', '已开启共享', '家庭资料', '只读访问'],
  ];
  const controls = pairing.querySelector('.step-buttons');
  const fields = [
    pairing.querySelector('#pairing-state'),
    pairing.querySelector('[data-host-status]'),
    pairing.querySelector('[data-client-title]'),
    pairing.querySelector('[data-client-status]'),
  ];

  controls.hidden = false;
  controls.addEventListener('click', (event) => {
    const selected = event.target.closest('button[data-step]');
    if (!selected) return;

    const stage = Number(selected.dataset.step);
    for (const button of controls.querySelectorAll('button')) {
      button.setAttribute('aria-pressed', String(button === selected));
    }
    for (const [index, field] of fields.entries()) {
      field.textContent = steps[stage][index];
    }
    pairing.classList.toggle('paired', stage > 0);
  });
}
