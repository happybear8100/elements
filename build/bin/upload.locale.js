const fs = require('fs')
const util = require('util')
const exists = util.promisify(fs.exists)
const readFile = util.promisify(fs.readFile)
const request = require('request-promise-native')
const { JSDOM } = require("jsdom")

const findToken = async() => {
  const tokenFilePath = `${__dirname}/../../.git/authentication_token.txt`
  if (!await exists(tokenFilePath)) return
  return await readFile(tokenFilePath, 'utf-8')
}

;(async () => {
  const localSourcePath = `${__dirname}/../../ex/messages.xlf`
  const msgFileIsExist = await exists(localSourcePath)
  if (!msgFileIsExist) {
    console.log('making messages file...')
    require('child_process').spawn('npm', ['run', 'i18n'])
  }
  
  const msgFile = await readFile(localSourcePath, 'utf-8')
  const { document } = new JSDOM(msgFile, {contentType: "text/xml",}).window
  const units = Array.from(document.querySelectorAll('trans-unit')).map(v => {
    return {
      source: v.querySelector('source').textContent,
      unit_id: v.getAttribute('id'),
      target: 'rr',
      line_number: +v.querySelector('context[context-type="linenumber"]').textContent,
      source_file: v.querySelector('context[context-type="sourcefile"]').textContent,
    }
  })
  const token = await findToken()
  request({
    uri: 'http://127.0.0.1:3000/elements',
    method: 'POST',
    headers: {
      'User-Agent': 'request',
      'Content-Type': 'application/json',
      'authorization': `Token token=${token}`,
    },
    json: { units: units },
  })
  .then(() => console.log('updated locale keys!'))
  .catch(e => {
    if (e.statusCode === 403) {
      return console.log('Authentication failed, try login.')
    }
    console.log('error: ', e.statusCode)
  })
  
})()

