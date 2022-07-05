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

import KittyAvatar from './KittyAvatar'
import { useSubstrateState } from './substrate-lib'
import { TxButton } from './substrate-lib/components'

//******************** */ Doing AttendCourse ***********************
//
//
//
//
//
//
//
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

//
//
//
//
//
//
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
  const { course, setStatus } = props
  const { slug = null, owner = null, gender = null, price = null } = course
  const displayDna = slug && slug.toJSON()
  const { currentAccount } = useSubstrateState()
  const isSelf = currentAccount.address === course.owner

  return (
    <Card>
      {isSelf && (
        <Label as="a" floating color="teal">
          Mine
        </Label>
      )}
      <KittyAvatar dna={slug.toU8a()} />
      <Card.Content>
        <Card.Meta style={{ fontSize: '.9em', overflowWrap: 'break-word' }}>
          DNA: {displayDna}
        </Card.Meta>
        <Card.Description>
          <p style={{ overflowWrap: 'break-word' }}>Gender: {gender}</p>
          <p style={{ overflowWrap: 'break-word' }}>Owner: {owner}</p>
          <p style={{ overflowWrap: 'break-word' }}>
            Price: {price || 'Not For Sale'}
          </p>
        </Card.Description>
      </Card.Content>
      <Card.Content extra style={{ textAlign: 'center' }}>
        {owner === currentAccount.address ? (
          <>
            <SetPrice course={course} setStatus={setStatus} />
            <TransferModal course={course} setStatus={setStatus} />
          </>
        ) : (
          <>
            <BuyCourse course={course} setStatus={setStatus} />
          </>
        )}
      </Card.Content>

      <Card.Content>
        <>
          <h1>MMMMMMMMMMMMM</h1>
          <AttendCourse course={course} setStatus={setStatus} />
        </>
      </Card.Content>

      <Card.Content>
        <Button>
          <Link to={`/course/${slug}`}>Go to Course</Link>
        </Button>
      </Card.Content>
    </Card>
  )
}

const CourseCards = props => {
  const { courses, setStatus } = props

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
          <CourseCard course={course} setStatus={setStatus} />
        </Grid.Column>
      ))}
    </Grid>
  )
}

export default CourseCards
