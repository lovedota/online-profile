var Console = {
    level: "ERROR",
    setLevel: function (level) {
        this.level = level
    },
    _levelValue: function (level) {
        if (level == "ERROR") return 40;
        if (level == "WARNING") return 30;
        if (level == "INFO") return 20;
        if (level == "DEBUG") return 10;
        return 0
    },
    filter: function (log_level) {
        var act_value = this._levelValue(this.level);
        var value = this._levelValue(log_level);
        if (value >= act_value) return true;
        else return false
    },
    log: function (log_level, type, msg) {
        var curr_level = this._levelValue(this.level);
        var this_level = this._levelValue(log_level);
        if (this_level >= curr_level) this._log(log_level, type, msg)
    },
    _log: function (log_level, type, msg) {
        var msgtxt;
        if (msg) {
            msgtxt = type + "," + msg
        } else {
            msgtxt = type
        }
        var color = "black";
        if (log_level == "ERROR") {
            color = "red"
        }
        $("#console").append('<div style="color:' + color + ";font-family:'Droid Sans Mono', monospace; font-size: 14px\">" + msgtxt + "</div><br/>");
        $("#console").scrollTop($("#console").prop("scrollHeight"))
    },
    _msg: function (msg, color) {
        if (!color) color = "black";
        $("#console").append('<div style="color:' + color + ";font-family:'Droid Sans Mono', monospace; font-size: 14px\">" + msg + "</div><br/>");
        $("#console").scrollTop($("#console").prop("scrollHeight"))
    },
    msg: function (msg) {
        Log.info("candidate console message", msg);
        this._msg(msg, "black")
    },
    msg_error: function (msg) {
        Log.info("candidate console message", msg);
        this._msg(msg, "red")
    },
    msg_ok: function (msg) {
        Log.info("candidate console message", msg);
        this._msg(msg, "green")
    },
    msg_quote: function (msg) {
        Log.info("candidate console message", msg);
        $("#console").append('<div class="quote">' + msg + "</div>");
        $("#console").scrollTop($("#console").prop("scrollHeight"))
    },
    msg_syserr: function (msg) {
        Log.warning("candidate console message", msg);
        this._msg(msg, "red")
    },
    clear: function () {
        Log.info("candidate console clear");
        $("#console").html("")
    }
};
var Diff = {};
Diff.splitLines = function (content) {
    if (content === "") return [];
    content = content.replace(/([^\t\n ])[\t ]+/g, "$1 ");
    content = content.replace(/ +$/gm, "");
    return content.split(/\r?\n/)
};
Diff.findChanges = function (oldTokens, newTokens) {
    var maxEditLength = oldTokens.length + newTokens.length;
    var bestPath = {};
    bestPath[0] = {
        x: -1,
        y: -1,
        changes: ""
    };

    function advance(path) {
        while (path.x + 1 < oldTokens.length && path.y + 1 < newTokens.length && oldTokens[path.x + 1] == newTokens[path.y + 1]) {
            path.x++;
            path.y++;
            path.changes += "0"
        }
    }
    advance(bestPath[0]);
    if (bestPath[0].x == oldTokens.length - 1 && bestPath[0].y == newTokens.length - 1) return bestPath[0].changes;
    for (var d = 1; d <= maxEditLength; d++) {
        for (var k = -d; k <= d; k += 2) {
            var path = {};
            if (bestPath[k + 1] !== undefined && (bestPath[k - 1] === undefined || bestPath[k - 1].x < bestPath[k + 1].x)) {
                path.x = bestPath[k + 1].x;
                path.y = bestPath[k + 1].y + 1;
                path.changes = bestPath[k + 1].changes + "+"
            } else if (bestPath[k - 1] !== undefined) {
                path.x = bestPath[k - 1].x + 1;
                path.y = bestPath[k - 1].y;
                path.changes = bestPath[k - 1].changes + "-"
            } else {
                continue
            }
            advance(path);
            bestPath[k] = path;
            if (path.x == oldTokens.length - 1 && path.y == newTokens.length - 1) {
                var simpleChanges = Diff.simpleFindChanges(d, oldTokens, newTokens);
                if (simpleChanges !== null) return simpleChanges;
                else return path.changes
            }
        }
    }
};
Diff.simpleFindChanges = function (maxEditLength, oldTokens, newTokens) {
    if (oldTokens.length != newTokens.length) return null;
    var d = 0;
    var changes = "";
    var i = 0;
    while (i < oldTokens.length) {
        if (oldTokens[i] == newTokens[i]) {
            changes += "0";
            i++
        } else {
            var end;
            for (end = i + 1; end < oldTokens.length && oldTokens[end] != newTokens[end]; end++);
            var length = end - i;
            d += length * 2;
            if (d > maxEditLength) return null;
            var k;
            for (k = 0; k < length; k++) changes += "-";
            for (k = 0; k < length; k++) changes += "+";
            i += length
        }
    }
    return changes
};
Diff.analyze = function (template, solution) {
    var oldLines = Diff.splitLines(template);
    var newLines = Diff.splitLines(solution);
    var changes = Diff.findChanges(oldLines, newLines);
    var nChanged = 0;
    var highlightChanged = [],
        highlightRemoved = [];
    var posOld = 0,
        posNew = 0;
    while (changes !== "") {
        var m = /^(-*)(\+*)/.exec(changes);
        if (m[0].length > 0) {
            var n = m[0].length,
                nRemoved = m[1].length,
                nAdded = m[2].length;
            var nRemovedNoEmpty = nRemoved,
                nAddedNoEmpty = nAdded;
            var i;
            for (i = 0; i < nAdded; i++) {
                if (newLines[posNew + i] !== "") highlightChanged.push(posNew + i);
                else nAddedNoEmpty--
            }
            for (i = 0; i < nRemoved; i++) {
                if (oldLines[posOld + i] === "") nRemovedNoEmpty--
            }
            if (nAddedNoEmpty === 0 && nRemovedNoEmpty > 0) highlightRemoved.push(posNew);
            posOld += nRemoved;
            posNew += nAdded;
            nChanged += Math.max(nAddedNoEmpty, nRemovedNoEmpty);
            changes = changes.slice(n)
        } else {
            m = /^0*/.exec(changes);
            var nSame = m[0].length;
            posOld += nSame;
            posNew += nSame;
            changes = changes.slice(nSame)
        }
    }
    return {
        nChanged: nChanged,
        highlightChanged: highlightChanged,
        highlightRemoved: highlightRemoved
    }
};
var TestCases = {
    limit: 5,
    init: function () {
        this.nextID = 0;
        this.count = 0;
        $("#add_test_case").click(function (e) {
            e.preventDefault();
            TestCases.add()
        })
    },
    add: function (value) {
        Log.info("candidate add test case");
        value = value || $("input[name=test_case_example]").val();
        var num = this.nextID;
        this.nextID++;
        this.count++;
        if (this.limitReached()) $("#add_test_case").hide();
        if (this.count == 1) {
            var help_text = '<div id="test_data_help"><small style="float:left">' + "include your own test data and use it for testing return values.</small></div>";
            $("#test_cases").append(help_text)
        }
        var $test_case = $('<div id="test_data' + num + '" class="testCase">' + '<a style="float:right" href="#">remove</a>' + '<div class="clr"></div>' + '<textarea name="test_data[]" rows=2 cols=50></textarea>' + "</div>");
        var $textarea = $test_case.find("textarea");
        $textarea.val(value);
        $("#test_cases").append($test_case);
        $test_case.find("a").click(function (e) {
            e.preventDefault();
            TestCases.remove(num)
        });
        ui.updatePageLayout()
    },
    remove: function (num) {
        if ($("#test_data" + num).length === 0) {
            return
        }
        this.count--;
        if (this.count < this.limit) $("#add_test_case").show();
        Log.info("candidate remove test case", "test case num=" + num);
        $("#test_data" + num).remove();
        if (this.count === 0) {
            $("#test_data_help").remove()
        }
        ui.updatePageLayout()
    },
    removeAll: function () {
        for (var i = 0; i < this.nextID; i++) {
            this.remove(i)
        }
    },
    disable: function () {
        $("#add_test_case").hide();
        ui.updatePageLayout()
    },
    enable: function () {
        $("#add_test_case").show();
        ui.updatePageLayout()
    },
    limitReached: function () {
        return this.count >= this.limit
    }
};
var num_i = 0;
var helpActive = new Array(10);

function center(id) {
    var offs = $(id).offset();
    if (!offs) return undefined;
    var w = $(id).width();
    var h = $(id).height();
    offs.left += Math.round(w / 2);
    offs.top += Math.round(h / 2);
    return offs
}

function rightEdge(id) {
    var offs = $(id).offset();
    if (!offs) return undefined;
    var w = $(id).width();
    var h = $(id).height();
    offs.left += w;
    offs.top += Math.round(h / 2);
    return offs
}

function shift(pos, dx, dy) {
    if (pos === undefined) return undefined;
    return {
        left: pos.left + dx,
        top: pos.top + dy
    }
}

