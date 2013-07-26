function queryString() {
            var vars = [], hash;
            var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
            for (var i = 0; i < hashes.length; i++) {
            hash = hashes[i].split('=');
            vars.push(hash[0]);
            vars[hash[0]] = hash[1];
         }
   return vars;          
}    


Date.prototype.monthNames = [
                             "January", "February", "March",
                             "April", "May", "June",
                             "July", "August", "September",
                             "October", "November", "December"];
Date.prototype.getMonthName = function() {
    return this.monthNames[this.getMonth()];
};