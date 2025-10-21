const storageKey = 'opportunity_board_6092';
let data = [];

const availableList = document.getElementById('available');
const savedList = document.getElementById('saved');
const count = document.getElementById('count');
const addBtn = document.getElementById('add-btn');
const input = document.getElementById('opportunity');
const message = document.getElementById('message');
const filters = document.getElementById('filters');

let activeFilter = 'all';


function loadData() {
  const saved = localStorage.getItem(storageKey);
  data = saved ? JSON.parse(saved) : [];
}


function saveData() {
  localStorage.setItem(storageKey, JSON.stringify(data));
}


function updateCount() {
  count.textContent = `(${data.length})`;
}


function render() {
  availableList.innerHTML = '';
  savedList.innerHTML = '';

  const filtered = data.filter(item => {
    if (activeFilter === 'all') return true;
    return item.category === activeFilter;
  });

  filtered.forEach(item => {
    const li = document.createElement('li');
    li.className = 'card';
    li.dataset.id = item.id;

    const left = document.createElement('div');
    const title = document.createElement('h3');
    title.textContent = item.title;
    const cat = document.createElement('p');
    cat.className = 'category';
    cat.textContent = item.category;
    left.append(title, cat);

    const btn = document.createElement('button');
    btn.className = item.saved ? 'remove' : 'save';
    btn.textContent = item.saved ? 'Remove' : 'Save';
    btn.setAttribute('data-action', 'toggle');

    li.append(left, btn);

    if (item.saved) savedList.appendChild(li);
    else availableList.appendChild(li);
  });

  updateCount();
  saveData();
}


function addOpportunity() {
  const title = input.value.trim();
  if (!title) {
    message.textContent = 'Please enter a valid title.';
    input.focus();
    return;
  }
  message.textContent = '';
  data.unshift({
    id: Date.now().toString(),
    title,
    category: 'internship',
    saved: false
  });
  input.value = '';
  render();
}

addBtn.addEventListener('click', addOpportunity);


filters.addEventListener('change', e => {
  const form = new FormData(filters);
  activeFilter = form.get('filter') || 'all';
  render();
});

/*
We use event delegation by listening once on the document instead of adding a listener to each card.
This keeps memory usage stable even when cards are added or removed dynamically.
We reliably identify which card was clicked by using e.target.closest() and the card’s dataset.id.
*/
document.addEventListener('click', e => {
  const btn = e.target.closest('button[data-action="toggle"]');
  if (!btn) return;
  const card = btn.closest('.card');
  if (!card) return;
  const id = card.dataset.id;
  const index = data.findIndex(x => x.id === id);
  if (index > -1) {
    data[index].saved = !data[index].saved;
    render();
  }
});


loadData();
render();
