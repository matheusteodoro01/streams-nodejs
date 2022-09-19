import fs from 'fs'
import csv from 'csv-parser'
import { Writable, Transform } from 'stream'

const readableStreamFile = fs.createReadStream('file.csv')
const transformToObject = csv({ separator: ';' })
const transformToString = new Transform({
  objectMode: true,
  transform(chunk, encoding, callback) {
    callback(null, JSON.stringify(chunk))
  },
})
const writableStreamFile = new Writable({
  write(chunk, encoding, next) {
    const stringifyer = chunk.toString()
    const rowData = JSON.parse(stringifyer)
    console.log('PROCESSANDO', rowData)
    next()
  },
})

console.log('Iniciou', Date())
readableStreamFile
  .pipe(transformToObject)
  .pipe(transformToString)
  .pipe(writableStreamFile)
  .on('close', () => console.log('Finalizou', Date()))
