var parseString = require('xml2js').parseString;
var request = require('request');

var codebase_config;

exports.codebase.setConfig = function(config) {
    codebase_config = config;
}

var getCodebase = function(channel) {
    request({
        url: 'https://api3.codebasehq.com/' + codebase_config.project + '/tickets?query=not-status:Completed,Invalid',
        headers: {
            'Accept': 'application/xml',
            'Content-type': 'application/xml',
        },
        auth: {
            'user': codebase_config.username,
            'pass': codebase_config.password
        }
    }, function (error, response, body) {
        if (error) {
            console.log(error);
            return;
        }
        if (response.statusCode == 200) {
            parseString(body, {
                charkey: 'value'
            }, function(err, result) {
                if (err) {
                    console.log(err);
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
var createCodebase = function(channel, summary, description) {
    var xml = '<ticket>'
        + '<summary>' + summary + '</summary>'
        + '<description><![CDATA[' + description + ']]></description>'
        + '</ticket>';

    request.post({
        url: 'https://api3.codebasehq.com/' + config.codebase.project + '/tickets?query=not-status:Completed,Invalid',
        headers: {
            'Accept': 'application/xml',
            'Content-type': 'application/xml',
        },
        auth: {
            'user': config.codebase.username,
            'pass': config.codebase.password
        },
        body: xml
    }, function (error, response, body) {
        if (error) {
            console.log(error);
            return;
        }
        if (response.statusCode == 201) {
            // was created
            parseString(body, {
                charkey: 'value'
            }, function(err, result) {
//                console.log(result);
                if (err) {
                    console.log(err);
                    channel.send('> Failed to parse but created');
                } else {
                    channel.send('> Created: ' + result.ticket['ticket-id'][0]['value']);
                }
            });
        } else {
            channel.send('> Fail: ' + response.statusCode);
        }
    });
}
var addCommentTicketCodebase = function(channel, ticket_id, comment) {
    var xml = '<ticket-note>'
        + '<content>' + comment + '</content>'
        + '</ticket-note>';

    request.post({
        url: 'https://api3.codebasehq.com/' + config.codebase.project + '/tickets/' + ticket_id + '/notes',
        headers: {
            'Accept': 'application/xml',
            'Content-type': 'application/xml',
        },
        auth: {
            'user': config.codebase.username,
            'pass': config.codebase.password
        },
        body: xml
    }, function (error, response, body) {
        if (error) {
            console.log(error);
            return;
        }
        if (response.statusCode == 201) {
            // was created
console.log(body);
            parseString(body, {
                charkey: 'value'
            }, function(err, result) {
                console.log(result);
                console.log(result['ticket-note']);
                if (err) {
                    console.log(err);
                    channel.send('> Failed to parse but created');
                } else {
                    channel.send('> Created: ' + result['ticket-note']['id'][0]['value']);
                }
            });
        } else {
            channel.send('> Fail: ' + response.statusCode);
        }
    });
}

var updateTicketCodebase = function(channel, ticket_id, summary, comment) {
    var xml = '<ticket-note>'
        + '<content>' + comment + '</content>'
        + '<changes>'
            + '<summary>' + summary + '</summary>'
        + '</changes>'
        + '</ticket-note>';

    request.post({
        url: 'https://api3.codebasehq.com/' + config.codebase.project + '/tickets/' + ticket_id + '/notes',
        headers: {
            'Accept': 'application/xml',
            'Content-type': 'application/xml',
        },
        auth: {
            'user': config.codebase.username,
            'pass': config.codebase.password
        },
        body: xml
    }, function (error, response, body) {
        if (error) {
            console.log(error);
            return;
        }
        if (response.statusCode == 201) {
            // was created
console.log(body);
            parseString(body, {
                charkey: 'value'
            }, function(err, result) {
                console.log(result);
                console.log(result['ticket-note']);
                if (err) {
                    console.log(err);
                    channel.send('> Failed to parse but created');
                } else {
                    channel.send('> Created: ' + result['ticket-note']['id'][0]['value']);
                }
            });
        } else {
            channel.send('> Fail: ' + response.statusCode);
        }
    });
}
