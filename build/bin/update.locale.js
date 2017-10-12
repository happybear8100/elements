const { utils, request, apis } = require('./base')
const xml2js = require('xml2js')
const xmlParser = new xml2js.Parser({ explicitArray: false, ignoreAttrs: false })
const parseString = utils.promisify(xmlParser.parseString)
const jsonBuilder = new xml2js.Builder({ xmldec: {
  version: '1.0',
  encoding: 'utf-8',
  standalone: false,
}})

;(async() => {
  console.log('Making messages.xlf...')
  require('child_process').spawn('npm', ['run', 'i18n'])
  
  const localSourcePath = `${__dirname}/../../ex/messages.xlf`
  const saveUnits = async(next) => {
    const file = await utils.readFile(localSourcePath)
    const result = await parseString(file)
    const units = result.xliff.file.body['trans-unit']
    result.xliff.file.body['trans-unit'] = units.map(unit => {
      const id = unit['$']['id']
      const nextUnit = next.find(u => u.unit_id === id) || { target: unit.source }
      return Object.assign({}, unit, { target: nextUnit.target })
    })
    const xml = jsonBuilder.buildObject(result)
    await utils.writeFile(`${__dirname}/../../ex/locale/messages.en-US.xlf`, xml, 'utf-8')
  }
 
  request({ uri: apis.elements, method: 'GET', headers: await apis.makeHeader() })
  .then(units => {
    const next = JSON.parse(units || '[]')
    if (!next || !next.length) {
      return console.log('Completed. Nothing has changed.')
    }
    saveUnits(JSON.parse(units)).then(() => console.log('Updated.'))
  })
  .catch(e => apis.catch(e))
  
})()
