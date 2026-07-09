const STORAGE_KEY = 'pcso_gemini_key';

function loadSavedKey() {
  try { return localStorage.getItem(STORAGE_KEY) || ''; } catch { return ''; }
}
function hasSavedKey() {
  try { return !!localStorage.getItem(STORAGE_KEY); } catch { return false; }
}
function setSavedKey(key) {
  if (key) { try { localStorage.setItem(STORAGE_KEY, key); } catch {} }
}
function removeSavedKey() {
  try { localStorage.removeItem(STORAGE_KEY); } catch {}
}

const MOVES_STORAGE_KEY = 'pcso_moves_data';
const STATS_STORAGE_KEY = 'pcso_stats_data';

function loadScreenshotData(kind) {
  try { return localStorage.getItem(kind === 'moves' ? MOVES_STORAGE_KEY : STATS_STORAGE_KEY) || ''; } catch { return ''; }
}
function saveScreenshotData(kind, dataUrl) {
  try { localStorage.setItem(kind === 'moves' ? MOVES_STORAGE_KEY : STATS_STORAGE_KEY, dataUrl); } catch {}
}
function clearScreenshotData(kind) {
  try { localStorage.removeItem(kind === 'moves' ? MOVES_STORAGE_KEY : STATS_STORAGE_KEY); } catch {}
}

const STAT_KEYS = ['hp', 'atk', 'def', 'spa', 'spd', 'spe'];
const STAT_NAMES = { hp: 'HP', atk: 'Atk', def: 'Def', spa: 'SpA', spd: 'SpD', spe: 'Spe' };
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

