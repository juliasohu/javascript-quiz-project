class Quiz {
    constructor (questions, timeLimit, timeRemaining){
      this.questions = questions;
      this.timeLimit = timeLimit;
      this.timeRemaining = timeRemaining;
      this.correctAnswers = 0;
      this.currentQuestionIndex = 0;
  }

 getQuestion(){
  return this.questions[this.currentQuestionIndex];
 }
  
 moveToNextQuestion(){
  this.currentQuestionIndex++;
 }

 shuffleQuestions(){
  for (let i = this.questions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.questions[i], this.questions[j]] = [this.questions[j], this.questions[i]];
    }
    return this.questions;
 }

  checkAnswer(answer){
    if (this.getQuestion().answer === answer)  
    this.correctAnswers++
  }

  hasEnded(){
      if (this.currentQuestionIndex < this.questions.length) {
          return false
      } else if (this.currentQuestionIndex === this.questions.length) {
          return true
      }
  }
    filterQuestionsByDifficulty(difficulty){
        if (difficulty >= 1 && difficulty <= 3){
        this.questions = this.questions.filter((question) => {
             if (question.difficulty === difficulty) {
                return true}
                else {return false}
            })}
        }

    averageDifficulty(){
        const difficultQuestion = this.questions.reduce((acc, question) => {
            return acc + question.difficulty
        }, 0)
    return difficultQuestion / this.questions.length}
}