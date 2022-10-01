const getLink = document.querySelector("#getLink");
const foundLink = document.querySelector("#link");
const minRating = document.querySelector("#minRating");
const maxRating = document.querySelector("#maxRating");
const radioButtons = document.querySelectorAll('input[name="index"]');
const questionName = document.querySelector("#name");
const questionTags = document.querySelector("#tags");
const questionRating = document.querySelector("#rating");
const foundQuestion = document.querySelector("#Answer");
const filterbtn = document.querySelector("#filterbtn");
const filter = document.querySelector("#filters");
const timeRadioButtons = document.querySelectorAll('input[name="time"]');
const Alltags = document.querySelector("#selectTag");
const notFound = document.querySelector("#not_found");
filterbtn.addEventListener("click", () => {
  filter.classList.toggle("togglefilter");
});
getLink.addEventListener("click", () => {
  let selectedIndex = "All";
  let selectedTime = "None";
  for (button of radioButtons) {
    if (button.checked) {
      selectedIndex = button.id;
      break;
    }
  }
  for (button of timeRadioButtons) {
    if (button.checked) {
      selectedTime = button.id;
    }
  }
  const lowerBar = parseInt(minRating.value) || 0;
  const upperBar = parseInt(maxRating.value) || 3600;
  if (lowerBar > upperBar) {
    minRating.value = "";
    maxRating.value = "";
    const notifications = {
      type: "basic",
      iconUrl: "icon48.png",
      title: "Invalid Rating",
      message: "Minimum Rating cannot be greater than maximum Rating",
    };
    chrome.notifications.create("limitnote", notifications);
  }
  let myQuestions = QUESTIONS.filter(
    (question) => question.rating >= lowerBar && question.rating <= upperBar
  );
  if (selectedIndex !== "All") {
    myQuestions = myQuestions.filter(
      (question) => question.index === selectedIndex
    );
  }
  if (selectedTime !== "None") {
    if (selectedTime === "Old") {
      myQuestions = myQuestions.filter((question) => question.contestId <= 500);
    } else if (selectedTime === "Medium") {
      myQuestions = myQuestions.filter(
        (question) => question.contestId > 500 && question.contestId <= 1000
      );
    } else {
      myQuestions = myQuestions.filter((question) => question.contestId > 1000);
    }
  }
  if (Alltags.value !== "none") {
    console.log("Entered");
    myQuestions = myQuestions.filter((question) =>
      question.tags.includes(Alltags.value)
    );
  }
  if (myQuestions.length === 0) {
    notFound.style.display = "block";
    foundQuestion.style.display = "none";
  } else {
    const randomNum = parseInt(Math.random() * myQuestions.length);
    const contestId = myQuestions[randomNum].contestId;
    const index = myQuestions[randomNum].index;
    const link = `https://codeforces.com/problemset/problem/${contestId}/${index}`;
    foundLink.innerText = link;
    foundLink.href = link;
    questionName.innerText = myQuestions[randomNum].name;
    let tags = "";
    for (tag of myQuestions[randomNum].tags) {
      tags = tags + tag + ", ";
    }
    questionTags.innerText = tags.slice(0, tags.length - 2);
    questionRating.innerText = myQuestions[randomNum].rating;
    foundQuestion.style.display = "block";
    notFound.style.display = "none";
  }
});

foundLink.addEventListener("click", () => {
  window.open(foundLink.innerText);
});