function computePos(pos, obj, orient) {
    var res = {};
    var PADDING = 20;
    var EXTRA = 5;
    switch (orient) {
        case "ur":
            res.left = pos.left + EXTRA;
            res.top = pos.top - obj.height() - PADDING - EXTRA;
            break;
        case "ul":
            res.left = pos.left - obj.width() - PADDING - EXTRA;
            res.top = pos.top - obj.height() - PADDING - EXTRA;
            break;
        case "lr":
            res.left = pos.left + EXTRA;
            res.top = pos.top + EXTRA;
            break;
        case "ll":
            res.left = pos.left - obj.width() - PADDING - EXTRA;
            res.top = pos.top + EXTRA;
            break;
        default:
            res.left = pos.left - Math.round(obj.width() / 2);
            res.top = pos.top - Math.round(obj.height() / 2)
    }
    return res
}

function addToolTip(i, pos, orient) {
    num_i = num_i + 1;
    if (pos === undefined) return;
    Log.debug("addToolTip", "i=" + i + " pos" + pos + " orient=" + orient);
    helpActive[i] = num_i;
    var num_obj = $("#num" + num_i);
    var help_obj = $("#help" + i);
    if (!num_obj || !help_obj) return;
    var num_pos = computePos(pos, num_obj, "c");
    var help_pos = computePos(pos, help_obj, orient);
    num_obj.css({
        left: num_pos.left,
        top: num_pos.top
    });
    help_obj.css({
        left: help_pos.left,
        top: help_pos.top
    })
}

function setupHelp() {
    Log.debug("setupHelp");
    var o_e = center("#edit");
    var o_t = shift(center("#task"), 0, -40);
    var o_vb = shift(center("#verify_button"), 0, 40);
    var o_fb = shift(center("#final_button"), 0, 40);
    var o_res = shift(center("#quit_button"), 60, -10);
    var o_prg = shift(rightEdge("#prg_lang_list"), -30, 30);
    var o_close = shift($("#header").offset(), 5, 5);
    var o_r = shift(center("#test_case_img"), 70, -30);
    o_vb = shift(o_vb, 0, -80);
    o_fb = shift(o_fb, 0, -80);
    o_res = shift(o_res, 0, 30);
    $("#help2").css({
        width: "150px"
    });
    $("#help4").css({
        width: "300px"
    });
    $("#help5").css({
        width: "300px"
    });
    $("#help6").css({
        width: "150px"
    });
    $("#help7").css({
        width: "250px"
    });
    num_i = 0;
    addToolTip("1", o_t, "ur");
    addToolTip("2", o_prg, "ll");
    addToolTip("3", o_e, "ul");
    if ($("#verify_button").css("display") != "none") addToolTip("4", o_vb, "ul");
    if ($("#run_button").css("display") != "none" && $("#test_case_img").length > 0) addToolTip("5", o_r, "ur");
    if ($("#final_button").css("display") != "none") addToolTip("6", o_fb, "ur");
    addToolTip("7", o_res, "ll");
    num_i = 7;
    addToolTip("8", o_close, "lr")
}
var helpbox_count = 8;

function hideHelp() {
    var i;
    for (i = 1; i <= helpbox_count; i++) {
        $("#num" + i).fadeOut("fast");
        $("#help" + i).fadeOut("fast")
    }
    $("#overlay").fadeOut("fast")
}

function showHelp() {
    var i;
    setupHelp();
    for (i = 1; i <= helpbox_count; i++) {
        if (helpActive[i]) $("#help" + i).css({
            display: "block",
            opacity: 0
        })
    }
    $("#overlay").fadeTo("fast", .5, function () {
        for (i = 1; i <= helpbox_count; i++) $("#help" + i).css({
            display: "none",
            opacity: 1
        });
        var speed = 300;
        var j;
        for (i = 1; i <= helpbox_count; i++) {
            if (!helpActive[i]) continue;
            j = helpActive[i];
            $("#num" + j).fadeIn(speed);
            $("#help" + i).fadeIn(speed)
        }
        $("#overlay").click(hideHelp);
        for (i = 1; i <= helpbox_count; i++) {
            j = helpActive[i];
            $("#num" + j).click(hideHelp);
            $("#help" + i).click(hideHelp)
        }
    })
}

function Editor() {
    var self = {
        template: null
    };
    self._updateTaskDescriptionHeight = function (h) {
        $("#task_description").css({
            height: h + "px"
        })
    };
    self._updateEditorHeight = function (h) {
        $("#solution").css({
            minHeight: h
        });
        $("#solution").css({
            height: h
        })
    };
    self.updatePageLayout = function () {
        var wh = $(window).outerHeight();
        $("#page").css({
            height: wh + "px"
        });
        var right_h = $("#rightColumn > div").outerHeight();
        var right_under_h = $("#rightColumn .under-edit").outerHeight();
        var editor_h = right_h - right_under_h;
        var left_h = $("#task > div").outerHeight();
        var left_under_h = $("#task .under-task").outerHeight();
        var task_descr_h = left_h - left_under_h;
        self._updateEditorHeight(editor_h);
        self._updateTaskDescriptionHeight(task_descr_h)
    };
    self.getValue = function () {
        return $("#solution").val()
    };
    self.setValue = function (value) {
        $("#solution").val(value)
    };
    self.setTemplate = function (template) {
        self.template = template
    };
    self.setPrgLang = function (prg_lang) {};
    self.setEditable = function (editable) {};
    self.clearHistory = function () {};
    self.onCopyEvent = function (f) {};
    self.onPasteEvent = function (f) {};
    self.onChangeEvent = function (f) {
        $("#solution").on("change", f)
    };
    self.setNoNewLines = function () {};
    self.setReadOnlyRegions = function () {};
    self.enforceReadOnlyRegions = function () {};
    return self
}

function AceEditor() {
    var self = Editor();
    try {
        $("#solution").after('<pre class="ace" display="none"></pre>');
        self.ace = ace.edit($(".ace").get(0));
        $("#solution").hide();
        $(".ace").show()
    } catch (err) {
        Log.error("Candidate interface", "Error setting up Ace", err);
        window.alert("The rich code editor failed to load.\n" + "Please try reloading or use another browser.\n" + "\n" + "If you continue to have problems, please contact support@codility.com.");
        return self
    }
    ace.require("ace/ext/language_tools");
    self.ace.setShowPrintMargin(false);
    self.ace.setOptions({
        enableBasicAutocompletion: true
    });
    var session = self.ace.getSession();
    session.setTabSize(4);
    session.setUseSoftTabs(true);
    session.setUseWrapMode(true);
    self.Range = ace.require("ace/range").Range;
    self.Anchor = ace.require("ace/anchor").Anchor;
    self.HashHandler = ace.require("ace/keyboard/hash_handler").HashHandler;
    self.diffengine = ace.require("diffengine").DiffEngine(self);
    self.diffengine.enable(true);
    self._updateEditorHeight = function (h) {
        $(".ace").css({
            minHeight: h
        });
        $(".ace").css({
            height: h
        });
        self.ace.resize()
    };
    self._clean = function () {
        self.ace.replaceAll("-", {
            needle: "−"
        })
    };
    self.getValue = function () {
        self._clean();
        return self.ace.getValue()
    };
    self.setValue = function (value) {
        self.ace.getSession().setValue(value);
        self.ace.clearSelection();
        if (self.handleChange) self.handleChange()
    };
    self._prgLangToEditorMode = function (prg_lang) {
        var lang_dict = {
            c: "c_cpp",
            cpp: "c_cpp",
            cs: "csharp",
            java: "java",
            js: "javascript",
            lua: "lua",
            m: "objectivec",
            py: "python",
            pas: "pascal",
            php: "php",
            pl: "perl",
            rb: "ruby",
            scala: "scala",
            sql: "sql",
            vb: "vbscript"
        };
        return lang_dict[prg_lang] || "plain_text"
    };
    self.setPrgLang = function (prg_lang) {
        var mode = "ace/mode/" + self._prgLangToEditorMode(prg_lang);
        if (prg_lang == "php") self.ace.getSession().setMode({
            path: mode,
            inline: true
        });
        else self.ace.getSession().setMode({
            path: mode
        })
    };
    self.setEditable = function (editable) {
        self.ace.setReadOnly(!editable)
    };
    self.clearHistory = function () {
        self.ace.getSession().setUndoManager(new ace.UndoManager)
    };
    self.onCopyEvent = function (f) {
        self.ace.on("copy", f)
    };
    self.onPasteEvent = function (f) {
        self.ace.on("paste", f)
    };
    self.onChangeEvent = function (f) {
        self.handleChange = f;
        self.ace.on("change", f)
    };
    self.markers = [];
    self.readOnlyRanges = [];
    self.noNewLines = false;
    self.setReadOnlyRegions = function (regions) {
        $.each(regions, function (index, value) {
            if (value.start) {
                var start = value.start;
                var end = {};
                if (!value.end) {
                    end.row = start.row;
                    end.column = self.ace.getSession().getDocument().getLine(start.row).length
                } else {
                    end = value.end
                }
                var doc = self.ace.getSession().getDocument();
                var start_anchor = new self.Anchor(doc, start.row, start.column);
                start_anchor.setPosition(start.row, start.column, true);
                var end_anchor = new self.Anchor(doc, end.row, end.column);
                end_anchor.setPosition(end.row, end.column, true);
                self.readOnlyRanges.push({
                    start: start_anchor,
                    end: end_anchor
                })
            }
        })
    };
    self.setNoNewLines = function (bool) {
        self.noNewLines = Boolean(bool);
        if (self.noNewLines) {
            self.ace.keyBinding.addKeyboardHandler(self.keyHandlers.enterHandler)
        } else {
            self.ace.keyBinding.removeKeyboardHandler(self.keyHandlers.enterHandler)
        }
    };
    self.keyHandlers = {
        enterHandler: new self.HashHandler([{
            name: "return",
            bindKey: "Return|Shift-Return",
            descr: "Always block Return",
            exec: function (ed) {
                return false
            }
        }])
    };
    self.enforceReadOnlyRegions = function (e) {
        var command = e.command;
        var contains = false;
        var multiLineSelect = false;
        if (self.readOnlyRanges) {
            $.each(self.readOnlyRanges, function (index, val) {
                contains = self.inRange(val);
                if (contains) {
                    return false
                }
            })
        }
        if (self.noNewLines) {
            multiLineSelect = self.ace.getSession().getSelection().isMultiLine()
        }
        if (contains || multiLineSelect) {
            if (!command.readOnly) {
                e.preventDefault();
                e.stopPropagation();
                Console.msg_error("Your current selection includes portions that are readonly")
            }
        } else if (self.noNewLines) {
            var currentCursor = self.ace.getCursorPosition();
            var rightEdge = currentCursor.column == self.ace.getSession().getLine(currentCursor.row).length;
            var leftEdge = currentCursor.column === 0;
            var stop = self.isPrevented(command) || self.isReturn(command) || self.isDelete(command) && rightEdge || self.isBackspace(command) && leftEdge;
            if (stop) {
                e.preventDefault();
                e.stopPropagation();
                Console.msg_error("You are not allowed to add or remove whole lines in this task")
            }
        }
    };
    self.inRange = function (range) {
        var sel = self.ace.getSession().getSelection().getRange();
        var start = range.start;
        var end = range.end;
        range = new self.Range(start.row, start.column, end.row, end.column);
        return range.intersects(sel)
    };
    self.isDelete = function (command) {
        return command.name in {
            del: true,
            removetolineend: true,
            removewordright: true
        }
    };
    self.isBackspace = function (command) {
        return command.name in {
            backspace: true,
            "cut-or-delete": true,
            removetolinestart: true,
            removewordleft: true
        }
    };
    self.isReturn = function (command) {
        return command.name in {
            "return": true
        }
    };
    self.isPrevented = function (command) {
        return command.name in {
            cut: true,
            removeline: true,
            duplicateSelection: true,
            copylinesup: true,
            copylinesdown: true,
            movelinesup: true,
            movelinesdown: true,
            splitline: true
        }
    };
    self.ace.commands.on("exec", self.enforceReadOnlyRegions);
    return self
}
var MAX_SUBMIT_SOLUTION_RETRY_COUNT = 15;
var OLD_AUTOSAVE_PERIOD = 2 * 60 * 1e3;
var CHECK_AUTOSAVE_PERIOD = 1e3;
var AUTOSAVE_AFTER_EDIT_PERIOD = 3 * 1e3;
var AUTOSAVE_MIN_PERIOD = 10 * 1e3;
var AUTOSAVE_MAX_PERIOD = 30 * 1e3;

