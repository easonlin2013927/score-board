(() => {
  'use strict';

  const LEGACY_STORAGE_KEY = 'scoreboard.v1';
  const STORAGE_KEY = 'scoreboard.collection.v1';
  const MAX_SCORE = 999999999;
  const MAX_GROUPS = 100;
  const MAX_ROUNDS = 30;
  const MAX_BOARDS = 20;
  const MAX_HISTORY = 200;
  const DEFAULT_TIMER_SECONDS = 300;
  const i18n = window.SCOREBOARD_I18N;
  const t = i18n.t;
  const $ = (selector) => document.querySelector(selector);
  const groupsElement = $('#groups');
  const inputDialog = $('#input-dialog');
  const confirmDialog = $('#confirm-dialog');
  const inputForm = $('#input-form');
  const inputValue = $('#input-value');
  let toastTimer;
  let storageFailed = false;
  let pendingInput = null;
  let pendingConfirm = null;

  function newId() {
    return globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  }

  function initialBoard(title = t('initialTitle')) {
    return {
      version: 1,
      title,
      groups: [],
      round: 1,
      timer: { duration: DEFAULT_TIMER_SECONDS, remaining: DEFAULT_TIMER_SECONDS, endsAt: null },
      rules: { step: 1, allowNegative: true, tieMode: 'shared' },
      history: [],
      updatedAt: new Date().toISOString(),
    };
  }

  function cleanName(value) {
    return typeof value === 'string' ? value.trim() : '';
  }

  function parseBoard(value) {
    if (!value || typeof value !== 'object' || value.version !== 1 ||
        !Array.isArray(value.groups) || value.groups.length > MAX_GROUPS) {
      throw new Error(t('invalidFile'));
    }
    const title = cleanName(value.title);
    if (!title || title.length > 40) throw new Error(t('invalidBoardName'));
    const round = value.round ?? 1;
    if (!Number.isInteger(round) || round < 1 || round > MAX_ROUNDS) throw new Error(t('invalidFile'));
    const rawTimer = value.timer ?? { duration: DEFAULT_TIMER_SECONDS, remaining: DEFAULT_TIMER_SECONDS, endsAt: null };
    if (!rawTimer || typeof rawTimer !== 'object' || !Number.isInteger(rawTimer.duration) || rawTimer.duration < 60 || rawTimer.duration > 10800 ||
        !Number.isInteger(rawTimer.remaining) || rawTimer.remaining < 0 || rawTimer.remaining > rawTimer.duration ||
        (rawTimer.endsAt !== null && (!Number.isSafeInteger(rawTimer.endsAt) || rawTimer.endsAt < 0))) {
      throw new Error(t('invalidFile'));
    }
    const timer = { duration: rawTimer.duration, remaining: rawTimer.remaining, endsAt: rawTimer.endsAt };
    if (timer.endsAt !== null && timer.endsAt <= Date.now()) { timer.remaining = 0; timer.endsAt = null; }
    const groups = value.groups.map((group) => {
      const name = cleanName(group?.name);
      if (!name || name.length > 40 || !Number.isSafeInteger(group?.score) || Math.abs(group.score) > MAX_SCORE) {
        throw new Error(t('invalidGroup'));
      }
      const roundScores = group.roundScores ?? (round === 1 ? [group.score] : null);
      if (!Array.isArray(roundScores) || roundScores.length !== round ||
          !roundScores.every((score) => Number.isSafeInteger(score) && Math.abs(score) <= MAX_SCORE * MAX_ROUNDS) ||
          roundScores.reduce((sum, score) => sum + score, 0) !== group.score) {
        throw new Error(t('invalidGroup'));
      }
      return { id: newId(), name, score: group.score, roundScores: [...roundScores] };
    });
    const rawRules = value.rules ?? { step: 1, allowNegative: true, tieMode: 'shared' };
    if (!rawRules || !Number.isInteger(rawRules.step) || rawRules.step < 1 || rawRules.step > 100 ||
        typeof rawRules.allowNegative !== 'boolean' || !['shared', 'order'].includes(rawRules.tieMode)) {
      throw new Error(t('invalidFile'));
    }
    const rules = { step: rawRules.step, allowNegative: rawRules.allowNegative, tieMode: rawRules.tieMode };
    const rawHistory = value.history ?? [];
    if (!Array.isArray(rawHistory)) throw new Error(t('invalidFile'));
    const history = rawHistory.slice(-MAX_HISTORY).map((entry) => {
      if (!entry || !cleanName(entry.name) || cleanName(entry.name).length > 40 ||
          !Number.isInteger(entry.round) || entry.round < 1 || entry.round > MAX_ROUNDS ||
          !Number.isSafeInteger(entry.before) || Math.abs(entry.before) > MAX_SCORE ||
          !Number.isSafeInteger(entry.after) || Math.abs(entry.after) > MAX_SCORE ||
          !['adjust', 'set', 'reset'].includes(entry.action) ||
          typeof entry.at !== 'string' || !Number.isFinite(Date.parse(entry.at))) {
        throw new Error(t('invalidFile'));
      }
      return { at: entry.at, round: entry.round, name: cleanName(entry.name), before: entry.before, after: entry.after, action: entry.action };
    });
    return { version: 1, title, groups, round, timer, rules, history, updatedAt: new Date().toISOString() };
  }

  function emptyCollection(board = initialBoard()) {
    const id = newId();
    return { version: 1, activeId: id, boards: [{ id, board }] };
  }

  function loadCollection() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const data = JSON.parse(saved);
        if (data?.version !== 1 || !Array.isArray(data.boards) || data.boards.length < 1 || data.boards.length > MAX_BOARDS) throw new Error('Invalid collection');
        const seen = new Set();
        const boards = data.boards.map((entry) => {
          if (typeof entry?.id !== 'string' || !entry.id || entry.id.length > 100 || seen.has(entry.id)) throw new Error('Invalid board ID');
          seen.add(entry.id);
          return { id: entry.id, board: parseBoard(entry.board) };
        });
        return { version: 1, activeId: seen.has(data.activeId) ? data.activeId : boards[0].id, boards };
      }
      const legacy = localStorage.getItem(LEGACY_STORAGE_KEY);
      if (legacy) {
        const migrated = emptyCollection(parseBoard(JSON.parse(legacy)));
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(migrated));
          localStorage.removeItem(LEGACY_STORAGE_KEY);
        } catch { setTimeout(() => showToast(t('storageFailed')), 100); }
        return migrated;
      }
      return emptyCollection();
    } catch {
      setTimeout(() => showToast(t('loadFailed')), 100);
      return emptyCollection();
    }
  }

  let collection = loadCollection();
  let board = collection.boards.find((entry) => entry.id === collection.activeId).board;

  function showToast(message) {
    const toast = $('#toast');
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 3500);
  }

  function save(touch = true) {
    if (touch) board.updatedAt = new Date().toISOString();
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(collection));
      localStorage.removeItem(LEGACY_STORAGE_KEY);
      storageFailed = false;
      $('#save-status').textContent = t('saved');
    } catch {
      storageFailed = true;
      $('#save-status').textContent = t('saveFailed');
      showToast(t('storageFailed'));
    }
  }

  function sortedGroups() {
    return [...board.groups].sort((a, b) => b.score - a.score);
  }

  function rankFor(sorted, index) {
    if (board.rules.tieMode === 'order') return index + 1;
    return sorted.findIndex((group) => group.score === sorted[index].score) + 1;
  }

  function renderBoardControls() {
    const select = $('#board-select');
    select.replaceChildren();
    collection.boards.forEach((entry) => {
      const option = document.createElement('option');
      option.value = entry.id;
      option.textContent = entry.board.title;
      select.append(option);
    });
    select.value = collection.activeId;
    select.setAttribute('aria-label', t('switchBoard'));
    $('#create-board').disabled = collection.boards.length >= MAX_BOARDS;
    $('#duplicate-board').disabled = collection.boards.length >= MAX_BOARDS;
    $('#delete-board').disabled = collection.boards.length === 1;
  }

  function renderScoreHistory() {
    const list = $('#score-history');
    list.replaceChildren();
    $('#history-empty').hidden = board.history.length > 0;
    for (const entry of [...board.history].reverse()) {
      const item = document.createElement('li');
      const name = document.createElement('span');
      name.className = 'history-event';
      name.textContent = t(`history${entry.action[0].toUpperCase()}${entry.action.slice(1)}`, { name: entry.name });
      const time = document.createElement('time');
      time.className = 'history-time';
      time.dateTime = entry.at;
      time.textContent = new Date(entry.at).toLocaleString(i18n.language);
      const detail = document.createElement('span');
      detail.className = 'history-detail';
      detail.textContent = t('historyDetail', { round: entry.round, before: entry.before.toLocaleString(i18n.language), after: entry.after.toLocaleString(i18n.language), delta: `${entry.after - entry.before > 0 ? '+' : ''}${(entry.after - entry.before).toLocaleString(i18n.language)}` });
      item.append(name, time, detail);
      list.append(item);
    }
  }

  function recordScore(group, before, action) {
    if (before === group.score) return;
    board.history.push({ at: new Date().toISOString(), round: board.round, name: group.name, before, after: group.score, action });
    if (board.history.length > MAX_HISTORY) board.history.splice(0, board.history.length - MAX_HISTORY);
  }

  function render() {
    renderBoardControls();
    $('#score-step').value = board.rules.step;
    $('#allow-negative').checked = board.rules.allowNegative;
    $('#tie-mode').value = board.rules.tieMode;
    $('#board-title').textContent = board.title;
    $('#sidebar-title').textContent = board.title;
    document.title = `${board.title} · Scoreboard`;
    $('#group-count').textContent = board.groups.length;
    const sorted = sortedGroups();
    const highest = sorted[0]?.score ?? 0;
    const tied = sorted.filter((group) => group.score === highest);
    $('#highest-score').textContent = highest.toLocaleString(i18n.language);
    $('#leader-name').textContent = !sorted.length ? t('noGroups') : highest === 0 && tied.length === sorted.length ? t('noLeader') : board.rules.tieMode === 'shared' && tied.length > 1 ? t('tied', { count: tied.length }) : sorted[0].name;
    $('#group-summary').textContent = board.groups.length ? t(board.groups.length === 1 ? 'groupSummaryOne' : 'groupSummary', { count: board.groups.length }) : t('groupSummaryEmpty');
    $('#reset-scores').disabled = !board.groups.some((group) => group.score !== 0);
    $('#empty-state').hidden = board.groups.length > 0;
    $('#round-number').textContent = board.round;
    $('#next-round').disabled = board.round >= MAX_ROUNDS || board.groups.length === 0;
    $('#timer-minutes').value = board.timer.duration / 60;
    groupsElement.replaceChildren();

    sorted.forEach((group, index) => {
      const card = $('#group-template').content.firstElementChild.cloneNode(true);
      card.dataset.id = group.id;
      if (index === 0 && highest > 0 && (tied.length === 1 || board.rules.tieMode === 'order')) card.classList.add('is-leader');
      card.querySelector('.rank-badge').textContent = t('rank', { number: String(rankFor(sorted, index)).padStart(2, '0') });
      card.querySelector('.team-avatar').textContent = [...group.name][0]?.toUpperCase() ?? '?';
      card.querySelector('.group-name').textContent = group.name;
      const roundScore = document.createElement('p');
      roundScore.className = 'round-score';
      roundScore.textContent = t('currentRoundPoints', { score: group.roundScores[board.round - 1].toLocaleString(i18n.language) });
      card.querySelector('.card-main').after(roundScore);
      const scoreButton = card.querySelector('.score-value');
      scoreButton.textContent = group.score.toLocaleString(i18n.language);
      scoreButton.title = t('setScore');
      scoreButton.setAttribute('aria-label', t('scoreAria', { name: group.name, score: group.score }));
      card.querySelector('.minus').setAttribute('aria-label', t('minusStepAria', { name: group.name, step: board.rules.step }));
      card.querySelector('.plus').setAttribute('aria-label', t('plusStepAria', { name: group.name, step: board.rules.step }));
      card.querySelector('.minus span').textContent = t('minusStep', { step: board.rules.step });
      card.querySelector('.plus span').textContent = t('plusStep', { step: board.rules.step });
      card.querySelector('.minus').disabled = !board.rules.allowNegative && group.score - board.rules.step < 0;
      card.querySelector('.rename-group').title = t('renameGroup');
      card.querySelector('.delete-group').title = t('deleteGroup');
      card.querySelector('.rename-group').setAttribute('aria-label', t('renameAria', { name: group.name }));
      card.querySelector('.delete-group').setAttribute('aria-label', t('deleteAria', { name: group.name }));
      card.querySelectorAll('[data-i18n]').forEach((element) => { element.textContent = t(element.dataset.i18n); });
      groupsElement.append(card);
    });
    renderRoundHistory();
    renderScoreHistory();
    renderTimer();
    renderPresentation();
  }

  function renderRoundHistory() {
    const history = $('#round-history');
    history.replaceChildren();
    for (let round = board.round - 1; round >= 1; round--) {
      const details = document.createElement('details');
      const summary = document.createElement('summary');
      summary.textContent = t('roundFinished', { round });
      details.append(summary);
      const list = document.createElement('ul');
      [...board.groups].sort((a, b) => b.roundScores[round - 1] - a.roundScores[round - 1]).forEach((group) => {
        const item = document.createElement('li');
        const name = document.createElement('span');
        const score = document.createElement('span');
        name.textContent = group.name;
        score.textContent = group.roundScores[round - 1].toLocaleString(i18n.language);
        item.append(name, score);
        list.append(item);
      });
      details.append(list);
      history.append(details);
    }
  }

  function remainingSeconds() {
    return board.timer.endsAt === null ? board.timer.remaining : Math.max(0, Math.ceil((board.timer.endsAt - Date.now()) / 1000));
  }

  function formatTime(seconds) {
    return `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;
  }

  function renderTimer() {
    const remaining = remainingSeconds();
    const running = board.timer.endsAt !== null;
    $('#timer-display').textContent = formatTime(remaining);
    $('#presentation-timer').textContent = formatTime(remaining);
    $('#timer-display').classList.toggle('is-finished', remaining === 0);
    $('#presentation-timer').classList.toggle('is-finished', remaining === 0);
    $('#timer-toggle').textContent = t(running ? 'timerPause' : 'timerStart');
    $('#presentation-timer-toggle').textContent = t(running ? 'timerPause' : 'timerStart');
    $('#timer-toggle').disabled = remaining === 0 && !running;
    $('#presentation-timer-toggle').disabled = remaining === 0 && !running;
  }

  function renderPresentation() {
    const view = $('#presentation-view');
    if (view.hidden) return;
    $('#presentation-title').textContent = board.title;
    $('#presentation-round').textContent = t('roundSummary', { round: board.round });
    const container = $('#presentation-groups');
    container.replaceChildren();
    if (board.groups.length === 0) {
      const empty = document.createElement('p');
      empty.className = 'presentation-empty';
      empty.textContent = t('groupSummaryEmpty');
      container.append(empty);
      return;
    }
    const sorted = sortedGroups();
    sorted.forEach((group, index) => {
      const card = document.createElement('article');
      card.className = 'presentation-card';
      const rank = document.createElement('div');
      rank.className = 'presentation-rank';
      rank.textContent = t('rank', { number: String(rankFor(sorted, index)).padStart(2, '0') });
      const name = document.createElement('div');
      name.className = 'presentation-name';
      name.textContent = group.name;
      const score = document.createElement('div');
      score.className = 'presentation-score';
      score.textContent = group.score.toLocaleString(i18n.language);
      const roundScore = document.createElement('div');
      roundScore.className = 'presentation-round-score';
      roundScore.textContent = t('currentRoundPoints', { score: group.roundScores[board.round - 1].toLocaleString(i18n.language) });
      card.append(rank, name, score, roundScore);
      container.append(card);
    });
  }

  function toggleTimer() {
    if (board.timer.endsAt !== null) {
      board.timer.remaining = remainingSeconds();
      board.timer.endsAt = null;
    } else if (board.timer.remaining > 0) {
      board.timer.endsAt = Date.now() + board.timer.remaining * 1000;
    }
    save();
    renderTimer();
  }

  setInterval(() => {
    if (board.timer.endsAt === null) return;
    if (remainingSeconds() === 0) {
      board.timer.remaining = 0;
      board.timer.endsAt = null;
      save();
      showToast(t('timerFinished'));
    }
    renderTimer();
  }, 250);

  function askInput({ title, description, label, value = '', type = 'text', submit = t('saveButton'), validate }) {
    $('#input-title').textContent = title;
    $('#input-description').textContent = description;
    $('#input-label').textContent = label;
    $('#input-submit').textContent = submit;
    $('#input-error').textContent = '';
    inputValue.type = type;
    inputValue.maxLength = type === 'number' ? 12 : 40;
    inputValue.value = value;
    inputValue.placeholder = t(type === 'number' ? 'numberPlaceholder' : 'namePlaceholder');
    if (type === 'number') {
      inputValue.min = String(-MAX_SCORE);
      inputValue.max = String(MAX_SCORE);
      inputValue.step = '1';
    } else {
      inputValue.removeAttribute('min');
      inputValue.removeAttribute('max');
      inputValue.removeAttribute('step');
    }
    inputDialog.showModal();
    inputValue.focus();
    inputValue.select();
    return new Promise((resolve) => { pendingInput = { resolve, validate }; });
  }

  inputForm.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!pendingInput) return;
    const value = inputValue.value.trim();
    const error = pendingInput.validate(value);
    if (error) { $('#input-error').textContent = error; return; }
    const resolve = pendingInput.resolve;
    pendingInput = null;
    inputDialog.close();
    resolve(value);
  });
  inputDialog.addEventListener('close', () => {
    if (pendingInput) { pendingInput.resolve(null); pendingInput = null; }
  });
  inputDialog.querySelectorAll('[data-close]').forEach((button) => button.addEventListener('click', () => inputDialog.close()));

  function askConfirm(title, description, accept = t('confirm')) {
    $('#confirm-title').textContent = title;
    $('#confirm-description').textContent = description;
    $('#confirm-accept').textContent = accept;
    confirmDialog.showModal();
    return new Promise((resolve) => { pendingConfirm = resolve; });
  }
  $('#confirm-accept').addEventListener('click', () => {
    const resolve = pendingConfirm;
    pendingConfirm = null;
    confirmDialog.close();
    resolve?.(true);
  });
  confirmDialog.addEventListener('close', () => {
    if (pendingConfirm) { pendingConfirm(false); pendingConfirm = null; }
  });
  confirmDialog.querySelectorAll('[data-confirm-cancel]').forEach((button) => button.addEventListener('click', () => confirmDialog.close()));

  const validateName = (value) => !value ? t('nameRequired') : [...value].length > 40 ? t('nameTooLong') : '';
  const validateScore = (value) => !/^-?\d+$/.test(value) || !Number.isSafeInteger(Number(value)) || Math.abs(Number(value)) > MAX_SCORE || (!board.rules.allowNegative && Number(value) < 0) ? t('scoreInvalid', { min: board.rules.allowNegative ? -MAX_SCORE : 0, max: MAX_SCORE }) : '';

  $('#board-select').addEventListener('change', (event) => {
    const entry = collection.boards.find((item) => item.id === event.target.value);
    if (!entry) return;
    collection.activeId = entry.id;
    board = entry.board;
    save(false); render();
  });
  $('#create-board').addEventListener('click', () => {
    if (collection.boards.length >= MAX_BOARDS) { showToast(t('boardLimit', { max: MAX_BOARDS })); return; }
    const id = newId();
    board = initialBoard(t('newBoard'));
    collection.boards.push({ id, board });
    collection.activeId = id;
    save(); render(); showToast(t('boardCreated'));
  });
  $('#duplicate-board').addEventListener('click', () => {
    if (collection.boards.length >= MAX_BOARDS) { showToast(t('boardLimit', { max: MAX_BOARDS })); return; }
    const suffix = t('copySuffix');
    const copy = parseBoard({ ...board, title: `${board.title.slice(0, 40 - suffix.length)}${suffix}`, timer: { ...board.timer, remaining: remainingSeconds(), endsAt: null } });
    const id = newId();
    collection.boards.push({ id, board: copy });
    collection.activeId = id;
    board = copy;
    save(); render(); showToast(t('boardDuplicated'));
  });
  $('#delete-board').addEventListener('click', async () => {
    if (collection.boards.length < 2) return;
    if (!await askConfirm(t('deleteBoardTitle'), t('deleteBoardDescription', { name: board.title }), t('deleteBoard'))) return;
    collection.boards = collection.boards.filter((entry) => entry.id !== collection.activeId);
    collection.activeId = collection.boards[0].id;
    board = collection.boards[0].board;
    save(false); render(); showToast(t('boardDeleted'));
  });

  $('#score-step').addEventListener('change', (event) => {
    const step = Number(event.target.value);
    if (!Number.isInteger(step) || step < 1 || step > 100) {
      event.target.value = board.rules.step;
      showToast(t('stepInvalid'));
      return;
    }
    board.rules.step = step;
    save(); render();
  });
  $('#allow-negative').addEventListener('change', (event) => {
    board.rules.allowNegative = event.target.checked;
    save(); render();
  });
  $('#tie-mode').addEventListener('change', (event) => {
    if (!['shared', 'order'].includes(event.target.value)) return;
    board.rules.tieMode = event.target.value;
    save(); render();
  });

  async function renameBoard() {
    const name = await askInput({ title: t('renameBoard'), description: t('renameBoardDescription'), label: t('boardName'), value: board.title, validate: validateName });
    if (name === null || name === board.title) return;
    board.title = name;
    save(); render(); showToast(t('boardRenamed'));
  }

  function addGroup() {
    if (board.groups.length >= MAX_GROUPS) { showToast(t('groupLimit', { max: MAX_GROUPS })); return; }
    const name = t('newGroup');
    board.groups.push({ id: newId(), name, score: 0, roundScores: Array(board.round).fill(0) });
    save(); render(); showToast(t('groupAdded', { name }));
  }

  $('#rename-board').addEventListener('click', renameBoard);
  $('#rename-board-side').addEventListener('click', renameBoard);
  $('#add-group').addEventListener('click', addGroup);
  $('#add-group-empty').addEventListener('click', addGroup);

  groupsElement.addEventListener('click', async (event) => {
    const button = event.target.closest('button');
    const id = event.target.closest('.group-card')?.dataset.id;
    const group = board.groups.find((item) => item.id === id);
    if (!button || !group) return;

    if (button.classList.contains('plus') || button.classList.contains('minus')) {
      const next = group.score + (button.classList.contains('plus') ? board.rules.step : -board.rules.step);
      if (!board.rules.allowNegative && next < 0 && next < group.score) { showToast(t('negativeBlocked')); return; }
      if (Math.abs(next) > MAX_SCORE) { showToast(t('scoreLimit')); return; }
      const before = group.score;
      group.roundScores[board.round - 1] += next - group.score;
      group.score = next; recordScore(group, before, 'adjust'); save(); render(); return;
    }
    if (button.classList.contains('score-value')) {
      const value = await askInput({ title: t('setScoreTitle'), description: t('setScoreDescription', { name: group.name }), label: t('scoreLabel'), value: String(group.score), type: 'number', validate: validateScore });
      if (value === null) return;
      const before = group.score;
      group.roundScores[board.round - 1] += Number(value) - group.score;
      group.score = Number(value); recordScore(group, before, 'set'); save(); render(); showToast(t('scoreUpdated')); return;
    }
    if (button.classList.contains('rename-group')) {
      const name = await askInput({ title: t('renameGroup'), description: t('renameGroupDescription'), label: t('groupName'), value: group.name, validate: validateName });
      if (name === null || name === group.name) return;
      group.name = name; save(); render(); showToast(t('groupRenamed')); return;
    }
    if (button.classList.contains('delete-group')) {
      if (await askConfirm(t('deleteGroupTitle'), t('deleteGroupDescription', { name: group.name }), t('deleteGroup'))) {
        board.groups = board.groups.filter((item) => item.id !== id);
        save(); render(); showToast(t('groupDeleted'));
      }
    }
  });

  $('#reset-scores').addEventListener('click', async () => {
    if (await askConfirm(t('resetTitle'), t('resetDescription'), t('resetAll'))) {
      board.groups.forEach((group) => { const before = group.score; group.score = 0; group.roundScores.fill(0); recordScore(group, before, 'reset'); });
      save(); render(); showToast(t('scoresReset'));
    }
  });

  $('#clear-data').addEventListener('click', async () => {
    if (!await askConfirm(t('clearDataTitle'), t('clearDataDescription'), t('clearLocalData'))) return;
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(LEGACY_STORAGE_KEY);
      collection = emptyCollection();
      board = collection.boards[0].board;
      storageFailed = false;
      $('#save-status').textContent = t('saved');
      render();
      showToast(t('clearDataDone'));
    } catch {
      showToast(t('clearDataFailed'));
    }
  });

  $('#timer-toggle').addEventListener('click', toggleTimer);
  $('#presentation-timer-toggle').addEventListener('click', toggleTimer);
  $('#timer-reset').addEventListener('click', () => {
    board.timer.remaining = board.timer.duration;
    board.timer.endsAt = null;
    save(); renderTimer();
  });
  $('#timer-minutes').addEventListener('change', (event) => {
    const minutes = Number(event.target.value);
    if (!Number.isInteger(minutes) || minutes < 1 || minutes > 180) {
      event.target.value = board.timer.duration / 60;
      showToast(t('timerInvalid'));
      return;
    }
    board.timer.duration = minutes * 60;
    board.timer.remaining = board.timer.duration;
    board.timer.endsAt = null;
    save(); renderTimer();
  });
  $('#next-round').addEventListener('click', async () => {
    if (board.round >= MAX_ROUNDS) { showToast(t('roundLimit', { max: MAX_ROUNDS })); return; }
    if (board.groups.length === 0) return;
    if (board.groups.some((group) => group.roundScores[board.round - 1] !== 0) &&
        !await askConfirm(t('nextRoundTitle'), t('nextRoundDescription'), t('nextRound'))) return;
    board.round += 1;
    board.groups.forEach((group) => group.roundScores.push(0));
    board.timer.remaining = board.timer.duration;
    board.timer.endsAt = null;
    save(); render(); showToast(t('roundStarted', { round: board.round }));
  });

  const presentationView = $('#presentation-view');
  let presentationOpener = null;
  $('#open-presentation').addEventListener('click', async () => {
    presentationOpener = document.activeElement;
    presentationView.hidden = false;
    renderPresentation();
    renderTimer();
    $('.app-shell').inert = true;
    $('#close-presentation').focus();
    try { await presentationView.requestFullscreen?.(); } catch { /* Keep the full viewport overlay available. */ }
  });
  function closePresentation() {
    if (presentationView.hidden) return;
    if (document.fullscreenElement === presentationView) document.exitFullscreen?.().catch(() => {});
    presentationView.hidden = true;
    $('.app-shell').inert = false;
    presentationOpener?.focus();
    presentationOpener = null;
  }
  $('#close-presentation').addEventListener('click', closePresentation);
  document.addEventListener('fullscreenchange', () => {
    if (!document.fullscreenElement) closePresentation();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !presentationView.hidden) closePresentation();
  });

  $('#export-button').addEventListener('click', () => {
    const data = JSON.stringify(board, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `${board.title.replace(/[\\/:*?"<>|]/g, '-').slice(0, 40)}-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.append(anchor);
    anchor.click();
    anchor.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    showToast(t('exported'));
  });

  function fitText(context, value, maxWidth) {
    const letters = [...value];
    while (letters.length && context.measureText(letters.join('')).width > maxWidth) letters.pop();
    return letters.length === [...value].length ? value : `${letters.join('')}…`;
  }

  $('#export-image').addEventListener('click', async () => {
    const button = $('#export-image');
    button.disabled = true;
    try {
      const sorted = sortedGroups();
      const canvas = document.createElement('canvas');
      canvas.width = 1200;
      canvas.height = 330 + Math.max(sorted.length, 1) * 92 + 80;
      const context = canvas.getContext('2d');
      if (!context) throw new Error('Canvas unavailable');
      context.fillStyle = '#0b1411';
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.fillStyle = '#b8f56b';
      context.font = '800 24px sans-serif';
      context.fillText('SCOREBOARD', 74, 81);
      context.fillStyle = '#f0f7ed';
      context.font = '700 52px sans-serif';
      context.fillText(fitText(context, board.title, 1020), 74, 160);
      context.fillStyle = '#a5c5a7';
      context.font = '24px sans-serif';
      context.fillText(t('imageRound', { round: board.round }), 74, 215);
      context.fillText(t('imageDate', { date: new Date().toLocaleDateString(i18n.language) }), 74, 252);
      if (sorted.length === 0) {
        context.fillStyle = '#b8cbb8';
        context.font = '28px sans-serif';
        context.fillText(t('noGroups'), 74, 372);
      }
      sorted.forEach((group, index) => {
        const y = 290 + index * 92;
        context.fillStyle = index === 0 ? '#24442b' : '#19291e';
        context.fillRect(64, y, 1072, 76);
        context.fillStyle = '#a9db82';
        context.font = '700 24px sans-serif';
        context.fillText(String(rankFor(sorted, index)).padStart(2, '0'), 88, y + 49);
        context.fillStyle = '#eef7eb';
        context.font = '600 29px sans-serif';
        context.fillText(fitText(context, group.name, 680), 155, y + 49);
        context.textAlign = 'right';
        context.fillStyle = '#c5f595';
        context.font = '800 36px sans-serif';
        context.fillText(group.score.toLocaleString(i18n.language), 1100, y + 51);
        context.textAlign = 'left';
      });
      const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/png'));
      if (!blob) throw new Error('PNG unavailable');
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = `${board.title.replace(/[\\/:*?"<>|]/g, '-').slice(0, 40)}-${t('imageFilename')}-${new Date().toISOString().slice(0, 10)}.png`;
      document.body.append(anchor);
      anchor.click();
      anchor.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      showToast(t('imageExported'));
    } catch {
      showToast(t('imageFailed'));
    } finally {
      button.disabled = false;
    }
  });

  $('#import-button').addEventListener('click', () => $('#import-file').click());
  $('#import-file').addEventListener('change', async (event) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    if (file.size > 1024 * 1024) { showToast(t('fileTooLarge')); return; }
    let imported;
    try {
      imported = parseBoard(JSON.parse(await file.text()));
    } catch (error) {
      showToast(error instanceof SyntaxError ? t('jsonInvalid') : error.message);
      return;
    }
    if (await askConfirm(t('importTitle'), t('importDescription', { title: imported.title }), t('confirmImport'))) {
      collection.boards.find((entry) => entry.id === collection.activeId).board = imported;
      board = imported; save(); render(); showToast(t('imported'));
    }
  });

  $('#language-select').addEventListener('change', (event) => {
    i18n.setLanguage(event.target.value);
    clearTimeout(toastTimer);
    $('#toast').classList.remove('show');
    $('#save-status').textContent = t(storageFailed ? 'saveFailed' : 'saved');
    render();
  });

  i18n.applyLanguage();
  $('#save-status').textContent = t('saved');
  render();
})();
