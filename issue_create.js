/**
 *
 * The Bipio IssueCreate Pod.  boilerplate sample action definition
 * ---------------------------------------------------------------
 *
 * @author Michael Pearson <michael@cloudspark.com.au>
 * Copyright (c) 2010-2013 CloudSpark pty ltd http://www.cloudspark.com.au
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

function IssueCreate(podConfig) {
  this.name = 'issue_create';
  this.description = 'Create an Issue',
  this.description_long = 'Create an Issue for the target repository',
  this.trigger = false; // this action can trigger
  this.singleton = false; // only 1 instance per account (can auto install)
  this.auto = false; // no config, not a singleton but can auto-install anyhow
  this.podConfig = podConfig; // general system level config for this pod (transports etc)
}

IssueCreate.prototype = {};

IssueCreate.prototype.getSchema = function() {
  return {
    "config": {
      "properties" : {
        "owner" : {
          "type" :  "string",
          "description" : "Owner Name"
        },
        "repository" : {
          "type" :  "string",
          "description" : "Repository Name"
        }
      }
    },
    "imports": {
      "properties" : {
        "title" : {
          "type" :  "string",
          "description" : "Title"
        },
        "body" : {
          "type" :  "string",
          "description" : "Body"
        }
      }
    },
    "exports": {
      "properties" : {
        "url" : {
          "type" : "string",
          "description" : "URL"
        },
        "html_url" : {
          "type" : "string",
          "description" : "HTML URL"
        },
        "number" : {
          "type" : "string",
          "description" : "Number"
        },
        "title" : {
          "type" : "string",
          "description" : "Title"
        },
        "body" : {
          "type" : "string",
          "description" : "Body"
        },
        "created_at" : {
          "type" : "string",
          "description" : "Created At"
        }
      }
    }
  }
}

IssueCreate.prototype.invoke = function(imports, channel, sysImports, contentParts, next) {
  var pod = this.pod,
    resource = this.$resource,
    url = 'https://api.github.com/repos/' + channel.config.owner + '/' + channel.config.repository + '/issues?access_token=' + sysImports.auth.oauth.token
 
  if (imports.title && imports.body) {

    resource._httpPost(
      url, 
      {      
        title : imports.title,
        body : imports.body
      },
      function(err,  body) {
        next(err, body);
      }
    );
  }
}

// -----------------------------------------------------------------------------
module.exports = IssueCreate;