function CandidateUi(options) {
    var self = {
        options: options,
        task: {
            loaded: false,
            open: false,
            solution_template: null,
            name: null,
            type: null,
            prg_lang: null,
            human_lang: null,
            saved_solution: null,
            modified: false,
            last_modify_time: null
        },
        trackers: [],
        resize_hnd: null,
        last_autosave_time: null
    };
    self.updatePageLayout = function () {
        self.editor.updatePageLayout()
    };
    self.setupResizeEvent = function () {
        $(window).resize(function () {
            Log.debug("candidate window.resize event");
            if (self.resize_hnd !== null) clearTimeout(self.resize_hnd);
            self.resize_hnd = setTimeout(function () {
                self.updatePageLayout()
            }, 500)
        })
    };
    self.notifyCheckerTimeoutAction = function () {
        Log.debug("candidate action timeout", "task=" + self.task.name + " prg_lang=" + self.task.prg_lang);
        Log.flush();
        $.ajax({
            type: "POST",
            url: self.options.urls["timeout_action"],
            data: {
                ticket: self.options.ticket_id,
                task: self.task.name,
                prg_lang: self.task.prg_lang,
                solution: self.editor.getValue()
            },
            dataType: "xml"
        })
    };
    self.openTask = function () {
        self.task.open = true;
        self.updateControls()
    };
    self.closeTask = function () {
        self.task.open = false;
        self.updateControls()
    };
    self.updateModified = function () {
        if (self.task.open && self.editor.getValue() != self.task.saved_solution) {
            self.task.last_modify_time = (new Date).getTime();
            self.task.modified = true;
            if (self.options.save_often) $("#save_status").text("")
        } else {
            self.task.modified = false;
            self.task.last_modify_time = null;
            if (self.options.save_often) $("#save_status").text("All changes saved.")
        }
    };
    self.isCalling = function () {
        return !!self.call
    };
    self.startCall = function (owner, xhr, data) {
        self.call = {
            owner: owner,
            xhr: xhr,
            timestamp: Date.now()
        };
        $.extend(self.call, data || {});
        self.updateControls()
    };
    self.callDetails = function () {
        if (!self.call) return "No call";
        else {
            var details = "call: (owner=" + self.call.owner + " duration=" + (Date.now() - self.call.timestamp) + "ms" + " attempt=" + (self.call.attempt ? self.call.attempt : "1") + ")";
            return details
        }
    };
    self.clearCall = function () {
        self.call = null;
        self.updateControls()
    };
    self.submitSolution = function (mode, analyzeStatus, successCallback, errorCallback, extraData, async) {
        if (analyzeStatus && async) {
            Log.error("submitSolution: asynchronous calls with analyzeStatus are not supported");
            async = false
        }
        Log.info("candidate submit solution", "mode=" + mode + ", task=" + self.task.name + ", lang=" + self.task.prg_lang);
        Log.flush();
        if (!async && self.isCalling()) {
            Log.error("Trying to call submitSolution while still handling a call.");
            if (errorCallback) errorCallback();
            return
        }
        var url;
        if (mode == "verify" || mode == "final" || mode == "save") {
            url = self.options.urls[mode]
        } else {
            Log.error("candidate submit solution", "unknown mode");
            if (errorCallback) errorCallback();
            return
        }
        var solution = self.editor.getValue();
        var task_name = self.task.name;
        var prg_lang = self.task.prg_lang;
        var data = {
            ticket: self.options.ticket_id,
            task: task_name,
            prg_lang: prg_lang,
            solution: solution,
            trackers: self.getTrackersValue()
        };
        if (extraData !== undefined) {
            $.each(extraData, function (k, v) {
                data[k] = v
            })
        }
        if (mode == "verify") {
            $("#test_cases div.testCase").each(function () {
                var id = $(this).attr("id");
                var value = $(this).find("textarea").val();
                var value_clean = value.replace("−", "-");
                value_clean = value_clean.replace(/[^ -]/g, "");
                if (value !== value_clean) {
                    $(this).find("textarea").val(value_clean);
                    Console.msg(value + " was changed to " + value_clean + ". (Illegal Characters removed.)")
                }
                data[id] = value_clean
            })
        }
        Log.debug("candidate submit solution", "ajax started, url=" + url);
        var xhr = $.ajax({
            url: url,
            data: data,
            type: "POST",
            error: function () {
                if (!async) self.clearCall();
                if (errorCallback) errorCallback()
            },
            success: function (data) {
                Log.debug("candidate submit  solution", "ajax succeed");
                $.each(self.trackers, function (i, t) {
                    t.reset()
                });
                var result = xmlNodeValue(data, "response result");
                if (result == "OK" || result == "LATER") {
                    if (self.task.loaded && self.task.name == task_name && self.task.prg_lang == prg_lang) {
                        self.task.saved_solution = solution;
                        self.updateModified()
                    } else {
                        Log.warning("submit returned after switching away from task")
                    }
                }
                if (analyzeStatus) {
                    Log.debug("candidate submit solution", "analyzing status");
                    self.submitSolutionStatusReceived(data, successCallback, errorCallback)
                } else {
                    Log.debug("candidate submit solution", "not analyzing status");
                    if (!async) self.clearCall();
                    successCallback(data)
                }
            }
        });
        if (!async) self.startCall("submitSolution(" + mode + ")", xhr, {
            attempt: 0
        });
        self.updateControls()
    };
    self.updateControls = function () {
        var may_edit = self.task.loaded && self.task.open;
        var may_submit_or_reload = self.task.loaded && self.task.open && !self.isCalling();
        var may_switch = self.task.loaded && !self.isCalling();
        var submit_or_reload_controls = ["#verify_button", "#final_button", "#save_btn", "#current_human_lang", "#current_prg_lang", "#reset_btn"];
        var switch_controls = ["#current_task", "#quit_button"];
        self.editor.setEditable(may_edit);
        $(submit_or_reload_controls).each(function (i, id) {
            $(id).prop("disabled", !may_submit_or_reload)
        });
        $(switch_controls).each(function (i, id) {
            $(id).prop("disabled", !may_switch)
        });
        if (self.task.type == "bugfixing") $("#reset_btn").show();
        else $("#reset_btn").hide(); if (self.options.sequential) $("#current_task").prop("disabled", true)
    };
    self.submitSolutionStatusReceived = function (data, successCallback, errorCallback) {
        Log.debug("candidate submit solution status received");
        if (self.call === null) return;
        var id = xmlNodeValue(data, "response id");
        var result = xmlNodeValue(data, "response result");
        var message = xmlNodeValue(data, "response message");
        if (result == "LATER") {
            var attempt = self.call.attempt;
            Log.debug("candidate submit solution status received", "result LATER");
            if (attempt < MAX_SUBMIT_SOLUTION_RETRY_COUNT) {
                if ((attempt + 1) % 5 === 0) Console.msg("Still working...");
                setTimeout(function () {
                    Log.debug("candidate submitSolutionRecheckStatus", "timeout succeeded");
                    self.recheckSolutionStatus(attempt + 1, id, successCallback, errorCallback)
                }, (attempt + 1) * 1e3)
            } else {
                Log.error("candidate submitSolution error", "too many retries");
                self.clearCall();
                errorCallback($.parseXML("<message>Sorry, verification timed out. Please try again, and reduce the number of test cases if you have any.</message>"))
            }
        } else {
            self.clearCall();
            Log.handle(result == "ERROR" ? "ERROR" : "INFO", "candidate submit solution status received", "result " + result + " " + message);
            if (result == "OK") successCallback(data);
            else errorCallback(data)
        }
    };
    self.recheckSolutionStatus = function (attempt, id, successCallback, errorCallback) {
        Log.debug("candidate recheckSolutionStatus");
        var data = {
            ticket: self.options.ticket_id,
            id: id
        };
        var url = self.options.urls["status"];
        Log.debug("candidate recheckSolutionStatus", "ajax started, url=" + url + " attempt=" + attempt);
        var xhr = $.ajax({
            url: url,
            data: data,
            type: "POST",
            error: [self.clearCall, errorCallback],
            success: function (data) {
                Log.debug("candidate recheckSolutionStatus", "ajax succeeded");
                self.submitSolutionStatusReceived(data, successCallback, errorCallback)
            }
        });
        self.startCall("recheckSolution", xhr, {
            attempt: attempt
        })
    };
    self.verifyAction = function () {
        Console.clear();
        Console.msg("Running solution...");
        Log.info("candidate verify action");
        self.submitSolution("verify", true, self.verifyActionSuccess, self.verifyActionError)
    };
    self.verifyActionSuccess = function (xml) {
        var verification_ok = false;
        var _message = xmlNodeValue(xml, "response > message");
        if (_message) {
            Console.msg(_message)
        } else {
            var _compile = xmlNodeValue(xml, "compile > ok");
            var _compile_msg = _compile !== "" ? xmlNodeValue(xml, "compile > message") : "";
            if (_compile == "1") {
                Console.msg_ok(_compile_msg)
            } else {
                Console.msg_error(_compile_msg)
            } if (_compile == "1") {
                var _example = xmlNodeValue(xml, "example > ok");
                var _example_msg = _example !== "" ? xmlNodeValue(xml, "example > message") : "";
                if (_example == "1") {
                    verification_ok = true
                }
                $("#test_cases div.testCase").each(function () {
                    var id = $(this).attr("id");
                    var test_case = $(this).find("textarea").val();
                    var _ui = xmlNodeValue(xml, id + "> ok");
                    var _ui_msg = _ui !== "" ? xmlNodeValue(xml, id + " > message") : "";
                    var _st_obj = $(this).find(".testCaseStatus");
                    test_case = $("<span>").text(test_case).html();
                    Console.msg('<span style="color:blue">' + "Your test case " + test_case + " : " + "</span>" + _ui_msg);
                    if (_ui != "1") {
                        verification_ok = false
                    }
                });
                if (_example == "1") {
                    Console.msg_ok("Example test : " + '<span style="color:black">' + _example_msg + "</span>")
                } else {
                    Console.msg_error("Example test : " + '<span style="color:black">' + _example_msg + "</span>")
                }
            }
        } if (verification_ok) {
            Console.msg_ok("Your code is syntactically correct and works properly on the example test.")
        } else {
            Console.msg_error("Detected some errors.")
        }
        var quote = xmlNodeValue(xml, "quote");
        Console.msg_quote(quote);
        self.editor.updatePageLayout()
    };
    self.verifyActionError = function (xml) {
        var _message = "";
        if (xml !== null) {
            _message = xmlNodeValue(xml, "message")
        }
        Log.warning("verification action error", "message:" + _message);
        if (_message) {
            Console.msg_syserr("Error : " + _message)
        } else {
            Console.msg_syserr("Connection problem. Please check your Internet connection and try again.")
        }
    };
    self.saveAction = function (force, onSuccess, onError, extraData, async) {
        if (!self.task.loaded) {
            Log.debug("saveAction", "task not loaded properly, not saving");
            return
        }
        var solution = self.editor.getValue();
        var prg_lang = self.task.prg_lang;
        if (!force) {
            if (!self.task.modified) {
                Log.debug("candidate skipping save solution action", "no changes detected since last save");
                if (onSuccess) {
                    onSuccess()
                }
                return
            }
        }
        self.submitSolution("save", false, function () {
            Log.debug("candidate save action" + async ? " async" : "", "success");
            if (onSuccess) onSuccess()
        }, function () {
            Log.warning("candidate save action" + async ? " async" : "", "error");
            if (onError) onError()
        }, extraData, async)
    };
    self.saveActionSuccess = function () {
        Log.debug("candidate save action", "success")
    };
    self.saveActionAsync = function (force, onSuccess, onError, extraData) {
        self.saveAction(force, onSuccess, onError, extraData, true)
    };
    self.finalSubmitButtonAction = function () {
        var diff = null;
        if (self.editor.template !== null) {
            try {
                diff = Diff.analyze(self.editor.template, self.editor.getValue())
            } catch (err) {
                Log.error("Error computing diff", err);
                diff = null;
                return
            }
        }
        if (self.task.type == "bugfixing" && diff && diff.nChanged === 0) {
            $("#bugfix_no_changes").jqmShow()
        } else {
            $("#final_prompt").jqmShow()
        }
    };
    self.finalSubmitAction = function () {
        Console.clear();
        self.finalSubmitActionVerify()
    };
    self.finalSubmitActionError = function (xml) {
        var _message = xml !== null ? xmlNodeValue(xml, "message") : null;
        $("#final_verification .message").html("<b>ERROR</b><br> The final submission failed, try again?" + (_message ? "<br>\n" + _message : ""));
        $("#fv_loader").css({
            display: "none"
        });
        $("#final_verification .dialog_buttons").css({
            display: "block"
        });
        Log.warning("candidate final submission failed", "message: " + _message);
        Console.msg_syserr("Connection problem. Please check your Internet connection and try again.")
    };
    self.finalSubmitActionVerify = function () {
        Log.info("candidate final submit verification");
        $("#final_prompt").jqmHide();
        $("#final_verification .dialog_buttons").hide();
        $("#final_verification .message").html("<b>Codility is verifying your solution.</b><br><br>");
        $("#fv_loader").css({
            display: "block"
        });
        $("#final_verification").jqmShow();
        self.submitSolution("verify", true, self.finalSubmitActionVerifySuccess, self.finalSubmitActionError)
    };
    self.finalSubmitActionVerifySuccess = function (xml) {
        $("#fv_loader").css({
            display: "none"
        });
        var _message = xmlNodeValue(xml, "response > message");
        var _compile_ok = xmlNodeValue(xml, "compile > ok");
        var _example_ok = xmlNodeValue(xml, "example > ok");
        var _c_message = xmlNodeValue(xml, "compile > message");
        var _e_message = xmlNodeValue(xml, "example > message");
        if (_compile_ok == "1" && _example_ok == "1") {
            Log.info("candidate final submit verify", "solution passed example tests");
            self.finalSubmitActionSave(1)
        } else {
            Log.info("candidate final submit verify", "solution not passed example tests");
            if (_message === "" && (_c_message !== "" || _e_message !== "")) {
                _message = _c_message;
                if (_e_message !== "") {
                    _message = _message + "<br>Example test: " + _e_message
                }
            }
            $("#final_verification .message").html("<b>ERROR</b><br> Ooops, we found some errors." + "<br>Your solution is not correct, do you still want to submit it?<br>" + (_message ? '<div style="width:80%;text-align:left;margin-left:10%;margin-right:10%;margin-top:10px;"><small><b>evaluation details:</b><br><div style="border:1px solid black;padding:5px;overflow:auto;max-height:80px;">' + _message + "</div></small></div>" : ""));
            $("#final_verification .dialog_buttons").css({
                display: "block"
            })
        }
    };
    self.finalSubmitActionSave = function (is_ok) {
        Log.debug("candidate final submit action save");
        var ver_res;
        if (is_ok) {
            ver_res = "OK!"
        } else {
            ver_res = "ERROR!"
        }
        $("#final_verification .dialog_buttons").css({
            display: "none"
        });
        $("#final_verification .message").html("<b>solution verification -- " + ver_res + "</b><br>" + "Your solution is being received and evaluated by our servers.");
        $("#fv_loader").css({
            display: "block"
        });
        setTimeout(function () {
            self.submitSolution("final", false, self.finalSubmitActionSaveSuccess, self.finalSubmitActionError)
        }, 1e3)
    };
    self.finalSubmitActionSaveSuccess = function (data) {
        Log.debug("candidate final submit action save success");
        self.next_task = xmlNodeValue(data, "response next_task");
        setTimeout(function () {
            $("#final_verification").jqmHide();
            self.finalSubmitActionComplete()
        }, 500)
    };
    self.finalSubmitActionComplete = function () {
        Log.debug("candidate final submit action complete");
        self.closeTask();
        $("#current_task").find("option:selected").addClass("task-closed");
        if (self.next_task !== "") {
            $("#msg_task_completed").jqmShow()
        } else {
            $("#msg_final_task_completed").jqmShow()
        }
    };
    self.finalSubmitForceAction = function () {
        self.finalSubmitActionSave(0)
    };
    self.oldAutoSave = function () {
        setTimeout(self.oldAutoSave, OLD_AUTOSAVE_PERIOD);
        if (!self.isCalling()) self.saveActionAsync()
    };
    self.checkAutoSave = function () {
        setTimeout(self.checkAutoSave, CHECK_AUTOSAVE_PERIOD);
        if (!self.task.modified) return;
        if (self.isCalling()) return;
        var now = (new Date).getTime();
        if (self.last_autosave_time && now - self.last_autosave_time < AUTOSAVE_MIN_PERIOD) return;
        if (now - self.task.last_modify_time >= AUTOSAVE_AFTER_EDIT_PERIOD || self.last_autosave_time && now - self.last_autosave_time >= AUTOSAVE_MAX_PERIOD) {
            self.last_autosave_time = now;
            self.saveActionAsync()
        }
    };
    self.reloadTask = function (prefer_server_prg_lang) {
        self.task.loaded = false;
        self.task.solution_template = null;
        self.task.type = null;
        self.editor.setTemplate(null);
        var task = $("#current_task").val();
        var prg_lang = $("#current_prg_lang").val() || self.options.current_prg_lang;
        var human_lang = $("#current_human_lang").val() || self.options.current_human_lang;
        Log.info("candidate reload task", "task=" + task + ", prg_lang=" + prg_lang + ", human_lang" + human_lang);
        $("#task_description").html("Loading task description...");
        self.editor.setPrgLang(null);
        self.editor.setValue("Loading solution...");
        self.editor.clearHistory();
        $("#example_input").val("");
        var url = self.options.urls["get_task"];
        var data = {
            ticket: self.options.ticket_id,
            task: task,
            human_lang: human_lang,
            prg_lang: prg_lang,
            prefer_server_prg_lang: !!prefer_server_prg_lang
        };
        Log.debug("candidate reload task", "ajax start, url=" + url);
        var xhr = $.ajax({
            url: url,
            data: data,
            type: "POST",
            error: self.reloadTaskError,
            success: function (data) {
                self.reloadTaskSuccess(data, task)
            }
        }).always(self.clearCall);
        self.startCall("reloadTask", xhr);
        self.updateControls()
    };
    self.nextTask = function () {
        Log.info("candidate next task", "next task=" + self.next_task);
        $("#current_task").val(self.next_task);
        TestCases.removeAll();
        self.reloadTask(true)
    };
    self.validSelectableNode = function (t) {
        var t_nodename = t.prop("nodeName");
        if (t_nodename == "TEXTAREA") return true;
        if (t.closest("#console").length) return true;
        if (t_nodename == "TT" || t_nodename == "SPAN" && t.hasClass("number")) {
            return true
        } else {
            return false
        }
    };
    self.validCopySelection = function (e) {
        if (typeof window.getSelection == "undefined") {
            return false
        }
        var t = $(e.target);
        if (!self.validSelectableNode(t)) return false;
        var selection = window.getSelection();
        var range = selection.getRangeAt(0);
        var sobj = $("<div></div>").append(range.cloneContents());
        if (sobj.html().search("<") != -1) {
            return false
        }
        return true
    };
    self.simpleCopyProtection = function () {
        Log.debug("protecting task description");
        $("#brinza-task-description").addClass("protected");
        if (typeof window.getSelection == "undefined") {
            $("#brinza-task-description > *").each(function () {
                $(this).attr("unselectable", "on")
            });
            if ($("#t_overlay").length === 0) {
                $("#brinza-task-description").css({
                    position: "relative"
                });
                $("#brinza-task-description").prepend('<div id="t_overlay" class="transparent"></div>')
            }
        } else {
            $("body").off("copy");
            $("body").on("copy", function (e) {
                if (self.validCopySelection(e)) {
                    return
                } else {
                    e.preventDefault()
                }
            })
        }
    };
    self.reloadTaskSuccess = function (data, task) {
        var prg_langs = self.options.prg_langs;
        Log.debug("candidate reload task success");
        var task_status = xmlNodeValue(data, "response task_status");
        var task_description = xmlNodeValue(data, "response task_description");
        var task_type = xmlNodeValue(data, "response task_type");
        var solution_template = xmlNodeValue(data, "response solution_template");
        var current_solution = xmlNodeValue(data, "response current_solution");
        var example_input = xmlNodeValue(data, "response example_input");
        var prg_lang = xmlNodeValue(data, "response prg_lang");
        var human_lang = xmlNodeValue(data, "response human_lang");
        var prg_lang_list = JSON.parse(xmlNodeValue(data, "response prg_lang_list"));
        var human_lang_list = JSON.parse(xmlNodeValue(data, "response human_lang_list"));
        self.task.name = task;
        self.task.type = task_type;
        self.task.solution_template = solution_template;
        self.task.prg_lang = prg_lang;
        self.task.human_lang = human_lang;
        self.task.saved_solution = current_solution;
        $("#task_description").html(task_description);
        if (!self.options.demo && !self.options.cert) self.simpleCopyProtection();
        $("#current_prg_lang").val(prg_lang);
        var lang_ver = prg_langs[prg_lang].version;
        $("#prg_lang_ver").text(lang_ver);
        $("#current_human_lang option").remove();
        $.each(human_lang_list, function (i, hl) {
            var name = self.options.human_langs[hl].name_in_itself;
            var $option = $("<option>").attr("value", hl).text(name);
            $("#current_human_lang").append($option)
        });
        $("#current_human_lang").val(human_lang);
        $("#current_prg_lang option").remove();
        $.each(prg_lang_list, function (i, pl) {
            var name = self.options.prg_langs[pl].name;
            var $option = $("<option>").attr("value", pl).text(name);
            $("#current_prg_lang").append($option)
        });
        $("#current_prg_lang").val(prg_lang);
        if (!$.inArray(human_lang, human_lang_list)) $("#current_human_lang option:first").attr("selected", true);
        self.editor.setPrgLang(prg_lang);
        self.editor.setNoNewLines(false);
        if (self.task.type == "bugfixing") {
            self.editor.setTemplate(self.task.solution_template);
            self.editor.setNoNewLines(true)
        }
        self.editor.setValue(current_solution);
        self.editor.clearHistory();
        $("#example_input").val(example_input);
        var show_test_cases = task_status == "open" && prg_lang != "sql" && !TestCases.limitReached();
        if (task_status == "open") {
            self.openTask()
        } else if (task_status == "closed") {
            self.closeTask();
            $("#msg_task_closed").jqmShow()
        } else {
            Log.error("candidate reload task success", "unknown task_status " + task_status)
        } if (show_test_cases) {
            TestCases.enable()
        } else {
            TestCases.disable()
        }
        self.task.loaded = true;
        self.updateControls()
    };
    self.changePrgLangAction = function () {
        self.saveAction(false, self.reloadTask, function () {
            Console.msg_syserr("Could not change language");
            $("#current_prg_lang").val(self.task.lang)
        })
    };
    self.reloadTaskError = function () {
        Console.msg_syserr("Could not load task");
        $("#task_description").html("Could not load task description");
        self.editor.setPrgLang(null);
        self.editor.setValue("Could not load solution. Please refresh the page in the browser.");
        self.editor.clearHistory();
        $("#example_input").val("")
    };
    self.changeTaskActionError = function () {
        Console.msg_syserr("Could not change task");
        $("#current_task").val(self.task.name)
    };
    self.changeTaskAction = function () {
        self.saveAction(false, function () {
            self.reloadTask(true)
        }, self.changeTaskActionError);
        TestCases.removeAll()
    };
    self.changeHumanLangAction = function () {
        self.saveAction(false, self.reloadTask, self.changeHumanLangError)
    };
    self.changeHumanLangError = function () {
        Console.msg_syserr("Could not change human language")
    };
    self.resetAction = function () {
        self.saveActionAsync();
        self.editor.setValue(self.task.solution_template)
    };
    self.actionLogout = function (mode) {
        Log.info("candidate action logout");
        Clock.active = false;
        window.location.href = self.options.urls["close"] + "?" + mode + "=1"
    };
    self.quitAction = function () {
        Log.info("candidate quit action");
        self.saveActionAsync();
        $("#quit_prompt").jqmShow();
        $("#q_yes").click(function () {
            $("#quit_prompt").jqmHide();
            self.actionLogout("resign")
        });
        return true
    };
    self.resizeConsoleAction = function () {
        if ($("#console").height() < 400) {
            $("#console").height(400);
            $("#resize_console_button").prop("value", "↓")
        } else {
            $("#console").height(200);
            $("#resize_console_button").prop("value", "↑")
        }
        self.updatePageLayout()
    };
    self.setupEditor = function () {
        self.editor = AceEditor();
        self.editor.onChangeEvent(self.updateModified)
    };
    self.setupModals = function () {
        if (self.options.demo) {
            $(".in-demo").show();
            $(".no-demo").hide()
        }
        $("#quit_prompt").jqm({
            modal: true
        });
        $("#final_prompt").jqm({
            modal: true
        });
        $("#final_verification").jqm({
            modal: true
        });
        $("#msg_task_completed").jqm({
            modal: true
        });
        $("#msg_task_closed").jqm({
            modal: true
        });
        $("#bugfix_no_changes").jqm({
            modal: true
        });

        function surveyPopup($elt, logout_reason) {
            if (self.options.show_survey) {
                $elt.find(".survey-msg").show();
                $elt.find(".survey-skip").val("skip survey");
                $elt.find(".survey-skip").parent().css("text-align", "right")
            }
            $elt.jqm({
                modal: true,
                onShow: function (hash) {
                    if (self.options.show_survey) {
                        Clock.active = false;
                        surveyShow(hash.w)
                    }
                    hash.w.show()
                },
                onHide: function (hash) {
                    if (self.options.show_survey) {
                        surveySubmit(self.options.urls["submit_survey"], function () {
                            self.actionLogout(logout_reason)
                        })
                    } else {
                        self.actionLogout(logout_reason)
                    }
                }
            })
        }
        surveyPopup($("#msg_final_task_completed"), "final_task_completed");
        surveyPopup($("#msg_timeout"), "timeout")
    };
    self.setupButtons = function () {
        $("#quit_button").click(self.quitAction);
        $("#final_button").click(self.finalSubmitButtonAction);
        $("#next_task_button").click(function () {
            $("#msg_task_completed").jqmHide();
            self.nextTask()
        });
        $("#fp_yes").click(self.finalSubmitAction);
        $("#bugfix_yes").click(function () {
            $("#bugfix_no_changes").jqmHide();
            self.finalSubmitAction()
        });
        $("#fv_yes").click(self.finalSubmitForceAction);
        $("#current_prg_lang").change(self.changePrgLangAction);
        if (!self.options.sequential) $("#current_task").change(self.changeTaskAction);
        $("#current_human_lang").change(self.changeHumanLangAction);
        $("#resize_console_button").click(self.resizeConsoleAction);
        $("#verify_button").click(self.verifyAction);
        $("#reset_btn").click(self.resetAction);
        $("#help_btn").click(showHelp);
        $("#survey_continue_button").click(function () {
            $(this).val("submit survey");
            $("#survey tbody.hidden_part").removeClass("hidden_part");
            $(this).hide();
            $("#survey_submit_button").show()
        });
        $("#survey_submit_button").click(function () {
            $("#survey").parent().jqmHide()
        })
    };
    self.setupSelects = function () {
        var n_tasks = self.options.task_names.length;
        $.each(self.options.task_names, function (i, task_name) {
            var $option = $("<option>").attr("value", task_name).text(i + 1 + " of " + n_tasks);
            $("#current_task").append($option)
        });
        $("#current_task").val(self.options.current_task_name);
        if (n_tasks > 1) {
            $(".current_task_select").show()
        }
    };
    self.getTrackersValue = function () {
        var res = {};
        $.each(self.trackers, function (i, t) {
            res[t.name] = JSON.stringify(t.exportData())
        });
        return res
    };
    self.setupTrackers = function () {
        var window_focus_tracker = new TimeTracker("focus", self.options.time_elapsed_sec);
        window_focus_tracker.turnOn();
        $(window).on("focus", function () {
            window_focus_tracker.turnOn()
        });
        $(window).on("blur", function () {
            window_focus_tracker.turnOff()
        });
        self.trackers.push(window_focus_tracker);
        var key_tracker = new TimeTracker("keypress", self.options.time_elapsed_sec);
        $("#edit").on("keypress", function () {
            key_tracker.tick()
        });
        self.trackers.push(key_tracker);
        self.editor.onCopyEvent(function (e) {
            self.editor.last_copy = e.text
        });
        self.editor.onPasteEvent(function (e) {
            var data = e.text;
            if (self.editor.last_copy === data) return;
            self.editor.last_paste = data;
            setTimeout(function () {
                var last_paste = $.trim(self.editor.last_paste);
                if (last_paste.split("\n").length < 2) return;
                var solution = self.editor.getValue();
                var ppos = solution.indexOf(last_paste);
                var plen = last_paste.length;
                if (ppos == -1) return;
                self.saveActionAsync(true, null, null, {
                    paste_start: ppos,
                    paste_end: ppos + plen
                })
            }, 100)
        })
    };
    self.init = function () {
        self.setupEditor();
        self.setupModals();
        self.setupButtons();
        self.setupSelects();
        if (!self.options.demo && !self.options.cert) self.setupTrackers();
        TestCases.init();
        Clock.init(self.options.ticket_id, self.options.urls["clock"], self.options.time_remaining_sec, self.options.time_elapsed_sec);
        self.updatePageLayout();
        self.reloadTask();
        if (self.options.save_often) setTimeout(self.checkAutoSave, CHECK_AUTOSAVE_PERIOD);
        else setTimeout(self.oldAutoSave, OLD_AUTOSAVE_PERIOD);
        self.updateControls();
        self.setupResizeEvent();
        if (self.options.show_help) setTimeout(showHelp, 500)
    };
    self.shutdown = function () {
        $(window).off("focus");
        $(window).off("blur")
    };
    self.data = {};
    return self
}
var Clock = {
    CLOCK_REFRESH_TIME: 2 * 60 * 1e3,
    timeout_warning_active: false,
    time_to_end: null,
    active: true,
    setTime: function () {
        var seconds = this.time_to_end % 60;
        var minutes = Math.floor(this.time_to_end / 60) % 60;
        var hours = Math.floor(this.time_to_end / (60 * 60));
        var time_string = hours < 10 ? "0" + hours : hours;
        time_string += ":";
        time_string += minutes < 10 ? "0" + minutes : minutes;
        time_string += ":";
        time_string += seconds < 10 ? "0" + seconds : seconds;
        $("#clock").text(time_string)
    },
    init: function (ticket_id, url, time_remaining_sec, time_elapsed_sec) {
        this.ticket_id = ticket_id;
        this.url = url;
        this.timeout_warning_active = false;
        this.time_from_start = time_elapsed_sec;
        this.time_to_end = time_remaining_sec;
        this.active = true;
        this.clock_tick();
        this.refreshClock();
        window.onbeforeunload = function (e) {
            if (Clock.active) return "Are you sure you want to close the window?\n" + "If you have finished, use the SUBMIT button.\n" + "If the interface is not responding (e.g. connection issues), it's acceptable to reload.";
            else return undefined
        }
    },
    clock_tick: function () {
        if (!Clock.active) return;
        this.setTime();
        if (this.time_to_end == 60 || this.time_to_end == 2 * 60 || this.time_to_end == 3 * 60) {
            this.startTimeoutWarning(15)
        }
        if (this.time_to_end <= 0) {
            if (!$("#msg_final_task_completed").is(":visible")) {
                this.actionTimeout()
            }
        } else {
            var that = this;
            this.time_to_end -= 1;
            setTimeout(function () {
                that.clock_tick()
            }, 1e3)
        }
    },
    _update: function (data) {
        var result = xmlNodeValue(data, "response result");
        if (result == "ERROR") {
            var t = String(xmlNodeValue(data, "response message"));
            if (t.match("closed") !== null) {
                if (!$("#msg_final_task_completed").is(":visible")) {
                    Log.info("Ticket closed by server");
                    this.actionTimeout()
                }
            } else {
                Log.error("Update clock error")
            }
        } else {
            var new_timelimit = parseInt(xmlNodeValue(data, "response new_timelimit"), 10);
            var new_time_elapsed = parseInt(xmlNodeValue(data, "response new_time_elapsed"), 10);
            var diff = xmlNodeValue(data, "response diff");
            Log.debug("candidate update clock", "new_timelimit: " + new_timelimit + (diff !== "" ? " diff=" + diff : ""));
            if (new_timelimit > 0) {
                this.time_to_end = new_timelimit;
                this.time_from_start = new_time_elapsed
            }
        }
    },
    actionTimeout: function () {
        ui.notifyCheckerTimeoutAction();
        $("#msg_timeout").jqmShow()
    },
    refreshClock: function () {
        var that = this;
        this.clockAction();
        setTimeout(function () {
            that.refreshClock()
        }, this.CLOCK_REFRESH_TIME)
    },
    clockAction: function () {
        var that = this;
        Log.debug("candidate clock action");
        var data = {
            ticket: this.ticket_id,
            old_timelimit: this.time_to_end
        };
        $.ajax({
            url: this.url,
            data: data,
            type: "POST",
            success: function (d) {
                that._update(d)
            },
            timeout: 30 * 1e3
        })
    },
    startTimeoutWarning: function (n) {
        Log.info("candidate timeout warning showed");
        if (this.timeout_warning_active) return;
        this.timeout_warning_active = true;
        var clock_id = "#clock";
        $(clock_id).fadeOut(100);
        $(clock_id).fadeOut(1, function () {
            $(clock_id).css({
                backgroundColor: "red"
            })
        });
        var i;
        for (i = 0; i < n; i++) {
            $(clock_id).fadeIn(250);
            $(clock_id).fadeOut(250)
        }
        $(clock_id).fadeIn(1, function () {
            $(clock_id).css({
                backgroundColor: ""
            })
        });
        $(clock_id).fadeIn(100);
        var that = this;
        setTimeout(function () {
            that.timeout_warning_active = false
        }, 5e3)
    }
};

