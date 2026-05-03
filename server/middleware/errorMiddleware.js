// const postRide = (req, res) => {
//     if (!req.body.dst){
//         res.status(400) //Bad request
//         throw new Error('Please add a Destination field.')
//     }
//     res.status(200).json({message: 'Post a ride.'})
// }
// Since this was giving the error as HTML or something.

const errorHandler = (err, req, res, next) => {
    const statusCode = res.statusCode ? res.statusCode : 500
    res.status(statusCode)
    res.json({
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack
    })
}

module.exports = {
    errorHandler,
}