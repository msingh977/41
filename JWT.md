- create a new file 'index.js'
- install dependencies:
```sh
yarn init -y
yarn add express nodemone
```
- in the `index.js` file add:
```javascript
const express = require('express')
const app = new express()
const PORT = process.env.PORT || 3000

app.get('/', (req,res,next)=> {
    res.send('hello from express jwt.')
})

app.listen(PORT)
```