function TimeTracker(name, time_elapsed_sec) {
    var self = {
        name: name,
        start_time: (new Date).getTime() / 1e3 - time_elapsed_sec,
        interval: 60,
        data: {},
        status: null,
        last_t: null
    };
    self.updateClock = function (new_time_elapsed_sec) {
        self.start_time = (new Date).getTime() / 1e3 - new_time_elapsed_sec
    };
    self.reset = function () {
        self.data = {};
        if (self.status !== null) {
            self.last_t = self.current_t();
            self.updateStatus(self.status)
        }
    };
    self.tick = function (c) {
        var t = self.current_t();
        if (!(t in self.data)) self.data[t] = 0;
        if (c === undefined) self.data[t] += 1;
        else self.data[t] += c
    };
    self.updateStatus = function (new_status) {
        var t = self.current_t();
        if (self.status !== null && self.last_t !== null) {
            for (var i = self.last_t + 1; i < t; i++) self.data[i] = self.status
        }
        if (!(t in self.data) || new_status === 1) self.data[t] = new_status;
        self.status = new_status;
        self.last_t = t
    };
    self.turnOn = function () {
        self.updateStatus(1)
    };
    self.turnOff = function () {
        self.updateStatus(0)
    };
    self.print = function () {
        if (self.status !== null) self.updateStatus(self.status);
        console.log("Tracker: " + self.name + " interval=" + self.interval + " data=" + JSON.stringify(self.data))
    };
    self.exportData = function () {
        if (self.status !== null) self.updateStatus(self.status);
        return [self.data, self.interval]
    };
    self.current_t = function () {
        var t = (new Date).getTime() / 1e3 - self.start_time;
        return Math.floor(t / self.interval)
    };
    self.data = {};
    self.status = null;
    return self
}

