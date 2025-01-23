document.addEventListener("DOMContentLoaded", () => {
  /************  HTML ELEMENTS  ************/
  // View divs
  const quizView = document.querySelector("#quizView");
  const endView = document.querySelector("#endView");

  // Quiz view elements
  const progressBar = document.querySelector("#progressBar");
  const questionCount = document.querySelector("#questionCount");
  const questionContainer = document.querySelector("#question");
  const choiceContainer = document.querySelector("#choices");
  const nextButton = document.querySelector("#nextButton");

  // End view elements
  const resultContainer = document.querySelector("#result");

  /************  SET VISIBILITY OF VIEWS  ************/

  // Show the quiz view (div#quizView) and hide the end view (div#endView)
  quizView.style.display = "block";
  endView.style.display = "none";

  /************  QUIZ DATA  ************/

  // Array with the quiz questions
  const questions = [
    new Question(
      "What will this code print? let a = 'b' console.log(b)",
      ["b ", "a", "Error", "undefined"],
      "Error",
      1
    ),
    new Question(
      "What is the capital of Spain?",
      ["Miami", "Paris", "Madrid", "Rome"],
      "Madrid",
      1
    ),
    new Question(
      "When was JavaScript created?",
      ["1990", "1996", "1992", "1995"],
      "1995",
      2
    ),
    new Question(
      "How do we access an ID selector in CSS?",
      [".", "#", "/", ":"],
      "#",
      3
    ),

    new Question(
      "What is the longest river in the world?",
      ["River Tajo", "River Rine", "River Nile", "River Seine"],
      "River Nile",
      3
    ),
    // Add more questions here
  ];
  const quizDuration = 120; // 120 seconds (2 minutes)

  /************  QUIZ INSTANCE  ************/

  // Create a new Quiz instance object
  const quiz = new Quiz(questions, quizDuration, quizDuration);
  // Shuffle the quiz questions
  quiz.shuffleQuestions();

  /************  SHOW INITIAL CONTENT  ************/

  // Convert the time remaining in seconds to minutes and seconds, and pad the numbers with zeros if needed
  const minutes = Math.floor(quiz.timeRemaining / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (quiz.timeRemaining % 60).toString().padStart(2, "0");

  // Display the time remaining in the time remaining container
  const timeRemainingContainer = document.getElementById("timeRemaining");
  timeRemainingContainer.innerText = `${minutes}:${seconds}`;

  // Show first question
  showQuestion();

  /************  TIMER  ************/

  let timer;

  const mainContainer = document.querySelector(".container");
  mainContainer.addEventListener("click", () => {
    startTimer();
  });

  function updateTimerDisplay() {
    const minutes = Math.floor(quiz.timeRemaining / 60)
      .toString()
      .padStart(2, "0");
    const seconds = (quiz.timeRemaining % 60).toString().padStart(2, "0");
    timeRemainingContainer.innerText = `${minutes}:${seconds}`;
  }

  function startTimer() {
    clearInterval(timer);
    updateTimerDisplay();

    timer = setInterval(function () {
      quiz.timeRemaining--;
      updateTimerDisplay();
      if (quiz.timeRemaining <= 0) {
        clearInterval(timer);
        showResults();
      }
    }, 1000);
  }
  /************  EVENT LISTENERS  ************/

  nextButton.addEventListener("click", nextButtonHandler);

  /************  FUNCTIONS  ************/

  // showQuestion() - Displays the current question and its choices
  // nextButtonHandler() - Handles the click on the next button
  // showResults() - Displays the end view and the quiz results

  function showQuestion() {
    // If the quiz has ended, show the results
    if (quiz.hasEnded()) {
      showResults();
      return;
    }

    // Clear the previous question text and question choices
    questionContainer.innerText = "";
    choiceContainer.innerHTML = "";

    // Get the current question from the quiz by calling the Quiz class method `getQuestion()`
    const question = quiz.getQuestion();

    // Shuffle the choices of the current question by calling the method 'shuffleChoices()' on the question object
    question.shuffleChoices();

    // YOUR CODE HERE:
    // 1. Show the question
    // Update the inner text of the question container element and show the question text

    questionContainer.innerText = question.text;

    // 2. Update the green progress bar
    // Update the green progress bar (div#progressBar) width so that it shows the percentage of questions answered

    progressBar.style.width = `${
      ((quiz.currentQuestionIndex + 1) / quiz.questions.length) * 100
    }% `;

    // 3. Update the question count text
    // Update the question count (div#questionCount) show the current question out of total questions

    questionCount.innerText = `Question ${quiz.currentQuestionIndex + 1} of ${
      quiz.questions.length
    }`; //  This value is hardcoded as a placeholder

    // 4. Create and display new radio input element with a label for each choice.
    // Loop through the current question `choices`.
    // For each choice create a new radio input with a label, and append it to the choice container.
    // Each choice should be displayed as a radio input element with a label:
    /* 
          <input type="radio" name="choice" value="CHOICE TEXT HERE">
          <label>CHOICE TEXT HERE</label>
        <br>
      */

    question.choices.forEach((choice) => {
      const listItem = document.createElement("li");

      const radioEl = document.createElement("input");
      //radioEl.innerHTML = "<input type='radio' name='choice' value='CHOICE TEXT HERE'><label>CHOICE TEXT HERE</label> <br>";
      radioEl.type = "radio";
      radioEl.name = "choice";
      radioEl.value = choice;

      const label = document.createElement("label");
      label.innerText = choice;
      //label.htmlFor = choice;

      listItem.appendChild(radioEl);
      listItem.appendChild(label);

      choiceContainer.appendChild(listItem);
    });
  }

  function nextButtonHandler() {
    let selectedAnswer; // A variable to store the selected answer value

    // 1. Get all the choice elements. You can use the `document.querySelectorAll()` method.

    const allChoices = document.querySelectorAll('input[name="choice"]');

    // 2. Loop through all the choice elements and check which one is selected
    // Hint: Radio input elements have a property `.checked` (e.g., `element.checked`).
    //  When a radio input gets selected the `.checked` property will be set to true.
    //  You can  check which choice was selected by checking if the `.checked` property is true.
    allChoices.forEach((element) => {
      if (element.checked) {
        selectedAnswer = element.value;

        quiz.checkAnswer(selectedAnswer);

        quiz.moveToNextQuestion();
        showQuestion();
      }
    });

    // 3. If an answer is selected (`selectedAnswer`), check if it is correct and move to the next question
    // Check if selected answer is correct by calling the quiz method `checkAnswer()` with the selected answer.
    // Move to the next question by calling the quiz method `moveToNextQuestion()`.
    // Show the next question by calling the function `showQuestion()`.
  }

  function showResults() {
    // 1. Hide the quiz view (div#quizView)
    clearInterval(timer);
    quizView.style.display = "none";

    // 2. Show the end view (div#endView)
    endView.style.display = "flex";

    // 3. Update the result container (div#result) inner text to show the number of correct answers out of total questions
    resultContainer.innerText = `You scored ${quiz.correctAnswers} out of ${quiz.questions.length} correct answers!`; // This value is hardcoded as a placeholder
  }

  const restartButton = document.getElementById("restartButton");
  restartButton.addEventListener("click", () => {
    quiz.currentQuestionIndex = 0;
    quiz.correctAnswers = 0;
    quiz.timeRemaining = quiz.timeLimit;
    quiz.shuffleQuestions();

    quizView.style.display = "block";
    endView.style.display = "none";

    showQuestion();
  });
});
