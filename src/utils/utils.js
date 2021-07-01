const _throw = (err) => {
    throw err;
};

const isURL = (str) => {
    // const pattern = new RegExp(
    //     "^(https?:\\/\\/)?" + // protocol
    //         "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
    //         "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
    //         "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
    //         "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
    //         "(\\#[-a-z\\d_]*)?$",
    //     "i"
    // );
    // return !!pattern.test(str);
    return (
        typeof str === "string" && 
        str !== null && 
        str.substr(0, 4) === "http"
    );
};

export { _throw, isURL };
