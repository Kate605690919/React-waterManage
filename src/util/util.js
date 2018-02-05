class Util {
    dateFormat(data, trail) {
        if(!data) return '';
        let d = parseInt(data.substring(6, data.length - trail), 10);
        d = new Date(d);
        let ar_date = [d.getFullYear(), d.getMonth() + 1, d.getDate()];
        function dFormat(i) {
            return i < 10 ? "0" + i.toString() : i;
        }
        for (var i = 0; i < ar_date.length; i++) ar_date[i] = dFormat(ar_date[i]);
        return ar_date.join('/');
    }
    setSessionStorate(key, data) {
        data = JSON.stringify(data);
        sessionStorage.setItem(key, data);
    }
    getSessionStorate(key) {
        let res = sessionStorage.getItem(key);
        return JSON.parse(res);
    }
    setLocalStorate(key, data) {
        data = JSON.stringify(data);
        localStorage.setItem(key, data);
    }
    getLocalStorate(key) {
        let res = localStorage.getItem(key);
        if (res) return JSON.parse(res);
        else return undefined;
    }
    // object to FormStr
    objToStr(obj) {
        let res = [];
        for (let key in obj) {
            let item = obj[key];
            if (Array.isArray(item)) {
                item.forEach(item => {
                    res.push(`${key}=${item}`);
                })
            } else res.push(`${key}=${obj[key]}`);
        }
        return res.join('&');
    }
    // get方法封装
    fetch({ url, success }) {
        let token = this.getSessionStorate('token');
        let headers = new Headers();
        headers.append('access_token', token);
        let request = new Request(url, {
            headers: headers,
            method: "GET"
        });
        fetch(request).then((response) => {
            if (response.status !== 200) {
                throw new Error('Fail to get response with status ' + response.status);
            }
            response.json().then((res) => {
                success(res);
            }).catch((error) => {
                console.error(error);
            });
        }).catch((error) => {
            console.error(error);
        });
    }
    // post方法封装
    fetch_Post({ url, data, success }) {
        let token = this.getSessionStorate('token');
        let headers = new Headers();
        headers.append("Content-Type", "application/x-www-form-urlencoded");
        headers.append('access_token', token);
        let request = new Request(url, {
            headers: headers,
            method: "POST",
            body: data,
        });
        fetch(request).then((response) => {
            if (response.status !== 200) {
                throw new Error('Fail to get response with status ' + response.status);
            }
            let headers = response.headers;
            response.json().then((res) => {
                success(res, headers);
            }).catch((error) => {
                console.error(error);
            });
        }).catch((error) => {
            console.error(error);
        });
    }
    // array(对象数组) 设定key值
    arraySetKey(array, key) {
        let res = array.map(item => {
            return { ...item, key: item[key] }
        });
        return res;
    }
    //获取父级节点和当前节点的uid [parentUid, childrenUid]
    getAreas(aid) {
        //因为区域id只有一个，所以要从区域树查找它的父级区域
        const areatree = util.getSessionStorate('areatree');
        const findArea = (areaid, tree) => {
            let arr = [];
            //先判断当前节点的id是否等于要查找的id
            if (tree.id === areaid) {
                arr = arr.concat(tree.id);
                return arr;
            } else if (tree.children) {
                //有子节点就继续找
                for (let i = 0; i < tree.children.length; i++) {
                    let res = findArea(areaid, tree.children[i]);
                    if (res) {
                        console.log(res);
                        arr = arr.concat(tree.id);
                        arr = arr.concat(res);
                        return arr;
                    }
                }
            } else {
                //没有子节点
                return false;
            }
        }
        let res = [];
        for (var i = 0; i < areatree.length; i++) {
            res = findArea(aid, areatree[i]);
            if (res) {
                return res;
            }
        }
        return res;
    }
}

const util = new Util();

export default util;