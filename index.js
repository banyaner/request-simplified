/**
 * Created by zhongjx on 2017/8/11.
 */
/* eslint-disable */
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
        typeof define === 'function' && define.amd ? define(factory) : (window.request = factory());
}(this, function () {
        /**
         * @method root 设置根路径
         * @param {String} root
         */
        var rootPath = ''

        function root(root) {
            rootPath = root
        }

        var _util = {}
        _util.getUrl = function (root, path, params) {
            var paramsKey = Object.keys(params)
            var query = ''
            for (var i = 0, max = paramsKey.length; i < max; i++) {
                var key = paramsKey[i]
                var value = params[key]
                query = query + encodeURIComponent(key) + '=' + encodeURIComponent(value) + '&'
            }
            var url = (path.indexOf('//') > -1 ? path : (root + path)) + (path.indexOf('?') > -1 ? '&' : '?') + query.slice(0, -1)
            return url
        }
        _util.generateCallbackfunction = function () {
            return 'jsonp_' + Date.now()
        }
        _util.clearCallbackfunction = function (functionName) {
            try {
                delete window[functionName]
            } catch (e) {
                window[functionName] = undefined
            }
        }
        _util.removeScript = function (scriptId) {
            var scriptNode = document.getElementById(scriptId)
            if (scriptNode) {
                document.getElementsByTagName('head')[0].removeChild(scriptNode)
            }
        }
        /**
         * @method get
         * @param {String} path
         * @param {Object} params
         * @param {Function} cbSuccess
         * @param {Function} cbFail
         */
        function get(path, params, cbSuccess, cbFail) {
            var xhr = new XMLHttpRequest()
            var url = _util.getUrl(rootPath, path, params)
            xhr.open('get', url, false) // 同步请求
            xhr.onreadystatechange = function () {
                var res = {
                    headers: {},
                }
                if ((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304) {
                    try {
                        res.data = JSON.parse('response' in xhr ? xhr.response : xhr.responseText)
                    } catch (e) {
                        res.data = 'response' in xhr ? xhr.response : xhr.responseText
                    }
                    res.status = xhr.status
                    res.statusText = xhr.statusText
                    res.headers.ContentType = xhr.getResponseHeader('Content-Type')
                    cbSuccess(res)
                } else {
                    res.status = xhr.status
                    res.statusText = xhr.statusText
                    res.headers.ContentType = xhr.getResponseHeader('Content-Type')
                    cbFail && cbFail(res)
                }
            }
            xhr.send()
        }

        /**
         * @method post
         * @param {String} path
         * @param {Object} headers
         * @param {any} body
         * @param {Function} cbSuccess
         * @param {Function} cbFail
         */
        function post(path, body, headers, cbSuccess, cbFail) {
            var xhr = new XMLHttpRequest()
            xhr.withCredentials = true // 暂时性方案
            var url = path.indexOf('//') > -1 ? path : (rootPath + path)
            xhr.open('post', url, false) // 同步请求
            var headerKeys = Object.keys(headers)
            var i = 0
            var max = headerKeys.length
            if (max) {
                for (i; i < max; i++) {
                    xhr.setRequestHeader(headerKeys[i], headers[headerKeys[i]])
                }
            }
            xhr.onreadystatechange = function () {
                var res = {
                    headers: {},
                }
                if ((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304) {
                    res.data = JSON.parse('response' in xhr ? xhr.response : xhr.responseText)
                    res.status = xhr.status
                    res.statusText = xhr.statusText
                    res.headers.ContentType = xhr.getResponseHeader('Content-Type')
                    cbSuccess(res)
                } else {
                    res.status = xhr.status
                    res.statusText = xhr.statusText
                    res.headers.ContentType = xhr.getResponseHeader('Content-Type')
                    cbFail && cbFail(res)
                }
            }
            xhr.send(body)
        }

        /**
         * @method jsonp
         * @param {String} path
         * @param {Object} params
         * @param {Function} cbSuccess
         * @param {Function} cbFail
         */
        function jsonp(path, params, cbSuccess, cbFail) {
            var _url = ''
            var paramsAll = ''
            if (_url.indexOf('callback=') === -1 && !params.callback) {
                window.jsonpCallback = _util.generateCallbackfunction()
                params.callback = window.jsonpCallback
                paramsAll = params
                // paramsAll = Object.assign({callback: window.jsonpCallback}, params)
                _url = _util.getUrl('', path, paramsAll)
            } else {
                _url = _util.getUrl('', path, params)
                // paramsAll = Object.assign({}, params)
                paramsAll = params
            }
            var jsonpScript = document.createElement('script')
            jsonpScript.src = _url
            var scriptId = Date.now()
            jsonpScript.id = scriptId
            document.getElementsByTagName('head')[0].appendChild(jsonpScript)
            jsonpScript.onerror = function () {
                console.log(new Error('JSONP request-simplified to ' + _url + ' failed'))
                _util.clearCallbackfunction(window.jsonpCallback)
                _util.removeScript(scriptId)
                cbFail && cbFail()
            }
            window[paramsAll.callback] = function (data) {
                cbSuccess(data)
                _util.removeScript(scriptId)
            }
        }

        return {
            root: root,
            get: get,
            post: post,
            jsonp: jsonp,
        }
    }
))

