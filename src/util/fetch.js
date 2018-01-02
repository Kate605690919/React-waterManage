class Fetch {
    /**
     * 同步fetch POST
     * @param {string} data 序列化过的对象
     * @param {string} url 纯url，不带参数
     */
    fetchSync_Post({ url, data }) {
        return new Promise((resolve, reject) => {
            fetch(url, {
                method: 'POST',
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: data
            }).then((response) => {
                if (response.status !== 200) {
                    throw new Error('Fail to get response with status ' + response.status);
                }
                response.json().then((res) => {
                    res = JSON.parse(res);
                    resolve(res);
                }).catch((error) => {
                    reject(error);
                });
            }).catch((error) => {
                reject(error);
            });
        });
    }
    /**
     * 同步fetch GET
     * @param {string} url url，带参数
     */
    fetchSync_Get(url) {
        debugger;
        return new Promise((resolve, reject) => {
            fetch(url).then((response) => {
                if (response.status !== 200) {
                    throw new Error('Fail to get response with status ' + response.status);
                }
                response.json().then((res) => {
                    res = JSON.parse(res);
                    resolve(res);
                }).catch((error) => {
                    reject(error);
                });
            }).catch((error) => {
                reject(error);
            });
        });
    }
}
let $Fetch = new Fetch();
export default $Fetch;