function xml_to_string(xml_node) {
    if (typeof xml_node == "undefined") return "";
    if (typeof xml_node.xml == "undefined") return "";
    else if (XMLSerializer) {
        var xml_serializer = new XMLSerializer;
        return xml_serializer.serializeToString(xml_node)
    } else {
        return ""
    }
}

function xmlNodeValue(xml, path) {
    var result = "";
    result = $(xml).find(path).text();
    return result
}

function getParams(query) {
    if (query === undefined) query = window.location.search.substring(1);
    var match;
    var pl = /\+/g;
    var search = /([^&=]+)=?([^&]*)/g;
    var decode = function (s) {
        return decodeURIComponent(s.replace(pl, " "))
    };
    var params = {};
    while (match = search.exec(query)) params[decode(match[1])] = decode(match[2]);
    return params
}

function surveyShow(dialog_element) {
    var survey_placeholder = $(".survey_placeholder", dialog_element);
    if (survey_placeholder.size() == 1) {
        var survey = $("#survey");
        survey[0].parentNode.removeChild(survey[0]);
        survey_placeholder.replaceWith(survey);
        survey.show()
    }
}

function surveySubmit(url, callback) {
    var form = $("#survey_form");
    var form_data = form.serialize();
    $.ajax({
        type: "POST",
        url: url,
        data: form_data,
        timeout: 1e3,
        complete: callback
    })
}
ace.define("diffengine", ["require", "exports", "module", "ace/line_widgets", "ace/lib/dom", "ace/range"], function (require, exports, module) {
    "use strict";
    var LineWidgets = require("ace/line_widgets").LineWidgets;
    var dom = require("ace/lib/dom");
    var Range = require("ace/range").Range;
    var prev_row = null;
    exports.DiffEngine = function (editor, options) {
        var self = {};
        self.options = options;
        self.editor = editor;
        self.diff = {};
        self.session = self.editor.ace.session;
        if (!self.session.widgetManager) {
            self.session.widgetManager = new LineWidgets(self.session);
            self.session.widgetManager.attach(self.editor.ace)
        }
        self.enable = function (bool) {
            if (bool) {
                self.editor.ace.on("change", self.onDocumentChange);
                self.editor.ace.on("changeSelection", self.onSelectionChange)
            } else {
                self.editor.ace.off("change", self.onDocumentChange);
                self.editor.ace.off("changeSelection", self.onSelectionChange)
            }
        };
        self.markers = [];
        self.onDocumentChange = function () {
            var prev_unedited = !(prev_row in self.diff);
            self.diff = self._calculateDiff();
            var now_edited = prev_row in self.diff;
            if (prev_unedited && now_edited) {
                prev_row = null
            }
            if (self.markers.length) {
                $.each(self.markers, function (idx, val) {
                    self.editor.ace.session.removeMarker(val)
                })
            }
            var diff_keys = Object.keys(self.diff);
            if (diff_keys.length) {
                $.each(diff_keys, function (idx, line) {
                    var lineEnd = self.editor.ace.session.getLine(line).length;
                    self.markers.push(self.editor.ace.session.addMarker(new Range(line, 0, line, lineEnd), "highlight-changed-line", "fullLine"))
                })
            }
        };
        self.onSelectionChange = function () {
            if (self.editor.ace.getSession().getSelection().isMultiLine() || !self.diff) return;
            var pos = self.editor.ace.getCursorPosition();
            var currentRow = pos.row;
            if (currentRow in self.diff && prev_row !== currentRow) {
                var oldWidget = self.session.lineWidgets && self.session.lineWidgets[currentRow];
                if (oldWidget) {
                    oldWidget.destroy(true)
                }
                var widget = self._buildWidget(pos);
                if (widget) {
                    self.editor.ace.session.widgetManager.addLineWidget(widget)
                }
            }
            prev_row = currentRow
        };
        self._buildWidget = function (position) {
            var row = position.row;
            var w = null;
            var className = self.options && self.options.className;
            if (self.template_lines && self.template_lines.length > row) {
                w = {
                    row: row,
                    fixedWidth: true,
                    coverGutter: true,
                    el: dom.createElement("div")
                };
                var el = w.el.appendChild(dom.createElement("div"));
                var arrow = w.el.appendChild(dom.createElement("div"));
                if (className) {
                    arrow.className = "diff_widget_arrow " + className
                } else {
                    arrow.className = "diff_widget_arrow diff_widget_default"
                }
                var left = self.editor.ace.renderer.$cursorLayer.getPixelPosition({
                    row: position.row,
                    column: 0
                }).left;
                arrow.style.left = left + self.editor.ace.renderer.gutterWidth - 5 + "px";
                w.el.className = "diff_widget_wrapper";
                if (className) {
                    el.className = "diff_widget " + className
                } else {
                    el.className = "diff_widget diff_widget_default"
                }
                el.innerHTML = self._renderTemplateLine(row);
                el.style.paddingLeft = self.editor.ace.renderer.gutterWidth + self.editor.ace.renderer.$padding + "px";
                w.destroy = function (ingoreMouse) {
                    if (self.editor.ace.$mouseHandler.isMousePressed && !ingoreMouse) return;
                    self.session.widgetManager.removeLineWidget(w);
                    self.editor.ace.off("changeSelection", w.destroyOnExit);
                    self.editor.ace.off("mouseup", w.destroyOnExit);
                    self.editor.ace.off("changeSession", w.destroy);
                    self.editor.ace.off("change", w.destroy);
                    self.editor.ace.off("change", w.destroyOnUnedit)
                };
                w.destroyOnExit = function () {
                    var pos = self.editor.ace.getCursorPosition();
                    var currentRow = pos.row;
                    if (w.row != currentRow) {
                        w.destroy()
                    }
                };
                w.destroyOnUnedit = function () {
                    var pos = self.editor.ace.getCursorPosition();
                    var currentRow = pos.row;
                    if (!(currentRow in self.diff)) {
                        w.destroy()
                    }
                };
                self.editor.ace.on("mouseup", w.destroyOnExit);
                self.editor.ace.on("changeSelection", w.destroyOnExit);
                self.editor.ace.on("changeSession", w.destroy);
                self.editor.ace.on("change", w.destroyOnExit);
                self.editor.ace.on("change", w.destroyOnUnedit)
            }
            return w
        };
        self._renderTemplateLine = function (row) {
            var tokenizer = self.editor.ace.session.getMode().getTokenizer();
            var row_text = self.template_lines[row];
            var tokens = tokenizer.getLineTokens(row_text).tokens;
            var stringBuilder = [];
            if (tokens.length) {
                var wrapLimit = self.editor.ace.session.getWrapLimit();
                var tabSize = self.editor.ace.session.getTabSize();
                var displayTokens = self.editor.ace.session.$getDisplayTokens(row_text);
                var splits = self.editor.ace.session.$computeWrapSplits(displayTokens, wrapLimit, tabSize);
                if (splits && splits.length) self.editor.ace.renderer.$textLayer.$renderWrappedLine(stringBuilder, tokens, splits, false);
                else self.editor.ace.renderer.$textLayer.$renderSimpleLine(stringBuilder, tokens);
                stringBuilder.unshift("<div class='ace_line' style='height:", self.editor.ace.renderer.$textLayer.config.lineHeight, "px'>");
                stringBuilder.unshift("<div class='ace_line_group' style='height:", self.editor.ace.renderer.$textLayer.config.lineHeight * (splits.length + 1), "px'>")
            }
            stringBuilder.push("</div>", "</div>");
            return stringBuilder.join("")
        };
        self._calculateDiff = function () {
            var diff = {};
            var template = self.editor.template;
            var value = self.editor.getValue();
            if (template) {
                var template_lines = Diff.splitLines(template);
                var value_lines = Diff.splitLines(value);
                var linesLength = Math.max(template_lines.length, value_lines.length);
                for (var i = 0; i < linesLength; i++) {
                    if (template_lines[i] !== value_lines[i]) {
                        diff[i] = true
                    }
                }
                if (template !== self.template) {
                    self.template = template;
                    self.template_lines = template_lines
                }
            }
            return diff
        };
        return self
    }
});

