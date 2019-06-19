let app = require('./server');

const port = process.env.OPENSHIFT_NODEJS_PORT || process.env.NODE_PORT;
const ip = process.env.OPENSHIFT_NODEJS_IP || process.env.NODE_IP;

// start server
app.listen(port, () => {
  console.log(`eCommerce API listening on  ${ip}:${port}!`);
});
