/**
 * GitHubQuery                       Leverages GitHub's v3 API to make searches and general queries
 *
 * @param String<baseURL>            base API string
 * @param Map<defaultSearcParams>    default parameters for search
 */
class GitHubQuery {

  constructor(baseURL="https://api.github.com", defaultSearchParams = new Map()){
    if(!baseURL || !(defaultSearchParams instanceof Map)){
      throw new Error("Could not create GitHubSearch instance, improper parameters.");
    }
    this.baseURL = baseURL;
    this.defaultSearchParams = defaultSearchParams;
  }

  /**
   *search                search the GitHub API (v3)
   *
   *@param String<q>      query parameter including qualifiers
   *@param String<sort>   criteria to sort search results (eg. by most stars)
   *@param String<order>  how return data should be ordered (eg. descending)
   *
   *return Promise        Resolves to search results
   */
  async search({type = "",q = "", sort = "", order = ""}){
    //construct request url
    let requestURL = `${this.baseURL}search/${type}?q=${q}&sort=${sort}&order=${order}`;

    //add any default search parameters
    for(const [param, val] of this.defaultSearchParams){
      //defaults do not take precedence over search parameters
      if(param === "q" || param === "sort" || param === "order"){
        continue
      }
      requestURL = `${requestURL}&${param}=${val}`;
    }

    return this.request(requestURL)
  }

  /**
   *request                      Async function to make a general request to the GitHub API (v3)
   *
   *@param String<requestURL>    URL to query
   *
   *return Promise               Resolves to query results
   */
  async request(requestURL="https://api.github.com"){

    return fetch(encodeURI(requestURL), {
      headers: {
        accept: "application/vnd.github.mercy-preview+json"  //accept header from github v3 api
      }
    }).then(response => {
      if(!response.ok){
        return Promise.reject(`Response not ok: ${response.status} ${response.statusText}`)
      }
      else return response.json()
    })
  }
}