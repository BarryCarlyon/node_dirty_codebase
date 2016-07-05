var parseString = require('xml2js').parseString;
var request = require('request');

exports.setConfig = function(config) {
    this.config = config;
    this.config.debug = (undefined === config.debug) ? false : config.debug;

    return this;
}

/* Get Open Tickets */
exports.getTickets = function(cb) {
    request({
        url: 'https://api3.codebasehq.com/' + this.config.project + '/tickets?query=not-status:Completed,Invalid',
        headers: {
            'Accept': 'application/xml',
            'Content-type': 'application/xml',
        },
        auth: {
            'user': this.config.username,
            'pass': this.config.password
        }
    }, function (error, response, body) {
        if (error) {
            if (this.config.debug) {
                console.log(error);
            }
            cb(false);
        } else if (response.statusCode == 200) {
            parseString(body, {
                charkey: 'value'
            }, function(err, result) {
                if (err) {
                    if (this.config.debug) {
                        console.log(err);
                    }
                    cb(false);
                } else {
                    cb(result);
                }
            });
        } else {
            if (self.config.debug) {
                console.log(response.statusCode);
            }
            cb(false);
        }
    });
}

exports.createTicket = function(summary, description, cb) {
    var xml = '<ticket>'
        + '<summary>' + summary + '</summary>'
        + '<description><![CDATA[' + description + ']]></description>'
        + '</ticket>';

    request.post({
        url: 'https://api3.codebasehq.com/' + this.config.project + '/tickets?query=not-status:Completed,Invalid',
        headers: {
            'Accept': 'application/xml',
            'Content-type': 'application/xml',
        },
        auth: {
            'user': this.config.username,
            'pass': this.config.password
        },
        body: xml
    }, function (error, response, body) {
        if (error) {
            if (this.config.debug) {
                console.log(error);
            }
            cb(false);
        } else if (response.statusCode == 201) {
            // was created
            parseString(body, {
                charkey: 'value'
            }, function(err, result) {
                if (err) {
                    if (this.config.debug) {
                        console.log(err);
                    }
                    cb(false);
                } else {
                    cb(result.ticket['ticket-id'][0]['value']);
                }
            });
        } else {
            if (self.config.debug) {
                console.log(response.statusCode);
            }
            cb(false);
        }
    });
}

exports.addCommentToTicket = function(ticket_id, comment, cb) {
    var xml = '<ticket-note>'
        + '<content>' + comment + '</content>'
        + '</ticket-note>';

    request.post({
        url: 'https://api3.codebasehq.com/' + this.config.project + '/tickets?query=not-status:Completed,Invalid',
        headers: {
            'Accept': 'application/xml',
            'Content-type': 'application/xml',
        },
        auth: {
            'user': this.config.username,
            'pass': this.config.password
        },
        body: xml
    }, function (error, response, body) {
        if (error) {
            if (this.config.debug) {
                console.log(error);
            }
            cb(false);
        } else if (response.statusCode == 201) {
            // was created
            parseString(body, {
                charkey: 'value'
            }, function(err, result) {
                if (err) {
                    if (this.config.debug) {
                        console.log(err);
                    }
                    cb(false);
                } else {
                    cb(result['ticket-note']['id'][0]['value']);
                }
            });
        } else {
            if (self.config.debug) {
                console.log(response.statusCode);
            }
            cb(false);
        }
    });
}

exports.reviseTicket = function(ticket_id, summary, comment, cb) {
    var xml = '<ticket-note>'
        + '<content>' + comment + '</content>'
        + '<changes>'
            + '<summary>' + summary + '</summary>'
        + '</changes>'
        + '</ticket-note>';

    request.post({
        url: 'https://api3.codebasehq.com/' + this.config.project + '/tickets/' + ticket_id + '/notes',
        headers: {
            'Accept': 'application/xml',
            'Content-type': 'application/xml',
        },
        auth: {
            'user': this.config.username,
            'pass': this.config.password
        },
        body: xml
    }, function (error, response, body) {
        if (error) {
            if (this.config.debug) {
                console.log(error);
            }
            cb(false);
        } else if (response.statusCode == 201) {
            // was created
            parseString(body, {
                charkey: 'value'
            }, function(err, result) {
                if (this.config.debug) {
                    console.log(result);
                    console.log(result['ticket-note']);
                }
                if (err) {
                    if (this.config.debug) {
                        console.log(err);
                    }
                    cb(false);
                } else {
                    cb(result['ticket-note']['id'][0]['value']);
                }
            });
        } else {
            if (self.config.debug) {
                console.log(response.statusCode);
            }
            cb(false);
        }
    });
}
