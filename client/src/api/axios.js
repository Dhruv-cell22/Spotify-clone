import axios from "axios";

export default axios.create({
  baseURL: import.meta.env.https://spotify-clone-xusx.onrender.com + '/api/v1/',
  withCredentials: true,
});
