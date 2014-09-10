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

function AddTeamRepo(podConfig) {
  this.name = 'add_team_repo';
  this.title = 'Add Team Repo',
  this.description = 'Adds a Repository to an Organizations Team',
  this.trigger = false;
  this.singleton = true;
  this.auto = false;
  this.podConfig = podConfig;
}

AddTeamRepo.prototype = {};

AddTeamRepo.prototype.getSchema = function() {
  return {
    "imports": {
      "properties" : {
        "id" : {
          "type" :  "string",
          "description" : "Team ID"
        },
        "org" : {
          "type" :  "string",
          "description" : "Organization Name"
        },
        "repo" : {
          "type" :  "string",
          "description" : "Repo Name"
        }
      },
      "required" : [ "id", "repo", "org" ]
    },
    "exports": {
      "properties" : {
        "status" : {
          "type" : "string",
          "description" : "Response Status"
        }
      }
    }
  }
}

AddTeamRepo.prototype.invoke = function(imports, channel, sysImports, contentParts, next) {
  var self = this,
    pod = this.pod,
    resource = this.$resource,
    dao = resource.dao,
    log = resource.log,
    url;

  if (imports.id && imports.repo && imports.org) {
    url = 'https://api.github.com/teams/'+ imports.id +'/repos/' + imports.org + '/' + imports.repo + '?access_token=' + sysImports.auth.oauth.token;
    resource._httpPut(url, null, function(err, repo, headers) {
      next(err, { status : headers.status });
    });
  }
}

// -----------------------------------------------------------------------------
module.exports = AddTeamRepo;