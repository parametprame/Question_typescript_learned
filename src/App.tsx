import React, {useState} from 'react';
import './App.css';
import Questioncard from './components/QuestionCards'
import {fetchQuestions} from './API'
import {QuestionState, Difficulty} from './API'

export type AnswerObject = {
  question: string;
  answer: string;
  correct: boolean;
  correctAnswer: string;
};


const TOTAL_QUESTIONS = 10;


const  App = () => {

  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState<QuestionState[]>([]);
  const [number, setNumber] = useState(0);
  const [userAnswer, setUserAnswer] = useState<AnswerObject[]>([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(true)
  console.log('check2', userAnswer)

  const startTrivia  = async () => {
    setLoading(true)
    setGameOver(false)
    const newQuestion = await fetchQuestions(
      TOTAL_QUESTIONS,
      Difficulty.EASY,
    )

    setQuestions(newQuestion)
    setScore(0)
    setUserAnswer([])
    setNumber(0)
    setLoading(false)

  }

  const checkanswer = (e:  React.MouseEvent<HTMLButtonElement>) => {
    if (!gameOver){
      //user answer
      const answer = e.currentTarget.value
      //check answer against correct answer
      const correct = questions[number].correct_answer === answer;

      if (correct) setScore(prev => prev + 1)
      //save answer in the array for user answer
      const answerObject = {
        question: questions[number].question,
        answer,
        correct,
        correctAnswer: questions[number].correct_answer,
      };
      setUserAnswer((prev) => [...prev, answerObject]);
    }
  }

  const nextQuestion = () => {
    const nextQuestion = number + 1;

    if(nextQuestion === TOTAL_QUESTIONS) {
      setGameOver(true)
    }else{
      setNumber(nextQuestion)
    }
  }

  return (
    <div className="App">
      <h1>Quiz</h1>
      {gameOver || userAnswer.length === TOTAL_QUESTIONS ? (
        <button className="start" onClick={startTrivia}>
          Start
        </button>
      ) 
      :
      null
      }
    
      {!gameOver ? <p className="score">Score: {score}</p> : null}
      {loading && <p>Loading Question ... </p>}
      {!loading && !gameOver  && (
        <Questioncard 
          questionNumber={number + 1}
          totalQuestions={TOTAL_QUESTIONS}
          question={questions[number].question}
          answers={questions[number].answers}
          userAnswer={userAnswer ? userAnswer[number] : undefined}
          callback={checkanswer}
       />
      )}
      {!gameOver && !loading && userAnswer.length === number + 1 && number !== TOTAL_QUESTIONS - 1 ? (
        <button className="next" onClick={nextQuestion}>
          Next Question 
        </button>
      ) : 
      null
      }
     
    </div>
  );
}

export default App;
