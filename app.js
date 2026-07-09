const STORAGE_KEY = 'pcso_gemini_key';

const STAT_KEYS = ['hp', 'atk', 'def', 'spa', 'spd', 'spe'];
const STAT_NAMES = { hp: 'HP', atk: 'Atk', def: 'Def', spa: 'SpA', spd: 'SpD', spe: 'Spe' };
const STAT_LABEL_ALIASES = {
  hp: 'hp', attack: 'atk', atk: 'atk', defense: 'def', def: 'def',
  'sp. atk': 'spa', 'spa.': 'spa', spatk: 'spa', 'special attack': 'spa',
  'sp. def': 'spd', spd: 'spd', 'special defense': 'spd', speed: 'spe'
};

const NATURE_STAT_ALIASES = {
  hp: 'hp', atk: 'atk', attack: 'atk', def: 'def', defense: 'def',
  spa: 'spa', spatk: 'spa', specialattack: 'spa', 'spatk': 'spa',
  spd: 'spd', specialdefense: 'spd', 'spdef': 'spd', speed: 'spe', spe: 'spe'
};

const NATURE_MAP = new Map([
  ['atk:def', 'Lonely'], ['atk:spa', 'Adamant'], ['atk:spd', 'Naughty'], ['atk:spe', 'Brave'],
  ['def:atk', 'Bold'], ['def:spa', 'Relaxed'], ['def:spd', 'Impish'], ['def:spe', 'Lax'],
  ['spa:atk', 'Modest'], ['spa:def', 'Mild'], ['spa:spd', 'Rash'], ['spa:spe', 'Quiet'],
  ['spd:atk', 'Calm'], ['spd:def', 'Gentle'], ['spd:spa', 'Careful'], ['spd:spe', 'Sassy'],
  ['spe:atk', 'Timid'], ['spe:def', 'Hasty'], ['spe:spa', 'Jolly'], ['spe:spd', 'Naive']
]);

const SCREEN_CROPS = {
  moves: [
    { x: 0.08, y: 0.18, w: 0.41, h: 0.17 }, { x: 0.54, y: 0.18, w: 0.38, h: 0.17 },
    { x: 0.08, y: 0.41, w: 0.41, h: 0.17 }, { x: 0.54, y: 0.41, w: 0.38, h: 0.17 },
    { x: 0.08, y: 0.64, w: 0.41, h: 0.17 }, { x: 0.54, y: 0.64, w: 0.38, h: 0.17 },
  ],
  stats: [
    { x: 0.08, y: 0.18, w: 0.41, h: 0.17 }, { x: 0.54, y: 0.18, w: 0.38, h: 0.17 },
    { x: 0.08, y: 0.41, w: 0.41, h: 0.17 }, { x: 0.54, y: 0.41, w: 0.38, h: 0.17 },
    { x: 0.08, y: 0.64, w: 0.41, h: 0.17 }, { x: 0.54, y: 0.64, w: 0.38, h: 0.17 },
  ]
};

const DEFAULT_TEAM = Array.from({ length: 6 }, (_, i) => ({
  slot: i + 1,
  species: '',
  item: '',
  ability: '',
  level: 50,
  statPoints: { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 },
  nature: '',
  moves: ['', '', '', ''],
  warnings: []
}));

const state = {
  geminiKey: localStorage.getItem(STORAGE_KEY) || '',
  saveKey: !!localStorage.getItem(STORAGE_KEY),
  useGemini: !!localStorage.getItem(STORAGE_KEY),
  autoMega: true,
  movesFile: null,
  statsFile: null,
  movesDataUrl: '',
  statsDataUrl: '',
  team: structuredClone(DEFAULT_TEAM),
  data: null,
  pasteIndex: 0,
};

const els = {};

init();

function init() {
  bindElements();
  wireEvents();
  renderTeamEditor();
  setExportText(formatExport(state.team));
  setWarnings([]);
  loadShowdownData().then(() => {
    validateAndRender();
  }).catch(err => {
    setWarnings([{ kind: 'bad', text: `Failed to load validation data: ${err.message}` }]);
  });
}

function bindElements() {
  [
    'geminiKey', 'saveKey', 'autoMega', 'movesFile', 'statsFile', 'movesPreview', 'statsPreview',
    'movesStatus', 'statsStatus', 'teamEditor', 'exportText', 'warningList', 'runOcr', 'clearAll', 'copyPaste', 'keyPanel'
  ].forEach(id => { els[id] = document.getElementById(id); });
}

