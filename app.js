require('dotenv').config();
require('./config/passport');
const express = require('express');
const app = express();
const cors = require('cors');
const passport = require('passport');
const { errorMiddleWare } = require('./middleware/error');
const userRoute = require('./routes/user');
const productRouter = require('./routes/productRouter');
const cartRoute = require('./routes/cart');
// const { sequelize } = require('./models');
// sequelize.sync({ force: true });

app.use(cors());
app.use(express.json());
app.use(passport.initialize());

app.use('/users', userRoute);
app.use('/product', productRouter);
app.use('/carts', cartRoute);

app.use((req, res, next) => {
  res.status(404).json({ message: 'resource not found!!' });
});

app.use(errorMiddleWare);

const port = process.env.PORT || 8001;

app.listen(port, () => console.log(`Server is running on port ${port}......`));
