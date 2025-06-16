const moodDate = document.getElementById("moodDate");
const moodLevel = document.getElementById("moodLevel");
const moodNotes = document.getElementById("moodNotes");
const moodAdvice = document.getElementById("moodAdvice");
const moodEntries = document.getElementById("moodEntries");

let moods = JSON.parse(localStorage.getItem("moodData")) || [];

function saveMoods() {
  localStorage.setItem("moodData", JSON.stringify(moods));
}

function updateChart() {
  const labels = moods.map(m => m.date);
  const data = moods.map(m => m.level);

  moodChart.data.labels = labels;
  moodChart.data.datasets[0].data = data;
  moodChart.update();
}

function renderEntries() {
  moodEntries.innerHTML = '';
  let total = 0;

  moods.forEach(entry => {
    const div = document.createElement("div");
    div.className = "entry";
    div.innerHTML = `<strong>${entry.date}</strong>: Mood ${entry.level} - ${entry.notes || "No notes"}`;
    moodEntries.appendChild(div);
    total += entry.level;
  });

  if (moods.length > 0) {
    const avg = (total / moods.length).toFixed(1);
    moodAdvice.textContent = `Your average mood score is ${avg}. ${avg < 5 ? "It may help to slow down and do things that bring you peace." : avg > 7 ? "You're doing great emotionally! Keep nurturing yourself." : "Your mood is fairly balanced. Reflect on small wins!"}`;
  }
}

function addMoodEntry() {
  const date = moodDate.value;
  const level = parseInt(moodLevel.value);
  const notes = moodNotes.value.trim();

  if (!date || isNaN(level)) {
    alert("Please enter a valid date and select a mood level.");
    return;
  }

  const newEntry = { date, level, notes };
  if (moods.length >= 30) moods.shift(); // Keep only recent 30
  moods.push(newEntry);

  saveMoods();
  renderEntries();
  updateChart();

  moodDate.value = '';
  moodLevel.value = '6';
  moodNotes.value = '';
}

function refreshMoodChart() {
  moods = JSON.parse(localStorage.getItem("moodData")) || [];
  renderEntries();
  updateChart();
}

// Chart setup
const ctx = document.getElementById('moodChart').getContext('2d');
const moodChart = new Chart(ctx, {
  type: 'line',
  data: {
    labels: [],
    datasets: [{
      label: 'Mood Level',
      data: [],
      backgroundColor: 'rgba(79,195,247,0.2)',
      borderColor: '#039be5',
      borderWidth: 2,
      tension: 0.4,
      fill: true,
    }]
  },
  options: {
    scales: {
      y: {
        min: 1,
        max: 11
      }
    }
  }
});

// Initialize
renderEntries();
updateChart();
