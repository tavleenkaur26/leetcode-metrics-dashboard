const searchBtn = document.getElementById("search-btn");
const usernameInput = document.getElementById("username");

const totalSolvedEl = document.getElementById("totalSolved");
const easySolvedEl = document.getElementById("easySolved");
const mediumSolvedEl = document.getElementById("mediumSolved");
const hardSolvedEl = document.getElementById("hardSolved");

const easyFill = document.querySelector(".easy-fill");
const mediumFill = document.querySelector(".medium-fill");
const hardFill = document.querySelector(".hard-fill");

searchBtn.addEventListener("click", fetchStats);

async function fetchStats() {
    const username = usernameInput.value.trim();
    if (!username) return alert("Please enter a username");

    try {
        const response = await fetch(`https://leetcode-stats-api.herokuapp.com/${username}`);
        const data = await response.json();

        if (!data.totalSolved && data.totalSolved !== 0) {
            alert("Invalid username");
            return;
        }

        updateUI(data);
    } catch (error) {
        alert("Something went wrong");
        console.error(error);
    }
}

function updateUI(data) {
    animateNumber(totalSolvedEl, data.totalSolved);
    animateNumber(easySolvedEl, data.easySolved);
    animateNumber(mediumSolvedEl, data.mediumSolved);
    animateNumber(hardSolvedEl, data.hardSolved);

    animateBar(easyFill, (data.easySolved / data.totalEasy) * 100);
    animateBar(mediumFill, (data.mediumSolved / data.totalMedium) * 100);
    animateBar(hardFill, (data.hardSolved / data.totalHard) * 100);

    leetcodeChart.data.datasets[0].data = [data.easySolved, data.mediumSolved, data.hardSolved];
    leetcodeChart.update();
}

// animate numbers
function animateNumber(element, target, duration = 1200) {
    let start = 0;
    const stepTime = Math.abs(Math.floor(duration / target));
    const timer = setInterval(() => {
        start++;
        element.textContent = start;
        if (start >= target) clearInterval(timer);
    }, stepTime);
}

// animate bars
function animateBar(bar, value) {
    bar.style.width = "0%";
    setTimeout(() => {
        bar.style.width = `${value}%`;
    }, 50);
}

const ctx = document.getElementById("leetcodeChart").getContext("2d");
const leetcodeChart = new Chart(ctx, {
  type: "doughnut",
  data: {
    labels: ["Easy", "Medium", "Hard"],
    datasets: [{
        label: "Solved Problems",
        data: [0, 0, 0],
        backgroundColor: ["#A3E4D7", "#F9E79F", "#F5B7B1"],
        borderWidth: 0
    }]
  },
  options: {
    plugins: { legend: { position: "bottom" } }
  }
});

// dark mode toggle
const themeToggle = document.getElementById("themeToggle");
themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    themeToggle.textContent = document.body.classList.contains("dark-mode") ? "☀️" : "🌙";
});

