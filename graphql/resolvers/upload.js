const path = require('path');
const fs = require('fs');


function generateRandomString(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

module.exports = {
    Query: {
        hello:() => "hello world",
    },
    Mutation: {
        uploadFile: async(parent, { file }) => {
            const {createReadStream, filename} = await file

            const { ext } = path.parse(filename)
            const randomName = generateRandomString(12) + ext

            const stream = createReadStream()
            const pathName = path.join(__dirname, `../../public/images/${randomName}`)
            await stream.pipe(fs.createWriteStream(pathName))

            return {
                url:`http://localhost:5000/images/${randomName}`
            }
        }
    },
}