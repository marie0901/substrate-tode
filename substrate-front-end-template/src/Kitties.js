import React, { useEffect, useState } from 'react'
import { Form, Grid } from 'semantic-ui-react'

import { useSubstrateState } from './substrate-lib'
import { TxButton } from './substrate-lib/components'

import KittyCards from './KittyCards'

const parseKitty = ({ dna, price, gender, owner }) => ({
  dna,
  price: price.toJSON(),
  gender: gender.toJSON(),
  owner: owner.toJSON(),
})

function toHexString(byteArray) {
  var s = '0x'
  byteArray.forEach(function (byte) {
    s += ('0' + (byte & 0xff).toString(16)).slice(-2)
  })
  return s
}

export default function Kitties(props) {
  const { api, keyring } = useSubstrateState()
  const [kittyIds, setKittyIds] = useState([])
  const [kitties, setKitties] = useState([])
  const [status, setStatus] = useState('')

  const subscribeCount = () => {
    let unsub = null

    const asyncFetch = async () => {
      unsub = await api.query.substrateKitties.countForKitties(async count => {
        // Fetch all kitty keys
        const entries = await api.query.substrateKitties.kitties.entries()
        console.log('!!!!! entries', entries)
        // const ids = entries.map(entry => toHexString(entry[0].slice(-32)))
        const ids = entries.map(entry => {
          console.log('!!!!! entry', entry)
          return toHexString(entry[0].slice(-32))
        })
        setKittyIds(ids)

        const kittiesMap = entries.map(entry => {
          console.log('!!!!kitty', entry[1].value.dna)

          return parseKitty(entry[1].value)
        })
        setKitties(kittiesMap)
      })
    }

    asyncFetch()

    return () => {
      unsub && unsub()
    }
  }

  // const subscribeKitties = () => {
  //   let unsub = null

  //   const asyncFetch = async () => {
  //     const k0 = await api.query.substrateKitties.kitties(
  //       '0xfc3cf622247e7f72ce6ac0e85d0ba359108998842f60cc6175c741e27afaff1b'
  //     )
  //     console.log('!!!!k0', k0)
  //     unsub = await api.query.substrateKitties.kitties.multi(
  //       kittyIds,
  //       kitties => {
  //         console.log('!!!!kittyIds', kittyIds)
  //         // console.log('!!!!kitties', kitties)
  //         const kittiesMap = kitties.map(kitty => {
  //           console.log('!!!!kitty', kitty)

  //           console.log('!!!!222kitty', kitty.unwrapOr(api.createType(117)))

  //           console.log('!!!!kitty.unwrap()', kitty.unwrap())
  //           return parseKitty(kitty.unwrap())
  //         })
  //         setKitties(kittiesMap)
  //       }
  //     )
  //   }

  //   asyncFetch()

  //   return () => {
  //     unsub && unsub()
  //   }
  // }

  useEffect(subscribeCount, [api, keyring])
  // useEffect(subscribeKitties, [api, keyring, kittyIds])

  return (
    <Grid.Column width={16}>
      <h1>Kitties</h1>
      <KittyCards kitties={kitties} setStatus={setStatus} />
      <Form style={{ margin: '1em 0' }}>
        <Form.Field style={{ textAlign: 'center' }}>
          <TxButton
            label="Create Kitty"
            type="SIGNED-TX"
            setStatus={setStatus}
            attrs={{
              palletRpc: 'substrateKitties',
              callable: 'createKitty',
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
