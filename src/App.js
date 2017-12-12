import React, { Component } from 'react';
import update from 'react-addons-update';

import Quiz from './components/quiz';
import quizQuestions from './api/quiz-questions';
import Result from './components/result';

import logo from './logo.svg';
import './App.css';


class App extends Component {

    constructor(props) {
    super(props);

    var cloneArray = quizQuestions.slice();
    cloneArray.splice(0,1);

    this.state = {
      counter: 0,
      questionId: 1,
      question: '',
      answerOptions: [],
      answer: '',
      answersCount: {
        Nintendo: 0,
        Microsoft: 0,
        Sony: 0
      },
      result: '',
      randomQuestions: this.shuffleArray(cloneArray)
    };

    this.handleAnswerSelected = this.handleAnswerSelected.bind(this);
  }

  componentWillMount() {
    const AnswerOptions = quizQuestions.map((question) => question.answers);

    this.setState({
      question: quizQuestions[0].question,
      answerOptions: AnswerOptions[0]
    });
  }

  shuffleArray(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
  };

  setUserAnswer(answer) {
    const updatedAnswersCount = update(this.state.answersCount, {
      [answer]: {$apply: (currentValue) => currentValue + 1}
    });
    this.setState({
      answersCount: updatedAnswersCount,
      answer: answer
    });
  }

  setNextQuestion() {
    const counter = this.state.counter + 1;
    const questionId = this.state.questionId + 1;

    this.setState({
      counter: counter,
      questionId: questionId,
      question: this.state.RandomisedQuestions[counter].question,
      answerOptions: this.state.RandomisedQuestions[counter].answers,
      answer: ''
    });
  }

  getResults() {
     const answersCount = this.state.answersCount;
     const answersCountKeys = Object.keys(answersCount);
     const answersCountValues = answersCountKeys.map((key) => answersCount[key]);
     const maxAnswerCount = Math.max.apply(null, answersCountValues);

     return answersCountKeys.filter((key) => answersCount[key] === maxAnswerCount);
   }

   setResults (result) {
     if (result.length === 1) {
       this.setState({ result: result[0] });
     } else {
       this.setState({ result: 'Undetermined' });
     }
   }

  handleAnswerSelected(event) {
    this.setUserAnswer(event.currentTarget.value);
    if (event.currentTarget.value === 'Gift') {
        setTimeout(() => this.setResults(this.getResults()), 300);
      } else {
        setTimeout(() => this.setNextQuestion(), 300);
      }
  }

  renderQuiz() {
    return (
      <Quiz
        answer={this.state.answer}
        answerOptions={this.state.answerOptions}
        questionId={this.state.questionId}
        question={this.state.question}
        questionTotal={quizQuestions.length}
        onAnswerSelected={this.handleAnswerSelected}
      />
    );
  }

  renderResult() {
    return (
      <Result quizResult={this.state.result} />
    );
  }

  render() {
      return (
        <div className="App">
          <div className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <h2>React Quiz</h2>
          </div>
            {this.state.result ? this.renderResult() : this.renderQuiz()}
        </div>
      )
    }
}

export default App;