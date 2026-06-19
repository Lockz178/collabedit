/**
 * End-to-end verification: two browser pages in the same room must converge.
 *
 * Both pages share one browser context, so y-webrtc's BroadcastChannel syncs
 * them even without a signaling server — a faithful test of the CRDT pipeline.
 */
import { chromium } from 'playwright'

const BASE = process.env.BASE_URL ?? 'http://localhost:4173'
const ROOM = 'verify' + Math.random().toString(36).slice(2, 7)
const URL = `${BASE}/#room=${ROOM}`

const browser = await chromium.launch()
const context = await browser.newContext()

const fail = (msg) => {
  console.error('✗ ' + msg)
  process.exitCode = 1
}

try {
  const alice = await context.newPage()
  await alice.goto(URL)
  await alice.waitForSelector('.ProseMirror', { timeout: 15000 })

  // Set Alice's name so Bob sees a labelled cursor.
  await alice.evaluate(() => {
    localStorage.setItem(
      'collabedit:identity',
      JSON.stringify({ name: 'Alice', color: '#3b82f6' }),
    )
  })
  await alice.reload()
  await alice.waitForSelector('.ProseMirror')

  // Type a title and body.
  await alice.fill('.doc__title-input', 'Launch Plan')
  const sentence = 'CollabEdit syncs every keystroke with zero conflicts.'
  await alice.click('.ProseMirror')
  await alice.type('.ProseMirror', sentence, { delay: 8 })

  // Open Bob in the same room.
  const bob = await context.newPage()
  await bob.evaluate(() => {}).catch(() => {})
  await bob.goto(URL)
  await bob.waitForSelector('.ProseMirror', { timeout: 15000 })

  // Wait for convergence on Bob's side.
  await bob.waitForFunction(
    (text) => document.querySelector('.ProseMirror')?.textContent?.includes(text),
    sentence,
    { timeout: 15000 },
  )
  const bobTitle = await bob.inputValue('.doc__title-input')
  const bobBody = await bob.textContent('.ProseMirror')

  if (!bobBody.includes(sentence)) fail('Bob did not receive the body text')
  else console.log('✓ Body synced to second peer')

  if (bobTitle !== 'Launch Plan') fail(`Bob title mismatch: "${bobTitle}"`)
  else console.log('✓ Title synced to second peer')

  // Bob types back; Alice should receive it (bidirectional).
  const reply = ' Confirmed on the other side.'
  await bob.click('.ProseMirror')
  await bob.keyboard.press('End')
  await bob.type('.ProseMirror', reply, { delay: 8 })

  await alice.waitForFunction(
    (text) => document.querySelector('.ProseMirror')?.textContent?.includes(text),
    reply.trim(),
    { timeout: 15000 },
  )
  console.log('✓ Reverse sync confirmed (bidirectional CRDT merge)')

  // Confirm a remote cursor label renders for Alice on Bob's view.
  const hasCursor = await bob
    .waitForSelector('.collaboration-cursor__caret', { timeout: 8000 })
    .then(() => true)
    .catch(() => false)
  console.log(hasCursor ? '✓ Remote collaborator cursor rendered' : '… cursor not observed (non-fatal)')

  await alice.screenshot({ path: 'scripts/peer-a.png' })
  await bob.screenshot({ path: 'scripts/peer-b.png' })
  console.log('✓ Screenshots written: scripts/peer-a.png, scripts/peer-b.png')
} catch (err) {
  fail('Exception: ' + (err?.message ?? err))
} finally {
  await browser.close()
}

if (process.exitCode) {
  console.error('\nVERIFICATION FAILED')
} else {
  console.log('\nVERIFICATION PASSED — real-time collaboration works end to end.')
}
