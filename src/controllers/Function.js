module.exports = {
	cutString(string, length) {
    if (string == null) {
        return "";
    }
    if (string.length <= length) {
        return string;
    }
    
    string = string.substring(0, length);
    let last = string.lastIndexOf(" ");
    string = string.substring(0, last);
    
    return string + "...";
  },
  
  extract_id(id) {
  	var timestamp = (new Date().getTime() / 1000 | 0).toString(16);
  	
    return timestamp + (Number(id)).toString(16)
  },
  
  forHumans(seconds) {
  	var levels = [
    	[Math.floor(seconds / 31536000), 'years'],
      [Math.floor((seconds % 31536000) / 86400), 'days'],
      [Math.floor(((seconds % 31536000) % 86400) / 3600), 'hours'],
      [Math.floor((((seconds % 31536000) % 86400) % 3600) / 60), 'minutes'],
      [(((seconds % 31536000) % 86400) % 3600) % 60, 'seconds'],
    ];
    var returntext = '';

    for (var i = 0, max = levels.length; i < max; i++) {
      if (levels[i][0] === 0) continue;
      returntext += ' ' + levels[i][0] + ' ' + (levels[i][0] === 1 ? levels[i][1].substr(0, levels[i][1].length-1): levels[i][1]);
    };
    
    return returntext.trim();
  },
  
  replaceAll(str, mapObj){
    var re = new RegExp(Object.keys(mapObj).join("|"),"gi");

    return str.replace(re, function(matched){
        return mapObj[matched.toLowerCase()];
    });
  },
  
  send_error(source, error) {
  	
  }
}
