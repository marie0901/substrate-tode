import React, { createRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Button, Container, Grid, Row, Label, Icon } from 'semantic-ui-react'

const Course = () => {
  const push = useNavigate()
  const { id } = useParams()

  return (
    <Container>
      <Grid stackable columns="equal">
        <Grid.Row>
          {/* <h2>Español Course 1</h2> */}
          <h2> </h2>
        </Grid.Row>
        <Grid.Row stretched>
          <Button
            basic
            color="black"
            icon
            labelPosition="left"
            onClick={() => push('/')}
          >
            <Icon name="left arrow" /> Back to All Courses{' '}
          </Button>
          {/* <h3>Single Course id (slug) = {id} </h3> */}
        </Grid.Row>
        <Grid.Row stretched>
          <iframe
            // src="https://www.youtube.com/embed/uXWycyeTeCs"
            src="https://www.youtube.com/embed/kJQjXAVEWt0?controls=0"
            width={1000}
            height={500}
          ></iframe>
        </Grid.Row>
        <Grid.Row stretched>
          <h2> </h2>
          <h2> </h2>
          <Button color="blue" onClick={() => push(`/quiz/${id}`)}>
            Quiz
          </Button>
        </Grid.Row>
      </Grid>
    </Container>
  )
}

export default Course
