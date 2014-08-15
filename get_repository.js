/**
 *
 * The Bipio Github Pod
 * ---------------------------------------------------------------
 *
 * @author Michael Pearson <github@m.bip.io>
 * Copyright (c) 2010-2014 Michael Pearson https://github.com/mjpearson
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

function Repo(podConfig) {
  this.name = 'get_repository';
  this.description = 'Get Repository Attributes',
  this.description_long = 'Fetches attributes for a given repository',
  this.trigger = false; // this action can trigger
  this.singleton = false; // only 1 instance per account (can auto install)
  this.auto = false; // no config, not a singleton but can auto-install anyhow
  this.podConfig = podConfig; // general system level config for this pod (transports etc)
}

Repo.prototype = {};

Repo.prototype.getSchema = function() {
  return {
    "imports": {
      "properties" : {
        "owner" : {
          "type" :  "string",
          "description" : "Owner Name"
        },

        "repo" : {
          "type" :  "string",
          "description" : "Repo Name"
        }      
      }
    },
    "exports": {
      "properties" : {
        "id" : {
          "type" : "string",
          "description" : "ID"
        },
        "name" : {
          "type" : "string",
          "description" : "Name"
        },
        "description" : {
          "type" : "string",
          "description" : "Description"
        },
        "private" : {
          "type" : "booelan",
          "description" : "Is Private"
        },
        "url" : {
          "type" : "string",
          "description" : "URL"
        },
        "html_url" : {
          "type" : "string",
          "description" : "Site URL"
        },
        "watchers_count" : {
          "type" : "integer",
          "description" : "# Watchers"
        },
        "stargazers_count" : {
          "type" : "integer",
          "description" : "# Stargazers"
        },
        "open_issues_count" : {
          "type" : "integer",
          "description" : "# Issues"
        }
      }
    }
  }
}

Repo.prototype.invoke = function(imports, channel, sysImports, contentParts, next) {  
  var self = this,
    pod = this.pod,
    resource = this.$resource,
    dao = resource.dao,
    log = resource.log,
    url;
    
  if (imports.owner && imports.repo) {
    url = 'https://api.github.com/repos/'+ imports.owner +'/' + imports.repo + '?access_token=' + sysImports.auth.oauth.token;
    resource._httpGet(url, function(err, repo, headers) {
      next(err, repo);      
    });
  }
}

// -----------------------------------------------------------------------------
module.exports = Repo;