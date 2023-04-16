import { Stats, lstatSync, readFileSync } from 'fs'
import { createServer } from 'http'
import { join } from 'path'

import { trimSlashes } from '../helpers'

const port = parseInt(process.env.PORT || '3000')

const server = createServer(async (req, res) => {
  const path = join(
    process.cwd(),
    'public',
    trimSlashes(req.url) || 'index.html'
  ) 

  let stat: Stats | undefined = undefined 

  try {
    stat = lstatSync(path)
  } 
  catch {}
  
  if(stat?.isFile()) {
    const data = readFileSync(path)

    if(path.endsWith('.js')) {
      res.setHeader('Content-Type', 'application/javascript; charset=UTF-8')
    } 
    else if(path.endsWith('.svg')) {
      res.setHeader('Content-Type', 'image/svg+xml')
    } 
    else if(path.endsWith('.png')) {
      res.setHeader('Content-Type', 'image/png')
    } 
    else if(path.endsWith('.css')) {
      res.setHeader('Content-Type', 'text/css; charset=UTF-8');
    }

    res.write(data)
  } 
  else {
    res.statusCode = 404
    res.setHeader('Content-Type', 'text/html;charset=UTF-8')
    res.write(`${req.method} ${req.url} not found`)  
  }

  res.end()
})

server.listen(port, undefined, undefined, () => {
  console.log(`Server listening on port ${port}`)  
})
