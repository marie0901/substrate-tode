import React, { createRef } from 'react'

import { useParams, useNavigate } from 'react-router-dom'

const Course = () => {
  const push = useNavigate()
  const { id } = useParams()

  return (
    <div>
      <h1>Single Course id (slug) = {id} </h1>
      <button onClick={() => push('/')}>Go back</button>
      <h2>
        {' '}
        Here the content of the course, can be embedded video from youtube or
        vimeo
      </h2>
      <h2> </h2>
      <h2> </h2>
      <button>Quiz to complete</button>
      <h3> On click open Quiz modal</h3>
      <h3>
        {' '}
        Set state quizStatus to "Success" of "Failed" when close the modal
      </h3>
    </div>
  )
}

export default Course
