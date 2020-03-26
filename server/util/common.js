

module.exports={
    stampToTime:function(timestamp) {
        var date = new Date(timestamp * 1000);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
        var Y = date.getFullYear();
        var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1);
        var D = (date.getDate()<10?'0'+date.getDate():date.getDate());
        var h = (date.getHours()<10?'0'+date.getHours():date.getHours());
        var m = (date.getMinutes()<10?'0'+date.getMinutes():date.getMinutes());
        var s = (date.getSeconds()<10?'0'+date.getSeconds():date.getSeconds());
        return Y+"-"+M+"-"+D+" "+h+":"+m+":"+s;
    },
    dateStartStamp:function(){
        var myDate = new Date();//获取系统当前时间
        var moths = myDate.getMonth()+1
        var moth = moths < 10 ? '0'+moths : moths;
        var day = myDate.getDate()<10 ? '0'+myDate.getDate():myDate.getDate();
        var DateTime = myDate.getFullYear()+'-'+moth+'-'+day;
        var dates= DateTime  +' 00:00:00';
        var tmp = Date.parse(dates).toString();
        tmp = tmp.substr(0,10);
        return tmp;
    },
    dateEndStamp:function(){
        var myDate = new Date();//获取系统当前时间
        var moths = myDate.getMonth()+1
        var moth = moths < 10 ? '0'+moths : moths;
        var day = myDate.getDate()<10 ? '0'+myDate.getDate():myDate.getDate();
        var DateTime = myDate.getFullYear()+'-'+moth+'-'+day;
        var dates= DateTime  +' 23:59:59';
        var tmp = Date.parse(dates).toString();
        tmp = tmp.substr(0,10);
        return tmp;
    },

    keysort:function (key,sortType) { //sortType true为降序；false为升序
        return function(a,b){
            return sortType ? ~~(a[key] < b[key]) : ~~(a[key] > b[key]);
        }
    },
    descSort:function (key) {
        return function(a,b){
            var value1 = a[key];
            var value2 = b[key];
            return value2 - value1;
        }

    },
    ascSort:function (key) {
        return function(a,b){
            var value1 = a[key];
            var value2 = b[key];
            return value1 - value2;
        }

    },
    specialKeyWord:function(str) {
        var reg = /\\+|\~+|\!+|\@+|\=+|\#+|¥+|\￥+|\%+|\^+|\&+|\*+|\(+|\)+|\'+|(\")+|\$+|`+|\“+|\”+|\‘+|\’+|\s+/g;
        var res = str.replace(reg,"");
        return res;
    },
    nowDate:function () {

            var myDate = new Date();//获取系统当前时间
            var moths = myDate.getMonth()+1
            var moth = moths < 10 ? '0'+moths : moths;
            var day = myDate.getDate()<10 ? '0'+myDate.getDate():myDate.getDate();
            var DateTime = myDate.getFullYear()+'-'+moth+'-'+day;

            var h = (myDate.getHours()<10?'0'+myDate.getHours():myDate.getHours());
            var m = (myDate.getMinutes()<10?'0'+myDate.getMinutes():myDate.getMinutes());
            var s = (myDate.getSeconds()<10?'0'+myDate.getSeconds():myDate.getSeconds());
            var dates= DateTime  +' '+h+':'+m+':'+s;
            return dates;

    },
    twentyAgo:function () {
        var myDate = new Date();//获取系统当前时间
        var moths = myDate.getMonth()+1
        var moth = moths < 10 ? '0'+moths : moths;
        var day = myDate.getDate()<10 ? '0'+myDate.getDate():myDate.getDate();
        var DateTime = myDate.getFullYear()+'-'+moth+'-'+day;
        var h = (myDate.getHours()<10?'0'+myDate.getHours():myDate.getHours());
        var m = (myDate.getMinutes()<10?'0'+myDate.getMinutes():myDate.getMinutes());
        var s = (myDate.getSeconds()<10?'0'+myDate.getSeconds():myDate.getSeconds());
        var dates= DateTime  +' '+h+':'+m+':'+s;
        var tmp = Date.parse(dates).toString();
        tmp = tmp.substr(0,10);
        var twentyAgo = parseInt(tmp)-1200;//获取二十分中前的时间戳
        var date = new Date(twentyAgo * 1000);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
        var Y = date.getFullYear() + '-';
        var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
        var D = (date.getDate()<10?'0'+date.getDate():date.getDate()) + ' ';
        var h = (date.getHours()<10?'0'+date.getHours():date.getHours()) + ':';
        var m =  (date.getMinutes()<10?'0'+date.getMinutes():date.getMinutes())+ ':';
        var s = (date.getSeconds()<10?'0'+date.getSeconds():date.getSeconds());
        return Y+M+D+h+m+s;

    },
    timeToStmp :function (time) {
        var tmp = Date.parse(new Date(time));
        tmp =  tmp / 1000;;
        return tmp;

    },
    firstDayOfMonth:function () {//获取当前月的第一天
        var myDate = new Date();//获取系统当前时间
        var moths = myDate.getMonth()+1
        var moth = moths < 10 ? '0'+moths : moths;
        var DateTime = myDate.getFullYear()+'-'+moth+'-01 00:00:00';
        var tmp = Date.parse(DateTime).toString();
        tmp = tmp.substr(0,10);
        return tmp;

    },
    nowToStemp:function () {
        var myDate = new Date();//获取系统当前时间
        var moths = myDate.getMonth()+1
        var moth = moths < 10 ? '0'+moths : moths;
        var day = myDate.getDate()<10 ? '0'+myDate.getDate():myDate.getDate();
        var DateTime = myDate.getFullYear()+'-'+moth+'-'+day;
        var h = (myDate.getHours()<10?'0'+myDate.getHours():myDate.getHours());
        var m = (myDate.getMinutes()<10?'0'+myDate.getMinutes():myDate.getMinutes());
        var s = (myDate.getSeconds()<10?'0'+myDate.getSeconds():myDate.getSeconds());
        var dates= DateTime  +' '+h+':'+m+':'+s;
        var tmp = Date.parse(dates).toString();
        tmp = tmp.substr(0,10);
        return tmp;
    },
    /*
    * 判断obj是否为一个整数
    */
    isInteger:function(obj) {
      return Math.floor(obj) === obj
    },

    /*
   * 将一个浮点数转成整数，返回整数和倍数。如 3.14 >> 314，倍数是 100
   * @param floatNum {number} 小数
   * @return {object}
   *   {times:100, num: 314}
   */
    toInteger:function (floatNum) {
      var ret = {times: 1, num: 0};
      if (this.isInteger(floatNum)) {
        ret.num = floatNum;
        return ret
      }
      var strfi = floatNum + '';
      var dotPos = strfi.indexOf('.');
      var len = strfi.substr(dotPos + 1).length;
      var times = Math.pow(10, len);
      var intNum = parseInt(floatNum * times + 0.5, 10);
      ret.times = times;
      ret.num = intNum;
      return ret
    },

    /*
   * 核心方法，实现加减乘除运算，确保不丢失精度
   * 思路：把小数放大为整数（乘），进行算术运算，再缩小为小数（除）
   *
   * @param a {number} 运算数1
   * @param b {number} 运算数2
   * @param op {string} 运算类型，有加减乘除（add/subtract/multiply/divide）
   *
   */
    operation:function(a, b, op) {
      var o1 = this.toInteger(a);
      var o2 = this.toInteger(b);
      var n1 = o1.num;
      var n2 = o2.num;
      var t1 = o1.times;
      var t2 = o2.times;
      var max = t1 > t2 ? t1 : t2;
      var result = null;
      switch (op) {
        case 'add':
          if (t1 === t2) { // 两个小数位数相同
            result = n1 + n2
          } else if (t1 > t2) { // o1 小数位 大于 o2
            result = n1 + n2 * (t1 / t2)
          } else { // o1 小数位 小于 o2
            result = n1 * (t2 / t1) + n2
          }
          return result / max;
        case 'subtract':
          if (t1 === t2) {
            result = n1 - n2
          } else if (t1 > t2) {
            result = n1 - n2 * (t1 / t2)
          } else {
            result = n1 * (t2 / t1) - n2
          }
          return result / max;
        case 'multiply':
          result = (n1 * n2) / (t1 * t2);
          return result;
        case 'divide':
          result = (n1 / n2) * (t2 / t1);
          return result
                }
    },
    inArray:function (search,array) {
        for(var i in array){
            if(array[i]===search){
                return true;
            }
        }
        return false;
    }



}