import axios from "axios";

// 后端服务器请求地址
const baseURL = "http://127.0.0.1:3000";

const instance = axios.create({
  baseURL,
  // maxContentLength: 2000,
});

// 定义请求办法（接口，请求方式，请求参数）
const request = async (url, method, params) => {
  if (method === "post") {
    const response = await instance.post(url, { ...params });
    return response.data;
  } else if (method === "get") {
    const response = await instance.get(url, { ...params });
    return response.data;
  }
};
// 导出请求方法
export default request;