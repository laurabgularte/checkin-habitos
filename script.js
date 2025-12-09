

let habits = [];

const habitsList = document.getElementById('habits-list');
const addHabitForm = document.getElementById('add-habit-form');
const newHabitNameInput = document.getElementById('new-habit-name');
const incentiveMessageDiv = document.getElementById('incentivo-message');


function loadHabits() {
    const storedHabits = localStorage.getItem('myGirlHabits');
  try {
        if (storedHabits) {
            habits = JSON.parse(storedHabits);
        }
    } catch (e) {
        console.error("Erro ao carregar hábitos do LocalStorage:", e);
        
        habits = []; 
    }
    renderHabits();
}


function saveHabits() {
    localStorage.setItem('myGirlHabits', JSON.stringify(habits));
}


function isHabitCompletedToday(habit) {
    const today = new Date().toDateString();
    return habit.lastCompletedDate === today;
}


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

    const checkBtn = item.querySelector('.check-btn');
    checkBtn.addEventListener('click', () => toggleHabit(habit.id));
    
    return item;
}


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


function displayIncentive(message) {
    incentiveMessageDiv.innerHTML = `<p>${message}</p>`;
    
    setTimeout(() => {
        incentiveMessageDiv.innerHTML = '';
    }, 5000);
}


addHabitForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = newHabitNameInput.value.trim();
    if (name) {
        const newHabit = {
            id: Date.now(), // 
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


function toggleHabit(id) {
    const habit = habits.find(h => h.id === id);
    if (!habit || isHabitCompletedToday(habit)) return;

    const today = new Date().toDateString();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayString = yesterday.toDateString();

   
    let newStreak = habit.streak;
    
    if (habit.lastCompletedDate === yesterdayString) {
       
        newStreak += 1;
    } else if (habit.lastCompletedDate !== today) {
        
        newStreak = 1;
    }

    habit.streak = newStreak;
    habit.lastCompletedDate = today;

    
    let incentiveMessage = 'Parabéns por mais um check-in! 💖';

    if (newStreak === 3) {
        incentiveMessage = `🎉 Três dias seguidos! Estou orgulhosa da sua dedicação ao hábito: ${habit.name}!`;
    } else if (newStreak === 7) {
        incentiveMessage = `🏆 UAU, UMA SEMANA INTEIRA! Sua recompensa é um café da manhã na cama neste fim de semana!`;
    } else if (newStreak === 30) {
        incentiveMessage = `💎 OBJETIVO DE 30 DIAS CONCLUÍDO! Recompensa Desbloqueada: Escolha um filme para assistirmos e eu preparo a pipoca!`;
    }
    

    displayIncentive(incentiveMessage);
    saveHabits();
    renderHabits();
}



loadHabits();