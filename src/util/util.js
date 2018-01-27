class Util {
    dateFormat(data, trail) {
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
            res.push(`${key}=${obj[key]}`);
        }
        return res.join('&');
    }
    // get方法封装
    fetch({ url, success }) {
        fetch(url).then((response) => {
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
}

const util = new Util();

export default util;