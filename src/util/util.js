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
}

const util = new Util();

export default util;