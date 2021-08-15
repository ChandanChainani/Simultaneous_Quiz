import React, { useState } from 'react';
import Operations from './Operations';

const operators = Object.keys(Operations);

const Quiz = function(props) {
  const OPERATORS_COUNT = 2;
  const [state, setState] = useState({
    totalQuestionsCount: 20,
    numberRange: 9,
    questionAskedCount: 0,
    questions: [],
    userInput: '',
    message: '',
    score: 0,
  });

  const {
    totalQuestionsCount,
    numberRange,
    questionAskedCount,
    questions,
    userInput,
    message,
    score
  } = state;

  function newQuestion(obj) {
    let tmp = { ...state, ...obj };
    if (questionAskedCount != totalQuestionsCount) {
      tmp['questions'] = [...tmp['questions'], {
        operands: [...Array(OPERATORS_COUNT)].map(() => Math.floor(Math.random() * numberRange + 1)),
        operator: operators[Math.floor((Math.random() * operators.length))]
      }];
    }
    tmp['questionAskedCount'] += 1;
    setState(tmp);
  }

  function startQuiz() {
    if (numberRange < 9 || numberRange > 14) {
      setState({...state, message: 'Range can only be between 10 to 15'});
      return;
    }

    if (totalQuestionsCount < 20 || totalQuestionsCount > 50) {
      setState({...state, message: 'Questions range cannot be less than 20 and greater than 50'});
      return;
    }

    newQuestion({
      score: 0,
      userInput: '',
      message: '',
      questions: [],
      questionAskedCount: 0,
    });
  }

  function onNextQuestion() {
    let tmp = {...state, message: '', userInput: ''};
    if (userInput == '') {
      tmp['message'] = 'Please input value';
      setState(tmp);
      return;
    }

    if (userInput != '' && userInput.replace(new RegExp(/^-?[0-9]*([.][0-9]+)?/), '').length > 0) {
      tmp['message'] = 'Invalid input';
      setState(tmp);
      return;
    }

    if (tmp.questions.length) {
      let question = tmp.questions[tmp.questions.length - 1];
      let result = Operations[question.operator](question.operands);
      let isCorrect = result == userInput;
      tmp.questions[tmp.questions.length - 1]['result'] = [isCorrect, userInput, result];
      if (isCorrect) {
        tmp['score'] += 1;
      }
    }

    newQuestion(tmp);
  }

  function setUserInput(evt) {
    setState({...state, userInput: evt.target.value});
  }

  function getView() {
    if (questionAskedCount > totalQuestionsCount) {
      return ['result', (
        <React.Fragment>
          <div className="score">
            Total Score: {score}
          </div>
          {questions.map(question => (
            <div className={`${question.result[0]}`}>
              {question.operands.reduce((x, y) => (
                <React.Fragment>
                  <span>
                    {x}
                  </span>
                  <span>
                    {question.operator}
                  </span>
                  <span>
                    {y}
                  </span>
                  <span>
                    Your Answer: {question.result[1]}
                  </span>
                  <span>
                    Correct Answer: {question.result[2]}
                  </span>
                </React.Fragment>
              ))}
            </div>
          ))}
          <button className="start-btn" onClick={startQuiz}>Start Quiz</button>
        </React.Fragment>
      )];
    }
    else if (questions.length) {
      let question = questions[questions.length - 1];
      return ['', (
        <React.Fragment>
          <div className="top">
            {question.operands.reduce((x, y) => (
              <React.Fragment>
                <span>
                  {x}
                </span>
                <span>
                  {question.operator}
                </span>
                <span>
                  {y}
                </span>
              </React.Fragment>
            ))}
            <span>
              =
            </span>
            <span>
              <input id="user-input" type="text" value={userInput} onChange={setUserInput} required />
            </span>
            <span>
              <button onClick={onNextQuestion}>Next Question</button>
            </span>
          </div>
          <div className="bottom">
            <div className="score">
              Score: {score}
            </div>
          </div>
        </React.Fragment>
      )];
    }
    return ['start', (
      <React.Fragment>
        <div className="form">
          <div className="group">
            <label>Questions Count: </label>
            <input
              type="number"
              min="20"
              max="50"
              value={totalQuestionsCount}
              onChange={(evt) => {
                let tmp = Number(evt.target.value);
                setState({...state, totalQuestionsCount: isNaN(tmp) ? totalQuestionsCount : tmp});
              }}
            />
          </div>
          <div className="group">
            <label>Number Range: </label>
            <input
              type="number"
              value={numberRange + 1}
              min="10"
              max="15"
              onChange={(evt) => {
                let tmp = Number(evt.target.value);
                setState({...state, numberRange: isNaN(tmp) ? numberRange : tmp - 1});
              }}
            />
          </div>
        </div>
        <button className="start-btn" onClick={startQuiz}>Start Quiz</button>
      </React.Fragment>
    )];
  }

  const [className, Comp] = getView();
  return (
    <div className={`container ${className}`}>
      <div className="message">
        {message}
      </div>
      {Comp}
    </div>
  );
};

export default Quiz;