function wireEvents() {
  els.geminiKey.value = state.geminiKey;
  els.saveKey.checked = state.saveKey;
  els.autoMega.checked = state.autoMega;

  els.saveKey.addEventListener('change', () => {
    state.saveKey = els.saveKey.checked;
    if (!state.saveKey) {
      localStorage.removeItem(STORAGE_KEY);
    }
  });
  els.geminiKey.addEventListener('input', () => {
    state.geminiKey = els.geminiKey.value;
    if (state.saveKey) {
      localStorage.setItem(STORAGE_KEY, state.geminiKey.trim());
    }
  });
  for (const input of [els.geminiKey]) {
    input.addEventListener('paste', e => e.preventDefault());
    input.addEventListener('copy', e => e.preventDefault());
    input.addEventListener('cut', e => e.preventDefault());
  }

  els.autoMega.addEventListener('change', () => {
    state.autoMega = els.autoMega.checked;
    validateAndRender();
  });

  document.querySelectorAll('[data-pick]').forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.pick;
      els[`${target}File`].click();
    });
  });
  document.querySelectorAll('[data-clear-upload]').forEach(btn => {
    btn.addEventListener('click', () => clearUpload(btn.dataset.clearUpload));
  });

  els.movesFile.addEventListener('change', e => handleFilePick('moves', e.target.files?.[0] || null));
  els.statsFile.addEventListener('change', e => handleFilePick('stats', e.target.files?.[0] || null));

  wireDropzone('moves');
  wireDropzone('stats');

  els.runOcr.addEventListener('click', () => runOcr());
  els.clearAll.addEventListener('click', resetAll);
  els.copyPaste.addEventListener('click', copyExport);

  document.addEventListener('paste', handlePaste);
}

function wireDropzone(kind) {
  const card = document.querySelector(`[data-upload="${kind}"]`);
  card.addEventListener('dragover', e => { e.preventDefault(); card.classList.add('drag'); });
  card.addEventListener('dragleave', () => card.classList.remove('drag'));
  card.addEventListener('drop', e => {
    e.preventDefault();
    card.classList.remove('drag');
    const file = e.dataTransfer?.files?.[0] || null;
    handleFilePick(kind, file);
  });
}

function handlePaste(e) {
  const files = [...(e.clipboardData?.files || [])].filter(file => file.type.startsWith('image/'));
  const items = [...(e.clipboardData?.items || [])]
    .filter(item => item.type.startsWith('image/'))
    .map(item => item.getAsFile())
    .filter(Boolean);
  const images = [...files, ...items];
  if (!images.length) return;
  e.preventDefault();
  const kind = state.pasteIndex % 2 === 0 ? 'moves' : 'stats';
  state.pasteIndex += 1;
  handleFilePick(kind, images[0]);
}

function clearUpload(kind) {
  state[`${kind}File`] = null;
  state[`${kind}DataUrl`] = '';
  els[`${kind}File`].value = '';
  els[`${kind}Preview`].src = '';
  els[`${kind}Preview`].style.display = 'none';
  els[`${kind}Status`].textContent = 'Waiting for image';
  if (kind === 'moves') state.team = structuredClone(DEFAULT_TEAM);
  if (kind === 'stats') state.team = structuredClone(DEFAULT_TEAM);
  validateAndRender();
}

function resetAll() {
  clearUpload('moves');
  clearUpload('stats');
  state.team = structuredClone(DEFAULT_TEAM);
  state.pasteIndex = 0;
  renderTeamEditor();
  validateAndRender();
}

async function handleFilePick(kind, file) {
  if (!file || !file.type.startsWith('image/')) return;
  state[`${kind}File`] = file;
  const dataUrl = await fileToDataUrl(file);
  state[`${kind}DataUrl`] = dataUrl;
  els[`${kind}Preview`].src = dataUrl;
  els[`${kind}Preview`].style.display = 'block';
  els[`${kind}Status`].textContent = file.name;
}

