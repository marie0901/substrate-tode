import React, { useEffect, useState } from 'react'
import { Form, Grid } from 'semantic-ui-react'

import { useSubstrateState } from './substrate-lib'
import { TxButton } from './substrate-lib/components'

import CourseCards from './CourseCards'

const parseKitty = ({ slug, price, gender, owner }) => ({
  slug,
  price: price.toJSON(),
  gender: 'female',
  owner: owner.toJSON(),
})

function toHexString(byteArray) {
  var s = '0x'
  byteArray.forEach(function (byte) {
    s += ('0' + (byte & 0xff).toString(16)).slice(-2)
  })
  return s
}

export default function Courses(props) {
  const { api, keyring, currentAccount } = useSubstrateState()
  const [courseIds, setCourseIds] = useState([])
  const [courses, setCourses] = useState([])
  const [status, setStatus] = useState('')
  const [myCurrentCourses, setMyCurrentCourses] = useState([])
  const [currentIds, setCurrentIds] = useState([])
  const subscribeCount = () => {
    let unsub = null

    const asyncFetch = async () => {
      unsub = await api.query.substrateTode.countForCourses(async count => {
        // Fetch all kitty keys
        const entries = await api.query.substrateTode.courses.entries()
        // console.log('!!!!! entries', entries)
        // const ids = entries.map(entry => toHexString(entry[0].slice(-32)))
        const ids = entries.map(entry => {
          // console.log('!!!!! entry', entry)
          return toHexString(entry[0].slice(-32))
        })
        setCourseIds(ids)

        const coursesMap = entries.map(entry => {
          return parseKitty(entry[1].value)
        })
        setCourses(coursesMap)
      })
    }

    asyncFetch()

    return () => {
      unsub && unsub()
    }
  }

  //
  //
  //
  //
  //
  const subscribeCurrentCourses = () => {
    let unsub = null

    const asyncFetchCurrent = async () => {
      unsub = await api.query.substrateTode.coursesCurrentAttended(
        currentAccount,
        async current => {
          console.log('!!!!! current ', current)
          //
          //
          //

          const entries =
            await api.query.substrateTode.coursesCurrentAttended.entries()
          console.log('!!!!! entries ', entries)
          const currentIds = entries.map(entry => {
            console.log('!!!!! entry', entry)
            return toHexString(entry[0].slice(-32))
          })
          setCurrentIds(currentIds)
        }
      )
    }

    asyncFetchCurrent()

    return () => {
      unsub && unsub()
    }
  }
  //
  //
  //
  //

  useEffect(subscribeCount, [api, keyring])
  useEffect(subscribeCurrentCourses, [api, keyring])

  return (
    <Grid.Column width={16}>
      <h1>Courses</h1>
      <div>{currentIds}</div>
      <CourseCards courses={courses} setStatus={setStatus} />
      <Form style={{ margin: '1em 0' }}>
        <Form.Field style={{ textAlign: 'center' }}>
          <TxButton
            label="Create Course"
            type="SIGNED-TX"
            setStatus={setStatus}
            attrs={{
              palletRpc: 'substrateTode',
              callable: 'createCourse',
              inputParams: [],
              paramFields: [],
            }}
          />
        </Form.Field>
      </Form>
      <div style={{ overflowWrap: 'break-word' }}>{status}</div>
    </Grid.Column>
  )
}
