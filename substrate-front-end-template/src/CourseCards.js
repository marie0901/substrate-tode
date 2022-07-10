import React from 'react'
import { Link } from 'react-router-dom'
import {
  Button,
  Card,
  Grid,
  Message,
  Modal,
  Form,
  Label,
} from 'semantic-ui-react'

import CourseAvatar from './CourseAvatar'
import { useSubstrateState } from './substrate-lib'
import { TxButton } from './substrate-lib/components'

//*********************  AttendCourse ***********************
const AttendCourse = props => {
  const { course, setStatus } = props
  const [open, setOpen] = React.useState(false)

  const confirmAndClose = unsub => {
    setOpen(false)
    if (unsub && typeof unsub === 'function') unsub()
  }

  return (
    <Modal
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
      trigger={
        <Button basic color="green">
          Attend Course
        </Button>
      }
    >
      <Modal.Header>AttendCourse</Modal.Header>
      <Modal.Content>
        <Form>
          <Form.Input fluid label="Course ID" readOnly value={course.slug} />
          <Form.Input
            fluid
            label="Price"
            readOnly
            value={course.price / 1000000000}
          />
        </Form>
      </Modal.Content>
      <Modal.Actions>
        <Button basic color="grey" onClick={() => setOpen(false)}>
          Cancel
        </Button>
        <TxButton
          label="Attend Course"
          type="SIGNED-TX"
          setStatus={setStatus}
          onClick={confirmAndClose}
          attrs={{
            palletRpc: 'substrateTode',
            callable: 'attendCourse',
            inputParams: [course.slug, course.price],
            paramFields: [true, true],
          }}
        />
      </Modal.Actions>
    </Modal>
  )
}
// ******************** End of AttendCourse *********************************

// --- Transfer Modal ---

const TransferModal = props => {
  const { course, setStatus } = props
  const [open, setOpen] = React.useState(false)
  const [formValue, setFormValue] = React.useState({})

  const formChange = key => (ev, el) => {
    setFormValue({ ...formValue, [key]: el.value })
  }

  const confirmAndClose = unsub => {
    setOpen(false)
    if (unsub && typeof unsub === 'function') unsub()
  }

  return (
    <Modal
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
      trigger={
        <Button basic color="blue">
          Transfer
        </Button>
      }
    >
      <Modal.Header>Course Transfer</Modal.Header>
      <Modal.Content>
        <Form>
          <Form.Input fluid label="Course ID" readOnly value={course.slug} />
          <Form.Input
            fluid
            label="Receiver"
            placeholder="Receiver Address"
            onChange={formChange('target')}
          />
        </Form>
      </Modal.Content>
      <Modal.Actions>
        <Button basic color="grey" onClick={() => setOpen(false)}>
          Cancel
        </Button>
        <TxButton
          label="Transfer"
          type="SIGNED-TX"
          setStatus={setStatus}
          onClick={confirmAndClose}
          attrs={{
            palletRpc: 'substrateTode',
            callable: 'transfer',
            inputParams: [formValue.target, course.slug],
            paramFields: [true, true],
          }}
        />
      </Modal.Actions>
    </Modal>
  )
}

// --- Set Price ---

const SetPrice = props => {
  const { course, setStatus } = props
  const [open, setOpen] = React.useState(false)
  const [formValue, setFormValue] = React.useState({})

  const formChange = key => (ev, el) => {
    setFormValue({ ...formValue, [key]: el.value })
  }

  const confirmAndClose = unsub => {
    setOpen(false)
    if (unsub && typeof unsub === 'function') unsub()
  }

  return (
    <Modal
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
      trigger={
        <Button basic color="blue">
          Set Price
        </Button>
      }
    >
      <Modal.Header>Set Course Price</Modal.Header>
      <Modal.Content>
        <Form>
          <Form.Input fluid label="Course ID" readOnly value={course.slug} />
          <Form.Input
            fluid
            label="Price"
            placeholder="Enter Price"
            onChange={formChange('target')}
          />
        </Form>
      </Modal.Content>
      <Modal.Actions>
        <Button basic color="grey" onClick={() => setOpen(false)}>
          Cancel
        </Button>
        <TxButton
          label="Set Price"
          type="SIGNED-TX"
          setStatus={setStatus}
          onClick={confirmAndClose}
          attrs={{
            palletRpc: 'substrateTode',
            callable: 'setPrice',
            inputParams: [course.slug, formValue.target],
            paramFields: [true, true],
          }}
        />
      </Modal.Actions>
    </Modal>
  )
}