async function runOcr() {
  if (!state.movesDataUrl || !state.statsDataUrl) {
    alert('Please add both screenshots first.');
    return;
  }
  if (!state.geminiKey.trim()) {
    const proceed = confirm('No Gemini API key is saved. Continue with Tesseract OCR, or cancel and enter a Gemini key for better results?');
    if (!proceed) return;
  }
  if (state.saveKey && state.geminiKey.trim()) {
    localStorage.setItem(STORAGE_KEY, state.geminiKey.trim());
  }
  els.runOcr.disabled = true;
  els.runOcr.textContent = 'Working...';
  try {
    const [movesTeam, statsTeam] = await Promise.all([
      extractTeamFromScreenshot('moves', state.movesDataUrl),
      extractTeamFromScreenshot('stats', state.statsDataUrl)
    ]);
    mergeTeams(movesTeam, statsTeam);
    renderTeamEditor();
    validateAndRender();
  } catch (err) {
    setWarnings([{ kind: 'bad', text: err.message || 'OCR failed' }]);
  } finally {
    els.runOcr.disabled = false;
    els.runOcr.textContent = 'Import screenshots';
  }
}

function mergeTeams(movesTeam, statsTeam) {
  const merged = structuredClone(DEFAULT_TEAM);
  for (let i = 0; i < 6; i++) {
    merged[i] = {
      ...merged[i],
      ...statsTeam[i],
      ...movesTeam[i],
      statPoints: statsTeam[i]?.statPoints || merged[i].statPoints,
      moves: movesTeam[i]?.moves || merged[i].moves,
      nature: statsTeam[i]?.nature || merged[i].nature,
    };
  }
  state.team = merged;
}

function renderTeamEditor() {
  els.teamEditor.innerHTML = '';
  state.team.forEach((mon, i) => {
    const card = document.createElement('article');
    card.className = 'team-card';
    card.innerHTML = `
      <div class="team-card-head">
        <h3>Slot ${i + 1}</h3>
        <span class="hint">Imported mon</span>
      </div>
      <div class="team-grid">
        <label class="team-block"><span class="team-label">Species</span><input class="team-input" data-field="species" data-index="${i}" value="${escapeHtml(mon.species || '')}"></label>
        <label class="team-block"><span class="team-label">Item</span><input class="team-input" data-field="item" data-index="${i}" value="${escapeHtml(mon.item || '')}"></label>
        <label class="team-block"><span class="team-label">Ability</span><input class="team-input" data-field="ability" data-index="${i}" value="${escapeHtml(mon.ability || '')}"></label>
        <label class="team-block"><span class="team-label">Level</span><input class="team-input" data-field="level" data-index="${i}" value="${escapeHtml(String(mon.level ?? 50))}"></label>
      </div>
      <div style="height:10px"></div>
      <div class="team-subgrid">
        ${STAT_KEYS.map(key => `
          <label class="team-block"><span class="team-label">${STAT_NAMES[key]}</span><input class="team-input" data-field="stat.${key}" data-index="${i}" value="${escapeHtml(String(mon.statPoints?.[key] ?? 0))}"></label>
        `).join('')}
      </div>
      <div style="height:10px"></div>
      <div class="team-grid">
        <label class="team-block"><span class="team-label">Nature</span><input class="team-input" data-field="nature" data-index="${i}" value="${escapeHtml(mon.nature || '')}"></label>
        <div class="team-block"><span class="team-label">Moves</span>
          <div class="moves-grid">
            ${mon.moves.map((move, j) => `<input class="team-input" data-field="move.${j}" data-index="${i}" value="${escapeHtml(move || '')}" placeholder="Move ${j + 1}">`).join('')}
          </div>
        </div>
      </div>
    `;
    els.teamEditor.appendChild(card);
  });
  els.teamEditor.querySelectorAll('input').forEach(input => {
    input.addEventListener('input', onTeamEdit);
  });
}

function onTeamEdit(e) {
  const el = e.target;
  const idx = Number(el.dataset.index);
  const field = el.dataset.field;
  const value = el.value;
  const mon = state.team[idx];
  if (!mon) return;
  if (field.startsWith('stat.')) {
    const key = field.split('.')[1];
    mon.statPoints[key] = clampInt(value, 0, 32);
  } else if (field.startsWith('move.')) {
    const j = Number(field.split('.')[1]);
    mon.moves[j] = value;
  } else if (field === 'level') {
    mon.level = clampInt(value, 1, 100);
  } else {
    mon[field] = value;
  }
  validateAndRender();
}

function validateAndRender() {
  if (!state.data) {
    setExportText(formatExport(state.team));
    return;
  }
  const result = validateTeam(state.team, state.data, state.autoMega);
  setWarnings(result.warnings);
  setExportText(formatExport(state.team, state.autoMega, state.data));
}

