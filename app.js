//get an instance of GitHubQuery for making requests to the github API
//set default search parameters to 1 page, 5 results per page, project spec only wants 5 results at a time
const git = new GitHubQuery("https://api.github.com/", new Map([["page", "1"], ["per_page", "5"]]));

//Events
//update tables onload, set recurring update
window.onload = updateAll;
setInterval(updateAll, 120000); //every 2 minutes

//add listener to the buttons to update corresponding tables
document.getElementById("hot_repo").addEventListener("click", updateRepositories);
document.getElementById("prolific_users").addEventListener("click", updateUsers);

//Event Functions
/**
 *updateRepositories    Updates both users and repositories
 */
function updateAll(){
  updateRepositories();
  updateUsers();
}

/**
 *updateRepositories    Searches for new "hot" repositories that were created last month
 *                      via the GitHub API v3 and then updates the repository table
 */
function updateRepositories(){
  //search for new results, process them, and update the table
  git.search({
    type: "repositories",
    q: `created:${moment().subtract(1, "Month").startOf("Month").format("YYYY-MM-DD")}` +
             `..${moment().startOf("Month").format("YYYY-MM-DD")}`,
    sort: "stars",
    order: "desc"
  }).then(updateRepoTable).catch(handleError);
}

/**
 *updateUsers    Searches for new "hot" users over the previous year via the GitHub API (v3)
 *               and then requests additional user information for those users and finally
 *               updates the user table in the interface
 */
function updateUsers(){
  git.search({
    type: "users",
    q: `created:>${moment().subtract(1, "Year").format("YYYY-MM-DD")}`,
    sort: "followers",
    order: "desc"
  }).then(getUsers).then(updateUserTable).catch(handleError);
}

//Functions
/**
 *updateUserTable          updates the user table with new information
 *
 *@param Array<results>    array of user objects from the GitHub API (v3)
 */
function updateUserTable(results=[]){
  //update each row in the table..  result = row
  for(let i = 0, len = results.length; i < len; i++){
    const user = results[i];
    //get container
    const container = document.getElementById(`user-${i}`);

    //set values
    container.querySelector(".cell-avatar").querySelector("img").src = user.avatar_url;
    container.querySelector(".cell-author").innerHTML = user.login;
    container.querySelector(".cell-author").href = user.html_url;
    container.querySelector(".cell-id").innerHTML = user.id;
    container.querySelector(".cell-desc").innerHTML = user.bio;
    container.querySelector(".cell-followers").innerHTML = user.followers;
    container.querySelector(".cell-following").innerHTML = user.following;
  }
}

/**
 *updateRepoTable           updates the repository table with new information
 *
 *@param Object<results>    results from a repository search from GitHub API (v3)
 */
function updateRepoTable(results={items:[]}){
  //update each row in the table.. item = row
  for(let i = 0, len = results.items.length; i < len; i++){
    const repo = results.items[i];
    //get repo container
    const container = document.getElementById(`repo-${i}`);

    //set values
    container.querySelector(".cell-id").innerHTML = repo.id;
    container.querySelector(".cell-desc").innerHTML = repo.description;
    container.querySelector(".cell-stars").innerHTML = repo.stargazers_count;
    container.querySelector(".cell-repo").innerHTML = repo.name;
    container.querySelector(".cell-repo").href = repo.html_url;
    container.querySelector(".cell-author").innerHTML =  repo.owner.login;
    container.querySelector(".cell-author").href = repo.owner.html_url;
  }
}

/**
 *getUsers                  gets user profile information from github given user search results
 *
 *@param Object<results>    results from user search from GitHub API (v3)
 *
 *return Promise            Resolves to an array of results from user queries on the GitHub API (v3)
 */
function getUsers(results={items:[]}){
  return Promise.all(results.items.map(item => git.request(item.url)))
}

/**
 *handleError         do something with an error
 *@param String<e>    error to handle
 */
function handleError(e){
  console.log(e);
}
