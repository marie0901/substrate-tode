import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Button, Container, Grid, Row, Label, Icon } from 'semantic-ui-react'
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
      questionText: 'Hola, me llamo Pablo. ¿Cómo te __________ tú?',
      answerOptions: [
        { answerText: 'llamas', isCorrect: true },
        { answerText: 'llamo', isCorrect: false },
        { answerText: 'llaman', isCorrect: false },
        { answerText: 'llama', isCorrect: false },
      ],
    },
    {
      questionText: '¿Quién ___________ Marc Anthony?',
      answerOptions: [
        { answerText: 'es', isCorrect: true },
        { answerText: 'están', isCorrect: false },
        { answerText: 'estoy', isCorrect: false },
        { answerText: 'esta', isCorrect: false },
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
    <Container verticalAlign="middle">
      <Grid stackable>
        <Grid.Column stretched verticalAlign="middle">
          <Grid.Row>
            {/* <h1 className="header">Quiz for Course {id} </h1> */}
            <h1> </h1>
            {showScore ? (
              <h3 style={{ margin: '5rem' }}>The quize is finished.</h3>
            ) : (
              <h3 style={{ margin: '5rem' }}>
                Complete the following by selecting a suitable item.
              </h3>
            )}
          </Grid.Row>
          <Grid.Row>
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
                  {score == questions.length ? (
                    <>
                      <h2>Congratulations! </h2>
                      <p>
                        You scored {score} out of {questions.length}.{' '}
                      </p>
                      <div style={{ margin: '20px' }}>
                        {status && status.indexOf('Finalized') != -1 ? (
                          <Button onClick={() => push(`/`)}>
                            Back to All Courses
                          </Button>
                        ) : (
                          <TxButton
                            label="Complete and Refund"
                            type="SIGNED-TX"
                            setStatus={setStatus}
                            // onClick={push(`/course/${id}`)}
                            attrs={{
                              palletRpc: 'substrateTode',
                              callable: 'completeCourse',
                              // !!!!!!! TODO fix here
                              // inputParams: [course.slug, course.price],
                              inputParams: [id],
                              paramFields: [true],
                            }}
                          />
                        )}
                      </div>

                      <div style={{ fontSize: '16px' }}>{status}</div>
                    </>
                  ) : (
                    <>
                      {' '}
                      You scored {score} out of {questions.length}.
                      <div>
                        Score {questions.length} is required to complete the
                        course{' '}
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
                      {/* {questions.length} */}
                    </div>
                    <div className="question-text">
                      {questions[currentQuestion].questionText}
                    </div>
                  </div>

                  <div className="answer-section">
                    {questions[currentQuestion].answerOptions.map(
                      answerOptions => (
                        <button
                          onClick={() =>
                            handleAnswerButtonClick(answerOptions.isCorrect)
                          }
                        >
                          {answerOptions.answerText}
                        </button>
                      )
                    )}
                  </div>
                </>
              )}
            </div>
          </Grid.Row>
        </Grid.Column>
      </Grid>
    </Container>
  )
}

export default Quiz
