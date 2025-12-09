script.js
// Variável global que armazena todos os hábitos
let habits = [];

const habitsList = document.getElementById('habits-list');
const addHabitForm = document.getElementById('add-habit-form');
const newHabitNameInput = document.getElementById('new-habit-name');
const incentiveMessageDiv = document.getElementById('incentivo-message');

// --- 1. FUNÇÕES DE ARMAZENAMENTO (localStorage) ---

// Carrega os hábitos salvos ou inicia um array vazio
function loadHabits() {
    const storedHabits = localStorage.getItem('myGirlHabits');
  try {
        if (storedHabits) {
            habits = JSON.parse(storedHabits);
        }
    } catch (e) {
        console.error("Erro ao carregar hábitos do LocalStorage:", e);
        // Se houver erro (dados corrompidos), inicia com array vazio
        habits = []; 
    }
    renderHabits();
}

// Salva o array de hábitos no localStorage
function saveHabits() {
    localStorage.setItem('myGirlHabits', JSON.stringify(habits));
}

// --- 2. FUNÇÕES DE RENDERIZAÇÃO E INTERFACE ---

// Verifica se o hábito foi concluído hoje
function isHabitCompletedToday(habit) {
    const today = new Date().toDateString();
    return habit.lastCompletedDate === today;
}

// Cria o elemento HTML para um hábito
function createHabitElement(habit) {
    const item = document.createElement('div');
    item.className = 'habit-item';
    item.dataset.id = habit.id;

    const completedToday = isHabitCompletedToday(habit);

    item.innerHTML = `
        <div class="habit-details">
            <span class="habit-name">${habit.name}</span>
            <div class="streak-info">Sequência: ${habit.streak} dias</div>
        </div>
        <button class="check-btn" ${completedToday ? 'disabled' : ''}>
            ${completedToday ? 'Concluído Hoje' : '✅ Concluir'}
        </button>
    `;

    // Adiciona o listener para o botão de check-in
    const checkBtn = item.querySelector('.check-btn');
    checkBtn.addEventListener('click', () => toggleHabit(habit.id));
    
    return item;
}

// Atualiza a lista na tela
function renderHabits() {
    habitsList.innerHTML = '';
    if (habits.length === 0) {
        habitsList.innerHTML = '<p class="placeholder-text">Nenhum hábito ainda. Adicione um para começar!</p>';
    } else {
        habits.forEach(habit => {
            habitsList.appendChild(createHabitElement(habit));
        });
    }
}

// Exibe a mensagem de incentivo (com temporizador para sumir)
function displayIncentive(message) {
    incentiveMessageDiv.innerHTML = `<p>${message}</p>`;
    // Faz a mensagem sumir após 5 segundos
    setTimeout(() => {
        incentiveMessageDiv.innerHTML = '';
    }, 5000);
}

// --- 3. LÓGICA DO RASTREADOR E INCENTIVO ---

// Adiciona um novo hábito
addHabitForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = newHabitNameInput.value.trim();
    if (name) {
        const newHabit = {
            id: Date.now(), // ID único baseado no timestamp
            name: name,
            streak: 0,
            lastCompletedDate: null
        };
        habits.push(newHabit);
        saveHabits();
        renderHabits();
        newHabitNameInput.value = '';
        displayIncentive("Novo hábito adicionado! Você consegue!");
    }
});

// Marca ou desmarca o hábito
function toggleHabit(id) {
    const habit = habits.find(h => h.id === id);
    if (!habit || isHabitCompletedToday(habit)) return;

    const today = new Date().toDateString();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayString = yesterday.toDateString();

    // Lógica para calcular o streak
    let newStreak = habit.streak;
    
    if (habit.lastCompletedDate === yesterdayString) {
        // Se concluiu ontem, o streak continua
        newStreak += 1;
    } else if (habit.lastCompletedDate !== today) {
        // Se pulou um dia, o streak é resetado para 1
        newStreak = 1;
    }

    habit.streak = newStreak;
    habit.lastCompletedDate = today;

    // --- LÓGICA CENTRAL DO INCENTIVO ---
    let incentiveMessage = 'Parabéns por mais um check-in! 💖';

    if (newStreak === 3) {
        incentiveMessage = `🎉 Três dias seguidos! Estou orgulhoso da sua dedicação ao hábito: ${habit.name}!`;
    } else if (newStreak === 7) {
        incentiveMessage = `🏆 UAU, UMA SEMANA INTEIRA! Sua recompensa é um café da manhã na cama neste fim de semana!`;
    } else if (newStreak === 30) {
        incentiveMessage = `💎 OBJETIVO DE 30 DIAS CONCLUÍDO! Recompensa Desbloqueada: Escolha um filme para assistirmos e eu preparo a pipoca!`;
    }
    // Adicione mais marcos de streak e mensagens/recompensas aqui!

    displayIncentive(incentiveMessage);
    saveHabits();
    renderHabits();
}


// Inicia o aplicativo ao carregar a página
loadHabits();