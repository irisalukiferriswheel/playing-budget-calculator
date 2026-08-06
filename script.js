const translations = {
  en: {
    title: "Playing Budget Calculator",
    intro: "Choose how much of your weekly pay you want to reserve for playing, divide it across your planned games, and track what remains.",
    weeklyPayLabel: "Weekly pay",
    weeklyPayHelp: "Enter your weekly take-home pay.",
    percentageLabel: "Percentage reserved for playing",
    percentageHelp: "The recommended amount is 4% of weekly pay.",
    plannedGamesLabel: "Number of games planned this week",
    plannedGamesHelp: "Your weekly playing budget will be divided equally across these games.",
    gamesPlayedLabel: "Games already played this week",
    gamesPlayedHelp: "Update this number after each game to track your remaining budget.",
    calculateButton: "Calculate my playing budget",
    weeklyBudgetResult: "Weekly playing budget",
    perGameResult: "Recommended amount per game",
    perGameDetail: "Equal share of the weekly playing budget",
    gamesRemainingResult: "Games remaining",
    usedBudgetResult: "Budget used so far",
    remainingBudgetResult: "Playing budget remaining",
    progressLabel: "Weekly budget progress",
    disclaimer: "This calculator is a budgeting guide. Do not use money needed for housing, food, bills, debt payments, or other essentials.",
    weeklyBudgetDetail: "{percent}% of weekly pay",
    gamesProgressDetail: "{played} of {planned} games played",
    budgetUsedDetail: "Based on {played} games at {amount} each",
    remainingDetail: "Available for {remaining} remaining games",
    healthyStatus: "You are within your weekly playing budget. Keep each game at or below the recommended amount.",
    completeStatus: "You have reached the number of games planned for this week.",
    overGamesStatus: "You entered more games played than games planned. Increase the planned number or review your entries.",
    weeklyPayError: "Enter a weekly pay amount greater than zero.",
    plannedGamesError: "Enter at least one planned game.",
    gamesPlayedError: "Enter zero or more games played."
  },
  fr: {
    title: "Calculateur de budget de jeu",
    intro: "Choisissez la part de votre paie hebdomadaire à réserver au jeu, répartissez-la entre les parties prévues et suivez le montant restant.",
    weeklyPayLabel: "Paie hebdomadaire",
    weeklyPayHelp: "Inscrivez votre paie nette pour une semaine.",
    percentageLabel: "Pourcentage réservé au jeu",
    percentageHelp: "Le montant recommandé est de 4 % de la paie hebdomadaire.",
    plannedGamesLabel: "Nombre de parties prévues cette semaine",
    plannedGamesHelp: "Votre budget de jeu hebdomadaire sera réparti également entre ces parties.",
    gamesPlayedLabel: "Parties déjà jouées cette semaine",
    gamesPlayedHelp: "Mettez ce nombre à jour après chaque partie pour suivre le budget restant.",
    calculateButton: "Calculer mon budget de jeu",
    weeklyBudgetResult: "Budget de jeu hebdomadaire",
    perGameResult: "Montant recommandé par partie",
    perGameDetail: "Part égale du budget de jeu hebdomadaire",
    gamesRemainingResult: "Parties restantes",
    usedBudgetResult: "Budget utilisé jusqu'à maintenant",
    remainingBudgetResult: "Budget de jeu restant",
    progressLabel: "Progression du budget hebdomadaire",
    disclaimer: "Ce calculateur est un outil de planification. N'utilisez pas l'argent nécessaire au logement, à la nourriture, aux factures, aux dettes ou à d'autres besoins essentiels.",
    weeklyBudgetDetail: "{percent} % de la paie hebdomadaire",
    gamesProgressDetail: "{played} partie(s) jouée(s) sur {planned}",
    budgetUsedDetail: "Selon {played} partie(s) à {amount} chacune",
    remainingDetail: "Disponible pour {remaining} partie(s) restante(s)",
    healthyStatus: "Vous respectez votre budget de jeu hebdomadaire. Gardez le coût de chaque partie au montant recommandé ou en dessous.",
    completeStatus: "Vous avez atteint le nombre de parties prévues pour cette semaine.",
    overGamesStatus: "Le nombre de parties jouées dépasse le nombre prévu. Augmentez le nombre prévu ou vérifiez vos données.",
    weeklyPayError: "Inscrivez une paie hebdomadaire supérieure à zéro.",
    plannedGamesError: "Inscrivez au moins une partie prévue.",
    gamesPlayedError: "Inscrivez zéro partie jouée ou plus."
  }
};