function setWarnings(list) {
  els.warningList.innerHTML = '';
  if (!list.length) {
    els.warningList.innerHTML = '<div class="warning-item ok">No warnings.</div>';
    return;
  }
  const grouped = new Map();
  for (const warning of list) {
    const slot = warning.slot || 'General';
    if (!grouped.has(slot)) grouped.set(slot, []);
    grouped.get(slot).push(warning);
  }
  for (const [slot, warnings] of grouped.entries()) {
    const div = document.createElement('div');
    div.className = 'warning-item';
    div.innerHTML = `<strong>${slot}</strong><div>${warnings.map(w => escapeHtml(w.text)).join('<br>')}</div>`;
    els.warningList.appendChild(div);
  }
}

function setExportText(text) {
  els.exportText.value = text;
}

async function copyExport() {
  const text = els.exportText.value;
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return;
    }
  } catch {}

  els.exportText.focus();
  els.exportText.select();
  document.execCommand('copy');
}

function formatExport(team, autoMega = state.autoMega, data = state.data) {
  const text = team.map(mon => formatMon(mon, autoMega, data)).filter(Boolean).join('\n\n').trim();
  return text ? `${text}\n` : '';
}

function formatMon(mon, autoMega = true, data = state.data) {
  const resolved = resolveExportForm(mon, autoMega, data);
  const species = resolved.species;
  if (!species) return '';
  const lines = [
    `${species}${mon.item ? ` @ ${mon.item}` : ''}`,
    resolved.ability ? `Ability: ${resolved.ability}` : null,
    mon.level ? `Level: ${mon.level}` : null,
    formatStatPoints(mon.statPoints),
    mon.nature ? `${mon.nature} Nature` : null,
    ...(mon.moves || []).filter(Boolean).map(move => `- ${move}`)
  ].filter(Boolean);
  return lines.join('\n');
}

function resolveExportForm(mon, autoMega, data = state.data) {
  const species = formatSpecies(mon.species || '', mon.item || '', autoMega, data);
  let ability = mon.ability || '';
  if (autoMega && data) {
    const baseName = normalizeSpecies(mon.species).replace(/-Mega$/i, '').trim();
    const baseEntry = data.findSpecies(baseName) || data.findSpecies(normalizeSpecies(mon.species));
    const mega = getMegaSpeciesFromItem(data, baseEntry, normalizeLookup(mon.item));
    if (mega) {
      ability = mega.abilities?.['0'] || mega.abilities?.['1'] || mega.abilities?.['H'] || ability;
    }
  }
  return { species, ability };
}

function formatSpecies(species, item, autoMega, data = state.data) {
  const cleaned = normalizeSpecies(species);
  if (!cleaned) return '';
  if (autoMega) {
    const mega = lookupMega(cleaned, item, data);
    if (mega) return mega;
  }
  return cleaned;
}

function formatStatPoints(stats) {
  const parts = STAT_KEYS.map(k => [stats?.[k] || 0, k]).filter(([v]) => v > 0).map(([v, k]) => `${v} ${STAT_NAMES[k]}`);
  return parts.length ? `EVs: ${parts.join(' / ')}` : null;
}

function normalizeSpecies(name) {
  return String(name || '').trim().replace(/\s+/g, ' ');
}

function lookupMega(species, item, data = state.data) {
  if (!data) return '';
  const itemEntry = data.itemsByName.get(normalizeLookup(item));
  if (!itemEntry?.megaStone) return '';
  const target = itemEntry.megaStone?.[species] || Object.values(itemEntry.megaStone || {})[0];
  return target || '';
}

