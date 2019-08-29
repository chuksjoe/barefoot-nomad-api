import express from 'express';
import dotenv from 'dotenv';
import logger from 'morgan';
import debug from 'debug';
import cors from 'cors';
import methodOverride from 'method-override';
import route from './routes/api/authRoute';

// import routes from './routes/api/indexRoute';
import message from './utils/messageUtils';
import response from './utils/response';
import statusCode from './utils/statusCode';
import routes from './routes/api';

dotenv.config();
const debugLog = debug('web-app');

const app = express();
const { port } = process.env;
const prefix = '/api/v1';

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// Enable Cross-Origin Resource Sharing (CORS)
app.use(cors());
app.options('*', cors());

app.use(methodOverride());
app.use("/api", route);
// serve the api endpoints built in routes folder
routes(prefix, app);

app.get(`${prefix}/`, (req, res) => {
    response.successResponse(res, statusCode.success, message.welcome);
});

const isProduction = process.env.NODE_ENV === 'production';

// catch 404 and forward to error handler
app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (!isProduction) {
    app.use((err, req, res, next) => {
        debugLog(`Error Stack: ${err.stack}`);

        res.status(err.status || 500);

        res.json({
            errors: {
                message: err.message,
                error: err,
            },
        });
        next();
    });
}

// production error handler
// no stack-traces leaked to user
app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.json({
        errors: {
            message: err.message,
            error: {},
        },
    });
    next();
});

app.listen(port || 5000, () => {
    debugLog(`Barefoot-Nomad [Backend] Server is running on port ${port}`);
});

// for testing
module.exports = app;