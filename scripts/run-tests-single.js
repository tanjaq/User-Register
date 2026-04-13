const { spawn } = require('child_process')
const fs = require('fs')

const start = Date.now()

const testPattern = process.argv[2] || ''
const outFile = process.argv[3] || 'test-runtime-single.txt'

// Use local jest binary via npx for portability
const cmd = process.platform === 'win32' ? 'npx.cmd' : 'npx'
const args = ['jest', '--coverage']
if (testPattern) args.push(testPattern)

const jestProc = spawn(cmd, args, { stdio: 'inherit', shell: true })

jestProc.on('close', (code) => {
  const durationMs = Date.now() - start
  const durationSec = (durationMs / 1000).toFixed(2)
  const out = `duration_ms:${durationMs}\nduration_s:${durationSec}\nexit_code:${code}\n`
  try {
    fs.writeFileSync(outFile, out)
    console.log(`\nTest runtime written to ${outFile} (${durationSec}s)`) 
  } catch (e) {
    console.error('Failed to write', outFile, e)
  }
  process.exit(code)
})
