/**
 *
 * The Bipio Github Pod
 * ---------------------------------------------------------------
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

function GetOrgTeams(podConfig) {
  this.name = 'get_org_teams';
  this.description = 'Get Teams For Organization',
  this.description_long = 'Fetches All Teams for a given Organization',
  this.trigger = false;
  this.singleton = true;
  this.auto = false;
  this.podConfig = podConfig;
}

GetOrgTeams.prototype = {};

GetOrgTeams.prototype.getSchema = function() {
  return {
    "imports": {
      "properties" : {
        "organization" : {
          "type" :  "string",
          "description" : "Organization Name"
        }      
      }
    },
    "exports": {
      "properties" : {
        "url" : {
          "type" : "string",
          "description" : "Org URL"
        },
        "name" : {
          "type" : "string",
          "description" : "Org Name"
        },
        "id" : {
          "type" : "string",
          "description" : "Org ID"
        }
      }
    }
  }
}

GetOrgTeams.prototype.invoke = function(imports, channel, sysImports, contentParts, next) {  
  var self = this,
    pod = this.pod,
    resource = this.$resource,
    dao = resource.dao,
    log = resource.log,
    url;
    
  if (imports.organization) {
    url = 'https://api.github.com/orgs/'+ imports.organization +'/teams?access_token=' + sysImports.auth.oauth.token;
    resource._httpGet(url, function(err, repo, headers) {
      next(err, repo);      
    });
  }
}

// -----------------------------------------------------------------------------
module.exports = GetOrgTeams;