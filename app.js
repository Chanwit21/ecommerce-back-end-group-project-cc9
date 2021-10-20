require('dotenv').config();
require('./config/passport');
const express = require('express');
const app = express();
const cors = require('cors');
const passport = require('passport');
const userRoute = require('./routes/user');
const { errorMiddleWare } = require('./middleware/error');
// const { sequelize } = require('./models');
// sequelize.sync({ force: true });

app.use(cors());
app.use(express.json());
app.use(passport.initialize());

app.use('/users', userRoute);
app.use('/cart', userRoute);

app.use((req, res, next) => {
  res.status(404).json({ message: 'resource not found!!' });
});

app.use(errorMiddleWare);

const port = process.env.PORT || 8001;

app.listen(port, () => console.log(`Server is running on port ${port}......`));
