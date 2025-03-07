export default function test(app) {
    app.get('/test', (req, res) => {res.send('Yo this works!')});
  }
  