function validateTeam(team, data, autoMega) {
  const warnings = [];

  team.forEach((mon, idx) => {
    const perMonWarnings = [];
    const statTotal = STAT_KEYS.reduce((sum, key) => sum + clampInt(mon.statPoints?.[key] ?? 0, 0, 999), 0);
    if (statTotal > 66) perMonWarnings.push({ slot: `Slot ${idx + 1}`, kind: 'bad', text: `stat points total ${statTotal} exceeds 66.` });
    for (const key of STAT_KEYS) {
      const n = clampInt(mon.statPoints?.[key] ?? 0, 0, 999);
      if (n > 32) perMonWarnings.push({ slot: `Slot ${idx + 1}`, kind: 'bad', text: `${STAT_NAMES[key]} stat points ${n} exceeds 32.` });
    }

    const species = normalizeSpecies(mon.species);
    const item = normalizeLookup(mon.item);
    const ability = normalizeLookup(mon.ability);
    const moveNames = (mon.moves || []).map(m => normalizeLookup(m)).filter(Boolean);
    const speciesEntry = data.findSpecies(species);
    if (mon.species.trim() && !speciesEntry) perMonWarnings.push({ slot: `Slot ${idx + 1}`, kind: 'bad', text: `unknown species "${mon.species}".` });
    if (mon.item.trim() && !data.itemsByName.has(item)) perMonWarnings.push({ slot: `Slot ${idx + 1}`, kind: 'bad', text: `unknown item "${mon.item}".` });
    if (mon.ability.trim() && !data.abilitiesByName.has(ability)) perMonWarnings.push({ slot: `Slot ${idx + 1}`, kind: 'bad', text: `unknown ability "${mon.ability}".` });
    for (const move of moveNames) {
      if (!data.movesByName.has(move)) perMonWarnings.push({ slot: `Slot ${idx + 1}`, kind: 'bad', text: `unknown move "${move}".` });
    }

    if (mon.nature.trim()) {
      const n = normalizeLookup(mon.nature.replace(/\s+nature$/i, ''));
      if (!data.naturesByName.has(n)) perMonWarnings.push({ slot: `Slot ${idx + 1}`, kind: 'bad', text: `unknown nature "${mon.nature}".` });
    }

    warnings.push(...perMonWarnings);
  });

  return { team, warnings };
}

function getMegaSpeciesFromItem(data, speciesEntry, item) {
  if (!speciesEntry) return null;
  const itemEntry = data.itemsByName.get(item);
  if (!itemEntry?.megaStone) return null;
  const targetName = itemEntry.megaStone[speciesEntry.name] || Object.values(itemEntry.megaStone)[0];
  return targetName ? data.findSpecies(targetName) : null;
}

async function extractTeamFromScreenshot(kind, dataUrl) {
  const image = await loadImage(dataUrl);
  const crops = SCREEN_CROPS[kind].map((rect, i) => cropImage(image, rect, i));
  const results = [];
  for (let i = 0; i < crops.length; i++) {
    const crop = crops[i];
    results.push(await extractCard(kind, crop, i + 1));
  }
  return results;
}

async function extractCard(kind, dataUrl, slot) {
  if (state.geminiKey.trim()) {
    try {
      return await geminiExtractCard(kind, dataUrl, slot);
    } catch (err) {
      console.warn('Gemini card OCR failed, falling back to Tesseract', err);
    }
  }
  return await tesseractExtractCard(kind, dataUrl, slot);
}

async function geminiExtractCard(kind, dataUrl, slot) {
  const mimeType = dataUrl.match(/^data:(.*?);base64,/i)?.[1] || 'image/png';
  const base64 = dataUrl.split(',')[1];
  const prompt = kind === 'stats'
    ? `Read this Pokemon Champions STATS card for slot ${slot}. Return JSON with fields: species, item, ability, level, statPoints (hp/atk/def/spa/spd/spe), natureUp, natureDown. Use the exact Pokemon names and item/ability names as shown. The stat points are the numbers shown on the right of each stat line. If a nature arrow is visible, identify which stat is boosted and lowered.`
    : `Read this Pokemon Champions MOVES & MORE card for slot ${slot}. Return JSON with fields: species, moves (an array of exactly 4 move names in order). Use the exact move names as shown.`;
  const body = {
    contents: [{ role: 'user', parts: [{ inlineData: { mimeType, data: base64 } }, { text: prompt }] }],
    generationConfig: {
      temperature: 0.1,
      topK: 1,
      topP: 0.8,
      maxOutputTokens: 2048,
      responseMimeType: 'application/json'
    }
  };
  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${encodeURIComponent(state.geminiKey.trim())}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  if (!res.ok) throw new Error(`Gemini OCR failed (${res.status})`);
  const json = await res.json();
  const text = json.candidates?.[0]?.content?.parts?.map(p => p.text || '').join('') || '';
  const cleaned = text.replace(/```json/gi, '').replace(/```/g, '').trim();
  const start = cleaned.indexOf('{');
  const end = cleaned.lastIndexOf('}');
  const parsed = JSON.parse(start >= 0 && end >= start ? cleaned.slice(start, end + 1) : cleaned);
  return kind === 'stats' ? normalizeStatsOcr(parsed, slot) : normalizeMovesOcr(parsed, slot);
}