function TestServer() {
    var self = {
        tasks: {
            task1: {
                status: "open",
                human_lang_list: ["en", "cn"],
                prg_lang_list: ["c", "cpp"],
                type: "programming",
                saved: null,
                n_saves: 0
            },
            task2: {
                status: "open",
                human_lang_list: ["en", "cn"],
                prg_lang_list: ["c", "cpp"],
                type: "bugfixing",
                saved: null,
                n_saves: 0
            },
            task3: {
                status: "open",
                human_lang_list: ["en"],
                prg_lang_list: ["sql"],
                type: "sql",
                saved: null,
                n_saves: 0
            }
        },
        current_task: "task1",
        next_task: "",
        submits: [],
        time_at_start: 1800,
        timed_out: false
    };
    self.use_asserts = true;
    self.ui_options = {
        ticket_id: "TICKET_ID",
        time_elapsed_sec: 15,
        time_remaining_sec: 1800,
        current_human_lang: "en",
        current_prg_lang: "c",
        current_task_name: "task1",
        task_names: ["task1", "task2", "task3"],
        human_langs: {
            en: {
                name_in_itself: "English"
            },
            cn: {
                name_in_itself: "中文"
            }
        },
        prg_langs: {
            c: {
                version: "C",
                name: "C"
            },
            sql: {
                version: "SQL",
                name: "SQL"
            },
            cpp: {
                version: "C++",
                name: "C++"
            }
        },
        show_survey: false,
        show_help: true,
        sequential: false,
        save_often: true,
        urls: {
            status: "/chk/status/",
            get_task: "/c/_get_task/",
            submit_survey: "/surveys/_ajax_submit_candidate_survey/TICKET_ID/",
            clock: "/chk/clock/",
            close: "/c/close/TICKET_ID",
            verify: "/chk/verify/",
            save: "/chk/save/",
            timeout_action: "/chk/timeout_action/",
            "final": "/chk/final/"
        }
    };
    self.respondGetTask = function (data) {
        var task = data.task || self.current_task;
        var human_lang = data.human_lang;
        var prg_lang = data.prg_lang;
        var prefer_server_prg_lang = data.prefer_server_prg_lang;
        var t = self.tasks[task];
        if (prefer_server_prg_lang == "true" && t.saved) prg_lang = t.saved.prg_lang;
        if (t.prg_lang_list.indexOf(prg_lang) == -1) prg_lang = t.prg_lang_list[0];
        if (t.human_lang_list.indexOf(human_lang) == -1) human_lang = t.human_lang_list[0];
        var id = task + "," + human_lang + "," + prg_lang;
        var solution = self.getTaskStart(id);
        if (t.saved && t.saved.prg_lang == prg_lang) solution = t.saved.solution;
        return {
            task_status: t.status,
            task_description: "Description: " + id,
            task_type: t.type,
            solution_template: self.getTaskStart(id),
            current_solution: solution,
            example_input: "Example input: " + id,
            prg_lang_list: JSON.stringify(t.prg_lang_list),
            human_lang_list: JSON.stringify(t.human_lang_list),
            prg_lang: prg_lang,
            human_lang: human_lang
        }
    };
    self.getTaskStart = function (id) {
        return "Start: " + id
    };
    self.respondSave = function (data) {
        var task = data.task;
        var prg_lang = data.prg_lang;
        var solution = data.solution;
        self.tasks[task].saved = {
            prg_lang: prg_lang,
            solution: solution
        };
        self.tasks[task].n_saves = (self.tasks[task].n_saves || 0) + 1;
        return {
            result: "OK",
            message: "solution saved"
        }
    };
    self.respondTimeout = function (data) {
        var t = self.getRemainingTime();
        if (self.use_asserts) expect(t).toBeLessThan(60);
        self.timed_out = true;
        return self.respondSave(data)
    };
    self.respondSubmit = function (data, mode) {
        var task = data.task;
        var prg_lang = data.prg_lang;
        var solution = data.solution;
        var submit_id = self.submits.length;
        self.submits.push({
            mode: mode,
            task: task,
            prg_lang: prg_lang,
            solution: solution,
            times_polled: 0
        });
        return self.submitStatus(submit_id)
    };
    self.respondStatus = function (data) {
        var submit_id = data.id;
        var submit = self.submits[submit_id];
        submit.times_polled++;
        return self.submitStatus(submit_id)
    };
    self.submitStatus = function (submit_id) {
        var submit = self.submits[submit_id];
        var response;
        if (submit.result) {
            response = {
                result: "OK",
                extra: submit.result
            }
        } else {
            response = {
                result: "LATER",
                message: "Request is waiting for evaluation.",
                id: submit_id,
                delay: 5
            }
        } if (submit.mode == "final") response.next_task = self.next_task;
        return response
    };
    self.getRemainingTime = function () {
        return self.time_at_start - Math.floor((new Date).valueOf() / 1e3)
    };
    self.respondClock = function (data) {
        return {
            result: "OK",
            new_timelimit: self.getRemainingTime()
        }
    };
    self.respondTo = function (req) {
        if (req.url == "/logs/_multilog/") {
            return
        }
        if (req.aborted) {
            return
        }
        var data = getParams(req.requestBody);
        if (self.use_asserts) {
            expect(data.ticket).toBe("TICKET_ID");
            expect(req.method).toBe("POST")
        }
        var response;
        if (req.url == "/c/_get_task/") {
            response = self.respondGetTask(data)
        }
        if (req.url == "/chk/save/") {
            response = self.respondSave(data)
        }
        if (req.url == "/chk/verify/") {
            response = self.respondSubmit(data, "verify")
        }
        if (req.url == "/chk/final/") {
            response = self.respondSubmit(data, "final")
        }
        if (req.url == "/chk/status/") {
            response = self.respondStatus(data)
        }
        if (req.url == "/chk/clock/") {
            response = self.respondClock(data)
        }
        if (req.url == "/chk/timeout_action/") {
            response = self.respondTimeout(data)
        }
        console.debug(JSON.stringify(response, null, "	"));
        req.respond(200, {
            "Content-Type": "text/xml"
        }, xmlResponse(response))
    };
    self.requests = [];
    self.respond = function (timeout) {
        while (self.requests.length > 0) {
            var request = self.requests.pop();
            if (timeout === undefined) self.respondTo(request);
            else setTimeout($.proxy(self.respondTo, self, request), timeout)
        }
    };
    self.init = function () {
        self.xhr = sinon.useFakeXMLHttpRequest();
        self.xhr.onCreate = function (request) {
            self.requests.push(request)
        }
    };
    self.shutdown = function () {
        self.xhr.restore()
    };
    self.verifyOkResponse = function () {
        return {
            compile: {
                ok: 1,
                message: "compiler output"
            },
            example: {
                ok: 1,
                message: "OK"
            }
        }
    };
    self.verifyFailedResponse = function () {
        return {
            compile: {
                ok: 1,
                message: "compiler output"
            },
            example: {
                ok: 0,
                message: "WRONG ANSWER"
            }
        }
    };

    function jsonToXml(data) {
        if (!(data instanceof Object)) return data;

        function toXml(tag, content) {
            return "<" + tag + ">" + jsonToXml(content) + "</" + tag + ">"
        }
        var ret = "";
        $.each(data, function (tag, content) {
            ret += toXml(tag, content)
        });
        return ret
    }

    function xmlResponse(data) {
        var ret = '<?xml version="1.0" encoding="UTF-8"?>';
        ret += "<response>";
        ret += jsonToXml(data);
        ret += "</response>";
        jQuery.parseXML(ret);
        return ret
    }
    return self
}

