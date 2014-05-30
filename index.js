/**
 *
 * The Bipio Github Pod.  Github Actions and Content Emitters
 *
 * @author Michael Pearson <michael@cloudspark.com.au>
 * Copyright (c) 2010-2014 CloudSpark pty ltd http://www.cloudspark.com.au
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
var Pod = require('bip-pod'),
Github = new Pod({
  name : 'github',
  description : 'Github',
  description_long : 'GitHub is a web-based hosting service for software development projects that use the Git revision control system',
  authType : 'oauth',
  passportStrategy : require('passport-github').Strategy,
  config : {
    "oauth": {
      "clientID" : "",
      "clientSecret" : "",
      "callbackURL" : "/rpc/oauth/github/cb",
      "scopes" : [
      "gist",
      "notifications",
      "repo:status",
      "repo"
      ]
    }
  },
  dataSources : [
    require('./models/track_repos')  
  ]
});



Github.add(require('./issue_create.js'));
Github.add(require('./get_repositories.js'));
Github.add(require('./get_repositories_org.js'));
Github.add(require('./get_repository.js'));

// -----------------------------------------------------------------------------
module.exports = Github;