const dataFields = ["body", "params", "query", "headers", "file", "files"];

const validate = (schema) => {
  return (req, res, next) => {
    let appErrors = [];
    dataFields.forEach((field) => {
      if (schema[field]) {
        const { error } = schema[field].validate(req[field], {
          abortEarly: false,
        });
        if (error?.details) {
          error.details.forEach((e) => {
            appErrors.push(e.message);
          });
        }
      }
    });
    appErrors.length
      ? res.status(400).json({
          error: appErrors.map((e) => {
            let [firstWord, ...rest] = e.split(" ");
            firstWord = `${firstWord[1].toUpperCase()}${firstWord.slice(
              2,
              -1
            )}`;
            return [firstWord, ...rest].join(" ");
          }),
        })
      : next();
  };
};

export default validate;
