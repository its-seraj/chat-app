const generateMessage = (text) => {
    return {
        text,
        createdAt: new Date().getTime()
    }
}

const generateLocation = (text) => {
    return {
        url: `https://google.com/maps?o=${text.latitude},${text.longitude}`,
        createdAt: new Date().getTime()
    }
}
module.exports = {
    generateMessage,
    generateLocation,
}