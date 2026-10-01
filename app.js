(() => {
  'use strict';

  const STORAGE_KEY = 'scoreboard.v1';
  const MAX_SCORE = 999999999;
  const MAX_GROUPS = 100;
  const $ = (selector) => document.querySelector(selector);
  const groupsElement = $('#groups');
  const inputDialog = $('#input-dialog');
  const confirmDialog = $('#confirm-dialog');
  const inputForm = $('#input-form');
  const inputValue = $('#input-value');
  let toastTimer;
  let pendingInput = null;
  let pendingConfirm = null;

  function newId() {
    return globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  }

  function initialBoard() {
    return {
      version: 1,
      title: '活動記分板',
      groups: ['綠光隊', '森林隊', '青葉隊'].map((name) => ({ id: newId(), name, score: 0 })),
      updatedAt: new Date().toISOString(),
    };
  }

  function cleanName(value) {
    return typeof value === 'string' ? value.trim() : '';
  }

  function parseBoard(value) {
    if (!value || typeof value !== 'object' || value.version !== 1 ||
        !Array.isArray(value.groups) || value.groups.length > MAX_GROUPS) {
      throw new Error('檔案格式不正確，請選擇由此記分板匯出的 JSON 檔。');
    }
    const title = cleanName(value.title);
    if (!title || title.length > 40) throw new Error('記分板名稱不符合格式。');
    const groups = value.groups.map((group) => {
      const name = cleanName(group?.name);
      if (!name || name.length > 40 || !Number.isSafeInteger(group.score) || Math.abs(group.score) > MAX_SCORE) {
        throw new Error('組別名稱或分數不符合格式。');
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
      setTimeout(() => showToast('無法讀取先前資料，已載入新的記分板。'), 100);
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
      $('#save-status').textContent = '已自動儲存';
    } catch {
      $('#save-status').textContent = '無法自動儲存，請匯出備份';
      showToast('瀏覽器無法儲存資料，建議立即匯出備份。');
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
    $('#highest-score').textContent = highest.toLocaleString('zh-TW');
    $('#leader-name').textContent = !sorted.length ? '尚無組別' : highest === 0 && tied.length === sorted.length ? '尚未產生' : tied.length > 1 ? `${tied.length} 組並列` : tied[0].name;
    $('#group-summary').textContent = board.groups.length ? `共 ${board.groups.length} 個組別，依分數排序` : '新增組別，開始記錄分數';
    $('#reset-scores').disabled = !board.groups.some((group) => group.score !== 0);
    $('#empty-state').hidden = board.groups.length > 0;
    groupsElement.replaceChildren();

    sorted.forEach((group, index) => {
      const card = $('#group-template').content.firstElementChild.cloneNode(true);
      card.dataset.id = group.id;
      if (index === 0 && highest > 0 && tied.length === 1) card.classList.add('is-leader');
      card.querySelector('.rank-badge').textContent = `RANK ${String(index + 1).padStart(2, '0')}`;
      card.querySelector('.team-avatar').textContent = [...group.name][0]?.toUpperCase() ?? '?';
      card.querySelector('.group-name').textContent = group.name;
      const scoreButton = card.querySelector('.score-value');
      scoreButton.textContent = group.score.toLocaleString('zh-TW');
      scoreButton.setAttribute('aria-label', `設定 ${group.name} 的分數，目前 ${group.score} 分`);
      card.querySelector('.minus').setAttribute('aria-label', `${group.name} 減一分`);
      card.querySelector('.plus').setAttribute('aria-label', `${group.name} 加一分`);
      card.querySelector('.rename-group').setAttribute('aria-label', `修改 ${group.name} 的名稱`);
      card.querySelector('.delete-group').setAttribute('aria-label', `刪除 ${group.name}`);
      groupsElement.append(card);
    });
  }

  function askInput({ title, description, label, value = '', type = 'text', submit = '儲存', validate }) {
    $('#input-title').textContent = title;
    $('#input-description').textContent = description;
    $('#input-label').textContent = label;
    $('#input-submit').textContent = submit;
    $('#input-error').textContent = '';
    inputValue.type = type;
    inputValue.maxLength = type === 'number' ? 12 : 40;
    inputValue.value = value;
    inputValue.placeholder = type === 'number' ? '輸入整數分數' : '輸入名稱';
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

  function askConfirm(title, description, accept = '確認') {
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

  const validateName = (value) => !value ? '請輸入名稱。' : [...value].length > 40 ? '名稱最多 40 個字。' : '';
  const validateScore = (value) => !/^-?\d+$/.test(value) || !Number.isSafeInteger(Number(value)) || Math.abs(Number(value)) > MAX_SCORE ? `請輸入 ${-MAX_SCORE} 到 ${MAX_SCORE} 之間的整數。` : '';

  async function renameBoard() {
    const name = await askInput({ title: '修改記分板名稱', description: '取一個能代表這場活動的名稱。', label: '記分板名稱', value: board.title, validate: validateName });
    if (name === null || name === board.title) return;
    board.title = name;
    save(); render(); showToast('記分板名稱已更新');
  }

  function addGroup() {
    if (board.groups.length >= MAX_GROUPS) { showToast(`最多只能建立 ${MAX_GROUPS} 個組別。`); return; }
    board.groups.push({ id: newId(), name: '新的組別', score: 0 });
    save(); render(); showToast('已新增「新的組別」，可點鉛筆修改名稱');
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
      if (Math.abs(next) > MAX_SCORE) { showToast('已達分數上限。'); return; }
      group.score = next; save(); render(); return;
    }
    if (button.classList.contains('score-value')) {
      const value = await askInput({ title: '設定分數', description: `直接修改「${group.name}」的分數。`, label: '分數', value: String(group.score), type: 'number', validate: validateScore });
      if (value === null) return;
      group.score = Number(value); save(); render(); showToast('分數已更新'); return;
    }
    if (button.classList.contains('rename-group')) {
      const name = await askInput({ title: '修改組別名稱', description: '更新這個組別的顯示名稱。', label: '組別名稱', value: group.name, validate: validateName });
      if (name === null || name === group.name) return;
      group.name = name; save(); render(); showToast('組別名稱已更新'); return;
    }
    if (button.classList.contains('delete-group')) {
      if (await askConfirm('刪除組別？', `「${group.name}」和它目前的分數將從記分板移除。`, '刪除組別')) {
        board.groups = board.groups.filter((item) => item.id !== id);
        save(); render(); showToast('組別已刪除');
      }
    }
  });

  $('#reset-scores').addEventListener('click', async () => {
    if (await askConfirm('全部分數歸零？', '所有組別的分數都會設為 0，組別和記分板名稱會保留。', '全部歸零')) {
      board.groups.forEach((group) => { group.score = 0; });
      save(); render(); showToast('所有分數已歸零');
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
    showToast('記分板已匯出');
  });

  $('#import-button').addEventListener('click', () => $('#import-file').click());
  $('#import-file').addEventListener('change', async (event) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    if (file.size > 1024 * 1024) { showToast('檔案太大，請選擇小於 1 MB 的 JSON 檔。'); return; }
    let imported;
    try {
      imported = parseBoard(JSON.parse(await file.text()));
    } catch (error) {
      showToast(error instanceof SyntaxError ? '無法解析 JSON 檔案。' : error.message);
      return;
    }
    if (await askConfirm('匯入記分板？', `匯入「${imported.title}」將取代目前的記分板與所有分數。建議先匯出目前的資料備份。`, '確認匯入')) {
      board = imported; save(); render(); showToast('記分板已匯入');
    }
  });

  render();
})();
