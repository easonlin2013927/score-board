(() => {
  'use strict';

  const STORAGE_KEY = 'scoreboard.v1';
  const MAX_SCORE = 999999999;
  const MAX_GROUPS = 100;
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

  function initialBoard() {
    return {
      version: 1,
      title: t('initialTitle'),
      groups: [],
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
    const groups = value.groups.map((group) => {
      const name = cleanName(group?.name);
      if (!name || name.length > 40 || !Number.isSafeInteger(group?.score) || Math.abs(group.score) > MAX_SCORE) {
        throw new Error(t('invalidGroup'));
      }
      return { id: newId(), name, score: group.score };
    });
    return { version: 1, title, groups, updatedAt: new Date().toISOString() };
  }

  function loadBoard() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? parseBoard(JSON.parse(saved)) : initialBoard();
    } catch {
      setTimeout(() => showToast(t('loadFailed')), 100);
      return initialBoard();
    }
  }

  let board = loadBoard();

  function showToast(message) {
    const toast = $('#toast');
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 3500);
  }

  function save() {
    board.updatedAt = new Date().toISOString();
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(board));
      storageFailed = false;
      $('#save-status').textContent = t('saved');
    } catch {
      storageFailed = true;
      $('#save-status').textContent = t('saveFailed');
      showToast(t('storageFailed'));
    }
  }

  function render() {
    $('#board-title').textContent = board.title;
    $('#sidebar-title').textContent = board.title;
    document.title = `${board.title} · Scoreboard`;
    $('#group-count').textContent = board.groups.length;
    const sorted = [...board.groups].sort((a, b) => b.score - a.score);
    const highest = sorted[0]?.score ?? 0;
    const tied = sorted.filter((group) => group.score === highest);
    $('#highest-score').textContent = highest.toLocaleString(i18n.language);
    $('#leader-name').textContent = !sorted.length ? t('noGroups') : highest === 0 && tied.length === sorted.length ? t('noLeader') : tied.length > 1 ? t('tied', { count: tied.length }) : tied[0].name;
    $('#group-summary').textContent = board.groups.length ? t('groupSummary', { count: board.groups.length }) : t('groupSummaryEmpty');
    $('#reset-scores').disabled = !board.groups.some((group) => group.score !== 0);
    $('#empty-state').hidden = board.groups.length > 0;
    groupsElement.replaceChildren();

    sorted.forEach((group, index) => {
      const card = $('#group-template').content.firstElementChild.cloneNode(true);
      card.dataset.id = group.id;
      if (index === 0 && highest > 0 && tied.length === 1) card.classList.add('is-leader');
      card.querySelector('.rank-badge').textContent = t('rank', { number: String(index + 1).padStart(2, '0') });
      card.querySelector('.team-avatar').textContent = [...group.name][0]?.toUpperCase() ?? '?';
      card.querySelector('.group-name').textContent = group.name;
      const scoreButton = card.querySelector('.score-value');
      scoreButton.textContent = group.score.toLocaleString(i18n.language);
      scoreButton.title = t('setScore');
      scoreButton.setAttribute('aria-label', t('scoreAria', { name: group.name, score: group.score }));
      card.querySelector('.minus').setAttribute('aria-label', t('minusAria', { name: group.name }));
      card.querySelector('.plus').setAttribute('aria-label', t('plusAria', { name: group.name }));
      card.querySelector('.rename-group').title = t('renameGroup');
      card.querySelector('.delete-group').title = t('deleteGroup');
      card.querySelector('.rename-group').setAttribute('aria-label', t('renameAria', { name: group.name }));
      card.querySelector('.delete-group').setAttribute('aria-label', t('deleteAria', { name: group.name }));
      card.querySelectorAll('[data-i18n]').forEach((element) => { element.textContent = t(element.dataset.i18n); });
      groupsElement.append(card);
    });
  }

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
  const validateScore = (value) => !/^-?\d+$/.test(value) || !Number.isSafeInteger(Number(value)) || Math.abs(Number(value)) > MAX_SCORE ? t('scoreInvalid', { min: -MAX_SCORE, max: MAX_SCORE }) : '';

  async function renameBoard() {
    const name = await askInput({ title: t('renameBoard'), description: t('renameBoardDescription'), label: t('boardName'), value: board.title, validate: validateName });
    if (name === null || name === board.title) return;
    board.title = name;
    save(); render(); showToast(t('boardRenamed'));
  }

  function addGroup() {
    if (board.groups.length >= MAX_GROUPS) { showToast(t('groupLimit', { max: MAX_GROUPS })); return; }
    const name = t('newGroup');
    board.groups.push({ id: newId(), name, score: 0 });
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
      const next = group.score + (button.classList.contains('plus') ? 1 : -1);
      if (Math.abs(next) > MAX_SCORE) { showToast(t('scoreLimit')); return; }
      group.score = next; save(); render(); return;
    }
    if (button.classList.contains('score-value')) {
      const value = await askInput({ title: t('setScoreTitle'), description: t('setScoreDescription', { name: group.name }), label: t('scoreLabel'), value: String(group.score), type: 'number', validate: validateScore });
      if (value === null) return;
      group.score = Number(value); save(); render(); showToast(t('scoreUpdated')); return;
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
      board.groups.forEach((group) => { group.score = 0; });
      save(); render(); showToast(t('scoresReset'));
    }
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
      board = imported; save(); render(); showToast(t('imported'));
    }
  });

  $('#language-select').addEventListener('change', (event) => {
    i18n.setLanguage(event.target.value);
    $('#save-status').textContent = t(storageFailed ? 'saveFailed' : 'saved');
    render();
  });

  i18n.applyLanguage();
  render();
})();
