const nextAnswerIdAlphabet = (lastId) => {
    return String.fromCharCode(lastId.toUpperCase().charCodeAt(0) + 1);
};

const prevAnswerIdAlphabet = (lastId) => {
    return String.fromCharCode(lastId.toUpperCase().charCodeAt(0) - 1);
};

const createQuestionFromResponseAPI = (data) => {
    return {
        title: data.title,
        questionType: data.question_type,
        explain: data.explain || "",
        choices: data.choices,
        correct: data.correct,
        id: data.id,
        image: data.img,
    };
};

const createQuestionFormData = (question) => {
    const formData = new FormData();
    formData.append("title", question.title);
    formData.append("question_type", question.questionType);
    formData.append("explain", question.explain);
    formData.append("choices", JSON.stringify(question.choices));
    formData.append("correct", JSON.stringify(question.correct));
    formData.append("img", question.image);
    return formData;
};

function shuffleQuestions(array) {
    let currentIndex = array.length,
        randomIndex;
    // While there remain elements to shuffle...
    // while (--currentIndex > 0) {
    //     // Pick a remaining element...
    //     randomIndex = Math.floor(Math.random() * (currentIndex + 1));
    //     // And swap it with the current element.
    //     [array[currentIndex], array[randomIndex]] = [
    //         array[randomIndex],
    //         array[currentIndex],
    //     ];
    //     // console.log(array);
    // }
    while (currentIndex !== 0) {
        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex--);
        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex],
            array[currentIndex],
        ];
        // console.log(array);
    }

    return array;
}

function shuffleChoices(array) {
    const choices = array;
    let mapping = {};
    let currentIndex = choices.length,
        randomIndex;

    //choices = [["A", "dap an a"], ["B", "dap an b"]] -> [['A', 'dap an b'], ['B', 'dap an a']]
    //mapping = {"A": "B", "B": "A"}
    while (currentIndex !== 0) {
        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex--);

        const original = choices[currentIndex];
        const random = choices[randomIndex];

        // And swap it with the current element.
        // "1" meaning only swap the value of the answer
        [original[1], random[1]] = [random[1], original[1]];

        // And memorize the original key of the value we swapped
        if (mapping[original[0]]) {
            mapping[random[0]] = mapping[original[0]];
            mapping[original[0]] = mapping[random[0]] || random[0];
        } else {
            mapping[original[0]] = mapping[random[0]] || random[0];
            mapping[random[0]] = original[0];
        }
    }

    return {
        choices: choices,
        mapping: mapping,
        answered: [],
        isSubmitted: false,
    };
}

function noShuffleChoices(array) {
    let mapping = {};
    array.forEach((element) => {
        const key = element[0];
        mapping[key] = key;
    });
    return {
        choices: Object.assign(array),
        mapping: mapping,
        answered: [],
        isSubmitted: false,
    };
}

const handleShuffleQuiz = (
    array,
    isQuestionsShuffled = false,
    isChoicesShuffled = false
) => {
    const shuffledQuestionsQuiz = isQuestionsShuffled
        ? shuffleQuestions(array)
        : array;
    const shuffledChoicesQuiz = shuffledQuestionsQuiz.map((q) => {
        const { choices, mapping, answered } =
            isChoicesShuffled && q.question_type !== "true-false"
                ? shuffleChoices(Object.entries(q.choices))
                : noShuffleChoices(Object.entries(q.choices));
        return { ...q, choices, mapping, answered };
    });
    return shuffledChoicesQuiz;
};

export {
    nextAnswerIdAlphabet,
    prevAnswerIdAlphabet,
    createQuestionFromResponseAPI,
    createQuestionFormData,
    handleShuffleQuiz,
};
