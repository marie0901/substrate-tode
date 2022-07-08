import React, { createRef } from 'react'

import { useParams, useNavigate } from 'react-router-dom'

const Course = () => {
  const push = useNavigate()
  const { id } = useParams()

  return (
    <div>
      <h1>Single Course id (slug) = {id} </h1>
      <button onClick={() => push('/')}> Back to All Courses </button>
      <h2>
        {' '}
        Here the content of the course, can be embedded video from youtube or
        vimeo
      </h2>
      <h3>Iframes in React</h3>
      <iframe
        src="https://www.youtube.com/embed/uXWycyeTeCs"
        width={1000}
        height={500}
      ></iframe>

      <h2> </h2>
      <h2> </h2>
      <button onClick={() => push(`/quiz/${id}`)}>Quiz</button>
      <h3> On click open Quiz modal</h3>

      <h3>
        {' '}
        Set state quizStatus to "Success" of "Failed" when close the modal
      </h3>
    </div>
  )
}

export default Course
