var request = (function (request, $) {
    "use strict";
    var _request = request || {};
    var rest_url = 'http://localhost/restServerAtm';
    var site_url = "";
    var responseType = "application/json";
    var dataType = "json";
    function getCookie(name) {
        var value = "; " + document.cookie;
        var parts = value.split("; " + name + "=");
        if (parts.length === 2)
            return parts.pop().split(";").shift();
    };
    _request.parseUri = function (path) {
        return rest_url + "/" + path;
    };
    _request.parseUrl = function (url) {
        return site_url + "/" + url;
    };
    _request.post = function (path, data) {
        //token || ( token = '' )
        var _self = this;
        return  new Promise(function (resolve, reject) {
            $.ajax({
                type: "POST",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                    //'X-CSRF-TOKEN' : Boolean( token ) ? token : "",
                    'Authorization': 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJhZG1pbkBnbWFpbC5jb20iLCJjcmVhdGVkX2F0IjoiMjAxOS0wNy0yNyAyMToyODoyMyIsInVwZGF0ZWRfYXQiOiIyMDE5LTA3LTI3IDIxOjI4OjIzIiwidGltZSI6MTU2NDMyNTczN30.ykS8ZuQQk4cfUszts1op-aa9xGhPnTnAJY8zs9d6OiA',
                },
                cache: false,
                dataType: _self.dataType,
                url: _self.parseUri(path),
                contentType: _self.responseType,
                data: JSON.stringify(data),
                beforeSend: function (xhr) {
                },
                success: function (data, textStatus, jqXHR) {
                    resolve(data);
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    reject(jqXHR);
                }
            });
        });
    };
    _request.get = function (path, data) {
        var _self = this;
        return  new Promise(function (resolve, reject) {
            $.ajax({
                type: "OPTIONS",
                cache: false,
                dataType: _self.dataType,
                url: _self.parseUri(path),
                contentType: _self.responseType,
                data: JSON.stringify(data),
                headers: {
                    //"Accept": "application/json",
                    //"Content-Type": "application/json",
                    'Authorization': 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJhZG1pbkBnbWFpbC5jb20iLCJjcmVhdGVkX2F0IjoiMjAxOS0wNy0yNyAyMToyODoyMyIsInVwZGF0ZWRfYXQiOiIyMDE5LTA3LTI3IDIxOjI4OjIzIiwidGltZSI6MTU2NDMyNTczN30.ykS8ZuQQk4cfUszts1op-aa9xGhPnTnAJY8zs9d6OiA',
                },
                beforeSend: function (xhr) {
                },
                success: function (data, textStatus, jqXHR) {
                    resolve(data);
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    reject(jqXHR);
                }
            });
        });
    };
    _request.put = function (path, data) {
        var _self = this;
        return  new Promise(function (resolve, reject) {
            $.ajax({
                type: "PUT",
                cache: false,
                dataType: _self.dataType,
                url: _self.parseUri(path),
                contentType: _self.responseType,
                data: JSON.stringify(data),
                beforeSend: function (xhr) {
                },
                success: function (data, textStatus, jqXHR) {
                    resolve(data);
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    reject(jqXHR);
                }
            });
        });
    };
    _request.delete = function (path, data) {
        var _self = this;
        return  new Promise(function (resolve, reject) {
            $.ajax({
                type: "DELETE",
                cache: false,
                dataType: _self.dataType,
                url: _self.parseUri(path),
                contentType: _self.responseType,
                data: JSON.stringify(data),
                beforeSend: function (xhr) {
                },
                success: function (data, textStatus, jqXHR) {
                    resolve(data);
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    reject(jqXHR);
                }
            });
        });
    };
    return request;
}(this.request || {}, window.jQuery));

/** loadContentToContainer("campoPlantilla.jsp", "containerCampoPlantilla");  **/
/*function loadContentToContainer(url, container, idpadre) {
    var uri = "./" + url;
    try {
        $.ajax({
            url: uri,
            type: 'GET',
            cache: false,
            beforeSend: function () {
                spinner.start();
            },
            success: function (response) {
                response = response.replace(eval("/idMaestro/g"), idpadre);
                $("#"+container).empty();
                //$("#"+container).html("");
                //response = translate(response);
                $("#"+container).html(response);
                spinner.stop();
            },
            error: function (request, status, error) {
                $("#"+container).html("");
                spinner.stop();
            }
        });
    } catch (err) {
        //$("#msgcontent").html("err");
    }
}*/

