// p2p/discovery.ts
import { createLibp2p } from 'libp2p'
import { tcp } from '@libp2p/tcp'
import { noise } from '@chainsafe/libp2p-noise'
import { mplex } from '@libp2p/mplex'
import { bootstrap } from '@libp2p/bootstrap'
import { identify } from '@libp2p/identify'
import { holePunching } from '@libp2p/hole-punching'

export async function createNode() {
  const node = await createLibp2p({
    transports: [tcp()],
    connectionEncryption: [noise()],
    streamMuxers: [mplex()],
    services: {
      identify: identify(),
      holePunching: holePunching()
    },
    peerDiscovery: [
      bootstrap({
        list: [
          '/ip4/1.2.3.4/tcp/15002/p2p/QmBootstrapNode'
        ]
      })
    ]
  })

  await node.start()
  console.log('🛰 P2P Node online:', node.peerId.toString())
  return node
}
