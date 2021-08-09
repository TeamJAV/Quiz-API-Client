const _throw = (err) => {
    throw err;
};

const isURL = (str) => {
    return (
        typeof str === "string" && str !== null && str.substr(0, 4) === "http"
    );
};

const toLocaleDateString = (dateString, region) => {
    return new Date(dateString).toLocaleDateString(region, {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    });
};

const isObjectEmpty = (obj) => {
    return obj && Object.keys(obj).length === 0 && obj.constructor === Object;
};

const getErrorMessage = (error) => {
    return (
        error?.response?.data?.message || "Unexpected Error. Please try again later"
    );
};

export { _throw, isURL, toLocaleDateString, isObjectEmpty, getErrorMessage };