async function tesseractExtractCard(kind, dataUrl, slot) {
  const result = await Tesseract.recognize(dataUrl, 'eng', { logger: () => {} });
  const text = result.data.text || '';
  return kind === 'stats' ? parseStatsText(text, slot) : parseMovesText(text, slot);
}

function normalizeStatsOcr(parsed, slot) {
  const statPoints = parsed.statPoints || {};
  const nature = natureFromBoostDrop(parsed.natureUp, parsed.natureDown);
  return {
    slot,
    species: parsed.species || '',
    item: parsed.item || '',
    ability: parsed.ability || '',
    level: clampInt(parsed.level ?? 50, 1, 100),
    statPoints: {
      hp: clampInt(statPoints.hp ?? 0, 0, 32),
      atk: clampInt(statPoints.atk ?? 0, 0, 32),
      def: clampInt(statPoints.def ?? 0, 0, 32),
      spa: clampInt(statPoints.spa ?? 0, 0, 32),
      spd: clampInt(statPoints.spd ?? 0, 0, 32),
      spe: clampInt(statPoints.spe ?? 0, 0, 32),
    },
    nature,
    moves: ['', '', '', '']
  };
}

function normalizeMovesOcr(parsed, slot) {
  return {
    slot,
    species: parsed.species || '',
    moves: (parsed.moves || []).slice(0, 4).map(v => String(v || '').trim()).concat(['', '', '', '']).slice(0, 4),
    item: '', ability: '', level: 50, statPoints: { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 }, nature: ''
  };
}

function parseStatsText(text, slot) {
  const lines = cleanLines(text);
  const species = lines[0] || '';
  const item = findLikelyItem(lines);
  const ability = findLikelyAbility(lines);
  const level = findLevel(lines) || 50;
  const statPoints = parseStatPoints(lines);
  const nature = ''; // fallback text OCR usually won't catch arrows reliably
  return { slot, species, item, ability, level, statPoints, nature, moves: ['', '', '', ''] };
}

function parseMovesText(text, slot) {
  const lines = cleanLines(text);
  const species = lines[0] || '';
  const moves = lines.filter(line => line.length > 1).slice(1, 5);
  return { slot, species, moves: moves.slice(0, 4).concat(['', '', '', '']).slice(0, 4), item: '', ability: '', level: 50, statPoints: { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 }, nature: '' };
}

function cleanLines(text) {
  return String(text || '')
    .split(/\r?\n/)
    .map(s => s.trim())
    .filter(Boolean);
}

function findLikelyItem(lines) {
  return lines.find(line => /berry|orb|herb|sash|band|vest|needle|specs|scarf|lenses|policy|incense|leftovers|life orb|charcoal|mawilite/i.test(line)) || '';
}