// --- Buy Course ---

const BuyCourse = props => {
  const { course, setStatus } = props
  const [open, setOpen] = React.useState(false)

  const confirmAndClose = unsub => {
    setOpen(false)
    if (unsub && typeof unsub === 'function') unsub()
  }

  if (!course.price) {
    return <></>
  }

  return (
    <Modal
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
      trigger={
        <Button basic color="green">
          Buy Course
        </Button>
      }
    >
      <Modal.Header>Buy Course</Modal.Header>
      <Modal.Content>
        <Form>
          <Form.Input fluid label="Course ID" readOnly value={course.slug} />
          <Form.Input fluid label="Price" readOnly value={course.price} />
        </Form>
      </Modal.Content>
      <Modal.Actions>
        <Button basic color="grey" onClick={() => setOpen(false)}>
          Cancel
        </Button>
        <TxButton
          label="Buy Course"
          type="SIGNED-TX"
          setStatus={setStatus}
          onClick={confirmAndClose}
          attrs={{
            palletRpc: 'substrateTode',
            callable: 'buyCourse',
            inputParams: [course.slug, course.price],
            paramFields: [true, true],
          }}
        />
      </Modal.Actions>
    </Modal>
  )
}

// --- About Course Card ---

const CourseCard = props => {
  const { course, setStatus, currentIds, completedIds, image } = props
  const { slug = null, owner = null, gender = null, price = null } = course
  const displayDna = slug && slug.toJSON()
  const { currentAccount } = useSubstrateState()
  const isSelf = currentAccount.address === course.owner
  const isCurrent = currentIds.find(id => id == slug)
  const isCompleted = completedIds.find(id => id == slug)

  return (
    <Card>
      {isSelf && (
        <Label as="a" floating color="teal">
          Mine
        </Label>
      )}
      {isCurrent && (
        <Label as="a" floating color="green">
          Current
        </Label>
      )}
      {isCompleted && !isCurrent && (
        <Label as="a" floating color="blue">
          Completed
        </Label>
      )}
      <CourseAvatar dna={slug.toU8a()} image={image} />
      <Card.Content>
        <Card.Meta style={{ fontSize: '.9em', overflowWrap: 'break-word' }}>
          Course Id: {displayDna}
        </Card.Meta>
        <Card.Description>
          <p style={{ overflowWrap: 'break-word' }}>
            Owner: {`TODE Lauguage University`}
          </p>
          <p style={{ overflowWrap: 'break-word' }}>
            Price: {price / 1000000000 || 'Not For Sale'}
          </p>
        </Card.Description>
      </Card.Content>

      {owner === currentAccount.address ? (
        <Card.Content extra style={{ textAlign: 'center' }}>
          <>
            <SetPrice course={course} setStatus={setStatus} />
            <TransferModal course={course} setStatus={setStatus} />
          </>
        </Card.Content>
      ) : (
        <>{/* <BuyCourse course={course} setStatus={setStatus} /> */}</>
      )}

      <Card.Content>
        {!isCurrent && <AttendCourse course={course} setStatus={setStatus} />}

        {isCurrent && (
          <Button basic color="blue">
            <Link to={`/course/${slug}`}>Go to Course</Link>
          </Button>
        )}
      </Card.Content>
    </Card>
  )
}

const CourseCards = props => {
  const { courses, setStatus, currentIds, completedIds } = props

  if (courses.length === 0) {
    return (
      <Message info>
        <Message.Header>
          No Course found here... Create one now!&nbsp;
          <span role="img" aria-label="point-down">
            👇
          </span>
        </Message.Header>
      </Message>
    )
  }

  return (
    <Grid columns={3}>
      {courses.map((course, i) => (
        <Grid.Column key={`course-${i}`}>
          <CourseCard
            course={course}
            setStatus={setStatus}
            currentIds={currentIds}
            completedIds={completedIds}
            image={(i % 3) + 1}
          />
        </Grid.Column>
      ))}
    </Grid>
  )
}

export default CourseCards
