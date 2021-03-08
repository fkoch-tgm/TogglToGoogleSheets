/**========================================
 * Import Entries from Toggl
 * ========================================
 * Version: 1.0
 * Github: https://github.com/fkoch-tgm/TogglToSheets
 
 * Get Data from Toggl
 * @customfunction
 * @return          2D-Array
 */
function getDataFromToggl() {
  const username = "YOUR_API_KEY"; // TODO use your API -Key
  const password = "api_token"; // the password is always "api_token"
  
  const parseOptions = null;
  const baser_url = "https://api.track.toggl.com/reports/api/v2/details"; // URL for Detaild Information on Entries
  const user_agent = "YOUR_EMAIL"; // TODO use your own EMail as the User-Agent (Dont forget to use '%40' instead of '@')
  const workspace_id = "YOUR_WORKSPACE"; // TODO use your WorkspaceID (you can see it in the Link from the toggl-reports page)
  const since = "2021-01-01"; // TODO 
  
  // These are the requested JSON-Values
  // Be carefull, they come in the order of the original JSON Document, not your own
  // id, pid, tid, uid, description, start, end, updated, dur, user ,use_stop, client, project, project_color, project_hex_color, task, billable, is_billable, cur, tags
  const query = "/data/user,/data/dur,/data/description,/data/tags,/data/start";
  

  // copied from ImportJSONBasicAuth()
  var encodedAuthInformation = Utilities.base64Encode(username + ":" + password); 
  var header = {headers: {Authorization: "Basic " + encodedAuthInformation}};

  // Transforms the Data
  const transformDur = function(data, row, column, options) {
    // change the value for Duration to the correct unit for GoogleSheet's Duration-Format
    if(column == 2 && row != 0) {
      data[row][column] = data[row][column]/86400000;
    }
    // Transform the start-DateTime into a Date object
    if(column == 1 && row != 0) {
      data[row][column] = new Date(data[row][column]);
    }
  };

  var data = Array();
  data.push(["Description","Start","Duration","User","Tag"]); // Set the header manually
  var still_data = true;
  var page = 1;
  while(still_data) {
    var url = baser_url+"?page="+page+"&user_agent="+user_agent+"&workspace_id="+workspace_id+"&since="+since;
    var dat = ImportJSONAdvanced(url, header, query,parseOptions, includeXPath_, transformDur);
    dat.shift(); // remove the original header for every request
    if(dat.length == 0) still_data = false;
    else data = data.concat(dat);
    page++;
  }
  return data;
}