function findLikelyAbility(lines) {
  return lines.find(line => /^[A-Za-z][A-Za-z '\-.]+$/.test(line) && !/slot|level|hp|atk|def|spa|spd|spe/i.test(line) && line.length > 2) || '';
}

function findLevel(lines) {
  const line = lines.find(v => /level\s*\d+|\b\d{1,3}\b/.test(v));
  if (!line) return 0;
  const m = line.match(/(\d{1,3})/);
  return m ? clampInt(m[1], 1, 100) : 0;
}

function parseStatPoints(lines) {
  const stats = { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 };
  for (const line of lines) {
    const lower = line.toLowerCase();
    for (const [k, label] of Object.entries(STAT_LABEL_ALIASES)) {
      if (lower.includes(k)) {
        const nums = line.match(/(\d+)/g);
        if (nums?.length) stats[label] = clampInt(nums[nums.length - 1], 0, 32);
      }
    }
  }
  return stats;
}

function natureFromBoostDrop(up, down) {
  const key = `${normalizeNatureStat(up)}:${normalizeNatureStat(down)}`;
  return NATURE_MAP.get(key) || '';
}

function normalizeNatureStat(stat) {
  const v = normalizeLookup(stat).replace(/\./g, '');
  return NATURE_STAT_ALIASES[v] || v;
}

async function loadShowdownData() {
  if (state.data) return state.data;
  const urls = {
    pokedex: 'https://play.pokemonshowdown.com/data/pokedex.js',
    moves: 'https://play.pokemonshowdown.com/data/moves.js',
    abilities: 'https://play.pokemonshowdown.com/data/abilities.js',
    items: 'https://play.pokemonshowdown.com/data/items.js',
    aliases: 'https://play.pokemonshowdown.com/data/aliases.js'
  };
  const [pokedex, moves, abilities, items, aliases] = await Promise.all(Object.values(urls).map(fetchShowdownModule));
  const data = buildDex({ pokedex, moves, abilities, items, aliases });
  state.data = data;
  return data;
}

async function fetchShowdownModule(url) {
  const text = await (await fetch(url)).text();
  const exports = {};
  // eslint-disable-next-line no-new-func
  new Function('exports', `${text}; return exports;`)(exports);
  return exports;
}

function buildDex({ pokedex, moves, abilities, items, aliases }) {
  const pokedexRaw = pokedex.BattlePokedex || {};
  const movesRaw = moves.BattleMovedex || moves.BattleMoves || movesRawFallback(moves);
  const abilitiesRaw = abilities.BattleAbilities || {};
  const itemsRaw = items.BattleItems || {};
  const aliasesRaw = aliases.BattleAliases || {};

  const speciesByName = new Map();
  const movesByName = new Map();
  const abilitiesByName = new Map();
  const itemsByName = new Map();
  const naturesByName = new Map([
    ['adamant', 'Adamant'], ['bashful', 'Bashful'], ['bold', 'Bold'], ['brave', 'Brave'], ['calm', 'Calm'], ['careful', 'Careful'],
    ['docile', 'Docile'], ['gentle', 'Gentle'], ['hardy', 'Hardy'], ['hasty', 'Hasty'], ['impish', 'Impish'], ['jolly', 'Jolly'],
    ['lax', 'Lax'], ['lonely', 'Lonely'], ['mild', 'Mild'], ['modest', 'Modest'], ['naive', 'Naive'], ['naughty', 'Naughty'],
    ['quiet', 'Quiet'], ['quirky', 'Quirky'], ['rash', 'Rash'], ['relaxed', 'Relaxed'], ['sassy', 'Sassy'], ['serious', 'Serious'], ['timid', 'Timid']
  ]);

  const findSpecies = (name) => {
    if (!name) return null;
    const key = normalizeLookup(name);
    return speciesByName.get(key) || speciesByName.get(aliasesRaw[key]) || null;
  };

  for (const [id, mon] of Object.entries(pokedexRaw)) {
    const name = mon.name || id;
    speciesByName.set(normalizeLookup(name), { id, name, ...mon });
    speciesByName.set(normalizeLookup(id), { id, name, ...mon });
  }
  for (const [id, move] of Object.entries(movesRaw)) {
    const name = move.name || id;
    movesByName.set(normalizeLookup(name), { id, name, ...move });
    movesByName.set(normalizeLookup(id), { id, name, ...move });
  }
  for (const [id, ability] of Object.entries(abilitiesRaw)) {
    const name = ability.name || id;
    abilitiesByName.set(normalizeLookup(name), { id, name, ...ability });
    abilitiesByName.set(normalizeLookup(id), { id, name, ...ability });
  }
  for (const [id, item] of Object.entries(itemsRaw)) {
    const name = item.name || id;
    itemsByName.set(normalizeLookup(name), { id, name, ...item });
    itemsByName.set(normalizeLookup(id), { id, name, ...item });
  }

  return { speciesByName, movesByName, abilitiesByName, itemsByName, aliases: aliasesRaw, naturesByName, findSpecies };
}

function movesRawFallback(moves) { return moves.BattleMovedex || moves; }

function normalizeLookup(value) {
  return String(value || '').toLowerCase().replace(/[^a-z0-9]+/g, '');
}

function clampInt(value, min, max) {
  const n = Number.parseInt(value, 10);
  if (Number.isNaN(n)) return min;
  return Math.max(min, Math.min(max, n));
}

async function fileToDataUrl(file) {
  return await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error || new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}

async function loadImage(dataUrl) {
  return await new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = dataUrl;
  });
}

async function cropImage(image, rect, index) {
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, Math.round(image.width * rect.w));
  canvas.height = Math.max(1, Math.round(image.height * rect.h));
  const ctx = canvas.getContext('2d');
  ctx.drawImage(
    image,
    Math.round(image.width * rect.x), Math.round(image.height * rect.y),
    Math.round(image.width * rect.w), Math.round(image.height * rect.h),
    0, 0, canvas.width, canvas.height
  );
  return canvas.toDataURL('image/png');
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