function LocalServer() {
    var self = TestServer();
    self.use_asserts = false;
    var super_init = self.init;
    self.init = function () {
        super_init();
        setTimeout(self.beat, self.BEAT_PERIOD)
    };
    self.BEAT_PERIOD = 200;
    self.RESPONSE_DELAY = 150;
    self.VERIFY_DELAY = 700;
    self.beat = function () {
        self.respond(self.RESPONSE_DELAY);
        self.verifySubmits(self.VERIFY_DELAY);
        setTimeout(self.beat, self.BEAT_PERIOD)
    };
    self.verifySubmits = function (timeout) {
        for (var i = 0; i < self.submits.length; i++) {
            var submit = self.submits[i];
            if (submit.mode != "verify" || submit.result || submit.in_eval) continue;
            setTimeout($.proxy(self.verifySubmit, self, submit), timeout);
            submit.in_eval = true
        }
    };
    self.verifySubmit = function (submit) {
        submit.in_eval = false;
        if (/^ *fail()/m.test(submit.solution)) {
            submit.result = {
                compile: {
                    ok: 1,
                    message: "The solution compiled flawlessly."
                },
                example: {
                    ok: 0,
                    message: "RUNTIME ERROR (you invoked the fail() function)"
                }
            }
        } else {
            submit.result = {
                compile: {
                    ok: 1,
                    message: "The solution compiled flawlessly."
                },
                example: {
                    ok: 1,
                    message: "OK"
                }
            }
        }
    };
    self.getTaskStart = function (id) {
        return ["// This is a starting solution for: " + id, "", "int solution() {", "    // Delete or comment out the following line", "    // and the solution will pass verification.", "    fail();", "    return 42;", "}"].join("\n")
    };
    return self
}
//# sourceMappingURL=/static/js/241d57784222.js.map