let currentLanguage = "en";
const form = document.querySelector("#budget-form");
const weeklyPayInput = document.querySelector("#weekly-pay");
const percentageInput = document.querySelector("#budget-percent");
const percentageOutput = document.querySelector("#budget-percent-output");
const plannedGamesInput = document.querySelector("#planned-games");
const gamesPlayedInput = document.querySelector("#games-played");
const errorElement = document.querySelector("#form-error");
const resultsElement = document.querySelector("#results");
const progressTrack = document.querySelector(".progress-track");
const progressFill = document.querySelector("#progress-fill");

function interpolate(template, values) {
  return Object.entries(values).reduce((text, [key, value]) => text.replaceAll(`{${key}}`, String(value)), template);
}

function formatMoney(value) {
  return new Intl.NumberFormat(currentLanguage === "fr" ? "fr-CA" : "en-CA", {
    style: "currency",
    currency: "CAD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
}

function applyLanguage(language) {
  currentLanguage = language;
  document.documentElement.lang = language;
  document.querySelectorAll("[data-i18n]").forEach((element) => {
    element.textContent = translations[language][element.dataset.i18n];
  });
  document.querySelectorAll(".language-button").forEach((button) => {
    const active = button.dataset.language === language;
    button.classList.toggle("active", active);
    button.setAttribute("aria-pressed", String(active));
  });
  if (!resultsElement.hidden) renderResults();
}

function showError(message, input) {
  errorElement.textContent = message;
  errorElement.hidden = false;
  resultsElement.hidden = true;
  input.focus();
}

function renderResults() {
  errorElement.hidden = true;
  const weeklyPay = Number.parseFloat(weeklyPayInput.value);
  const percentage = Number.parseInt(percentageInput.value, 10);
  const plannedGames = Number.parseInt(plannedGamesInput.value, 10);
  const gamesPlayed = Number.parseInt(gamesPlayedInput.value, 10);
  const text = translations[currentLanguage];

  if (!Number.isFinite(weeklyPay) || weeklyPay <= 0) return showError(text.weeklyPayError, weeklyPayInput);
  if (!Number.isInteger(plannedGames) || plannedGames < 1) return showError(text.plannedGamesError, plannedGamesInput);
  if (!Number.isInteger(gamesPlayed) || gamesPlayed < 0) return showError(text.gamesPlayedError, gamesPlayedInput);

  const playingBudget = weeklyPay * (percentage / 100);
  const amountPerGame = playingBudget / plannedGames;
  const budgetUsed = amountPerGame * gamesPlayed;
  const budgetRemaining = Math.max(0, playingBudget - budgetUsed);
  const gamesRemaining = Math.max(0, plannedGames - gamesPlayed);
  const usagePercent = playingBudget > 0 ? Math.min(100, (budgetUsed / playingBudget) * 100) : 0;

  document.querySelector("#playing-budget").textContent = formatMoney(playingBudget);
  document.querySelector("#playing-budget-detail").textContent = interpolate(text.weeklyBudgetDetail, { percent: percentage });
  document.querySelector("#per-game-budget").textContent = formatMoney(amountPerGame);
  document.querySelector("#games-remaining").textContent = gamesRemaining;
  document.querySelector("#games-progress-detail").textContent = interpolate(text.gamesProgressDetail, { played: gamesPlayed, planned: plannedGames });
  document.querySelector("#budget-used").textContent = formatMoney(budgetUsed);
  document.querySelector("#budget-used-detail").textContent = interpolate(text.budgetUsedDetail, { played: gamesPlayed, amount: formatMoney(amountPerGame) });
  document.querySelector("#budget-remaining").textContent = formatMoney(budgetRemaining);
  document.querySelector("#remaining-detail").textContent = interpolate(text.remainingDetail, { remaining: gamesRemaining });
  document.querySelector("#progress-percent").textContent = `${usagePercent.toFixed(0)}%`;
  progressFill.style.width = `${usagePercent}%`;
  progressTrack.setAttribute("aria-valuenow", usagePercent.toFixed(0));

  const status = document.querySelector("#status-message");
  if (gamesPlayed > plannedGames) {
    status.className = "status danger";
    status.textContent = text.overGamesStatus;
  } else if (gamesPlayed === plannedGames) {
    status.className = "status warning";
    status.textContent = text.completeStatus;
  } else {
    status.className = "status";
    status.textContent = text.healthyStatus;
  }
  resultsElement.hidden = false;
}

percentageInput.addEventListener("input", () => {
  percentageOutput.textContent = `${percentageInput.value}%`;
});

document.querySelectorAll(".language-button").forEach((button) => {
  button.addEventListener("click", () => applyLanguage(button.dataset.language));
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  renderResults();
});

applyLanguage("en");
