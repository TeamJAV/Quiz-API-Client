const nextAnswerIdAlphabet = (lastId) => {
    return String.fromCharCode(lastId.toUpperCase().charCodeAt(0) + 1);
};

const prevAnswerIdAlphabet = (lastId) => {
    return String.fromCharCode(lastId.toUpperCase().charCodeAt(0) - 1);
}

export { nextAnswerIdAlphabet, prevAnswerIdAlphabet };
