# gh-stats  

gh-stats is a simple solution to the GitHubIntegration coding exercise completeted for the Bitsight interview process.  

This webapp provides two buttons and corresponding tables to display information from the publicly accessible portion of  [GitHub API (v3)](https://developer.github.com/v3/). The first table displays "Hot Repositories"; the 5 repositories with the most stars, created last month. The second table displays "Prolific Users"; the 5 users with the most followers, created in the last year.  

Both tables can be updated by clicking the corresponding button, and both will update every two minutes on their own.  

#### Usage  
Open index.html in Google Chrome.

#### Tech  
This app was written mostly with vanilla Javascript, ECMAScript 2015 was used, so a modern browser is required.  

gh-stats runs with only one external library: [moment.js](https://momentjs.com/). I decided to include this small library to handle date ranges for filtering, as the native Date object produces a lot of gotchas eg. adding 1 month to Jan 30th produces March 2nd, etc.  

The app has four other files:  
`app.js`- Binds update events, initiates requests for new data, and updates the GUI.  
`GitHubQuery.js`- Provides the GitHubQuery class which can search and query the GitHub API  
`index.html`- Base layout  
`app.css`- style, CSS3 flexbox  

#### Other Considerations  
Due to the time constraint, there are some things I would change and add to this app.  

Development done in Google Chrome 64, though I expect any modern browser will work due to the simplicity of the application.  

I would monitor request rates to prevent spamming the GitHub API. GitHub provides information about requests made and the time in which the request window resets in every HTTP response header.  

The functions used to update the tables, `updateUserTable` and `updateRepoTable` are good candidates for refactoring; could probably be combined.  

Error handling is minimal to say the least - I included a function to catch promise rejections, though it only logs errors to the console. Depending on the error, it would be nice to provide the user with some feedback, eg. "Unable to connect", "Too many requests", etc.  

No tests, and I do not always validate function input. `getUsers()`, `search()`, and `request()` are candidates for unit tests.  

These files could be concatenated & minified, though for this exercise I did not think it necessary.  


#### Author
Andrew Gomez  
argomez@ncsu.edu