const FORM_ALIASES = new Map([
  ['wash rotom', 'Rotom-Wash'], ['rotom wash', 'Rotom-Wash'],
  ['heat rotom', 'Rotom-Heat'], ['rotom heat', 'Rotom-Heat'],
  ['frost rotom', 'Rotom-Frost'], ['rotom frost', 'Rotom-Frost'],
  ['fan rotom', 'Rotom-Fan'], ['rotom fan', 'Rotom-Fan'],
  ['mow rotom', 'Rotom-Mow'], ['rotom mow', 'Rotom-Mow'],
  ['midnight lycanroc', 'Lycanroc-Midnight'], ['lycanroc midnight', 'Lycanroc-Midnight'],
  ['dusk lycanroc', 'Lycanroc-Dusk'], ['lycanroc dusk', 'Lycanroc-Dusk'],
  ['maushold four', 'Maushold-Four'], ['maushold 4', 'Maushold-Four'], ['maushold 3', 'Maushold-Three'],
  ['maushold three', 'Maushold-Three'],
  ['basculin blue', 'Basculin-Blue-Striped'], ['basculin blue striped', 'Basculin-Blue-Striped'],
  ['basculin white', 'Basculin-White-Striped'], ['basculin white striped', 'Basculin-White-Striped'],
  ['meowstic female', 'Meowstic-F'], ['meowstic f', 'Meowstic-F'], ['meowstic fem', 'Meowstic-F'],
  ['meowstic male', 'Meowstic-M'], ['meowstic m', 'Meowstic-M'],
  ['indeedee female', 'Indeedee-F'], ['indeedee f', 'Indeedee-F'], ['indeedee fem', 'Indeedee-F'],
  ['indeedee male', 'Indeedee-M'], ['indeedee m', 'Indeedee-M'],
  ['floette eternal', 'Floette-Eternal'], ['eternal floette', 'Floette-Eternal'],
  ['polteageist antique', 'Polteageist-Antique'], ['antique polteageist', 'Polteageist-Antique'],
  ['polteageist authentic', 'Polteageist-Antique'],
  ['polteageist phony', 'Polteageist-Phony'],
  ['gourgeist small', 'Gourgeist-Small'], ['gourgeist average', 'Gourgeist-Average'],
  ['gourgeist large', 'Gourgeist-Large'], ['gourgeist super', 'Gourgeist-Super'],
  ['tauros paldea', 'Tauros-Paldea'], ['tauros combat', 'Tauros-Paldea-Combat'],
  ['tauros paldea combat', 'Tauros-Paldea-Combat'],
  ['tauros blaze', 'Tauros-Paldea-Blaze'], ['tauros paldea blaze', 'Tauros-Paldea-Blaze'],
  ['tauros aqua', 'Tauros-Paldea-Aqua'], ['tauros paldea aqua', 'Tauros-Paldea-Aqua'],
  ['alolan raichu', 'Raichu-Alola'], ['alola raichu', 'Raichu-Alola'], ['raichu alola', 'Raichu-Alola'],
  ['galarian articuno', 'Articuno-Galar'], ['galar articuno', 'Articuno-Galar'],
  ['galarian zapdos', 'Zapdos-Galar'], ['galar zapdos', 'Zapdos-Galar'],
  ['galarian moltres', 'Moltres-Galar'], ['galar moltres', 'Moltres-Galar'],
  ['galarian slowpoke', 'Slowpoke-Galar'], ['galar slowpoke', 'Slowpoke-Galar'],
  ['galarian slowbro', 'Slowbro-Galar'], ['galar slowbro', 'Slowbro-Galar'],
  ['galarian slowking', 'Slowking-Galar'], ['galar slowking', 'Slowking-Galar'],
  ['galarian farfetchd', 'Farfetchd-Galar'], ['galar farfetchd', 'Farfetchd-Galar'],
  ['galarian weezing', 'Weezing-Galar'], ['galar weezing', 'Weezing-Galar'],
  ['galarian mr mime', 'MrMime-Galar'], ['galar mr mime', 'MrMime-Galar'],
  ['galarian articuno', 'Articuno-Galar'], ['galar articuno', 'Articuno-Galar'],
  ['galarian corsola', 'Corsola-Galar'], ['galar corsola', 'Corsola-Galar'],
  ['galarian zigzagoon', 'Zigzagoon-Galar'], ['galar zigzagoon', 'Zigzagoon-Galar'],
  ['galarian linoone', 'Linoone-Galar'], ['galar linoone', 'Linoone-Galar'],
  ['galarian obstagoon', 'Obstagoon'], ['galar obstagoon', 'Obstagoon'],
  ['galarian darumaka', 'Darumaka-Galar'], ['galar darumaka', 'Darumaka-Galar'],
  ['galarian darmanitan', 'Darmanitan-Galar'], ['galar darmanitan', 'Darmanitan-Galar'],
  ['galarian yamask', 'Yamask-Galar'], ['galar yamask', 'Yamask-Galar'],
  ['galarian stunfisk', 'Stunfisk-Galar'], ['galar stunfisk', 'Stunfisk-Galar'],
  ['galarian ponyta', 'Ponyta-Galar'], ['galar ponyta', 'Ponyta-Galar'],
  ['galarian rapidash', 'Rapidash-Galar'], ['galar rapidash', 'Rapidash-Galar'],
  ['hisuian decidueye', 'Decidueye-Hisui'], ['hisui decidueye', 'Decidueye-Hisui'],
  ['hisuian typhlosion', 'Typhlosion-Hisui'], ['hisui typhlosion', 'Typhlosion-Hisui'],
  ['hisuian samurott', 'Samurott-Hisui'], ['hisui samurott', 'Samurott-Hisui'],
  ['hisuian electrode', 'Electrode-Hisui'], ['hisui electrode', 'Electrode-Hisui'],
  ['hisuian arcanine', 'Arcanine-Hisui'], ['hisui arcanine', 'Arcanine-Hisui'],
  ['hisuian zoroark', 'Zoroark-Hisui'], ['hisui zoroark', 'Zoroark-Hisui'],
  ['hisuian zorua', 'Zorua-Hisui'], ['hisui zorua', 'Zorua-Hisui'],
  ['hisuian sneasel', 'Sneasel-Hisui'], ['hisui sneasel', 'Sneasel-Hisui'],
  ['hisuian qwilfish', 'Qwilfish-Hisui'], ['hisui qwilfish', 'Qwilfish-Hisui'],
  ['hisuian samurott', 'Samurott-Hisui'], ['hisui samurott', 'Samurott-Hisui'],
  ['hisuian goodra', 'Goodra-Hisui'], ['hisui goodra', 'Goodra-Hisui'],
  ['hisuian avalugg', 'Avalugg-Hisui'], ['hisui avalugg', 'Avalugg-Hisui'],
  ['hisuian growlithe', 'Growlithe-Hisui'], ['hisui growlithe', 'Growlithe-Hisui'],
  ['hisuian braviary', 'Braviary-Hisui'], ['hisui braviary', 'Braviary-Hisui'],
  ['hisuian liligant', 'Lilligant-Hisui'], ['hisui liligant', 'Lilligant-Hisui'],
  ['hisuian basculin', 'Basculin-White-Striped'], ['hisui basculin', 'Basculin-White-Striped'],
]);

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
  geminiKey: loadSavedKey(),
  saveKey: hasSavedKey(),
  autoMega: false,
  fuzzyMatch: true,
  formLookup: false,
  customFormMatch: true,
  movesFile: null,
  statsFile: null,
  movesDataUrl: '',
  statsDataUrl: '',
  team: structuredClone(DEFAULT_TEAM),
  data: null,
};

