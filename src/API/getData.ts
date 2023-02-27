import axios from "axios";

const getData = (url: string, callback: any) => {
  axios
    .get(url)
    .then((res) => callback({ data: res.data }))
    .catch((err) => callback({ error: err }));
};

export { getData };
