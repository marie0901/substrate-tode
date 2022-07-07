import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import './quiz.css'
import { TxButton } from './substrate-lib/components'

function Quiz() {
  const push = useNavigate()
  const { id } = useParams()
  const [status, setStatus] = useState('')

  // const [course, setCourse] = useState({})

  // const subscribeCourse = () => {
  //   let unsub = null

  //   const asyncFetch = async () => {
  //     unsub = await  api.query.substrateTode.courses(id,
  //       async course=> {
  //       console.log('!!!!!course', course)
  //       setCourse(course)
  //   }
  //     )

  //   asyncFetch()

  //   return () => {
  //     unsub && unsub()
  //   }
  // }

  // useEffect(subscribeCourse, [])

  const questions = [
    {
      questionText: 'Who is Prime Minister of India?',
      answerOptions: [
        { answerText: 'Vijay Rupani', isCorrect: true },
        { answerText: 'Manmohan singh', isCorrect: false },
        { answerText: 'Narendra Modi', isCorrect: false },
        { answerText: 'Deep Patel', isCorrect: false },
      ],
    },
    {
      questionText: 'Who is CEO of Tata?',
      answerOptions: [
        { answerText: 'Jeff Bezos', isCorrect: true },
        { answerText: 'Ratan Tata', isCorrect: false },
        { answerText: 'Mukesh Ambani', isCorrect: false },
        { answerText: 'Gautam Adani', isCorrect: false },
      ],
    },
    // {
    //   questionText: 'who is richest person in the world?',
    //   answerOptions: [
    //     { answerText: 'Jeff Bezos', isCorrect: false },
    //     { answerText: 'Elon Musk', isCorrect: true },
    //     { answerText: 'Mukesh Ambani', isCorrect: false },
    //     { answerText: 'Warren Buffett', isCorrect: false },
    //   ],
    // },
    // {
    //   questionText: 'how many countries in the world?',
    //   answerOptions: [
    //     { answerText: '120', isCorrect: false },
    //     { answerText: '183', isCorrect: false },
    //     { answerText: '170', isCorrect: false },
    //     { answerText: '195', isCorrect: true },
    //   ],
    // },
  ]

  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [showScore, setShowScore] = useState(false)
  const [score, setScore] = useState(0)
  const handleAnswerButtonClick = isCorrect => {
    if (isCorrect === true) {
      setScore(score + 1)
    }

    const nextQuetions = currentQuestion + 1
    if (nextQuetions < questions.length) {
      setCurrentQuestion(nextQuetions)
    } else {
      setShowScore(true)
    }
  }

  return (
    <>
      <h1 className="header">Quiz for Course {id} </h1>
      <div className="app">
        {showScore ? (
          <div
            className="score-section"
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            You scored {score} out of {questions.length}
            <div>Satus = {status}</div>
            {score == questions.length ? (
              <>
                <button style={{ color: '#00b5ad', borderColor: '#00b5ad' }}>
                  Delme Complete and refund
                </button>

                <TxButton
                  label="Complete and Refund"
                  type="SIGNED-TX"
                  setStatus={setStatus}
                  // onClick={push(`/course/${id}`)}
                  attrs={{
                    palletRpc: 'substrateTode',
                    callable: 'attendCourse',
                    // !!!!!!! TODO fix here
                    // inputParams: [course.slug, course.price],
                    inputParams: [id, 2],
                    paramFields: [true, true],
                  }}
                />
              </>
            ) : (
              <>
                {' '}
                <div>
                  Score {questions.length} is required to complete the course{' '}
                </div>
                <button onClick={() => push(`/course/${id}`)}>
                  Back to course
                </button>
              </>
            )}
          </div>
        ) : (
          <>
            <div className="question-section">
              <div className="question-count">
                <span>Question {currentQuestion + 1}</span>
                {questions.length}
              </div>
              <div className="question-text">
                {questions[currentQuestion].questionText}
              </div>
            </div>

            <div className="answer-section">
              {questions[currentQuestion].answerOptions.map(answerOptions => (
                <button
                  onClick={() =>
                    handleAnswerButtonClick(answerOptions.isCorrect)
                  }
                >
                  {answerOptions.answerText}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </>
  )
}

export default Quiz
