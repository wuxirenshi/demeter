import axios from 'axios';
import auth from '../auth.js';

let base = '/demeter/api';

export const requestLogin = params => {
    return axios.post(`${base}/user/info`, params).then(res => res.data);
};

export const getRemindListPage = params => {
    return axios.get(`${base}/remind/listpage`, {params: params});
};

export const getRemindsByFilters = params => {
    return axios.get(`${base}/remind/filters`, {params: params});
};

export const saveRemind = params => {
    return axios.post(`${base}/remind/save`, params).then(res => res.data);
};

export const removeRemind = params => {
    return axios.delete(`${base}/remind/remove`, {params: params});
};

export const batchRemoveUser = params => {
    return axios.get(`${base}/user/batchremove`, {params: params});
};

export const commitRemind = params => {
    return axios.post(`${base}/remind/commit`, params).then(res => res.data);
};

export const saveReport = params => {
    return axios.post(`${base}/report/save`, params).then(res => res.data);
};

export const commitReport = params => {
    return axios.post(`${base}/report/commit`, params).then(res => res.data);
};

export const removeReport = params => {
    return axios.delete(`${base}/report/remove`, {params: params});
};

export const getReportListPage = params => {
    return axios.get(`${base}/report/listpage`, {params: params});
};

export const getUnitProjectList = params => {
    return axios.get(`${base}/project/list`, {params: params});
};

export const getPassRate = params => {
    return axios.get(`${base}/job/get_pass_rate`, {params: params});
};

export const getCoverageList = params => {
    return axios.get(`${base}/coverage/list`, {params: params});
};

export const getCase = params => {
    return axios.get(`${base}/get`, {params: params});
};

export const getJob = params => {
    return axios.get(`${base}/job/get`, {params: params});
};

export const startJob = params => {
    return axios.post(`${base}/job/start`, params).then(res => res.data);
};

export const addUser = params => {
    return axios.post(`${base}/user`, params).then(res => res.data);
};

export const getUser = params => {
    return axios.get(`${base}/user`, {params: params});
};

export const deleterUser = params => {
    return axios.delete(`${base}/user/${params}`).then(res => res.data);
};

export const addDepartment = params => {
    return axios.post(`${base}/department`, params).then(res => res.data)
};

export const deleteDepartment = params => {
    return axios.delete(`${base}/department/${params}`).then(res => res.data)
};

export const getDepartment = params => {
    return axios.get(`${base}/department`, {params: params});
};

export const addGroup = params => {
    return axios.post(`${base}/group`, params).then(res => res.data)
};

export const getGroup = params => {
    return axios.get(`${base}/group`, {params: params});
};

export const deleteGroup = params => {
    return axios.delete(`${base}/group/${params}`).then(res => res.data)
};

export const getFlow = params => {
    return axios.get(`${base}/flow`, {params: params});
};

export const getFlowCase = params => {
    return axios.get(`${base}/flow/case`, {params: params});
};