const els = {};

init();

function init() {
  bindElements();
  wireEvents();
  renderTeamEditor();
  setExportText(formatExport(state.team));
  setWarnings([]);
  updateKeyBanner();
  restoreCachedScreenshots();
  loadShowdownData().then(() => {
    validateAndRender();
  }).catch(err => {
    setWarnings([{ kind: 'bad', text: `Failed to load validation data: ${err.message}` }]);
  });
}

function bindElements() {
  [
    'geminiKey', 'saveKey', 'autoMega', 'fuzzyMatch', 'formLookup', 'customFormMatch', 'movesFile', 'statsFile', 'movesPreview', 'statsPreview',
    'movesStatus', 'statsStatus', 'teamEditor', 'exportText', 'warningList', 'runOcr', 'clearAll', 'copyPaste', 'keyPanel', 'ocrStatus', 'keyBanner'
  ].forEach(id => { els[id] = document.getElementById(id); });
}

function wireEvents() {
  els.geminiKey.value = state.geminiKey;
  els.saveKey.checked = state.saveKey;
  els.autoMega.checked = state.autoMega;
  els.fuzzyMatch.checked = state.fuzzyMatch;
  els.formLookup.checked = state.formLookup;
  els.customFormMatch.checked = state.customFormMatch;

  els.saveKey.addEventListener('change', () => {
    state.saveKey = els.saveKey.checked;
    if (!state.saveKey) removeSavedKey();
  });
  els.geminiKey.addEventListener('input', () => {
    state.geminiKey = els.geminiKey.value;
    if (state.saveKey) setSavedKey(state.geminiKey.trim());
    updateKeyBanner();
  });
  for (const input of [els.geminiKey]) {
    input.addEventListener('copy', e => e.preventDefault());
    input.addEventListener('cut', e => e.preventDefault());
  }

  els.autoMega.addEventListener('change', () => {
    state.autoMega = els.autoMega.checked;
    validateAndRender();
  });
  els.fuzzyMatch.addEventListener('change', () => {
    state.fuzzyMatch = els.fuzzyMatch.checked;
  });
  els.formLookup.addEventListener('change', () => {
    state.formLookup = els.formLookup.checked;
  });
  els.customFormMatch.addEventListener('change', () => {
    state.customFormMatch = els.customFormMatch.checked;
  });

  document.querySelectorAll('[data-pick]').forEach(btn => {
    btn.addEventListener('click', () => {
      els[`${btn.dataset.pick}File`].click();
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

function updateKeyBanner() {
  const hasKey = state.geminiKey.trim().length > 0;
  if (els.keyBanner) els.keyBanner.style.display = hasKey ? 'none' : '';
}

function restoreCachedScreenshots() {
  for (const kind of ['moves', 'stats']) {
    const cached = loadScreenshotData(kind);
    if (cached) {
      state[`${kind}DataUrl`] = cached;
      els[`${kind}Preview`].src = cached;
      els[`${kind}Preview`].style.display = 'block';
      els[`${kind}Status`].textContent = 'Restored from previous session';
    }
  }
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
  const files = [...(e.clipboardData?.files || [])].filter(f => f.type.startsWith('image/'));
  const items = [...(e.clipboardData?.items || [])]
    .filter(item => item.type.startsWith('image/'))
    .map(item => item.getAsFile())
    .filter(Boolean);
  const images = [...files, ...items];
  if (!images.length) return;
  e.preventDefault();
  const kind = !state.movesDataUrl ? 'moves' : !state.statsDataUrl ? 'stats' : 'moves';
  handleFilePick(kind, images[0]);
}

function clearUpload(kind) {
  state[`${kind}File`] = null;
  state[`${kind}DataUrl`] = '';
  els[`${kind}File`].value = '';
  els[`${kind}Preview`].src = '';
  els[`${kind}Preview`].style.display = 'none';
  els[`${kind}Status`].textContent = 'Waiting for image';
  clearScreenshotData(kind);
  if (kind === 'moves') state.team = structuredClone(DEFAULT_TEAM);
  if (kind === 'stats') state.team = structuredClone(DEFAULT_TEAM);
  validateAndRender();
}

function resetAll() {
  clearUpload('moves');
  clearUpload('stats');
  state.team = structuredClone(DEFAULT_TEAM);
  renderTeamEditor();
  validateAndRender();
  clearScreenshotData('moves');
  clearScreenshotData('stats');
}

async function handleFilePick(kind, file) {
  if (!file || !file.type.startsWith('image/')) return;
  state[`${kind}File`] = file;
  const dataUrl = await fileToDataUrl(file);
  state[`${kind}DataUrl`] = dataUrl;
  els[`${kind}Preview`].src = dataUrl;
  els[`${kind}Preview`].style.display = 'block';
  els[`${kind}Status`].textContent = file.name;
  saveScreenshotData(kind, dataUrl);
}

async function runOcr() {
  if (!state.movesDataUrl || !state.statsDataUrl) {
    alert('Please add both screenshots first.');
    return;
  }
  if (!state.geminiKey.trim()) {
    els.ocrStatus.textContent = '';
    setWarnings([{ kind: 'bad', text: 'A Gemini API key is required. Open the "API Key" section at the bottom of the page and enter your key.' }]);
    return;
  }
  if (state.saveKey) setSavedKey(state.geminiKey.trim());
  els.runOcr.disabled = true;
  els.runOcr.textContent = 'Importing...';
  els.ocrStatus.innerHTML = '<span class="spinner"></span> Sending screenshots to Gemini...';
  try {
    const [movesTeam, statsTeam] = await Promise.all([
      extractTeamFromScreenshot('moves', state.movesDataUrl),
      extractTeamFromScreenshot('stats', state.statsDataUrl)
    ]);
    els.ocrStatus.innerHTML = '<span class="spinner"></span> Processing results...';
    mergeTeams(movesTeam, statsTeam);
    if (state.data && state.fuzzyMatch) correctTeamNames(state.team, state.data);
    if (state.data && state.customFormMatch) applyCustomFormRules(state.team);
    renderTeamEditor();
    validateAndRender();
    els.ocrStatus.textContent = 'Done. Review and copy the paste below.';
  } catch (err) {
    els.ocrStatus.textContent = '';
    setWarnings([{ kind: 'bad', text: err.message || 'OCR failed.' }]);
  } finally {
    els.runOcr.disabled = false;
    els.runOcr.textContent = 'Import screenshots';
    if (els.ocrStatus.textContent.startsWith('Sending') || els.ocrStatus.textContent.startsWith('Processing')) {
      els.ocrStatus.textContent = 'Import failed.';
    }
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
        <span class="hint">Imported Pokemon</span>
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
    mon.statPoints[field.split('.')[1]] = clampInt(value, 0, 32);
  } else if (field.startsWith('move.')) {
    mon.moves[Number(field.split('.')[1])] = value;
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
  const mimeType = dataUrl.match(/^data:(.*?);base64,/i)?.[1] || 'image/png';
  const base64 = dataUrl.split(',')[1];
  const prompt = kind === 'stats'
    ? `You are analyzing a Pokemon Champions "Stats" screen. It shows 6 Pokemon cards arranged in a grid (2 columns, 3 rows). Read left-to-right, top-to-bottom. Return a JSON object with a "team" array of exactly 6 objects. Each object MUST have the following fields. Do not skip any field. If a value is not visible use null.

- species (string): official species name. If the SPRITE ICON next to the name shows a special form, INCLUDE the form suffix (e.g. Rotom-Wash, Lycanroc-Midnight, Maushold-Four, Basculin-Blue-Striped, Meowstic-F, Floette-Eternal). If it's the base form, just the name.
- item (string): the held item name
- ability (string): the ability name
- level (number): the numeric level
- statPoints (object): { hp, atk, def, spa, spd, spe } — the small allocated stat point numbers (0-32 each, shown on the right side of each stat row). NOT the large base stat numbers.
- nature (string|null): the Pokemon's NATURE name directly (e.g. "Brave", "Quiet", "Adamant"). Look at the stat layout — one stat row has a RED UP ARROW at the far right end of its row, another has a BLUE DOWN ARROW. You know Pokemon natures; name which nature matches the boost/lower pattern.
- natureUp (string|null): ONLY if nature is uncertain — the stat name that has the RED UP ARROW (the arrow is at the END of that stat's row)
- natureDown (string|null): ONLY if nature is uncertain — the stat name that has the BLUE DOWN ARROW (the arrow is at the END of that stat's row)

Use exact English names as shown.`
    : `You are analyzing a Pokemon Champions "Moves & More" screen. It shows 6 Pokemon cards arranged in a grid (2 columns, 3 rows). Read left-to-right, top-to-bottom. Return a JSON object with a "team" array of exactly 6 objects. Each object MUST have the following fields. Do not skip any field.

- species (string): official species name. If the SPRITE ICON next to the name shows a special form, INCLUDE the form suffix (e.g. Rotom-Wash, Lycanroc-Midnight, Maushold-Four, Basculin-Blue-Striped). If base form, just the name.
- item (string): the held item name — shown on the card
- ability (string): the ability name — shown on the card
- moves (array of 4 strings): exactly 4 move names in order

Use exact English names as shown.`;

  const body = {
    contents: [{ role: 'user', parts: [{ inlineData: { mimeType, data: base64 } }, { text: prompt }] }],
    generationConfig: {
      temperature: 0.1,
      maxOutputTokens: 4096,
      responseMimeType: 'application/json'
    }
  };
  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${encodeURIComponent(state.geminiKey.trim())}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  if (!res.ok) {
    let detail = '';
    try { const err = await res.json(); detail = err.error?.message || ''; } catch {}
    throw new Error(`Gemini request failed (${res.status}${detail ? ': ' + detail : ''})`);
  }
  const json = await res.json();
  const text = json.candidates?.[0]?.content?.parts?.map(p => p.text || '').join('') || '';
  if (!text) throw new Error('Gemini returned an empty response.');
  const cleaned = text.replace(/```json/gi, '').replace(/```/g, '').trim();
  const start = cleaned.indexOf('{');
  const end = cleaned.lastIndexOf('}');
  const parsed = JSON.parse(start >= 0 && end >= start ? cleaned.slice(start, end + 1) : cleaned);
  const team = parsed.team || [];
  if (!Array.isArray(team) || team.length === 0) throw new Error(`Gemini returned no team data for ${kind} screen.`);
  return kind === 'stats' ? normalizeStatsTeam(team) : normalizeMovesTeam(team);
}

function normalizeStatsTeam(team) {
  return team.slice(0, 6).map((entry, i) => {
    const sp = entry.statPoints || {};
    return {
      slot: i + 1,
      species: entry.species || '',
      item: entry.item || '',
      ability: entry.ability || '',
      level: clampInt(entry.level ?? 50, 1, 100),
      statPoints: {
        hp: clampInt(sp.hp ?? 0, 0, 32),
        atk: clampInt(sp.atk ?? 0, 0, 32),
        def: clampInt(sp.def ?? 0, 0, 32),
        spa: clampInt(sp.spa ?? 0, 0, 32),
        spd: clampInt(sp.spd ?? 0, 0, 32),
        spe: clampInt(sp.spe ?? 0, 0, 32),
      },
      nature: entry.nature || natureFromBoostDrop(entry.natureUp, entry.natureDown),
      moves: ['', '', '', '']
    };
  });
}

function normalizeMovesTeam(team) {
  return team.slice(0, 6).map((entry, i) => ({
    slot: i + 1,
    species: entry.species || '',
    moves: (entry.moves || []).slice(0, 4).map(v => String(v || '').trim()).concat(['', '', '', '']).slice(0, 4),
    item: entry.item || '',
    ability: entry.ability || '',
    level: 50,
    statPoints: { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 },
    nature: ''
  }));
}

function natureFromBoostDrop(up, down) {
  const key = `${normalizeNatureStat(up)}:${normalizeNatureStat(down)}`;
  return NATURE_MAP.get(key) || '';
}

function normalizeNatureStat(stat) {
  const v = normalizeLookup(stat).replace(/\./g, '');
  return NATURE_STAT_ALIASES[v] || v;
}

function levenshteinDistance(a, b) {
  if (a.length < b.length) [a, b] = [b, a];
  if (b.length === 0) return a.length;
  const row = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    let prev = i;
    for (let j = 1; j <= b.length; j++) {
      const cur = a[i - 1] === b[j - 1] ? row[j - 1] : 1 + Math.min(row[j - 1], prev, row[j]);
      row[j - 1] = prev;
      prev = cur;
    }
    row[b.length] = prev;
  }
  return row[b.length];
}

function fuzzyMatchName(raw, dataMap, threshold = 2) {
  if (!raw) return '';
  const normalized = normalizeLookup(raw);
  if (dataMap.has(normalized)) return dataMap.get(normalized).name;
  let best = '', bestDist = Infinity;
  for (const [key, entry] of dataMap) {
    const dist = levenshteinDistance(normalized, key);
    if (dist < bestDist) { bestDist = dist; best = entry.name; }
  }
  if (bestDist > 0 && bestDist <= threshold) return best;
  return '';
}

function correctTeamNames(team, data) {
  for (const mon of team) {
    if (mon.species) {
      let fixed = fuzzyMatchName(mon.species, data.speciesByName, 3);
      if (!fixed) {
        const normalized = normalizeLookup(mon.species);
        for (const [alias, form] of FORM_ALIASES) {
          if (normalized.includes(alias) || levenshteinDistance(normalized, alias) <= 2) {
            fixed = form;
            break;
          }
        }
      }
      if (fixed) mon.species = fixed;
    }
    if (mon.item) {
      const fixed = fuzzyMatchName(mon.item, data.itemsByName, 3);
      if (fixed) mon.item = fixed;
    }
    if (mon.ability) {
      const fixed = fuzzyMatchName(mon.ability, data.abilitiesByName, 3);
      if (fixed) mon.ability = fixed;
    }
    if (mon.nature) {
      const raw = normalizeLookup(mon.nature.replace(/\s+nature$/i, ''));
      let bestName = '', bestDist = Infinity;
      for (const [key, entry] of data.naturesByName) {
        const dist = levenshteinDistance(raw, key);
        if (dist < bestDist) { bestDist = dist; bestName = entry; }
      }
      if (bestDist <= 2) mon.nature = bestName;
    }
    mon.moves = (mon.moves || []).map(m => {
      if (!m) return m;
      const fixed = fuzzyMatchName(m, data.movesByName, 3);
      return fixed || m;
    });
  }
}

const FORM_RULES = [
  { species: 'Rotom', moves: ['Hydro Pump'], result: 'Rotom-Wash' },
  { species: 'Rotom', moves: ['Air Slash'], result: 'Rotom-Fan' },
  { species: 'Rotom', moves: ['Overheat'], result: 'Rotom-Heat' },
  { species: 'Rotom', moves: ['Blizzard'], result: 'Rotom-Frost' },
  { species: 'Rotom', moves: ['Leaf Storm'], result: 'Rotom-Mow' },
  { species: 'Samurott', ability: 'Sharpness', result: 'Samurott-Hisui' },
  { species: 'Samurott', moves: ['Ceaseless Edge', 'Dark Pulse', 'Lash Out', 'Snarl', 'Sucker Punch', 'Throat Chop'], result: 'Samurott-Hisui' },
  { species: 'Arcanine', ability: 'Rock Head', result: 'Arcanine-Hisui' },
  { species: 'Arcanine', moves: ['Head Smash', 'Power Gem', 'Rock Blast', 'Rock Slide', 'Rock Tomb', 'Sandstorm', 'Smack Down', 'Smart Strike', 'Stealth Rock', 'Stone Edge'], result: 'Arcanine-Hisui' },
  { species: 'Avalugg', ability: 'Strong Jaw', result: 'Avalugg-Hisui' },
  { species: 'Avalugg', moves: ['Ancient Power', 'Dig', 'Hard Press', 'Meteor Beam', 'Mountain Gale', 'Rock Blast', 'Sandstorm', 'Stealth Rock'], result: 'Avalugg-Hisui' },
  { species: 'Decidueye', ability: 'Scrappy', result: 'Decidueye-Hisui' },
  { species: 'Decidueye', moves: ['Aura Sphere', 'Brick Break', 'Bulk Up', 'Close Combat', 'Focus Blast', 'Focus Punch', 'Reversal', 'Rock Tomb', 'Scary Face', 'Taunt', 'Triple Arrows', 'Upper Hand'], result: 'Decidueye-Hisui' },
  { species: 'Goodra', ability: 'Shell Armor', result: 'Goodra-Hisui' },
  { species: 'Goodra', moves: ['Ancient Power', 'Flash Cannon', 'Gyro Ball', 'Heavy Slam', 'Ice Spinner', 'Iron Head', 'Lash Out', 'Rock Tomb', 'Sandstorm', 'Scary Face', 'Steel Beam'], result: 'Goodra-Hisui' },
  { species: 'Typhlosion', ability: 'Frisk', result: 'Typhlosion-Hisui' },
  { species: 'Typhlosion', moves: ['Calm Mind', 'Confuse Ray', 'Hex', 'Infernal Parade', 'Mystical Fire', 'Night Shade', 'Poltergeist', 'Spite'], result: 'Typhlosion-Hisui' },
  { species: 'Zoroark', moves: ['Bitter Malice', 'Comeuppance', 'Curse', 'Focus Punch', 'Icy Wind', 'Phantom Force', 'Poltergeist', 'Shadow Sneak', 'Snowscape', 'Will-O-Wisp'], result: 'Zoroark-Hisui' },
  { species: 'Slowbro', ability: 'Quick Draw', result: 'Slowbro-Galar' },
  { species: 'Slowbro', moves: ['Acid Spray', 'Double-Edge', 'Gunk Shot', 'Haze', 'Ice Fang', 'Poison Jab', 'Power Gem', 'Rock Blast', 'Sandstorm', 'Scary Face', 'Shell Side Arm', 'Sludge Bomb', 'Sludge Wave', 'Smack Down', 'Toxic', 'Toxic Spikes', 'Venoshock'], result: 'Slowbro-Galar' },
  { species: 'Slowking', ability: 'Curious Medicine', result: 'Slowking-Galar' },
  { species: 'Slowking', moves: ['Acid Spray', 'Eerie Spell', 'Gunk Shot', 'Hex', 'Low Sweep', 'Poison Jab', 'Scary Face', 'Sludge Bomb', 'Sludge Wave', 'Snarl', 'Stomping Tantrum', 'Taunt', 'Toxic', 'Toxic Spikes', 'Venoshock'], result: 'Slowking-Galar' },
  { species: 'Stunfisk', ability: 'Mimicry', result: 'Stunfisk-Galar' },
  { species: 'Stunfisk', moves: ['Bind', 'Counter', 'Crunch', 'Flash Cannon', 'Ice Fang', 'Iron Defense', 'Metal Sound', 'Screech', 'Snap Trap', 'Steel Beam', 'Terrain Pulse'], result: 'Stunfisk-Galar' },
  { species: 'Floette', result: 'Floette-Eternal' },
  { species: 'Ninetales', ability: 'Snow Cloak', result: 'Ninetales-Alola' },
  { species: 'Ninetales', ability: 'Snow Warning', result: 'Ninetales-Alola' },
  { species: 'Raichu', ability: 'Surge Surfer', result: 'Raichu-Alola' },
  { species: 'Meowstic', ability: 'Competitive', result: 'Meowstic-F' },
  { species: 'Meowstic', moves: ['Extrasensory', 'Future Sight'], result: 'Meowstic-F' },
  { species: 'Lycanroc', ability: 'Tough Claws', result: 'Lycanroc-Dusk' },
  { species: 'Lycanroc', moves: ['Crush Claw', 'Focus Energy', 'Outrage'], result: 'Lycanroc-Dusk' },
  { species: 'Lycanroc', ability: 'Vital Spirit', result: 'Lycanroc-Midnight' },
  { species: 'Lycanroc', ability: 'No Guard', result: 'Lycanroc-Midnight' },
  { species: 'Lycanroc', moves: ['Fire Punch', 'Fling', 'Focus Punch', 'Foul Play', 'Knock Off', 'Lash Out', 'Low Sweep', 'Payback', 'Shadow Claw', 'Thunder Punch', 'Upper Hand', 'Uproar'], result: 'Lycanroc-Midnight' },
  { species: 'Tauros', moves: ['Aqua Jet', 'Chilling Water', 'Drill Run', 'Hydro Pump', 'Liquidation', 'Water Pulse', 'Wave Crash'], result: 'Tauros-Paldea-Aqua' },
  { species: 'Tauros', moves: ['Fire Spin', 'Flame Charge', 'Flare Blitz', 'Overheat', 'Temper Flare', 'Will-O-Wisp'], result: 'Tauros-Paldea-Blaze' },
];

function applyCustomFormRules(team) {
  for (const mon of team) {
    const base = normalizeLookup(mon.species);
    const movesLower = (mon.moves || []).map(m => normalizeLookup(m));
    const abilityLower = normalizeLookup(mon.ability);

    for (const rule of FORM_RULES) {
      const ruleBase = normalizeLookup(rule.species);
      if (base !== ruleBase) continue;
      if (mon.species.includes('-')) continue;

      let abilityMatch = false;
      if (rule.ability) {
        const ruleAbilities = Array.isArray(rule.ability) ? rule.ability : [rule.ability];
        abilityMatch = ruleAbilities.some(a => normalizeLookup(a) === abilityLower);
      }

      let moveMatch = false;
      if (rule.moves) {
        moveMatch = rule.moves.some(m => movesLower.includes(normalizeLookup(m)));
      }

      const abilityNeeded = !!rule.ability;
      const movesNeeded = !!rule.moves;

      if ((!abilityNeeded || abilityMatch) && (!movesNeeded || moveMatch)) {
        mon.species = rule.result;
        break;
      }
    }
  }
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

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
