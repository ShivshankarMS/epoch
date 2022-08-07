const express = require('express');
const validate = require('jsonschema').validate;
const promMid = require('express-prometheus-middleware');
const cors = require('cors');

const app = express();
app.use(express.static('dist'));

const corsOption = {
    origin: ['http://localhost:3000'],
};

app.use(cors(corsOption));

//403 will be written if there is no authorization header in the request body
app.use(function (req, res, next) {
    if (!req.headers.authorization) {
        return res.status(403).json({ error: 'No credentials sent!' });
    }
    next();
});

//API which will give server epoch in seconds and after schema validation, otherwise it will return validation error
app.get('/time', (req, res) => {
    const schema = {
        "properties": {
            "epoch": {
                "description": `The current server time, in epoch seconds, at time of processing the request.`,
                "type": "number"
            }
        },
        "required": ["epoch"],
        "type": "object"
    }
    const epoch = Math.round(Date.now() / 1000);
    const result = validate({ epoch }, schema);
    if (!result.errors.length) {
        res.send({ epoch: epoch })
    } else {
        res.status(500).json({ error: 'Something Went Wrong!!!!!' });
    }
});

// Hosted express-prometheus-middleware server which will provide many matrics
app.use(promMid({
    metricsPath: '/metrics',
    collectDefaultMetrics: true,
    requestDurationBuckets: [0.1, 0.5, 1, 1.5],
    requestLengthBuckets: [512, 1024, 5120, 10240, 51200, 102400],
    responseLengthBuckets: [512, 1024, 5120, 10240, 51200, 102400],
}));

app.listen(process.env.PORT || 3001, () => console.log(`Listening on port ${process.env.PORT || 3001}!`));
