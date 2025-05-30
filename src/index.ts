import express from 'express';
import morgan from 'morgan';
import router from './routes/auth.routes';
import connectDB from './config/db';

const app = express();
const PORT  = process.env.PORT || 4000;

app.use(express.json());
app.use(morgan('dev'));

app.use('/api/v1/auth', router);

connectDB().then(()=>{
    app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
})


