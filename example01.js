import knex from 'knex'
import { Writable, Transform } from 'stream'

const knexInstance = knex({
  client: 'mysql',
  connection: {
    port: 0,
    host: '',
    user: '',
    password: '',
    database: '',
  },
})

const readableStream = knexInstance
  .select(knexInstance.raw('* FROM Offers;'))
  .stream()

const transformToString = new Transform({
  objectMode: true,
  transform(chunk, encoding, callback) {
    callback(null, JSON.stringify(chunk))
  },
})
const writableStream = new Writable({
  write(chunk, encoding, next) {
    const stringifyer = chunk.toString()
    const rowData = JSON.parse(stringifyer)
    console.log('PROCESSANDO', rowData)
    next()
  },
})

console.log('Iniciou', Date())
readableStream
  .pipe(transformToString)
  .pipe(writableStream)
  .on('close', () => console.log('Finalizou', Date()))
