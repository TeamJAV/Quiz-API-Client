const nextAnswerIdAlphabet = (lastId) => {
    return String.fromCharCode(lastId.toUpperCase().charCodeAt(0) + 1);
};

const prevAnswerIdAlphabet = (lastId) => {
    return String.fromCharCode(lastId.toUpperCase().charCodeAt(0) - 1);
}

const createQuestionFromResponseAPI = (data) => {
    return ({
        title: data.title,
        questionType: data.question_type,
        explain: data.explain || "",
        choices: data.choices,
        correct: data.correct,
        id: data.id,
        image: data.img,
    })
}

const createQuestionFormData = (question) => {
    const formData = new FormData()
    formData.append("title", question.title);
    formData.append("question_type", question.questionType);
    formData.append("explain", question.explain);
    formData.append("choices", JSON.stringify(question.choices));
    formData.append("correct", JSON.stringify(question.correct));
    formData.append("img", question.image);
    return formData
}

export { nextAnswerIdAlphabet, prevAnswerIdAlphabet, createQuestionFromResponseAPI, createQuestionFormData };
