/**
 *
 * The Bipio Github
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

function GistCreate(podConfig) {
  this.name = 'gist_create';
  this.title = 'Create a Gist',
  this.description = 'Create a Gist',
  this.trigger = false;
  this.singleton = false;
  this.auto = false;
  this.podConfig = podConfig;
}

GistCreate.prototype = {};

GistCreate.prototype.getSchema = function() {
  return {
    "config": {
      "properties" : {
        "public" : {
          "type" :  "boolean",
          "description" : "Public Gist",
          "default" : false
        }
      }
    },
    "imports": {
      "properties" : {
        "description" : {
          "type" :  "string",
          "description" : "Description"
        },
        "file_name" : {
          "type" :  "string",
          "description" : "File Name"
        },
        "content" : {
          "type" :  "string",
          "description" : "File Content"
        }
      },
      "required" : [ "description", "file_name", "content" ]
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

GistCreate.prototype.invoke = function(imports, channel, sysImports, contentParts, next) {
  var pod = this.pod,
    resource = this.$resource,
    url = 'https://api.github.com/gists?access_token=' + sysImports.auth.oauth.token

  var struct = {
    "description" : imports.description,
    "public" : channel.config.public,
    "files" : {
    }
  }

  struct.files[imports.file_name] = { "content" : imports.content };

  resource._httpPost(
    url,
    struct,
    function(err,  body) {
      console.log(body.errors);
      if (body.errors) {
        next(body.message)
      } else {
        next(err, body);
      }
    }
  );
}

// -----------------------------------------------------------------------------
module.exports = GistCreate;