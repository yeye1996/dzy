import request from "./request"

export const user_login = params => { return request("/login", "post", params) };

export const sel_user = params => { return request("/selUser", "get", params) };

export const sel_project = params => { return request("/selProject", "get", params) };

export const sel_task = params => { return request("/selTask", "get", params) };

export const sel_user_name = params => { return request("/selUserName", "get", params) };

export const sel_admin_name = params => { return request("/selAdminName", "get", params) };

export const add_user = (uname, upwd, dept, post) => { return request("/register", "post", { uname, upwd, dept, post }) };

export const change_user = (uid, dept, post) => { return request("/changeUser", "post", { uid, dept, post }) };

export const del_user = (uid) => { return request("/delUser", "post", { uid }) };

export const sel_admin = () => { return request("/selAdmin", "get") };

export const add_admin = (aname, apwd) => { return request("/addAdmin", "post", { aname, apwd }) };

export const add_project = (pname, pstart, pend, ptype, ppeople) => { return request("/setProject", "post", { pname, pstart, pend, ptype, ppeople }) };

export const add_task = (pid, tname, tstart, tend, ttype, workload, demand) => { return request("/setTask", "post", { pid, tname, tstart, tend, ttype, workload, demand }) };

export const del_admin = aname => { return request("/delAdmin", "post", { aname }) };

export const del_project = pid => { return request("/delProject", "post", { pid }) };

export const del_task = tid => { return request("/delTask", "post", { tid }) };

export const change_project = (pid, pname, pstart, pend, ptype, ppeople) => { return request("/changeProject", "post", { pid, pname, pstart, pend, ptype, ppeople }) };

export const change_task = (tid, tname, tstart, tend, ttype, workload, demand) => { return request("/changeTask", "post", { tid, tname, tstart, tend, ttype, workload, demand }) };


export const reset_pass = (aname, oldpass, newpass) => { return request("/resetPass", "post", { aname, oldpass, newpass }) };