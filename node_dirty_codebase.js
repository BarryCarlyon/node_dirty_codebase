var parseString = require('xml2js').parseString;
var request = require('request');

var _codebase_config;

exports.codebase.setConfig = function(config) {
    _codebase_config = config;
    _codebase_config.debug = (undefined === config.debug) ? false : config.debug;
}

/* Get Open Tickets */
exports.codebase.getTickets = function() {
    request({
        url: 'https://api3.codebasehq.com/' + _codebase_config.project + '/tickets?query=not-status:Completed,Invalid',
        headers: {
            'Accept': 'application/xml',
            'Content-type': 'application/xml',
        },
        auth: {
            'user': _codebase_config.username,
            'pass': _codebase_config.password
        }
    }, function (error, response, body) {
        if (error) {
            if (_codebase_config.debug) {
                console.log(error);
            }
            return false;
        }
        if (response.statusCode == 200) {
            parseString(body, {
                charkey: 'value'
            }, function(err, result) {
                if (err) {
                    if (_codebase_config.debug) {
                        console.log(err);
                    }
                    return false;
                } else {
                    return result;
                }
            });
        } else {
            return false;
        }
    });
}

exports.codebase.createTicket = function(summary, description) {
    var xml = '<ticket>'
        + '<summary>' + summary + '</summary>'
        + '<description><![CDATA[' + description + ']]></description>'
        + '</ticket>';

    request.post({
        url: 'https://api3.codebasehq.com/' + _codebase_config.project + '/tickets?query=not-status:Completed,Invalid',
        headers: {
            'Accept': 'application/xml',
            'Content-type': 'application/xml',
        },
        auth: {
            'user': _codebase_config.username,
            'pass': _codebase_config.password
        },
        body: xml
    }, function (error, response, body) {
        if (error) {
            if (_codebase_config.debug) {
                console.log(error);
            }
            return false;
        }
        if (response.statusCode == 201) {
            // was created
            parseString(body, {
                charkey: 'value'
            }, function(err, result) {
                if (err) {
                    if (_codebase_config.debug) {
                        console.log(err);
                    }
                    return false;
                } else {
                    return result.ticket['ticket-id'][0]['value'];
                }
            });
        } else {
            return false;
        }
    });
}
exports.codebase.addCommentToTicket = function(ticket_id, comment) {
    var xml = '<ticket-note>'
        + '<content>' + comment + '</content>'
        + '</ticket-note>';

    request.post({
        url: 'https://api3.codebasehq.com/' + _codebase_config.project + '/tickets?query=not-status:Completed,Invalid',
        headers: {
            'Accept': 'application/xml',
            'Content-type': 'application/xml',
        },
        auth: {
            'user': _codebase_config.username,
            'pass': _codebase_config.password
        },
        body: xml
    }, function (error, response, body) {
        if (error) {
            if (_codebase_config.debug) {
                console.log(error);
            }
            return false;
        }
        if (response.statusCode == 201) {
            // was created
            parseString(body, {
                charkey: 'value'
            }, function(err, result) {
                if (err) {
                    if (_codebase_config.debug) {
                        console.log(err);
                    }
                    return false;
                } else {
                    return result['ticket-note']['id'][0]['value'];
                }
            });
        } else {
            return false;
        }
    });
}

exports.codebase.reviseTicket = function(ticket_id, summary, comment) {
    var xml = '<ticket-note>'
        + '<content>' + comment + '</content>'
        + '<changes>'
            + '<summary>' + summary + '</summary>'
        + '</changes>'
        + '</ticket-note>';

    request.post({
        url: 'https://api3.codebasehq.com/' + _codebase_config.project + '/tickets/' + ticket_id + '/notes',
        headers: {
            'Accept': 'application/xml',
            'Content-type': 'application/xml',
        },
        auth: {
            'user': _codebase_config.username,
            'pass': _codebase_config.password
        },
        body: xml
    }, function (error, response, body) {
        if (error) {
            if (_codebase_config.debug) {
                console.log(error);
            }
            return false;
        }
        if (response.statusCode == 201) {
            // was created
            parseString(body, {
                charkey: 'value'
            }, function(err, result) {
                if (_codebase_config.debug) {
                    console.log(result);
                    console.log(result['ticket-note']);
                }
                if (err) {
                    if (_codebase_config.debug) {
                        console.log(err);
                    }
                    return false;
                } else {
                    return result['ticket-note']['id'][0]['value'];
                }
            });
        } else {
            return false;
        }
    });
}
