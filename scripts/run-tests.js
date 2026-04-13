const { spawn } = require('child_process')
const fs = require('fs')

const start = Date.now()

// Use local jest binary via npx for portability
const cmd = process.platform === 'win32' ? 'npx.cmd' : 'npx'
const jest = spawn(cmd, ['jest', '--coverage'], { stdio: 'inherit', shell: true })

jest.on('close', (code) => {
  const durationMs = Date.now() - start
  const durationSec = (durationMs / 1000).toFixed(2)
  const out = `duration_ms:${durationMs}\nduration_s:${durationSec}\nexit_code:${code}\n`
  try {
    fs.writeFileSync('test-runtime.txt', out)
    console.log(`\nTest runtime written to test-runtime.txt (${durationSec}s)`) 
  } catch (e) {
    console.error('Failed to write test-runtime.txt', e)
  }
  process.exit(code)
})
